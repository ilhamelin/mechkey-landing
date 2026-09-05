'use client';
import { useState } from 'react';
import { motion, type Variants, AnimatePresence } from 'framer-motion';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.13,
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1] as unknown as [number, number, number, number],
    },
  }),
};

// ── Colorways ──
export type Colorway = 'dark' | 'cream' | 'stealth' | 'arctic';

const COLORWAYS: Record<Colorway, { label: string; body: string; accent: string; accentGlow: string; border: string; tag: string }> = {
  dark:    { label: 'Dark',    body: 'linear-gradient(135deg,#1c1c1c 0%,#141414 60%,#0e0e0e 100%)', accent: '#e8c97d', accentGlow: 'rgba(232,201,125,0.12)', border: 'rgba(232,201,125,0.12)', tag: 'DARK OPS' },
  cream:   { label: 'Cream',   body: 'linear-gradient(135deg,#eae2d4 0%,#d8cdb8 60%,#c9b99a 100%)', accent: '#8b6914', accentGlow: 'rgba(139,105,20,0.18)', border: 'rgba(139,105,20,0.22)', tag: 'VINTAGE CREAM' },
  stealth: { label: 'Stealth', body: 'linear-gradient(135deg,#111118 0%,#0a0a12 60%,#060610 100%)', accent: '#7b8cde', accentGlow: 'rgba(123,140,222,0.18)', border: 'rgba(123,140,222,0.18)', tag: 'STEALTH BLUE' },
  arctic:  { label: 'Arctic',  body: 'linear-gradient(135deg,#1a2430 0%,#111c28 60%,#0a131e 100%)', accent: '#5dc8e0', accentGlow: 'rgba(93,200,224,0.15)', border: 'rgba(93,200,224,0.15)', tag: 'ARCTIC TEAL' },
};

// ── Key metadata for interactive keymap ──
const KEY_INFO: Record<string, { material: string; note: string }> = {
  '0-0':  { material: 'PBT Double-shot', note: 'Esc — programable vía VIA' },
  '0-13': { material: 'ABS Translúcido', note: 'Backspace — actuación 45g' },
  '1-0':  { material: 'PBT Double-shot', note: 'Tab — 1.5u, stabilizador Cherry' },
  '2-0':  { material: 'PBT Double-shot', note: 'CapsLock — LED status dorado' },
  '3-0':  { material: 'PBT XL', note: 'Shift — 2.25u, silicioso' },
  '4-0':  { material: 'Aluminio CNC', note: 'Fn Knob — encoder rotativo' },
};

interface KeyboardIllustrationProps {
  colorway: Colorway;
  activeKey: string | null;
  onKeyHover: (key: string | null) => void;
}

