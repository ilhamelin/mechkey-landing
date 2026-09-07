'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, type Variants } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

// Register ScrollTrigger plugin safely in browser
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface HeroSectionProps {
  totalFrames?: number;
  folderPath?: string;
  scrollDistance?: number;
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as unknown as [number, number, number, number],
    },
  }),
};

export default function HeroSection({
  totalFrames = 300,
  folderPath = '/sequence/frame_',
  scrollDistance = 2500,
}: HeroSectionProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Animation & Frame tracking states
  const [loadProgress, setLoadProgress] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [activeFrameIndex, setActiveFrameIndex] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  // High-performance cache & refs
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const currentFrameRef = useRef<number>(0);
  const animationFrameIdRef = useRef<number | null>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const frameObjRef = useRef<{ frame: number }>({ frame: 0 });
  const canvasSizeRef = useRef<{ width: number; height: number; dpr: number }>({
    width: 0,
    height: 0,
    dpr: 1,
  });

  // Zero-padded 4-digit frame formatting with automatic basePath resolution (GitHub Pages support)
  const getFrameUrl = useCallback(
    (index: number): string => {
      const padded = String(index + 1).padStart(4, '0');

      // If folderPath is an absolute URL (http:// or https://), return directly
      if (folderPath.startsWith('http://') || folderPath.startsWith('https://')) {
        return `${folderPath}${padded}.jpg`;
      }

      // Automatically resolve Next.js basePath in production (GitHub Pages)
      let bp = '';
      if (typeof window !== 'undefined') {
        const winNextData = (window as unknown as { __NEXT_DATA__?: { basePath?: string } }).__NEXT_DATA__;
        if (winNextData?.basePath) {
          bp = winNextData.basePath;
        } else if (process.env.NEXT_PUBLIC_BASE_PATH) {
          bp = process.env.NEXT_PUBLIC_BASE_PATH;
        }
      } else if (process.env.NEXT_PUBLIC_BASE_PATH) {
        bp = process.env.NEXT_PUBLIC_BASE_PATH;
      }

      const cleanBp = bp.replace(/\/+$/, '');
      const cleanFolder = folderPath.startsWith('/') ? folderPath : `/${folderPath}`;

      return `${cleanBp}${cleanFolder}${padded}.jpg`;
    },
    [folderPath]
  );

  // High-performance 2D Canvas render routine
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const { width, height, dpr } = canvasSizeRef.current;
      if (width === 0 || height === 0) return;

      // Locate target frame or nearest loaded frame
      let img = imagesRef.current[frameIndex];
      if (!img || !img.complete || img.naturalWidth === 0) {
        for (let i = frameIndex - 1; i >= 0; i--) {
          if (imagesRef.current[i]?.complete && imagesRef.current[i]?.naturalWidth !== 0) {
            img = imagesRef.current[i];
            break;
          }
        }
        if (!img || !img.complete) {
          img = imagesRef.current[0];
        }
      }

      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      if (img && img.complete && img.naturalWidth > 0) {
        const naturalW = img.naturalWidth;
        const naturalH = img.naturalHeight;
        const imgRatio = naturalW / naturalH;

        let renderW: number;
        let renderH: number;
        let offsetX = 0;
        let offsetY = 0;

        // Full-bleed cover background spanning 100% of the hero section
        const canvasRatio = width / height;
        if (canvasRatio > imgRatio) {
          renderW = width;
          renderH = width / imgRatio;
          offsetY = (height - renderH) / 2;
          offsetX = 0;
        } else {
          renderH = height;
          renderW = height * imgRatio;
          offsetX = (width - renderW) / 2;
          offsetY = 0;
        }

        ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
      } else {
        // High-tech placeholder blueprint
        ctx.fillStyle = '#080808';
        ctx.fillRect(0, 0, width, height);

        ctx.strokeStyle = 'rgba(232, 201, 125, 0.15)';
        ctx.lineWidth = 1;
        ctx.strokeRect(width * 0.45, height * 0.25, width * 0.48, height * 0.5);

        ctx.fillStyle = '#e8c97d';
        ctx.font = '10px monospace';
        ctx.fillText('STRATA // INITIALIZING FRAMES...', width * 0.48, height * 0.5);
      }

      ctx.restore();
    } catch (err) {
      console.warn('Canvas render exception:', err);
    }
  }, []);

  // Request render via RAF
  const requestDraw = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(totalFrames - 1, index));
      currentFrameRef.current = clamped;
      setActiveFrameIndex(clamped);

      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }

      animationFrameIdRef.current = requestAnimationFrame(() => {
        drawFrame(clamped);
        animationFrameIdRef.current = null;
      });
    },
    [drawFrame, totalFrames]
  );

  // Recalculate canvas buffer dimensions on resize (never during scroll!)
  const updateCanvasDimensions = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (width === 0 || height === 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvasSizeRef.current = { width, height, dpr };

    const targetW = Math.round(width * dpr);
    const targetH = Math.round(height * dpr);

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    requestDraw(currentFrameRef.current);
  }, [requestDraw]);

  // 1. High-Performance Progressive Batch Image Loader with Concurrency Limit & .decode()
  useEffect(() => {
    let isCancelled = false;
    imagesRef.current = new Array(totalFrames).fill(null);
    let loadedCount = 0;

    const onImageReady = (img: HTMLImageElement, idx: number) => {
      if (isCancelled) return;
      imagesRef.current[idx] = img;
      loadedCount += 1;
      const pct = Math.round((loadedCount / totalFrames) * 100);
      setLoadProgress(pct);

      if (idx === 0) {
        requestDraw(0);
      }
      if (loadedCount >= totalFrames) {
        setIsLoaded(true);
      }
    };

    // Priority 1: Load frame 0 immediately
    const firstImg = new Image();
    firstImg.src = getFrameUrl(0);

    const startQueue = () => {
      // Concurrency worker pool (5 parallel workers to avoid connection choking & GC spikes)
      const CONCURRENCY = 5;
      let nextIndex = 1;

      const loadNextWorker = () => {
        if (isCancelled || nextIndex >= totalFrames) return;
        const currentIdx = nextIndex++;

        const img = new Image();
        img.src = getFrameUrl(currentIdx);

        const handleSuccess = () => {
          if ('decode' in img) {
            img.decode().then(() => {
              onImageReady(img, currentIdx);
              loadNextWorker();
            }).catch(() => {
              onImageReady(img, currentIdx);
              loadNextWorker();
            });
          } else {
            onImageReady(img, currentIdx);
            loadNextWorker();
          }
        };

        img.onload = handleSuccess;
        img.onerror = () => {
          onImageReady(img, currentIdx);
          loadNextWorker();
        };
      };

      for (let w = 0; w < CONCURRENCY; w++) {
        loadNextWorker();
      }
    };

    firstImg.onload = () => {
      onImageReady(firstImg, 0);
      startQueue();
    };
    firstImg.onerror = () => {
      onImageReady(firstImg, 0);
      startQueue();
    };

    return () => {
      isCancelled = true;
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [totalFrames, getFrameUrl, requestDraw]);

  // 2. GSAP ScrollTrigger Setup & Reset Event Listener
  useEffect(() => {
    if (!heroRef.current || !canvasRef.current) return;

    const heroEl = heroRef.current;
    updateCanvasDimensions();

    const frameObj = frameObjRef.current;
    frameObj.frame = 0;

    const ctx = gsap.context(() => {
      const tween = gsap.to(frameObj, {
        frame: totalFrames - 1,
        ease: 'none',
        scrollTrigger: {
          trigger: heroEl,
          start: 'top top',
          end: `+=${scrollDistance}`,
          pin: true,
          scrub: 0.5,
          anticipatePin: 0, // Prevents rubber-band / negative scroll offset glitches
          onUpdate: (self) => {
            const rawProgress = self.progress;
            const clampedProgress = Math.max(0, Math.min(1, rawProgress));
            setScrollProgress(clampedProgress);

            // If user scrolled back to top, force point 0 immediately
            if (rawProgress <= 0.002 || (typeof window !== 'undefined' && window.scrollY <= 10)) {
              frameObj.frame = 0;
              setScrollProgress(0);
              requestDraw(0);
              return;
            }

            const targetFrame = Math.max(0, Math.min(totalFrames - 1, Math.round(frameObj.frame)));
            requestDraw(targetFrame);
          },
        },
      });

      tweenRef.current = tween;
      scrollTriggerRef.current = tween.scrollTrigger ?? null;
    }, heroEl);

    // Window resize handler
    const handleResize = () => {
      updateCanvasDimensions();
      ScrollTrigger.refresh();
    };

    // Global reset handler: triggers when user clicks Logo or "Inicio" in Navbar
    const handleResetHero = () => {
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      frameObj.frame = 0;
      if (tweenRef.current) {
        tweenRef.current.progress(0);
      }
      setScrollProgress(0);
      requestDraw(0);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('strata:reset-hero', handleResetHero);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('strata:reset-hero', handleResetHero);
      ctx.revert();
      tweenRef.current = null;
      scrollTriggerRef.current = null;
    };
  }, [totalFrames, scrollDistance, requestDraw, updateCanvasDimensions]);

  // Telemetry phase info
  const getPhaseInfo = (progress: number) => {
    if (progress < 0.25) {
      return {
        step: '01 / 04',
        phase: 'CHASIS UNIFICADO',
        detail: 'Mecanizado CNC monobloque de aluminio 6061-T6.',
      };
    }
    if (progress < 0.55) {
      return {
        step: '02 / 04',
        phase: 'DESACOPLE TOP-FRAME',
        detail: 'Liberación de marco superior sin tornillos visibles.',
      };
    }
    if (progress < 0.8) {
      return {
        step: '03 / 04',
        phase: 'PLACA & GASKET MOUNT',
        detail: 'Suspensión acústica desacoplada con latón pulido.',
      };
    }
    return {
      step: '04 / 04',
      phase: 'PCB HOT-SWAP & BASE',
      detail: 'Aislamiento de silicona pura de 3 capas y fondo CNC.',
    };
  };

  const currentPhase = getPhaseInfo(scrollProgress);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="hero-section"
      suppressHydrationWarning
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        minHeight: '700px',
        backgroundColor: '#080808',
        overflow: 'hidden',
      }}
    >
      {/* ── Background Canvas ── */}
      <canvas
        ref={canvasRef}
        className="hero-sequence-canvas"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          display: 'block',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* ── Soft Vignette Overlay for Text Legibility (No hard cutoffs) ── */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(90deg, 
            rgba(8, 8, 8, 0.88) 0%, 
            rgba(8, 8, 8, 0.55) 24%, 
            rgba(8, 8, 8, 0.18) 42%, 
            transparent 65%)`,
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      {/* Top & Bottom Seamless Transitions */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(180deg, 
            rgba(8, 8, 8, 0.6) 0%, 
            transparent 15%, 
            transparent 82%, 
            #080808 100%)`,
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      {/* Subtle Gold Ambient Radial Glow */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(232, 201, 125, 0.08) 0%, transparent 70%)',
          top: '50%',
          right: '15%',
          transform: 'translateY(-50%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      {/* ── Foreground Layout Grid ── */}
      <div
        className="hero-grid"
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'grid',
          gridTemplateColumns: '460px 1fr',
          height: '100%',
          alignItems: 'center',
          pointerEvents: 'auto',
        }}
      >
        {/* ── Left Column: Typography & Controls ── */}
        <div
          className="hero-text"
          style={{
            padding: '0 0 0 72px',
          }}
        >
          {/* Badges */}
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
            <span
              style={{
                fontSize: 10,
                fontFamily: 'monospace',
                color: '#888',
                letterSpacing: '0.08em',
              }}
            >
              [ ARCH // 75% TKL ] • [ 1000HZ ]
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            style={{
              fontSize: 'clamp(54px, 6vw, 90px)',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              letterSpacing: '-0.05em',
              lineHeight: 0.95,
              color: '#f4f4f5',
              marginBottom: 18,
              textShadow: '0 4px 30px rgba(0,0,0,0.9)',
            }}
          >
            STRATA
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            style={{
              fontSize: 16,
              color: '#a1a1aa',
              letterSpacing: '0.04em',
              marginBottom: 10,
              fontWeight: 400,
              lineHeight: 1.6,
            }}
          >
            Teclado Mecánico Modular
          </motion.p>

          {/* Description */}
          <motion.p
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            style={{
              fontSize: 13.5,
              color: '#71717a',
              marginBottom: 40,
              maxWidth: 340,
              lineHeight: 1.7,
            }}
          >
            Aluminio 6061-T6 mecanizado CNC. Rieles perimetrales magnéticos de cambio rápido.
            Firmware QMK/VIA. Diseñado sin compromisos.
          </motion.p>

          {/* CTAs */}
          <motion.div
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="hero-actions"
            style={{
              display: 'flex',
              gap: 12,
              alignItems: 'center',
            }}
          >
            <a href="#cta" className="btn-primary" id="cta-explore">
              Reservar Ahora
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M6.5 1L12 6.5L6.5 12M1 6.5H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </a>
            <a href="#story" className="btn-ghost" id="cta-design">
              Ver Diseño
            </a>
          </motion.div>

          {/* Telemetry Metrics Row */}
          <motion.div
            custom={5}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="hero-metrics"
            style={{
              display: 'flex',
              gap: 32,
              marginTop: 48,
              flexWrap: 'wrap',
            }}
          >
            {[
              { code: 'M-01', value: '1.2kg', label: 'Peso sólido' },
              { code: 'M-02', value: '100M', label: 'Pulsaciones' },
              { code: 'M-03', value: '1000Hz', label: 'Polling rate' },
            ].map((m) => (
              <div key={m.label} style={{ position: 'relative' }}>
                <div style={{ fontSize: 9, fontFamily: 'monospace', color: '#777', letterSpacing: '0.08em', marginBottom: 2 }}>
                  {m.code}
                </div>
                <div
                  style={{
                    fontSize: 22,
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    color: '#e8c97d',
                    letterSpacing: '-0.03em',
                    textShadow: '0 0 14px rgba(232, 201, 125, 0.3)',
                  }}
                >
                  {m.value}
                </div>
                <div style={{ fontSize: 11, color: '#666', marginTop: 2, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  {m.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Right Column: Interactive Explosion Phase HUD Card ── */}
        <div
          className="hero-hud-column"
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            padding: '80px 48px 48px 0',
            pointerEvents: 'none',
          }}
        >
          {/* Top Right: Frame Sequence Status & Scrub Tracker */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{
              background: 'rgba(11, 12, 16, 0.78)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(232, 201, 125, 0.22)',
              borderRadius: '8px',
              padding: '12px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              maxWidth: '260px',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.7)',
              pointerEvents: 'auto',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#e8c97d', boxShadow: '0 0 8px #e8c97d' }} />
                <span style={{ fontSize: 9, fontFamily: 'monospace', color: '#e8c97d', fontWeight: 700, letterSpacing: '0.1em' }}>
                  EXPLODED SEQUENCE
                </span>
              </div>
              <span style={{ fontSize: 9, fontFamily: 'monospace', color: '#aaa' }}>
                {String(activeFrameIndex + 1).padStart(3, '0')} / {totalFrames}
              </span>
            </div>

            <div style={{ fontSize: 12, fontWeight: 600, color: '#f5f5f7', letterSpacing: '0.02em', marginTop: '2px' }}>
              {currentPhase.phase}
            </div>

            <div style={{ fontSize: 10, color: '#a1a1aa', lineHeight: 1.4 }}>
              {currentPhase.detail}
            </div>

            {/* Micro Scrub Timeline Bar */}
            <div style={{ width: '100%', height: 3, background: 'rgba(255, 255, 255, 0.1)', borderRadius: 2, marginTop: 4, overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${scrollProgress * 100}%`,
                  background: 'linear-gradient(90deg, #e8c97d, #f5d78e)',
                  boxShadow: '0 0 8px rgba(232, 201, 125, 0.6)',
                  transition: 'width 0.04s linear',
                }}
              />
            </div>
          </motion.div>

          {/* Bottom Right: Buffering Badge */}
          {!isLoaded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                background: 'rgba(8, 8, 10, 0.88)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '6px',
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontFamily: 'monospace',
                fontSize: '9.5px',
                color: '#bbb',
                letterSpacing: '0.06em',
                pointerEvents: 'auto',
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  border: '1.5px solid rgba(232, 201, 125, 0.25)',
                  borderTopColor: '#e8c97d',
                  animation: 'heroSpin 0.8s linear infinite',
                }}
              />
              <span>BUFFERING ASSETS: [{loadProgress}%]</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* ── Scroll Hint — Bottom Center ── */}
      <motion.div
        className="hero-scroll-hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        style={{
          position: 'absolute',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        <span
          style={{
            fontSize: 9,
            color: '#777',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            fontFamily: 'monospace',
          }}
        >
          {scrollProgress >= 0.98 ? 'CONTINUAR' : 'SCROLL PARA DESACOPLAR'}
        </span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          style={{
            width: 1,
            height: 24,
            background: 'linear-gradient(180deg, #e8c97d80, transparent)',
          }}
        />
      </motion.div>

      {/* Responsive Styles */}
      <style>{`
        @keyframes heroSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 1120px) {
          .hero-grid {
            grid-template-columns: 380px 1fr !important;
          }
          .hero-text {
            padding: 0 0 0 36px !important;
          }
        }

        @media (max-width: 900px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            padding-top: 60px;
          }
          .hero-text {
            padding: 0 24px !important;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .hero-actions {
            justify-content: center !important;
          }
          .hero-metrics {
            justify-content: center !important;
            gap: 20px !important;
            margin-top: 32px !important;
          }
          .hero-hud-column {
            display: none !important;
          }
          .hero-scroll-hint {
            bottom: 12px !important;
          }
        }
      `}</style>
    </section>
  );
}
