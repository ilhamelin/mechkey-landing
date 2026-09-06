'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  AnimatePresence,
} from 'framer-motion';

export interface KeyboardScrollSequenceProps {
  totalFrames?: number;
  folderPath?: string;
  className?: string;
  sectionHeight?: string;
}

interface NarrativeStage {
  id: string;
  phase: string;
  title: string;
  description: string;
  spec: string;
  range: [number, number]; // [startProgress, endProgress]
}

const NARRATIVE_STAGES: NarrativeStage[] = [
  {
    id: 'stage-1',
    phase: 'FASE 01 // CHASIS MECANIZADO',
    title: 'Aluminio 6061-T6 Aeroespacial',
    description: 'Bloque macizo fresado en CNC de 5 ejes con tolerancias de grado aeronáutico de ±0.01mm.',
    spec: 'Masa estructural: 1.25 kg',
    range: [0.03, 0.24],
  },
  {
    id: 'stage-2',
    phase: 'FASE 02 // INGENIERÍA MODULAR',
    title: 'Rieles Magnéticos Quick-Release',
    description: 'Sistema perimetral desacoplable sin tornillos con conexión eléctrica por pines pogo dorados.',
    spec: 'Bloqueo magnético de neodimio N52',
    range: [0.28, 0.49],
  },
  {
    id: 'stage-3',
    phase: 'FASE 03 // ACÚSTICA Y GASKET',
    title: 'Aislamiento Acústico en Sándwich',
    description: 'Placa champagne montada en elastómero Poron con almohadillas IXPE que filtran resonancias metálicas.',
    spec: 'Frecuencia sonora "Thock": 340 Hz',
    range: [0.53, 0.74],
  },
  {
    id: 'stage-4',
    phase: 'FASE 04 // POLVO Y ACABADO PVD',
    title: 'STRATA — Dare Ops Masterpiece',
    description: 'Biselado con diamante a 45° y barra de contrapeso maciza tratada en cámara de vacío PVD.',
    spec: 'Tasa de sondeo: 1,000 Hz nativo',
    range: [0.78, 0.97],
  },
];

