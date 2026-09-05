'use client';
import { useRef, useEffect, useState } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';

const QUOTE = { text: 'Un teclado es la interfaz más íntima entre un ser humano y su pensamiento.', author: 'Diseño STRATA, 2026' };

const PILLARS = [
  { code: '01', title: 'Sonido', subtitle: 'Acoustic Engineering', icon: '◈', body: 'Cada capa de PORON, foam interno y ángulo de la placa fue diseñado para producir un "thock" profundo, uniforme y sin resonancias metálicas.' },
  { code: '02', title: 'Tacto', subtitle: 'Haptic Precision', icon: '◉', body: 'Los switches V2 Linear custom tienen recorrido de 4mm con resortes dorados de 67g de actuación. Cada pulsación, idéntica.' },
  { code: '03', title: 'Forma', subtitle: 'Industrial Design', icon: '◇', body: 'El ángulo de 7° no es arbitrario. Es el resultado de 18 meses de ergonomía y ensayos con mecanógrafos profesionales.' },
];

const STATS = [
  { value: 18, unit: 'meses', label: 'de desarrollo' },
  { value: 500, unit: 'unidades', label: 'edición limitada' },
  { value: 5, unit: 'ejes CNC', label: 'mecanizado de precisión' },
  { value: 7, unit: '°', label: 'ángulo ergonómico' },
];

const MARQUEE_ITEMS = Array.from({ length: 8 });

function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const duration = 1400;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, value]);
  return <span ref={ref}>{display}</span>;
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.18, duration: 0.8, ease: [0.22, 1, 0.36, 1] as unknown as [number, number, number, number] },
  }),
};

