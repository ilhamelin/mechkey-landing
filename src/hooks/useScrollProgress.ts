import { useEffect, useRef, useState } from 'react';

interface ScrollProgress {
  /** 0 → 1 global scroll progress */
  progress: number;
  /** Current active section index */
  section: number;
  /** 0 → 1 progress within current section */
  sectionProgress: number;
  /** Scroll direction: 1 = down, -1 = up */
  direction: number;
}

/**
 * Tracks scroll position and converts it into normalized progress values
 * for driving 3D animations and section transitions.
 */
export function useScrollProgress(totalSections = 8): ScrollProgress {
  const [state, setState] = useState<ScrollProgress>({
    progress: 0,
    section: 0,
    sectionProgress: 0,
    direction: 1,
  });

  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollY / maxScroll, 1);

      const direction = scrollY > lastScrollY.current ? 1 : -1;
      lastScrollY.current = scrollY;

      const sectionSize = 1 / totalSections;
      const section = Math.min(
        Math.floor(progress / sectionSize),
        totalSections - 1
      );
      const sectionProgress = (progress % sectionSize) / sectionSize;

      setState({ progress, section, sectionProgress, direction });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [totalSections]);

  return state;
}
