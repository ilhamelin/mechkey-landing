'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, type Variants } from 'framer-motion';
import { type ModularFinish } from '../3d/HeroModularModel';

const HeroScene = dynamic(() => import('../3d/HeroScene'), {
  ssr: false,
  loading: () => (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px',
    }}>
      <div style={{
        width: 44,
        height: 44,
        borderRadius: '50%',
        border: '2px solid rgba(232, 201, 125, 0.15)',
        borderTopColor: '#e8c97d',
        animation: 'heroSpin 1s linear infinite',
      }} />
    </div>
  ),
});

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

const COLORWAYS: Record<Colorway, { label: string; accent: string; accentGlow: string; tag: string }> = {
  dark:    { label: 'Dark',    accent: '#e8c97d', accentGlow: 'rgba(232,201,125,0.25)', tag: 'DARK OPS' },
  cream:   { label: 'Cream',   accent: '#c9b99a', accentGlow: 'rgba(201,185,154,0.25)', tag: 'VINTAGE CREAM' },
  stealth: { label: 'Stealth', accent: '#7b8cde', accentGlow: 'rgba(123,140,222,0.25)', tag: 'STEALTH BLUE' },
  arctic:  { label: 'Arctic',  accent: '#5dc8e0', accentGlow: 'rgba(93,200,224,0.25)',  tag: 'ARCTIC TEAL' },
};

