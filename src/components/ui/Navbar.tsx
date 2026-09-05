'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_SECTIONS = [
  { href: '#hero',         label: 'Inicio',   id: 'hero' },
  { href: '#exploded-view', label: 'Diseño',  id: 'exploded-view' },
  { href: '#specs',         label: 'Specs',   id: 'specs' },
  { href: '#cta',           label: 'Reservar', id: 'cta' },
];

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [active, setActive]         = useState('hero');
  const [menuOpen, setMenuOpen]     = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Track active section with IntersectionObserver
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    NAV_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { threshold: 0.25, rootMargin: '-80px 0px -20% 0px' }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const activeIndex = NAV_SECTIONS.findIndex((s) => s.id === active);
  const sectionLabel = `0${activeIndex + 1} / 0${NAV_SECTIONS.length}`;

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="nav-bar-wrapper"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: scrolled ? 'rgba(8,8,8,0.88)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : '1px solid transparent',
          transition: 'all 0.4s ease',
        }}
      >
        {/* Logo */}
        <a
          href="#hero"
          id="nav-logo"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 18,
            letterSpacing: '-0.04em',
            color: '#f0f0f0',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: 'var(--accent-primary)',
            display: 'inline-block',
            boxShadow: '0 0 8px rgba(232,201,125,0.5)',
          }} />
          STRATA
        </a>

        {/* Desktop links */}
        <div
          className="nav-desktop-links"
          style={{ display: 'flex', gap: 36, alignItems: 'center' }}
        >
          {NAV_SECTIONS.slice(0, 3).map((link) => {
            const isActive = link.id === active;
            return (
              <div key={link.href} style={{ position: 'relative' }}>
                <a
                  href={link.href}
                  id={`nav-${link.id}`}
                  style={{
                    fontSize: 13,
                    color: isActive ? '#f0f0f0' : '#555',
                    textDecoration: 'none',
                    letterSpacing: '0.04em',
                    fontWeight: isActive ? 500 : 400,
                    transition: 'color 0.3s',
                    paddingBottom: 4,
                  }}
                >
                  {link.label}
                </a>
                {/* Active underline */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      style={{
                        position: 'absolute',
                        bottom: -2,
                        left: 0,
                        right: 0,
                        height: 1,
                        background: 'var(--accent-primary)',
                        borderRadius: 1,
                      }}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      exit={{ scaleX: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    />
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {/* Section counter */}
          <span style={{
            fontSize: 11,
            color: '#333',
            letterSpacing: '0.1em',
            fontFamily: 'var(--font-display)',
            minWidth: 42,
            textAlign: 'right',
            transition: 'color 0.3s',
          }}>
            {sectionLabel}
          </span>

          <a href="#cta" id="nav-reservar" className="btn-primary" style={{ padding: '8px 20px', fontSize: 13 }}>
            Reservar
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="nav-hamburger"
          id="nav-hamburger"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Menú"
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 8,
            flexDirection: 'column',
            gap: 5,
          }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                rotate: menuOpen && i !== 1 ? (i === 0 ? 45 : -45) : 0,
                y: menuOpen ? (i === 0 ? 7 : i === 2 ? -7 : 0) : 0,
                opacity: menuOpen && i === 1 ? 0 : 1,
              }}
              transition={{ duration: 0.2 }}
              style={{ width: 22, height: 1.5, background: '#f0f0f0', borderRadius: 1 }}
            />
          ))}
        </button>
      </motion.nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'fixed',
              top: 64,
              left: 0,
              right: 0,
              zIndex: 999,
              background: 'rgba(8,8,8,0.97)',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              padding: '24px 32px 32px',
            }}
          >
            {NAV_SECTIONS.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                style={{
                  display: 'block',
                  fontSize: 22,
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  letterSpacing: '-0.02em',
                  color: link.id === active ? '#e8c97d' : '#f0f0f0',
                  textDecoration: 'none',
                  padding: '12px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                {link.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile-responsive style */}
      <style>{`
        .nav-bar-wrapper {
          padding: 0 48px;
        }
        @media (max-width: 768px) {
          .nav-bar-wrapper { padding: 0 16px !important; }
          .nav-desktop-links { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
}
