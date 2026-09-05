'use client';
import { useState, useEffect, useRef } from 'react';

interface TickerItem {
  id: string;
  label: string;
  value: string;
  delta: string;
  positive: boolean;
  unit?: string;
}

const BASE_DATA: TickerItem[] = [
  { id: 'al-price',   label: 'ALUMINIO 6061-T6',  value: '4.23',  delta: '+0.07',  positive: true,  unit: '$/kg' },
  { id: 'cu-price',   label: 'LATON PVDM',        value: '8.91',  delta: '+0.12',  positive: true,  unit: '$/kg' },
  { id: 'switches',   label: 'SWITCHES INST.',    value: '14',    delta: '+3',     positive: true,  unit: 'esta hora' },
  { id: 'latency',    label: 'LATENCIA USB',      value: '0.98',  delta: '-0.02',  positive: true,  unit: 'ms' },
  { id: 'units',      label: 'UNIDADES REST.',    value: '487',   delta: '-13',    positive: false, unit: 'de 500' },
  { id: 'polling',    label: 'POLLING RATE',      value: '1000',  delta: '±0',     positive: true,  unit: 'Hz' },
  { id: 'pcb-temp',   label: 'TEMP. PCB',        value: '24.1',  delta: '-0.2°C', positive: true,  unit: '°C' },
  { id: 'qmk-commit', label: 'QMK BUILD',        value: '#8f2c1', delta: '3m ago', positive: true,  unit: '' },
];

function jitter(val: string, range: number): string {
  const n = parseFloat(val);
  if (isNaN(n)) return val;
  return (n + (Math.random() - 0.5) * range).toFixed(val.includes('.') ? 2 : 0);
}

export default function LiveTicker() {
  const [items, setItems] = useState<TickerItem[]>(BASE_DATA);
  const [time, setTime] = useState('');
  const [visible, setVisible] = useState(true);
  const rafRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Update clock
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toUTCString().split(' ')[4] + ' UTC');
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, []);

  // Simulate live data updates
  useEffect(() => {
    const iv = setInterval(() => {
      setItems(prev => prev.map(item => {
        if (['latency', 'pcb-temp', 'al-price', 'cu-price'].includes(item.id)) {
          const range = item.id === 'latency' ? 0.04 : item.id === 'pcb-temp' ? 0.4 : 0.15;
          const newVal = jitter(item.value, range);
          const diff = parseFloat(newVal) - parseFloat(item.value);
          const pos = diff >= 0;
          return { ...item, value: newVal, delta: (pos ? '+' : '') + diff.toFixed(2), positive: pos };
        }
        return item;
      }));
    }, 2800);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    return () => { if (rafRef.current) clearTimeout(rafRef.current); };
  }, []);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 800,
      height: 32,
      background: 'rgba(6,6,6,0.95)',
      borderTop: '1px solid rgba(232,201,125,0.08)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      display: 'flex',
      alignItems: 'stretch',
      overflow: 'hidden',
    }}>
      <style>{`
        .ticker-source {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 16px;
          border-right: 1px solid rgba(255,255,255,0.04);
          flex-shrink: 0;
          white-space: nowrap;
        }
        .ticker-pulse {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #e8c97d;
          animation: tickerPulse 1.6s ease-in-out infinite;
          flex-shrink: 0;
        }
        @keyframes tickerPulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 4px rgba(232,201,125,0.6); }
          50% { opacity: 0.4; box-shadow: none; }
        }
        .ticker-scroll-outer {
          flex: 1;
          overflow: hidden;
          position: relative;
        }
        .ticker-scroll-inner {
          display: flex;
          align-items: center;
          height: 100%;
          gap: 0;
          animation: tickerScroll 38s linear infinite;
          width: max-content;
        }
        .ticker-scroll-inner:hover {
          animation-play-state: paused;
        }
        @keyframes tickerScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .ticker-item {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 0 20px;
          border-right: 1px solid rgba(255,255,255,0.04);
          height: 100%;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .ticker-close {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 12px;
          border-left: 1px solid rgba(255,255,255,0.04);
          flex-shrink: 0;
          cursor: pointer;
          background: none;
          border-top: none;
          border-bottom: none;
          border-right: none;
          color: #333;
          font-size: 12px;
          transition: color 0.2s;
          height: 100%;
        }
        .ticker-close:hover { color: #888; }
        .ticker-time {
          display: flex;
          align-items: center;
          padding: 0 14px;
          border-right: 1px solid rgba(255,255,255,0.04);
          flex-shrink: 0;
        }
        @media (max-width: 640px) {
          .ticker-source { padding: 0 10px; }
          .ticker-item { padding: 0 14px; }
        }
      `}</style>

      {/* Source label */}
      <div className="ticker-source">
        <div className="ticker-pulse" />
        <span style={{ fontSize: 9, fontFamily: 'monospace', color: '#e8c97d', letterSpacing: '0.14em', fontWeight: 600 }}>
          STRATA LIVE
        </span>
      </div>

      {/* Time */}
      <div className="ticker-time">
        <span style={{ fontSize: 9, fontFamily: 'monospace', color: '#333', letterSpacing: '0.08em' }}>
          {time}
        </span>
      </div>

      {/* Scrolling data */}
      <div className="ticker-scroll-outer">
        <div className="ticker-scroll-inner">
          {/* Duplicate for seamless loop */}
          {[...items, ...items].map((item, idx) => (
            <div key={`${item.id}-${idx}`} className="ticker-item">
              <span style={{ fontSize: 9, fontFamily: 'monospace', color: '#444', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                {item.label}
              </span>
              <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#d0d0d0', fontWeight: 600, letterSpacing: '0.04em' }}>
                {item.value}
                {item.unit && <span style={{ fontSize: 8, color: '#555', marginLeft: 2 }}>{item.unit}</span>}
              </span>
              <span style={{ fontSize: 9, fontFamily: 'monospace', color: item.positive ? '#5de87d' : '#e87d5d', letterSpacing: '0.04em' }}>
                {item.delta}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Close */}
      <button className="ticker-close" onClick={() => setVisible(false)} title="Cerrar ticker" aria-label="Cerrar ticker">
        ✕
      </button>
    </div>
  );
}
