'use client';
import { useEffect, useRef, ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  /** Delay in ms before the animation starts */
  delay?: number;
  /** Direction of entry: 'up' | 'left' | 'right' | 'none' */
  direction?: 'up' | 'left' | 'right' | 'none';
  /** Distance to travel in px */
  distance?: number;
  /** Duration in ms */
  duration?: number;
  /** CSS class for the wrapper */
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Wraps children and animates them in when they enter the viewport.
 * Uses IntersectionObserver + CSS transitions — no JS animation loop.
 * Safe with SSR: starts invisible, becomes visible when observed.
 */
export default function Reveal({
  children,
  delay = 0,
  direction = 'up',
  distance = 28,
  duration = 600,
  className,
  style,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Slight delay then reveal
          setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translate(0, 0)';
            el.style.filter = 'blur(0px)';
          }, delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  const initTranslate =
    direction === 'up'    ? `translate(0, ${distance}px)` :
    direction === 'left'  ? `translate(-${distance}px, 0)` :
    direction === 'right' ? `translate(${distance}px, 0)` :
    'translate(0, 0)';

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: 0,
        transform: initTranslate,
        filter: direction !== 'none' ? 'blur(4px)' : 'none',
        transition: `opacity ${duration}ms cubic-bezier(0.22, 1, 0.36, 1),
                     transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1),
                     filter ${duration}ms ease`,
        willChange: 'opacity, transform',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
