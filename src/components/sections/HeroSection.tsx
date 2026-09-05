'use client';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.13, duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  }),
};

// Decorative keyboard illustration (CSS/SVG — no WebGL context used here)
function KeyboardIllustration() {
  const rows = [14, 14, 13, 12, 10];
  return (
    <div
      className="hero-keyboard-scaler"
      style={{
        position: 'relative',
        perspective: 900,
        perspectiveOrigin: '50% 40%',
        width: '100%',
        maxWidth: 580,
        margin: '0 auto',
      }}
    >
      {/* Main keyboard body */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1c1c1c 0%, #141414 60%, #0e0e0e 100%)',
          borderRadius: 16,
          padding: '18px 22px 22px',
          boxShadow: `
            0 0 0 1px rgba(232,201,125,0.12),
            0 40px 80px rgba(0,0,0,0.7),
            0 8px 24px rgba(0,0,0,0.5),
            inset 0 1px 0 rgba(255,255,255,0.06)
          `,
          transform: 'rotateX(18deg) rotateY(-4deg)',
          transformStyle: 'preserve-3d',
          animation: 'heroFloat 5s ease-in-out infinite',
        }}
      >
        {/* Top accent strip */}
        <div style={{
          height: 2,
          background: 'linear-gradient(90deg, transparent, #e8c97d, #c8a45a, transparent)',
          borderRadius: 1,
          marginBottom: 16,
          opacity: 0.6,
        }} />

        {/* Key rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {rows.map((cols, rowIdx) => (
            <div key={rowIdx} style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
              {Array.from({ length: cols }).map((_, colIdx) => {
                const isAccent = (rowIdx === 0 && (colIdx === 0 || colIdx === cols - 1)) ||
                  (rowIdx === 1 && colIdx === 0) ||
                  (rowIdx === 4 && colIdx === 0);
                const isWide = colIdx === 0 && rowIdx > 1;
                return (
                  <div
                    key={colIdx}
                    style={{
                      width: isWide ? 48 : 28,
                      height: 24,
                      borderRadius: 4,
                      background: isAccent
                        ? 'linear-gradient(135deg, #e8c97d, #c8a45a)'
                        : 'linear-gradient(180deg, #2a2a2a 0%, #1e1e1e 100%)',
                      boxShadow: isAccent
                        ? '0 2px 4px rgba(0,0,0,0.5), 0 0 8px rgba(232,201,125,0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
                        : '0 2px 4px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      flexShrink: 0,
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {/* Bottom accent & Technical Engraving */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 12,
          paddingTop: 8,
          borderTop: '1px solid rgba(255,255,255,0.05)',
        }}>
          <span style={{ fontSize: 8, fontFamily: 'monospace', color: '#555', letterSpacing: '0.14em' }}>
            STRATA // 6061-T6
          </span>
          <span style={{ fontSize: 8, fontFamily: 'monospace', color: 'rgba(232,201,125,0.6)', letterSpacing: '0.1em' }}>
            [ ANSI/ISO 75% ]
          </span>
        </div>
      </div>

      {/* Reflection below */}
      <div style={{
        position: 'absolute',
        left: '5%',
        right: '5%',
        bottom: -24,
        height: 40,
        background: 'linear-gradient(180deg, rgba(232,201,125,0.04), transparent)',
        filter: 'blur(8px)',
        borderRadius: '50%',
      }} />
    </div>
  );
}

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="hero-section"
      style={{
        position: 'relative',
        background: '#080808',
      }}
    >
      {/* CSS animations */}
      <style>{`
        @keyframes heroFloat {
          0%, 100% { transform: rotateX(18deg) rotateY(-4deg) translateY(0); }
          50% { transform: rotateX(18deg) rotateY(-4deg) translateY(-12px); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .hero-section {
          height: 100vh;
          min-height: 680px;
          overflow: hidden;
        }
        .hero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          height: 100%;
          align-items: center;
        }
        .hero-text {
          padding: 0 0 0 80px;
          z-index: 10;
        }
        .hero-keyboard {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          padding-right: 60px;
        }
        .hero-actions {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .hero-metrics {
          display: flex;
          gap: 32px;
          margin-top: 52px;
          flex-wrap: wrap;
        }
        @media (max-width: 768px) {
          .hero-section {
            height: auto;
            min-height: 100svh;
            padding-bottom: 48px;
            overflow: visible;
          }
          .hero-grid {
            grid-template-columns: 1fr;
            grid-template-rows: auto auto;
            padding-top: 80px;
          }
          .hero-text {
            padding: 0 16px;
            order: 2;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .hero-keyboard {
            order: 1;
            height: 220px;
            padding: 0;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .hero-keyboard-scaler {
            transform: scale(0.66);
            transform-origin: center center;
          }
          .hero-actions {
            justify-content: center;
            width: 100%;
            flex-wrap: wrap;
          }
          .hero-metrics {
            justify-content: center;
            gap: 24px;
            margin-top: 32px;
          }
          .hero-scroll-hint {
            display: none !important;
          }
        }
        @media (max-width: 420px) {
          .hero-keyboard {
            height: 190px;
          }
          .hero-keyboard-scaler {
            transform: scale(0.55);
            transform-origin: center center;
          }
          .hero-metrics {
            gap: 16px;
          }
        }
      `}</style>

      {/* ── Background elements ── */}
      {/* Grid */}
      <div aria-hidden style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(232,201,125,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(232,201,125,0.025) 1px, transparent 1px)
        `,
        backgroundSize: '64px 64px',
        maskImage: 'radial-gradient(ellipse 70% 70% at 60% 50%, black 30%, transparent 100%)',
      }} />

      {/* Glow left */}
      <div aria-hidden style={{
        position: 'absolute',
        width: 500,
        height: 500,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(232,201,125,0.07) 0%, transparent 70%)',
        top: '50%',
        right: 0,
        transform: 'translateY(-50%)',
        filter: 'blur(60px)',
        pointerEvents: 'none',
      }} />

      {/* ── Grid wrapper ── */}
      <div className="hero-grid">

      {/* ── Left column: Text ── */}
      <div className="hero-text">
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
          <span className="tag" style={{ display: 'inline-flex' }}>
            Edición Limitada — 500 Unidades
          </span>
          <span style={{
            fontSize: 10,
            fontFamily: 'monospace',
            color: '#555',
            letterSpacing: '0.08em',
          }}>
            [ ARCH // 75% TKL ] • [ 1000HZ ]
          </span>
        </motion.div>

        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          style={{
            fontSize: 'clamp(64px, 7vw, 100px)',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            letterSpacing: '-0.05em',
            lineHeight: 0.95,
            color: '#f0f0f0',
            marginBottom: 20,
          }}
        >
          STRATA
        </motion.h1>

        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          style={{
            fontSize: 16,
            color: '#555',
            letterSpacing: '0.04em',
            marginBottom: 12,
            fontWeight: 400,
            lineHeight: 1.6,
          }}
        >
          Teclado Mecánico Modular
        </motion.p>

        <motion.p
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          style={{
            fontSize: 14,
            color: '#383838',
            marginBottom: 44,
            maxWidth: 340,
            lineHeight: 1.7,
          }}
        >
          Aluminio 6061-T6 mecanizado CNC. Switches hot-swap.
          Firmware QMK/VIA. Diseñado sin compromisos.
        </motion.p>

        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="hero-actions"
        >
          <a href="#cta" className="btn-primary" id="cta-explore">
            Reservar Ahora
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M6.5 1L12 6.5L6.5 12M1 6.5H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </a>
          <a href="#exploded-view" className="btn-ghost" id="cta-design">
            Ver Diseño
          </a>
        </motion.div>

        {/* Metrics row */}
        <motion.div
          custom={5}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="hero-metrics"
        >
          {[
            { code: 'M-01', value: '1.2kg', label: 'Peso sólido' },
            { code: 'M-02', value: '100M', label: 'Pulsaciones' },
            { code: 'M-03', value: '1000Hz', label: 'Polling rate' },
          ].map((m) => (
            <div key={m.label} style={{ position: 'relative' }}>
              <div style={{ fontSize: 9, fontFamily: 'monospace', color: '#555', letterSpacing: '0.08em', marginBottom: 2 }}>
                {m.code}
              </div>
              <div style={{
                fontSize: 22,
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                color: '#e8c97d',
                letterSpacing: '-0.03em',
              }}>
                {m.value}
              </div>
              <div style={{ fontSize: 11, color: '#444', marginTop: 2, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {m.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── Right column: CSS 3D Keyboard ── */}
      <motion.div
        className="hero-keyboard"
        initial={{ opacity: 0, scale: 0.94, x: 30 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <KeyboardIllustration />
      </motion.div>

      </div>{/* end hero-grid */}

      {/* Scroll hint — bottom center */}
      <motion.div
        className="hero-scroll-hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        style={{
          position: 'absolute',
          bottom: 36,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
          zIndex: 10,
        }}
      >
        <span style={{ fontSize: 10, color: '#333', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
          Explorar
        </span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          style={{
            width: 1,
            height: 36,
            background: 'linear-gradient(180deg, #e8c97d60, transparent)',
          }}
        />
      </motion.div>
    </section>
  );
}
