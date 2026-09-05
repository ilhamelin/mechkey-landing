'use client';
import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

const KeyboardScene = dynamic(() => import('../3d/KeyboardScene'), {
  ssr: false,
  loading: () => (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div className="loader-ring" />
    </div>
  ),
});

const LAYERS = [
  {
    id: 'case_top',
    title: 'Carcasa CNC & Knob',
    subtitle: 'Aluminio 6061-T6 + Latón',
    description: 'Mecanizado a 5 ejes con perilla rotatoria diamond-knurled y bisel dorado pulido.',
    color: '#e8c97d',
    range: [0.0, 0.25] as [number, number],
  },
  {
    id: 'switches',
    title: 'Switches V2 & Plate Gasket',
    subtitle: 'Vástago Lineal · Carcasa Clara',
    description: 'Switches con carcasa de policarbonato translúcido, resortes dorados y montaje gasket amortiguado.',
    color: '#7dc8e8',
    range: [0.25, 0.5] as [number, number],
  },
  {
    id: 'pcb',
    title: 'PCB Audiófila & USB-C',
    subtitle: 'ARM Cortex-M0+ // USB-C',
    description: 'Pistas doradas de baja latencia (1000Hz), LEDs SMD por tecla y puerto USB-C trasero.',
    color: '#7de8a0',
    range: [0.5, 0.75] as [number, number],
  },
  {
    id: 'foam',
    title: 'Amortiguación & Peso PVD',
    subtitle: 'PORON + Barra de Latón Espejo',
    description: 'Doble absorción acústica y placa de peso de latón macizo PVD en la base para un sonido thock puro.',
    color: '#e87d9a',
    range: [0.75, 1.0] as [number, number],
  },
];

