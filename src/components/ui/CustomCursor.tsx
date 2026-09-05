'use client';
import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const dotRef   = useRef<HTMLDivElement>(null);
  const ringRef  = useRef<HTMLDivElement>(null);
  const pos      = useRef({ x: -100, y: -100 });
  const ring     = useRef({ x: -100, y: -100 });
  const raf      = useRef<number>(0);
  const [hidden, setHidden] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      setHidden(false);
    };

    const onLeave = () => setHidden(true);
    const onEnter = () => setHidden(false);

    const onDown = () => setClicked(true);
    const onUp   = () => setClicked(false);

    // Detect hover on interactive elements
    const addHover = () => {
      document.querySelectorAll('a, button, [role="button"], .spec-card').forEach((el) => {
        el.addEventListener('mouseenter', () => setHovered(true));
        el.addEventListener('mouseleave', () => setHovered(false));
      });
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);

    // Re-scan after a tick (for dynamic elements)
    const t = setTimeout(addHover, 500);

    // RAF loop — smooth ring follow with lerp
    const loop = () => {
      const LERP = 0.12;
      ring.current.x += (pos.current.x - ring.current.x) * LERP;
      ring.current.y += (pos.current.y - ring.current.y) * LERP;

      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate(${pos.current.x - 4}px, ${pos.current.y - 4}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform =
          `translate(${ring.current.x - 20}px, ${ring.current.y - 20}px)`;
      }

      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
      cancelAnimationFrame(raf.current);
      clearTimeout(t);
    };
  }, []);

  // Only show on non-touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) {
    return null;
  }

  const dotSize   = clicked ? 3 : 5;
  const ringSize  = hovered ? 56 : clicked ? 28 : 40;
  const ringBorder = hovered
    ? '1.5px solid rgba(232,201,125,0.9)'
    : '1.5px solid rgba(232,201,125,0.4)';
  const ringBg = hovered ? 'rgba(232,201,125,0.06)' : 'transparent';

  return (
    <>
      {/* Dot — follows exactly */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: dotSize,
          height: dotSize,
          borderRadius: '50%',
          background: '#e8c97d',
          pointerEvents: 'none',
          zIndex: 99999,
          opacity: hidden ? 0 : 1,
          transition: `opacity 0.2s, width 0.15s, height 0.15s`,
          willChange: 'transform',
          boxShadow: '0 0 6px rgba(232,201,125,0.6)',
        }}
      />

      {/* Ring — follows with lerp lag */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: ringSize,
          height: ringSize,
          borderRadius: '50%',
          border: ringBorder,
          background: ringBg,
          pointerEvents: 'none',
          zIndex: 99998,
          opacity: hidden ? 0 : 1,
          transition: `opacity 0.2s, width 0.3s ease, height 0.3s ease, border-color 0.3s, background 0.3s`,
          willChange: 'transform',
          mixBlendMode: 'normal',
        }}
      />
    </>
  );
}