// ── Modularity Control Panel (Left of 3D Model, matching user screenshot) ──
interface ModularityControlProps {
  finish: ModularFinish;
  onFinishChange: (f: ModularFinish) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

function ModularityControl({
  finish,
  onFinishChange,
  isExpanded,
  onToggleExpand,
}: ModularityControlProps) {
  const options: { id: ModularFinish; label: string; bgGradient: string; borderAccent: string }[] = [
    {
      id: 'bronce',
      label: 'TOP-PLATE BRONCE',
      bgGradient: 'linear-gradient(135deg, #c59b48 0%, #75521b 100%)',
      borderAccent: '#e8c97d',
    },
    {
      id: 'carbono',
      label: 'TOP-PLATE CARBONO',
      bgGradient: 'linear-gradient(135deg, #242426 0%, #0e0e10 100%)',
      borderAccent: '#555560',
    },
    {
      id: 'titanium',
      label: 'TOP-PLATE TITANIUM',
      bgGradient: 'linear-gradient(135deg, #3d414d 0%, #1e2026 100%)',
      borderAccent: '#8a92a6',
    },
  ];

  return (
    <div
      className="modularity-control-widget"
      style={{
        position: 'absolute',
        left: 12,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 25,
        background: 'rgba(11, 12, 16, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(232, 201, 125, 0.28)',
        borderRadius: '10px',
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        width: '156px',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.65), 0 0 16px rgba(232, 201, 125, 0.1)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '2px' }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#e8c97d', boxShadow: '0 0 6px #e8c97d' }} />
        <span style={{
          fontFamily: 'monospace',
          fontSize: '9px',
          fontWeight: 700,
          color: '#e8c97d',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}>
          MODULARITY CONTROL
        </span>
      </div>

      {/* Selectable Plate Modules */}
      {options.map((opt) => {
        const isActive = finish === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => onFinishChange(opt.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              padding: '6px',
              borderRadius: '6px',
              background: isActive ? 'rgba(232, 201, 125, 0.12)' : 'rgba(255, 255, 255, 0.03)',
              border: `1px solid ${isActive ? opt.borderAccent : 'rgba(255, 255, 255, 0.07)'}`,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease',
              boxShadow: isActive ? `0 0 10px ${opt.borderAccent}33` : 'none',
            }}
          >
            {/* Swatch preview bar */}
            <div
              style={{
                width: '100%',
                height: '18px',
                borderRadius: '3px',
                background: opt.bgGradient,
                border: '1px solid rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Miniature plate grill texture */}
              <div style={{
                width: '70%',
                height: '2px',
                background: 'rgba(0, 0, 0, 0.35)',
                borderRadius: '1px',
              }} />
            </div>

            <span
              style={{
                fontFamily: 'monospace',
                fontSize: '8.5px',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#ffffff' : '#888892',
                letterSpacing: '0.04em',
              }}
            >
              {opt.label}
            </span>
          </button>
        );
      })}

      {/* Quick-Release Expand / Snap Action Button */}
      <button
        onClick={onToggleExpand}
        style={{
          marginTop: '4px',
          padding: '6px 8px',
          borderRadius: '5px',
          background: isExpanded
            ? 'linear-gradient(135deg, rgba(232, 201, 125, 0.25), rgba(200, 164, 90, 0.15))'
            : 'rgba(255, 255, 255, 0.05)',
          border: `1px solid ${isExpanded ? '#e8c97d' : 'rgba(255, 255, 255, 0.1)'}`,
          color: isExpanded ? '#e8c97d' : '#a1a1aa',
          fontFamily: 'monospace',
          fontSize: '8.5px',
          fontWeight: 700,
          letterSpacing: '0.06em',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '5px',
          transition: 'all 0.2s ease',
        }}
      >
        <span>{isExpanded ? '⚡ RIELES DESACOPLADOS' : '🧲 RIELES ENSAMBLADOS'}</span>
      </button>
    </div>
  );
}

// ── Color Configurator Panel (Right side) ──
function ColorConfigurator({ colorway, onChange }: { colorway: Colorway; onChange: (c: Colorway) => void }) {
  return (
    <div
      className="hero-color-swatches"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        position: 'absolute',
        right: 18,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 25,
        background: 'rgba(11, 12, 16, 0.75)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        padding: '10px 8px',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <div style={{ fontSize: 8, fontFamily: 'monospace', color: '#666', letterSpacing: '0.12em', marginBottom: 2, textAlign: 'center' }}>
        TEMA
      </div>
      {(Object.keys(COLORWAYS) as Colorway[]).map((cw) => {
        const active = cw === colorway;
        return (
          <button
            key={cw}
            title={COLORWAYS[cw].label}
            onClick={() => onChange(cw)}
            style={{
              width: 22,
              height: 22,
              borderRadius: '50%',
              background: COLORWAYS[cw].accent,
              border: `2px solid ${active ? '#ffffff' : 'rgba(255,255,255,0.1)'}`,
              boxShadow: active ? `0 0 14px ${COLORWAYS[cw].accentGlow}` : 'none',
              cursor: 'pointer',
              transition: 'all 0.25s',
              transform: active ? 'scale(1.2)' : 'scale(1)',
            }}
          />
        );
      })}
    </div>
  );
}

export default function HeroSection() {
  const [colorway, setColorway] = useState<Colorway>('dark');
  const [finish, setFinish] = useState<ModularFinish>('bronce');
  const [isExpanded, setIsExpanded] = useState<boolean>(true); // Defaults to modular expanded view as in screenshot!

  const cw = COLORWAYS[colorway];

  return (
    <section
      id="hero"
      className="hero-section"
      style={{
        position: 'relative',
        background: '#080808',
      }}
    >
      {/* Keyframe & responsive styles */}
      <style>{`
        @keyframes heroSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .hero-section {
          height: 100vh;
          min-height: 720px;
          overflow: hidden;
          position: relative;
        }
        .hero-grid {
          display: grid;
          grid-template-columns: 460px 1fr;
          height: 100%;
          align-items: center;
        }
        .hero-text {
          padding: 0 0 0 72px;
          z-index: 15;
        }
        .hero-3d-container {
          position: relative;
          height: 100%;
          width: 100%;
          display: flex;
          align-items: center;
          justifyContent: center;
          overflow: hidden;
        }
        .hero-actions {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .hero-metrics {
          display: flex;
          gap: 32px;
          margin-top: 48px;
          flex-wrap: wrap;
        }

        @media (max-width: 1120px) {
          .hero-grid {
            grid-template-columns: 380px 1fr;
          }
          .hero-text {
            padding: 0 0 0 36px;
          }
          .modularity-control-widget {
            left: 6px !important;
            transform: translateY(-50%) scale(0.9) !important;
            transform-origin: left center !important;
          }
        }

        @media (max-width: 900px) {
          .hero-section {
            height: auto;
            min-height: 100svh;
            padding-bottom: 48px;
            overflow: visible;
          }
          .hero-grid {
            display: flex;
            flex-direction: column;
            padding-top: 80px;
          }
          .hero-text {
            padding: 0 20px;
            order: 2;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .hero-3d-container {
            order: 1;
            height: 380px;
            width: 100%;
          }
          .modularity-control-widget {
            left: 10px !important;
            top: auto !important;
            bottom: 10px !important;
            transform: scale(0.85) !important;
            transform-origin: bottom left !important;
          }
          .hero-color-swatches {
            right: 10px !important;
            top: auto !important;
            bottom: 10px !important;
            transform: none !important;
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
      `}</style>

      {/* Subtle Background Grid & Radial Glow */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(232,201,125,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(232,201,125,0.025) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 70% 70% at 65% 50%, black 35%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      <div
        aria-hidden
        style={{
          position: 'absolute',
          width: 550,
          height: 550,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${cw.accentGlow} 0%, transparent 70%)`,
          top: '50%',
          right: '5%',
          transform: 'translateY(-50%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
          transition: 'background 0.5s ease',
        }}
      />

      {/* Main Grid: Left Column Text, Right Column 3D Modular Scene */}
      <div className="hero-grid">

        {/* ── Left Column: Text & CTAs ── */}
        <div className="hero-text">
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}
          >
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
              fontSize: 'clamp(56px, 6.5vw, 92px)',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              letterSpacing: '-0.05em',
              lineHeight: 0.95,
              color: '#f0f0f0',
              marginBottom: 18,
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
              marginBottom: 10,
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
              fontSize: 13.5,
              color: '#404044',
              marginBottom: 40,
              maxWidth: 340,
              lineHeight: 1.7,
            }}
          >
            Aluminio 6061-T6 mecanizado CNC. Rieles perimetrales magnéticos de cambio rápido.
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
                  color: cw.accent,
                  letterSpacing: '-0.03em',
                  transition: 'color 0.4s ease',
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

        {/* ── Right Column: Interactive 3D Modular Canvas + Widgets ── */}
        <motion.div
          className="hero-3d-container"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Modularity Control Widget (Left of keyboard) */}
          <ModularityControl
            finish={finish}
            onFinishChange={setFinish}
            isExpanded={isExpanded}
            onToggleExpand={() => setIsExpanded(!isExpanded)}
          />

          {/* Real-time 3D Scene with Detachable Quick-Release Rails & Laser Blueprint */}
          <HeroScene
            finish={finish}
            isExpanded={isExpanded}
            accentColor={cw.accent}
          />

          {/* Colorway / Palette Swatches (Right of keyboard) */}
          <ColorConfigurator colorway={colorway} onChange={setColorway} />
        </motion.div>

      </div>

      {/* Scroll hint — bottom center */}
      <motion.div
        className="hero-scroll-hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        style={{
          position: 'absolute',
          bottom: 28,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          zIndex: 10,
        }}
      >
        <span style={{ fontSize: 9.5, color: '#444', letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: 'monospace' }}>
          Explorar
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          style={{
            width: 1,
            height: 32,
            background: `linear-gradient(180deg, ${cw.accent}80, transparent)`,
          }}
        />
      </motion.div>
    </section>
  );
}