export default function ScrollytellingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [localProgress, setLocalProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollable = el.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const p = Math.max(0, Math.min(1, -rect.top / scrollable));
      setLocalProgress(p);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeLayer = (() => {
    const idx = LAYERS.findIndex(
      (l) => localProgress >= l.range[0] && localProgress < l.range[1]
    );
    return idx === -1 ? LAYERS.length - 1 : idx;
  })();

  const activeColor = LAYERS[activeLayer].color;

  return (
    <>
      <style>{`
        .scrolly-section {
          position: relative;
          height: 360vh;
          background: #080808;
        }
        .scrolly-viewport {
          position: sticky;
          top: 0;
          height: 100vh;
          display: grid;
          grid-template-columns: 420px 1fr;
          align-items: stretch;
          background: #080808;
          overflow: hidden;
        }
        .scrolly-desktop-panel {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 80px 40px 32px 64px;
          z-index: 10;
          height: 100vh;
          max-height: 100vh;
          box-sizing: border-box;
          background: linear-gradient(90deg, #080808 88%, transparent);
        }
        .scrolly-canvas-panel {
          position: relative;
          height: 100vh;
          width: 100%;
        }
        .scrolly-mobile-header,
        .scrolly-mobile-card {
          display: none;
        }

        @media (max-width: 900px) {
          .scrolly-section {
            height: 280vh;
          }
          .scrolly-viewport {
            display: block;
            height: 100svh;
            position: sticky;
            top: 0;
            overflow: hidden;
          }
          .scrolly-desktop-panel {
            display: none !important;
          }
          .scrolly-canvas-panel {
            position: absolute;
            inset: 0;
            height: 100%;
            width: 100%;
            z-index: 1;
          }
          .scrolly-mobile-header {
            display: flex;
            position: absolute;
            top: 72px;
            left: 16px;
            right: 16px;
            z-index: 10;
            justify-content: space-between;
            align-items: center;
            padding: 10px 14px;
            background: rgba(12, 12, 12, 0.75);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 12px;
          }
          .scrolly-mobile-card {
            display: block;
            position: absolute;
            bottom: 24px;
            left: 16px;
            right: 16px;
            z-index: 10;
            background: rgba(12, 12, 12, 0.82);
            backdrop-filter: blur(24px);
            -webkit-backdrop-filter: blur(24px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 16px;
            padding: 18px 20px;
            box-shadow: 0 16px 40px rgba(0,0,0,0.6);
          }
        }
      `}</style>

      <section
        ref={sectionRef}
        id="exploded-view"
        className="scrolly-section"
      >
        {/* Sticky viewport */}
        <div className="scrolly-viewport">

          {/* ── Mobile Top Header HUD ── */}
          <div className="scrolly-mobile-header">
            <span className="tag" style={{ fontSize: 11, padding: '3px 10px' }}>
              Diseño Interno
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex', gap: 4 }}>
                {LAYERS.map((layer, i) => (
                  <div
                    key={i}
                    style={{
                      height: 3,
                      borderRadius: 2,
                      width: i === activeLayer ? 18 : 6,
                      background: i === activeLayer ? layer.color : 'rgba(255,255,255,0.15)',
                      transition: 'all 0.3s ease',
                    }}
                  />
                ))}
              </div>
              <div style={{
                height: 3,
                width: 50,
                background: 'rgba(255,255,255,0.08)',
                borderRadius: 2,
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  width: `${localProgress * 100}%`,
                  background: 'linear-gradient(90deg, #e8c97d, #c8a45a)',
                  transition: 'width 0.08s linear',
                }} />
              </div>
            </div>
          </div>

          {/* ── Mobile Bottom Info Card HUD ── */}
          <div className="scrolly-mobile-card">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 6,
            }}>
              <span style={{
                fontSize: 10,
                color: activeColor,
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}>
                <span style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: activeColor,
                  display: 'inline-block',
                  boxShadow: `0 0 8px ${activeColor}`,
                }} />
                {LAYERS[activeLayer].subtitle}
              </span>
              <span style={{ fontSize: 10, color: '#555', letterSpacing: '0.08em' }}>
                0{activeLayer + 1} / 04
              </span>
            </div>

            <div style={{
              fontSize: 18,
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              color: '#f0f0f0',
              letterSpacing: '-0.02em',
              marginBottom: 4,
            }}>
              {LAYERS[activeLayer].title}
            </div>

            <p style={{
              fontSize: 12,
              color: '#777',
              lineHeight: 1.5,
              margin: 0,
            }}>
              {LAYERS[activeLayer].description}
            </p>

            <div style={{
              marginTop: 10,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid rgba(255,255,255,0.05)',
              paddingTop: 8,
              fontSize: 10,
              color: '#444',
            }}>
              <span>Desplaza para desensamblar</span>
              <span style={{ color: activeColor }}>↓</span>
            </div>
          </div>

          {/* ── Desktop Left Panel ── */}
          <div className="scrolly-desktop-panel">
            {/* Header */}
            <div style={{ marginBottom: 20 }}>
              <span className="tag" style={{ display: 'inline-flex', marginBottom: 10, fontSize: 11, padding: '3px 10px' }}>
                Diseño Interno
              </span>
              <h2 style={{
                fontSize: 'clamp(26px, 2.4vw, 34px)',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                letterSpacing: '-0.04em',
                lineHeight: 1.1,
                color: '#f0f0f0',
                margin: '6px 0',
              }}>
                Ingeniería<br />
                <span className="gradient-text">capa a capa</span>
              </h2>
              <p style={{ color: '#555', fontSize: 13, lineHeight: 1.4, margin: 0 }}>
                Desplaza para desensamblar.
              </p>
            </div>

            {/* Layer labels — active layer expands, inactive stay compact */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, margin: '6px 0' }}>
              {LAYERS.map((layer, i) => {
                const isActive = i === activeLayer;
                return (
                  <motion.div
                    key={layer.id}
                    animate={{
                      opacity: isActive ? 1 : 0.35,
                      x: isActive ? 0 : -4,
                    }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    style={{
                      borderLeft: `2px solid ${isActive ? layer.color : 'rgba(255,255,255,0.08)'}`,
                      paddingLeft: 14,
                      paddingTop: isActive ? 8 : 4,
                      paddingBottom: isActive ? 8 : 4,
                      transition: 'border-color 0.3s ease, padding 0.25s ease',
                    }}
                  >
                    <div style={{
                      fontSize: 10,
                      color: isActive ? layer.color : '#555',
                      fontWeight: 600,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      marginBottom: 2,
                      transition: 'color 0.3s',
                    }}>
                      {layer.subtitle}
                    </div>
                    <div style={{
                      fontSize: isActive ? 16 : 14,
                      fontFamily: 'var(--font-display)',
                      fontWeight: 600,
                      color: isActive ? '#f0f0f0' : '#555',
                      marginBottom: isActive ? 3 : 0,
                      transition: 'all 0.25s',
                    }}>
                      {layer.title}
                    </div>
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          style={{
                            fontSize: 12,
                            color: '#888',
                            lineHeight: 1.5,
                            maxWidth: 300,
                            overflow: 'hidden',
                          }}
                        >
                          {layer.description}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>

            {/* Progress indicators — always comfortably visible */}
            <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, maxWidth: 220 }}>
                <span style={{ fontSize: 10, color: '#555', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Capa 0{activeLayer + 1} / 04
                </span>
                <span style={{ fontSize: 11, color: activeColor, fontWeight: 600 }}>
                  {Math.round(localProgress * 100)}%
                </span>
              </div>
              <div style={{ display: 'flex', gap: 5, marginBottom: 8 }}>
                {LAYERS.map((layer, i) => (
                  <div key={i} style={{
                    height: 3,
                    borderRadius: 2,
                    width: i === activeLayer ? 24 : 8,
                    background: i === activeLayer ? layer.color : 'rgba(255,255,255,0.1)',
                    transition: 'all 0.3s ease',
                  }} />
                ))}
              </div>
              {/* Gold progress bar */}
              <div style={{
                height: 2,
                width: 200,
                background: 'rgba(255,255,255,0.06)',
                borderRadius: 1,
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  width: `${localProgress * 100}%`,
                  background: 'linear-gradient(90deg, #e8c97d, #c8a45a)',
                  transition: 'width 0.08s linear',
                }} />
              </div>
            </div>
          </div>

          {/* ── 3D Canvas Panel ── */}
          <div className="scrolly-canvas-panel">
            {/* Color-reactive glow */}
            <div aria-hidden style={{
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(ellipse 65% 55% at 50% 55%, ${activeColor}0d 0%, transparent 70%)`,
              transition: 'background 0.6s ease',
              pointerEvents: 'none',
              zIndex: 0,
            }} />
            <KeyboardScene scrollProgress={localProgress} />
          </div>
        </div>
      </section>
    </>
  );
}
