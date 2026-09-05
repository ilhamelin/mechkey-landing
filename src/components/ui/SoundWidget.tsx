'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSwitchSound, SwitchProfile } from '@/lib/sound';

const SWITCH_META: Record<SwitchProfile, { emoji: string; desc: string; freq: string; color: string }> = {
  thock:  { emoji: '🔔', desc: 'Bajo profundo, resonancia cálida', freq: 'Baja–Media', color: '#e8c97d' },
  clack:  { emoji: '⚡', desc: 'Clic nítido, tacto definido',      freq: 'Alta',       color: '#7dc8e8' },
  creamy: { emoji: '🫧', desc: 'Suave y silencioso, fluido',       freq: 'Muy Baja',   color: '#9de87d' },
};

const BAR_HEIGHTS: Record<SwitchProfile, number[]> = {
  thock:  [4, 10, 14, 12, 6],
  clack:  [6, 14, 10, 14, 12],
  creamy: [8, 6,  10, 5,  8 ],
};

export default function SoundWidget() {
  const [profile, setProfile] = useState<SwitchProfile>('thock');
  const [muted, setMuted] = useState(false);
  const [lastKeyPressed, setLastKeyPressed] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Global keydown listener for typing sound
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger when user is typing inside an actual input/textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (muted) return;

      playSwitchSound(profile, 0.65);
      setLastKeyPressed(e.key.length === 1 ? e.key.toUpperCase() : e.code.replace('Key', ''));
      setIsTyping(true);

      const timer = setTimeout(() => setIsTyping(false), 200);
      return () => clearTimeout(timer);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [profile, muted]);

  const triggerSound = (prof?: SwitchProfile) => {
    const p = prof || profile;
    playSwitchSound(p, 0.7);
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 200);
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 900,
      }}
    >
      <style>{`
        .sound-widget-card {
          background: rgba(14, 14, 14, 0.88);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(232, 201, 125, 0.15);
          border-radius: 14px;
          box-shadow: 0 12px 36px rgba(0, 0, 0, 0.6);
          overflow: hidden;
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        .sound-widget-card:hover {
          border-color: rgba(232, 201, 125, 0.3);
          box-shadow: 0 16px 44px rgba(232, 201, 125, 0.08);
        }
        @media (max-width: 640px) {
          .sound-widget-container {
            bottom: 16px !important;
            right: 16px !important;
          }
        }
      `}</style>

      <div className="sound-widget-container">
        {/* Expanded Panel */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="sound-widget-card"
              style={{
                width: 280,
                padding: '16px 18px',
                marginBottom: 10,
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{
                  fontSize: 10,
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '0.12em',
                  color: 'var(--accent-primary)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                }}>
                  [ ACOUSTIC PROFILE ]
                </span>
                <span style={{ fontSize: 10, color: '#666' }}>
                  WebAudio DSP
                </span>
              </div>

              {/* Switch Profiles */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
                {(['thock', 'clack', 'creamy'] as SwitchProfile[]).map((p) => {
                  const active = profile === p;
                  const meta = SWITCH_META[p];
                  return (
                    <button
                      key={p}
                      onClick={() => {
                        setProfile(p);
                        triggerSound(p);
                      }}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        fontSize: 12,
                        fontFamily: 'var(--font-display)',
                        textTransform: 'capitalize',
                        background: active ? 'rgba(232, 201, 125, 0.08)' : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${active ? meta.color + '80' : 'rgba(255,255,255,0.06)'}`,
                        color: active ? '#f0f0f0' : '#777',
                        borderRadius: 8,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        fontWeight: active ? 600 : 400,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        textAlign: 'left',
                      }}
                    >
                      <span>{meta.emoji}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 1 }}>{p}</div>
                        <div style={{ fontSize: 10, color: active ? '#888' : '#555', fontWeight: 400 }}>{meta.desc}</div>
                      </div>
                      {/* Mini spectrum */}
                      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 14 }}>
                        {BAR_HEIGHTS[p].map((h, bi) => (
                          <div key={bi} style={{ width: 2.5, height: h, borderRadius: 1, background: active ? meta.color : 'rgba(255,255,255,0.12)', transition: 'background 0.3s' }} />
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Interactive Key Tester */}
              <div
                onClick={() => triggerSound()}
                style={{
                  background: isTyping ? 'rgba(232, 201, 125, 0.15)' : 'rgba(255,255,255,0.02)',
                  border: '1px dashed rgba(232, 201, 125, 0.25)',
                  borderRadius: 8,
                  padding: '12px 10px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'background 0.15s, border-color 0.15s',
                }}
              >
                <div style={{ fontSize: 11, color: '#aaa', marginBottom: 2 }}>
                  {lastKeyPressed ? (
                    <span>Tecla: <strong style={{ color: 'var(--accent-primary)' }}>{lastKeyPressed}</strong></span>
                  ) : (
                    'Haz clic o presiona cualquier tecla'
                  )}
                </div>
                <div style={{ fontSize: 10, color: '#555', letterSpacing: '0.04em' }}>
                  Simulador de switch V2 Linear
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Minimized Trigger Pill */}
        <button
          onClick={() => {
            if (!expanded) {
              setExpanded(true);
              triggerSound();
            } else {
              setExpanded(false);
            }
          }}
          className="sound-widget-card"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 14px',
            color: '#f0f0f0',
            cursor: 'pointer',
            border: '1px solid rgba(232,201,125,0.2)',
          }}
          title="Test de sonido de switch mecánico"
        >
          {/* Animated sound bars */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 14 }}>
            {[1, 2, 3, 4].map((bar) => (
              <motion.div
                key={bar}
                animate={{
                  height: isTyping ? [4, 14, 6, 12][bar - 1] : muted ? 2 : [6, 10, 5, 8][bar - 1],
                }}
                transition={{ duration: 0.15 }}
                style={{
                  width: 2.5,
                  borderRadius: 1,
                  background: isTyping ? 'var(--accent-primary)' : 'rgba(232,201,125,0.5)',
                }}
              />
            ))}
          </div>

          <span style={{
            fontSize: 11,
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            letterSpacing: '0.06em',
          }}>
            SOUND: {profile.toUpperCase()}
          </span>

          <span style={{ fontSize: 10, color: '#888' }}>
            {expanded ? '✕' : '▲'}
          </span>
        </button>
      </div>
    </div>
  );
}