export default function StorySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section ref={sectionRef} id="story" style={{ background: '#080808', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        .story-inner { padding: 120px 0 80px; }
        .story-divider { height:1px; background:linear-gradient(90deg,transparent 5%,rgba(232,201,125,0.12) 50%,transparent 95%); }
        .story-headline { font-size:clamp(52px,8vw,130px); font-family:var(--font-display); font-weight:700; letter-spacing:-0.05em; line-height:0.9; color:#f0f0f0; }
        .story-pillars { display:grid; grid-template-columns:repeat(3,1fr); gap:2px; margin-top:64px; }
        .story-pillar { padding:40px 32px; border:1px solid rgba(255,255,255,0.05); position:relative; overflow:hidden; transition:border-color .3s,background .3s; }
        .story-pillar::before { content:''; position:absolute; inset:0; background:radial-gradient(ellipse 80% 80% at 50% 0%,rgba(232,201,125,0.04) 0%,transparent 70%); opacity:0; transition:opacity .4s; }
        .story-pillar:hover { border-color:rgba(232,201,125,0.15); background:rgba(232,201,125,0.02); }
        .story-pillar:hover::before { opacity:1; }
        .story-stats-row { display:flex; gap:0; margin-top:2px; }
        .story-stat { flex:1; padding:40px 32px; border:1px solid rgba(255,255,255,0.05); text-align:center; }
        .story-quote-block { margin:64px 0; padding:40px 56px; border-left:2px solid rgba(232,201,125,0.3); position:relative; }
        .story-marquee-row { overflow:hidden; border-top:1px solid rgba(255,255,255,0.05); border-bottom:1px solid rgba(255,255,255,0.05); padding:16px 0; white-space:nowrap; }
        .story-marquee-inner { display:inline-flex; gap:48px; animation:storyMarquee 28s linear infinite; }
        .story-marquee-item { font-size:10px; font-family:monospace; color:#2a2a2a; letter-spacing:.14em; text-transform:uppercase; flex-shrink:0; }
        @keyframes storyMarquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .story-intro-grid { display:grid; grid-template-columns:1fr 1fr; gap:40px 80px; border-top:1px solid rgba(255,255,255,0.05); padding-top:28px; }
        @media(max-width:900px){
          .story-pillars{grid-template-columns:1fr;margin-top:32px;}
          .story-stats-row{flex-direction:column;}
          .story-quote-block{padding:28px 20px;}
          .story-inner{padding:72px 0 48px;}
          .story-intro-grid{grid-template-columns:1fr;}
        }
        @media(max-width:640px){
          .story-pillar{padding:24px 18px;}
          .story-stat{padding:28px 16px;}
        }
      `}</style>

      <div className="story-divider" />

      <div className="story-marquee-row">
        <div className="story-marquee-inner">
          {MARQUEE_ITEMS.map((_, i) => (
            <span key={i} className="story-marquee-item">
              STRATA ◆ ALUMINIO 6061-T6 ◆ CNC 5-EJES ◆ 1000HZ POLLING ◆ QMK // VIA ◆ EDICIÓN LIMITADA 500 UND ◆&nbsp;
            </span>
          ))}
        </div>
      </div>

      <div className="story-inner">
        <div className="container">

          <div style={{ overflow: 'hidden', marginBottom: 8 }}>
            <motion.div initial={{ y: '110%' }} animate={isInView ? { y: 0 } : { y: '110%' }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
              <div className="story-headline">DISEÑADO</div>
            </motion.div>
          </div>
          <div style={{ overflow: 'hidden', marginBottom: 40 }}>
            <motion.div initial={{ y: '110%' }} animate={isInView ? { y: 0 } : { y: '110%' }} transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}>
              <div className="story-headline" style={{ display: 'flex', alignItems: 'baseline', gap: '0.18em', flexWrap: 'wrap' }}>
                <span style={{ WebkitTextStroke: '1px rgba(232,201,125,0.45)', color: 'transparent' }}>SIN</span>
                <span className="gradient-text">LÍMITES</span>
              </div>
            </motion.div>
          </div>

          <motion.div className="story-intro-grid" initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }} transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            <p style={{ fontSize: 14, color: '#666', lineHeight: 1.75 }}>
              STRATA no es una respuesta al mercado. Es una declaración. Un objeto creado para personas que creen que las herramientas cotidianas merecen ser extraordinarias.
            </p>
            <p style={{ fontSize: 14, color: '#444', lineHeight: 1.75 }}>
              Cada decisión de diseño fue deliberada. No hay componentes suficientemente buenos. Solo componentes correctos.
            </p>
          </motion.div>

          <motion.div custom={0} variants={itemVariants} initial="hidden" animate={isInView ? 'visible' : 'hidden'} className="story-quote-block">
            <div style={{ position: 'absolute', top: 16, left: 20, fontSize: 72, lineHeight: 1, color: 'rgba(232,201,125,0.07)', fontFamily: 'var(--font-display)', fontWeight: 700, pointerEvents: 'none', userSelect: 'none' }}>❝</div>
            <blockquote style={{ fontSize: 'clamp(17px,2.2vw,26px)', fontFamily: 'var(--font-display)', fontWeight: 500, color: '#d0d0d0', lineHeight: 1.45, letterSpacing: '-0.02em', fontStyle: 'italic', maxWidth: 680 }}>
              {QUOTE.text}
            </blockquote>
            <div style={{ marginTop: 16, fontSize: 10, color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase' }}>— {QUOTE.author}</div>
          </motion.div>

          <div className="story-stats-row">
            {STATS.map((stat, i) => (
              <motion.div key={stat.label} className="story-stat" custom={i} variants={itemVariants} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
                <div style={{ fontSize: 'clamp(32px,4vw,52px)', fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '-0.04em', color: '#e8c97d', lineHeight: 1, marginBottom: 4 }}>
                  <AnimatedNumber value={stat.value} /><span style={{ fontSize: '0.38em', color: 'rgba(232,201,125,0.6)', marginLeft: 3 }}>{stat.unit}</span>
                </div>
                <div style={{ fontSize: 11, color: '#444', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{stat.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="story-pillars">
            {PILLARS.map((pillar, i) => (
              <motion.div key={pillar.code} className="story-pillar" custom={i} variants={itemVariants} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                  <span style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(232,201,125,0.6)', letterSpacing: '0.14em' }}>[ {pillar.code} ]</span>
                  <span style={{ fontSize: 20, color: 'rgba(232,201,125,0.22)' }}>{pillar.icon}</span>
                </div>
                <div style={{ fontSize: 10, color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>{pillar.subtitle}</div>
                <div style={{ fontSize: 'clamp(26px,3vw,38px)', fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '-0.04em', color: '#f0f0f0', marginBottom: 14, lineHeight: 1.05 }}>{pillar.title}</div>
                <p style={{ fontSize: 13, color: '#666', lineHeight: 1.7 }}>{pillar.body}</p>
                <div style={{ marginTop: 24, height: 1, background: 'linear-gradient(90deg,rgba(232,201,125,0.2),transparent)' }} />
              </motion.div>
            ))}
          </div>

        </div>
      </div>

      <div className="story-divider" />
    </section>
  );
}
