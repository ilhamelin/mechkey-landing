import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import KeyboardScrollSequence from '../KeyboardScrollSequence';

// ── Mock Framer Motion ──
let mockMotionValueChangeHandler: ((value: number) => void) | null = null;

jest.mock('framer-motion', () => {
  const actual = jest.requireActual('framer-motion');
  return {
    ...actual,
    useScroll: () => ({
      scrollYProgress: {
        get: () => 0,
        onChange: jest.fn(),
      },
    }),
    useTransform: (_value: unknown, _input: number[], output: number[]) => {
      return {
        get: () => output[0],
      };
    },
    useMotionValueEvent: (_motionVal: unknown, event: string, callback: (val: number) => void) => {
      if (event === 'change') {
        mockMotionValueChangeHandler = callback;
      }
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    motion: {
      div: ({ children, style, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
        <div style={style} className={className} {...props}>
          {children}
        </div>
      ),
    },
  };
});

describe('KeyboardScrollSequence Component', () => {
  let originalImage: typeof Image;
  let mockContext: Partial<CanvasRenderingContext2D>;
  let createdImages: HTMLImageElement[] = [];

  beforeEach(() => {
    createdImages = [];
    originalImage = global.Image;

    // Mock HTMLImageElement
    // @ts-expect-error Mocking Image constructor for testing
    global.Image = class {
      src = '';
      naturalWidth = 1920;
      naturalHeight = 1080;
      complete = false;
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;

      constructor() {
        createdImages.push(this as unknown as HTMLImageElement);
      }
    };

    // Mock Canvas 2D context
    mockContext = {
      clearRect: jest.fn(),
      drawImage: jest.fn(),
      fillRect: jest.fn(),
      fillText: jest.fn(),
      beginPath: jest.fn(),
      arc: jest.fn(),
      stroke: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      fillStyle: '#000000',
      strokeStyle: '#000000',
      lineWidth: 1,
      font: '10px sans-serif',
      textAlign: 'center',
    };

    HTMLCanvasElement.prototype.getContext = jest.fn().mockImplementation((contextId: string) => {
      if (contextId === '2d') {
        return mockContext as CanvasRenderingContext2D;
      }
      return null;
    });

    HTMLCanvasElement.prototype.getBoundingClientRect = jest.fn().mockReturnValue({
      width: 1920,
      height: 1080,
      top: 0,
      left: 0,
      bottom: 1080,
      right: 1920,
    });

    // Mock requestAnimationFrame and cancelAnimationFrame
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
      cb(0);
      return 1;
    });
    jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
  });

  afterEach(() => {
    global.Image = originalImage;
    jest.restoreAllMocks();
    mockMotionValueChangeHandler = null;
  });

  test('renders container and canvas element correctly', () => {
    const { container } = render(
      <KeyboardScrollSequence totalFrames={10} folderPath="/sequence/frame_" />
    );

    const section = container.querySelector('#scroll-sequence');
    expect(section).toBeInTheDocument();

    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  test('displays technical loader initially while frames are loading', () => {
    render(<KeyboardScrollSequence totalFrames={10} folderPath="/sequence/frame_" />);

    expect(screen.getByText(/PRECARGA DE SECUENCIA 60 FPS/i)).toBeInTheDocument();
    expect(screen.getByText(/BUFFER:/i)).toBeInTheDocument();
  });

  test('preloads all requested frames and transitions loading state upon completion', () => {
    render(<KeyboardScrollSequence totalFrames={5} folderPath="/sequence/frame_" />);

    // Should create 5 images for 5 frames
    expect(createdImages.length).toBe(5);
    expect(createdImages[0].src).toContain('/sequence/frame_0001.jpg');
    expect(createdImages[4].src).toContain('/sequence/frame_0005.jpg');

    // Simulate completion of all images
    act(() => {
      createdImages.forEach((img) => {
        img.complete = true;
        if (img.onload) img.onload();
      });
    });

    // Loading screen should unmount after completion
    expect(screen.queryByText(/PRECARGA DE SECUENCIA 60 FPS/i)).not.toBeInTheDocument();
  });

  test('renders frame using canvas drawImage with object-fit: cover logic', () => {
    render(<KeyboardScrollSequence totalFrames={5} folderPath="/sequence/frame_" />);

    // Complete frame 1 loading
    act(() => {
      const firstImg = createdImages[0];
      firstImg.complete = true;
      if (firstImg.onload) firstImg.onload();
    });

    // drawImage should be called to draw the frame
    expect(mockContext.drawImage).toHaveBeenCalled();
  });

  test('re-renders on scroll progress change via framer-motion event', () => {
    render(<KeyboardScrollSequence totalFrames={10} folderPath="/sequence/frame_" />);

    // Complete all images
    act(() => {
      createdImages.forEach((img) => {
        img.complete = true;
        if (img.onload) img.onload();
      });
    });

    // Clear previous calls
    (mockContext.drawImage as jest.Mock).mockClear();

    // Trigger scroll change to frame 4
    act(() => {
      if (mockMotionValueChangeHandler) {
        mockMotionValueChangeHandler(4);
      }
    });

    expect(mockContext.drawImage).toHaveBeenCalled();
  });

  test('handles window resize and adjusts canvas dimensions', () => {
    const { container } = render(<KeyboardScrollSequence totalFrames={5} />);

    const canvas = container.querySelector('canvas') as HTMLCanvasElement;
    expect(canvas).toBeInTheDocument();

    act(() => {
      fireEvent(window, new Event('resize'));
    });

    expect(mockContext.clearRect).toHaveBeenCalled();
  });

  test('handles image load errors gracefully without throwing', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<KeyboardScrollSequence totalFrames={3} folderPath="/sequence/frame_" />);

    act(() => {
      // Simulate error on frame 2
      if (createdImages[1] && createdImages[1].onerror) {
        createdImages[1].onerror();
      }
    });

    // Component should continue working without crashing
    const canvas = document.querySelector('canvas');
    expect(canvas).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });
});