export default function KeyboardScrollSequence({
  totalFrames = 300,
  folderPath = '/sequence/frame_',
  className = '',
  sectionHeight = 'h-[400vh]',
}: KeyboardScrollSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef<number>(1);
  const rafIdRef = useRef<number | null>(null);

  const [loadedCount, setLoadedCount] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [missingFramesCount, setMissingFramesCount] = useState<number>(0);

  // Link scroll progress (0.0 to 1.0) of containerRef
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Map progress to exact frame index [1, totalFrames]
  const frameIndexMotion = useTransform(scrollYProgress, [0, 1], [1, totalFrames]);

  // Utility to pad frame numbers with leading zeros (e.g. 1 -> "0001")
  const padIndex = useCallback((index: number): string => {
    return index.toString().padStart(4, '0');
  }, []);

  // Aspect-ratio cover rendering logic on canvas
  const drawFrame = useCallback((frameNumber: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imagesRef.current[frameNumber];

    // Canvas real pixel dimensions
    const cWidth = canvas.width;
    const cHeight = canvas.height;

    try {
      if (img && img.complete && img.naturalWidth > 0) {
        const iWidth = img.naturalWidth;
        const iHeight = img.naturalHeight;

        const imgRatio = iWidth / iHeight;
        const canvasRatio = cWidth / cHeight;

        let renderWidth = cWidth;
        let renderHeight = cHeight;
        let offsetX = 0;
        let offsetY = 0;

        // object-fit: cover algorithm
        if (canvasRatio > imgRatio) {
          renderHeight = cWidth / imgRatio;
          offsetY = (cHeight - renderHeight) / 2;
        } else {
          renderWidth = cHeight * imgRatio;
          offsetX = (cWidth - renderWidth) / 2;
        }

        ctx.clearRect(0, 0, cWidth, cHeight);
        ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);
      } else {
        // Procedural blueprint canvas fallback if frame image is missing or loading
        ctx.fillStyle = '#080808';
        ctx.fillRect(0, 0, cWidth, cHeight);

        // Subtle background grid
        ctx.strokeStyle = 'rgba(232, 201, 125, 0.04)';
        ctx.lineWidth = 1;
        const gridSize = 40;
        for (let x = 0; x < cWidth; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, cHeight);
          ctx.stroke();
        }
        for (let y = 0; y < cHeight; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(cWidth, y);
          ctx.stroke();
        }

        // Technical Reticle
        ctx.strokeStyle = 'rgba(232, 201, 125, 0.25)';
        ctx.lineWidth = 1.5;
        const centerX = cWidth / 2;
        const centerY = cHeight / 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 80, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(centerX - 100, centerY);
        ctx.lineTo(centerX + 100, centerY);
        ctx.moveTo(centerX, centerY - 100);
        ctx.lineTo(centerX, centerY + 100);
        ctx.stroke();

        // Technical Labels
        ctx.fillStyle = '#e8c97d';
        ctx.font = 'bold 14px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`STRATA FRAME [ ${padIndex(frameNumber)} / ${padIndex(totalFrames)} ]`, centerX, centerY - 110);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.font = '12px monospace';
        ctx.fillText('SECUENCIA CINEMÁTICA EN BÚFER // SCROLL SYNC 60 FPS', centerX, centerY + 120);
      }
    } catch (error) {
      console.error('Error drawing frame to canvas:', error);
    }
  }, [padIndex, totalFrames]);

  // Adjust canvas resolution for retina/High-DPI displays on resize
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);

    // Re-render current frame immediately after resize
    drawFrame(currentFrameRef.current);
  }, [drawFrame]);

  // Window resize listener
  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [resizeCanvas]);

  // Preload all frames asynchronously on mount
  useEffect(() => {
    let isCancelled = false;
    let loaded = 0;
    let errors = 0;

    const imageArray: HTMLImageElement[] = [];

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const frameSrc = `${folderPath}${padIndex(i)}.jpg`;
      img.src = frameSrc;

      img.onload = () => {
        if (isCancelled) return;
        loaded++;
        setLoadedCount(loaded);

        // Once first frame is loaded, render it on canvas
        if (i === 1) {
          drawFrame(1);
        }

        if (loaded + errors >= totalFrames) {
          setIsLoaded(true);
        }
      };

      img.onerror = () => {
        if (isCancelled) return;
        errors++;
        setMissingFramesCount(errors);
        setHasError(true);

        if (loaded + errors >= totalFrames) {
          setIsLoaded(true);
        }
      };

      imageArray[i] = img;
    }

    imagesRef.current = imageArray;

    return () => {
      isCancelled = true;
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [totalFrames, folderPath, padIndex, drawFrame]);

  // Decoupled RAF scroll listener for smooth 60 FPS canvas painting
  useMotionValueEvent(frameIndexMotion, 'change', (latest: number) => {
    const targetFrame = Math.min(totalFrames, Math.max(1, Math.round(latest)));

    if (targetFrame !== currentFrameRef.current) {
      currentFrameRef.current = targetFrame;

      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }

      rafIdRef.current = requestAnimationFrame(() => {
        drawFrame(targetFrame);
      });
    }
  });

  const progressPercentage = Math.min(100, Math.round((loadedCount / totalFrames) * 100));

  return (
    <section
      ref={containerRef}
      className={`relative w-full bg-[#080808] ${sectionHeight} ${className}`}
      id="scroll-sequence"
      style={{ isolation: 'isolate' }}
    >
      {/* ── Sticky Fullscreen Canvas Viewport ── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-[#080808]">
        {/* Render Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block"
          style={{ width: '100%', height: '100%' }}
        />

        {/* Ambient Dark Gradient Vignette for cinematic focus */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 85% 75% at 50% 50%, transparent 40%, rgba(8, 8, 8, 0.85) 100%)',
          }}
        />

        {/* Subtle Top & Bottom Fade Out to integrate with neighbor sections */}
        <div
          aria-hidden="true"
          className="absolute top-0 inset-x-0 h-32 pointer-events-none bg-gradient-to-b from-[#080808] to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute bottom-0 inset-x-0 h-32 pointer-events-none bg-gradient-to-t from-[#080808] to-transparent"
        />

        {/* ── Floating Narrative Cards (Apple Scrollytelling Style) ── */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-6 md:p-12 z-20">
          {NARRATIVE_STAGES.map((stage) => (
            <NarrativeOverlayCard
              key={stage.id}
              stage={stage}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>

        {/* ── Real-Time HUD Overlay Indicator (Bottom Right) ── */}
        <div className="absolute bottom-8 right-8 z-20 pointer-events-none hidden sm:flex items-center gap-4 bg-[#0d0e12]/80 backdrop-blur-md border border-[#e8c97d]/20 px-4 py-2 rounded-lg shadow-2xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4ade80] shadow-[0_0_8px_#4ade80]" />
            <span className="font-mono text-[10px] text-[#e8c97d] tracking-wider uppercase font-semibold">
              SCROLL SYNC
            </span>
          </div>
          <span className="text-white/20 font-mono text-xs">|</span>
          <div className="font-mono text-[11px] text-white/80 font-medium">
            FRAME <span className="text-[#e8c97d]">{padIndex(currentFrameRef.current)}</span> / {padIndex(totalFrames)}
          </div>
        </div>

        {/* ── Dev Notice when frames need to be placed in public/sequence ── */}
        {hasError && !isLoaded && (
          <div className="absolute top-24 inset-x-4 max-w-lg mx-auto z-30 bg-[#16171d]/90 backdrop-blur-md border border-[#e8c97d]/30 text-white p-4 rounded-xl shadow-2xl pointer-events-auto">
            <div className="flex items-start gap-3">
              <span className="text-[#e8c97d] text-lg">✦</span>
              <div>
                <h4 className="font-mono text-xs font-bold text-[#e8c97d] tracking-wide uppercase">
                  Aviso de Fotogramas de Secuencia
                </h4>
                <p className="text-xs text-white/70 mt-1 leading-relaxed">
                  Coloca los fotogramas extraídos en <code className="text-[#e8c97d] bg-black/40 px-1.5 py-0.5 rounded">public/sequence/frame_0001.jpg</code> a <code className="text-[#e8c97d] bg-black/40 px-1.5 py-0.5 rounded">frame_{padIndex(totalFrames)}.jpg</code>.
                </p>
                <div className="mt-2 text-[10px] font-mono text-white/50">
                  Fotogramas pendientes: {missingFramesCount} / {totalFrames}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Minimalist Technical Loading Screen (STRATA Gold/Dark) ── */}
        <AnimatePresence>
          {!isLoaded && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
              className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#080808] px-6 text-center"
            >
              {/* Gold Ambient Corona */}
              <div
                aria-hidden="true"
                className="absolute w-72 h-72 rounded-full bg-[#e8c97d]/10 blur-[90px] pointer-events-none"
              />

              {/* Technical Badge */}
              <div className="inline-flex items-center gap-2 bg-[#e8c97d]/10 border border-[#e8c97d]/30 px-3 py-1 rounded-full mb-6">
                <span className="w-2 h-2 rounded-full bg-[#e8c97d] animate-ping" />
                <span className="font-mono text-[10px] text-[#e8c97d] tracking-widest uppercase font-semibold">
                  PRECARGA DE SECUENCIA 60 FPS
                </span>
              </div>

              {/* Percentage Counter */}
              <div className="font-display font-bold text-5xl md:text-6xl text-white tracking-tight mb-4">
                {progressPercentage}
                <span className="text-2xl text-[#e8c97d] ml-1">%</span>
              </div>

              {/* High-Tech Progress Bar */}
              <div className="w-full max-w-xs h-1.5 bg-white/10 rounded-full overflow-hidden mb-4 p-[1px]">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#c8a45a] to-[#e8c97d] rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                  transition={{ ease: 'easeOut', duration: 0.2 }}
                />
              </div>

              {/* Micro specs */}
              <div className="font-mono text-[11px] text-white/50 flex items-center gap-3">
                <span>BUFFER: {loadedCount} / {totalFrames} FRAMES</span>
                <span>•</span>
                <span>DECODIFICACIÓN GPU</span>
              </div>

              <p className="text-xs text-white/40 mt-4 max-w-sm">
                Sincronizando fotogramas cinematográficos al desplazamiento del scroll vertical.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// ── Internal Component: Narrative Overlay Card (Synchronized to Scroll Progress) ──
interface NarrativeOverlayCardProps {
  stage: NarrativeStage;
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
}

function NarrativeOverlayCard({ stage, scrollYProgress }: NarrativeOverlayCardProps) {
  const [start, end] = stage.range;
  const mid = (start + end) / 2;
  const fadeInWindow = (end - start) * 0.22;

  // Opacity: fade in -> hold -> fade out
  const opacity = useTransform(
    scrollYProgress,
    [start, start + fadeInWindow, end - fadeInWindow, end],
    [0, 1, 1, 0]
  );

  // Subtle vertical movement
  const y = useTransform(
    scrollYProgress,
    [start, mid, end],
    [32, 0, -32]
  );

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute max-w-lg w-full px-6 py-6 rounded-2xl bg-[#0c0d12]/85 backdrop-blur-xl border border-[#e8c97d]/25 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(232,201,125,0.08)] pointer-events-auto"
    >
      {/* Phase Tag */}
      <div className="flex items-center gap-2 mb-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#e8c97d]" />
        <span className="font-mono text-[10px] text-[#e8c97d] tracking-widest uppercase font-semibold">
          {stage.phase}
        </span>
      </div>

      {/* Headline */}
      <h3 className="font-display font-bold text-2xl md:text-3xl text-white tracking-tight leading-snug mb-2">
        {stage.title}
      </h3>

      {/* Description */}
      <p className="text-xs md:text-sm text-white/70 leading-relaxed font-light mb-4">
        {stage.description}
      </p>

      {/* Spec Badge */}
      <div className="pt-3 border-t border-white/10 flex items-center gap-2 text-[10px] font-mono text-[#e8c97d]/90">
        <span className="w-1 h-1 rounded-full bg-[#4ade80]" />
        <span>ESPECIFICACIÓN: {stage.spec}</span>
      </div>
    </motion.div>
  );
}
