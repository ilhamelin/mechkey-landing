'use client';
import { useState } from 'react';

const COLORS = [
  { name: 'Obsidian', hex: '#141414', border: '#e8c97d', glow: '232,201,125' },
  { name: 'Arctic',   hex: '#d0d5de', border: '#4a90d9', glow: '74,144,217' },
  { name: 'Midnight', hex: '#1a1a2e', border: '#7b68ee', glow: '123,104,238' },
  { name: 'Copper',   hex: '#2d1a0e', border: '#c87941', glow: '200,121,65' },
];

export default function CTASection() {
  const [selected, setSelected] = useState(0);
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const c = COLORS[selected];

  return (
    <section
      id="cta"
      className="cta-section"
      style={{
        background: '#080808',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <style>{`
        @keyframes ctaFadeIn {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .cta-section {
          padding: 140px 0 120px;
        }
        .cta-wrapper {
          animation: ctaFadeIn 0.7s ease both;
        }
        .cta-form {
          display: flex;
          gap: 10px;
          justify-content: center;
          max-width: 440px;
          margin: 0 auto;
        }
        .cta-input {
          padding: 13px 18px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          color: #f0f0f0;
          font-size: 14px;
          flex: 1;
          min-width: 0;
          font-family: var(--font-body);
          transition: border-color 0.2s;
        }
        .cta-input::placeholder { color: #333; }
        .cta-input:focus { outline: none; border-color: rgba(232,201,125,0.4) !important; }
        .cta-btn {
          white-space: nowrap;
        }
        .pricing-col {
          padding: 24px 20px;
          text-align: center;
          background: #080808;
        }
        @media (max-width: 640px) {
          .cta-section {
            padding: 80px 0 60px;
          }
        }
        @media (max-width: 520px) {
          .cta-form {
            flex-direction: column;
            width: 100%;
          }
          .cta-input {
            width: 100%;
          }
          .cta-btn {
            width: 100%;
            justify-content: center;
          }
          .pricing-col {
            padding: 14px 4px !important;
          }
          .pricing-val {
            font-size: 15px !important;
          }
        }
      `}</style>

      {/* Top divider */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: 1,
        background: 'linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.06) 50%, transparent 95%)',
      }} />

      {/* Reactive background glow */}
      <div aria-hidden style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(ellipse 70% 50% at 50% 60%, rgba(${c.glow},0.05) 0%, transparent 70%)`,
        transition: 'background 0.7s ease',
        pointerEvents: 'none',
      }} />

      <div
        className="cta-wrapper container"
        style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}
      >
        {/* Tag */}
        <span className="tag" style={{ display: 'inline-flex', marginBottom: 24 }}>
          Disponible Q1 2027
        </span>

        {/* Title */}
        <h2 style={{
          fontSize: 'clamp(36px, 7vw, 76px)',
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          letterSpacing: '-0.04em',
          lineHeight: 1.0,
          color: '#f0f0f0',
          margin: '12px 0 14px',
        }}>
          Tu <span className="gradient-text">STRATA</span>
        </h2>

        <p style={{
          color: '#555',
          fontSize: 14,
          lineHeight: 1.7,
          maxWidth: 480,
          margin: '0 auto 36px',
        }}>
          500 unidades. Los primeros 100 registros reciben precio early-bird y envío gratis a cualquier parte del mundo.
        </p>

        {/* Color swatches */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 12 }}>
          {COLORS.map((col, i) => (
            <button
              key={col.name}
              id={`color-${col.name.toLowerCase()}`}
              onClick={() => setSelected(i)}
              title={col.name}
              style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                background: col.hex,
                border: `2px solid ${i === selected ? col.border : 'rgba(255,255,255,0.1)'}`,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                transform: i === selected ? 'scale(1.2)' : 'scale(1)',
                boxShadow: i === selected ? `0 0 14px rgba(${col.glow},0.4)` : 'none',
              }}
            />
          ))}
        </div>
        <p style={{ fontSize: 12, color: '#3a3a3a', marginBottom: 36 }}>
          Color:{' '}
          <span style={{ color: c.border, fontWeight: 600 }}>{c.name}</span>
        </p>

        {/* Form / Success */}
        {!done ? (
          <form
            id="preorder-form"
            className="cta-form"
            onSubmit={(e) => { e.preventDefault(); if (email) setDone(true); }}
          >
            <input
              id="email-input"
              className="cta-input"
              type="email"
              required
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button id="submit-preorder" type="submit" className="btn-primary cta-btn">
              Reservar Ahora
            </button>
          </form>
        ) : (
          <div style={{
            display: 'inline-block',
            padding: '24px 36px',
            background: 'rgba(232,201,125,0.04)',
            border: '1px solid rgba(232,201,125,0.15)',
            borderRadius: 16,
            animation: 'ctaFadeIn 0.4s ease',
          }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>✦</div>
            <div style={{
              fontSize: 16,
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              color: '#e8c97d',
              marginBottom: 4,
            }}>
              ¡Estás en la lista!
            </div>
            <div style={{ fontSize: 13, color: '#555' }}>
              Te avisamos en cuanto abra la venta.
            </div>
          </div>
        )}

        {/* Pricing grid */}
        <div style={{
          marginTop: 48,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 1,
          background: 'rgba(255,255,255,0.05)',
          borderRadius: 12,
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.05)',
        }}>
          {[
            { label: 'Early-Bird', value: '$289 USD', note: 'Primeros 100' },
            { label: 'Regular', value: '$349 USD', note: '500 unidades' },
            { label: 'Envío', value: 'Gratis', note: 'Early-bird global' },
          ].map((item) => (
            <div
              key={item.label}
              className="pricing-col"
            >
              <div style={{ fontSize: 9, color: '#3a3a3a', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
                {item.label}
              </div>
              <div
                className="pricing-val"
                style={{
                  fontSize: 19,
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  color: '#f0f0f0',
                  marginBottom: 2,
                }}
              >
                {item.value}
              </div>
              <div style={{ fontSize: 11, color: '#333' }}>{item.note}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
