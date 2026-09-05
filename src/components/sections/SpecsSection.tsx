'use client';
import Reveal from '@/components/ui/Reveal';

const SPECS = [
  { code: '01 // ARCH', label: 'Layout', value: '75%', sub: 'Tenkeyless compacto' },
  { code: '02 // MECH', label: 'Switches', value: 'V2 Linear', sub: 'Hot-swap PCB' },
  { code: '03 // BUS', label: 'Polling Rate', value: '1000Hz', sub: 'USB-C 2.0 (1ms)' },
  { code: '04 // MATRIX', label: 'N-Key Rollover', value: 'NKRO', sub: 'Anti-ghosting total' },
  { code: '05 // CORE', label: 'Firmware', value: 'QMK / VIA', sub: 'Totalmente programable' },
  { code: '06 // OPTIC', label: 'Backlight', value: 'RGB', sub: 'Per-key, 16.7M colores' },
  { code: '07 // MOUNT', label: 'Estructura', value: 'Gasket', sub: 'Montaje amortiguado' },
  { code: '08 // ALLOY', label: 'Peso', value: '1.2kg', sub: 'Aluminio 6061-T6 CNC' },
  { code: '09 // PORT', label: 'Conectividad', value: 'USB-C', sub: 'Cable trenzado blindado' },
];

export default function SpecsSection() {
  return (
    <section
      id="specs"
      className="specs-section"
      style={{
        background: '#080808',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <style>{`
        @keyframes cardFadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .specs-section {
          padding: 120px 0 100px;
        }
        .spec-card {
          position: relative;
          padding: 24px 22px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          cursor: default;
          transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s;
          animation: cardFadeIn 0.5s ease both;
        }
        .spec-card:hover {
          border-color: rgba(232,201,125,0.3);
          box-shadow: 0 10px 30px rgba(232,201,125,0.06);
          transform: translateY(-2px);
        }
        .specs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 12px;
        }
        .specs-cta-bar {
          margin-top: 56px;
          padding: 32px 40px;
          background: rgba(232,201,125,0.04);
          border: 1px solid rgba(232,201,125,0.12);
          border-radius: 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }
        @media (max-width: 640px) {
          .specs-section {
            padding: 80px 0 60px;
          }
          .specs-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
          .spec-card {
            padding: 16px 14px;
          }
          .spec-card-value {
            font-size: 20px !important;
          }
          .spec-card-sub {
            font-size: 11px !important;
          }
          .specs-cta-bar {
            padding: 22px 18px;
            flex-direction: column;
            align-items: stretch;
            text-align: center;
            gap: 16px;
          }
          .specs-cta-btn {
            width: 100%;
            justify-content: center;
            text-align: center;
          }
        }
        @media (max-width: 380px) {
          .specs-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Top divider */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: 1,
        background: 'linear-gradient(90deg, transparent 5%, rgba(232,201,125,0.15) 50%, transparent 95%)',
      }} />

      <div className="container">
        <Reveal delay={0} direction="up">
          <div style={{ marginBottom: 48, maxWidth: 540 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span className="tag" style={{ display: 'inline-flex' }}>
                Especificaciones
              </span>
              <span style={{
                fontSize: 10,
                fontFamily: 'monospace',
                color: '#555',
                letterSpacing: '0.08em',
              }}>
                [ REV. 2.4 // HARDWARE SPEC ]
              </span>
            </div>
            <h2 style={{
              fontSize: 'clamp(32px, 5vw, 52px)',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              letterSpacing: '-0.04em',
              lineHeight: 1.1,
              color: '#f0f0f0',
              margin: '12px 0 14px',
            }}>
              Construido sin<br />
              <span className="gradient-text">compromisos</span>
            </h2>
            <p style={{ color: '#555', fontSize: 14, lineHeight: 1.6 }}>
              Cada componente seleccionado al mínimo detalle. Tolerancias micrométricas y calibración acústica individual.
            </p>
          </div>
        </Reveal>

        <div className="specs-grid">
          {SPECS.map((spec, i) => (
            <div
              key={spec.label}
              className="spec-card"
              style={{ animationDelay: `${i * 55}ms` }}
            >
              {/* Technical index badge row */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 10,
              }}>
                <span style={{
                  fontSize: 9,
                  fontFamily: 'monospace',
                  color: 'rgba(232, 201, 125, 0.7)',
                  letterSpacing: '0.1em',
                  fontWeight: 600,
                }}>
                  {spec.code}
                </span>
                <span style={{ fontSize: 9, color: '#333', fontFamily: 'monospace' }}>
                  +
                </span>
              </div>

              <div style={{
                fontSize: 10,
                color: '#444',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: 6,
                fontWeight: 600,
              }}>
                {spec.label}
              </div>
              <div
                className="spec-card-value"
                style={{
                  fontSize: 24,
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  color: '#f0f0f0',
                  letterSpacing: '-0.03em',
                  marginBottom: 4,
                }}
              >
                {spec.value}
              </div>
              <div
                className="spec-card-sub"
                style={{ fontSize: 12, color: '#555', lineHeight: 1.4 }}
              >
                {spec.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA bar */}
        <Reveal delay={200} direction="up">
          <div className="specs-cta-bar">
            <div>
              <div style={{ fontSize: 12, color: '#555', marginBottom: 4 }}>
                Disponibilidad
              </div>
              <div style={{
                fontSize: 17,
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                color: '#e8c97d',
              }}>
                Q1 2027 — Producción limitada
              </div>
            </div>
            <a href="#cta" className="btn-primary specs-cta-btn" id="specs-cta">
              Ver Precio y Reservar
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