// Decorative keyboard illustration (CSS/SVG — no WebGL context used here)
function KeyboardIllustration({ colorway, activeKey, onKeyHover }: KeyboardIllustrationProps) {
  const cw = COLORWAYS[colorway];
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
          background: cw.body,
          borderRadius: 16,
          padding: '18px 22px 22px',
          boxShadow: `0 0 0 1px ${cw.border}, 0 40px 80px rgba(0,0,0,0.7), 0 8px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)`,
          transform: 'rotateX(18deg) rotateY(-4deg)',
          transformStyle: 'preserve-3d',
          animation: 'heroFloat 5s ease-in-out infinite',
          transition: 'background 0.5s ease, box-shadow 0.5s ease',
        }}
      >
        {/* Top accent strip */}
        <div style={{
          height: 2,
          background: `linear-gradient(90deg, transparent, ${cw.accent}, transparent)`,
          borderRadius: 1,
          marginBottom: 16,
          opacity: 0.6,
          transition: 'background 0.5s ease',
        }} />

        {/* Key rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {rows.map((cols, rowIdx) => (
            <div key={rowIdx} style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
              {Array.from({ length: cols }).map((_, colIdx) => {
                const keyId = `${rowIdx}-${colIdx}`;
                const isAccent = (rowIdx === 0 && (colIdx === 0 || colIdx === cols - 1)) ||
                  (rowIdx === 1 && colIdx === 0) ||
                  (rowIdx === 4 && colIdx === 0);
                const isWide = colIdx === 0 && rowIdx > 1;
                const hasInfo = !!KEY_INFO[keyId];
                const isHovered = activeKey === keyId;
                return (
                  <div
                    key={colIdx}
                    onMouseEnter={() => hasInfo ? onKeyHover(keyId) : undefined}
                    onMouseLeave={() => onKeyHover(null)}
                    style={{
                      width: isWide ? 48 : 28,
                      height: 24,
                      borderRadius: 4,
                      background: isAccent
                        ? `linear-gradient(135deg, ${cw.accent}, ${cw.accent}cc)`
                        : colorway === 'cream'
                          ? 'linear-gradient(180deg, #d0c5b0 0%, #c4b8a0 100%)'
                          : 'linear-gradient(180deg, #2a2a2a 0%, #1e1e1e 100%)',
                      boxShadow: isHovered
                        ? `0 2px 4px rgba(0,0,0,0.5), 0 0 12px ${cw.accentGlow}, inset 0 1px 0 rgba(255,255,255,0.15)`
                        : isAccent
                          ? `0 2px 4px rgba(0,0,0,0.5), 0 0 8px ${cw.accentGlow}, inset 0 1px 0 rgba(255,255,255,0.1)`
                          : '0 2px 4px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
                      border: `1px solid ${isHovered ? cw.accent + '80' : 'rgba(255,255,255,0.05)'}`,
                      flexShrink: 0,
                      cursor: hasInfo ? 'default' : 'default',
                      transform: isHovered ? 'translateZ(4px) scale(1.08)' : 'translateZ(0) scale(1)',
                      transition: 'all 0.18s ease',
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
          <span style={{ fontSize: 8, fontFamily: 'monospace', color: colorway === 'cream' ? '#888' : '#555', letterSpacing: '0.14em' }}>
            STRATA // 6061-T6
          </span>
          <span style={{ fontSize: 8, fontFamily: 'monospace', color: cw.accent + '99', letterSpacing: '0.1em', transition: 'color 0.4s' }}>
            [ {cw.tag} ]
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

// ── Color Configurator Panel ──
function ColorConfigurator({ colorway, onChange }: { colorway: Colorway; onChange: (c: Colorway) => void }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      position: 'absolute',
      right: 16,
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 20,
    }}>
      <div style={{ fontSize: 9, fontFamily: 'monospace', color: '#444', letterSpacing: '0.12em', marginBottom: 4, textAlign: 'right' }}>COLORWAY</div>
      {(Object.keys(COLORWAYS) as Colorway[]).map((cw) => {
        const active = cw === colorway;
        return (
          <button
            key={cw}
            title={COLORWAYS[cw].label}
            onClick={() => onChange(cw)}
            style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: COLORWAYS[cw].accent,
              border: `2px solid ${active ? COLORWAYS[cw].accent : 'rgba(255,255,255,0.08)'}`,
              boxShadow: active ? `0 0 0 3px rgba(255,255,255,0.06), 0 0 12px ${COLORWAYS[cw].accentGlow}` : 'none',
              cursor: 'pointer',
              transition: 'all 0.25s',
              transform: active ? 'scale(1.15)' : 'scale(1)',
              alignSelf: 'flex-end',
            }}
          />
        );
      })}
    </div>
  );
}

export default function HeroSection() {
  const [colorway, setColorway] = useState<Colorway>('dark');
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const keyInfo = activeKey ? KEY_INFO[activeKey] : null;

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
        <KeyboardIllustration
          colorway={colorway}
          activeKey={activeKey}
          onKeyHover={setActiveKey}
        />
        <ColorConfigurator colorway={colorway} onChange={setColorway} />

        {/* Interactive key tooltip */}
        <AnimatePresence>
          {keyInfo && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.95 }}
              transition={{ duration: 0.18 }}
              style={{
                position: 'absolute',
                bottom: 8,
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(10,10,10,0.92)',
                border: '1px solid rgba(232,201,125,0.2)',
                borderRadius: 8,
                padding: '8px 16px',
                zIndex: 30,
                backdropFilter: 'blur(12px)',
                textAlign: 'center',
                pointerEvents: 'none',
                minWidth: 180,
              }}
            >
              <div style={{ fontSize: 10, color: '#e8c97d', fontFamily: 'monospace', letterSpacing: '0.08em', marginBottom: 2 }}>
                {keyInfo.material}
              </div>
              <div style={{ fontSize: 11, color: '#888' }}>{keyInfo.note}</div>
            </motion.div>
          )}
        </AnimatePresence>
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
