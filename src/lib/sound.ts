'use client';

// Web Audio API realistic mechanical keyboard switch sound synthesizer
// Generates authentic "thock", "clack", and "creamy" profiles with zero latency and no external assets.

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export type SwitchProfile = 'thock' | 'clack' | 'creamy';

export function playSwitchSound(profile: SwitchProfile = 'thock', volume = 0.6) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Slight random pitch variation (±4%) for authentic human typing sound
    const pitchJitter = 0.96 + Math.random() * 0.08;

    // 1. Noise burst (tactile transient click)
    const bufferSize = Math.floor(ctx.sampleRate * 0.015);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const noiseFilter = ctx.createBiquadFilter();
    if (profile === 'thock') {
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(1400 * pitchJitter, now);
      noiseFilter.Q.setValueAtTime(3.0, now);
    } else if (profile === 'clack') {
      noiseFilter.type = 'highpass';
      noiseFilter.frequency.setValueAtTime(2600 * pitchJitter, now);
      noiseFilter.Q.setValueAtTime(2.0, now);
    } else {
      // creamy
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.setValueAtTime(900 * pitchJitter, now);
      noiseFilter.Q.setValueAtTime(1.5, now);
    }

    const noiseGain = ctx.createGain();
    const clickVol = (profile === 'clack' ? 0.35 : profile === 'thock' ? 0.22 : 0.16) * volume;
    noiseGain.gain.setValueAtTime(clickVol, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noiseSource.start(now);

    // 2. Body resonance ("thump / bottom-out")
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();

    if (profile === 'thock') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(280 * pitchJitter, now);
      osc.frequency.exponentialRampToValueAtTime(95 * pitchJitter, now + 0.045);
      oscGain.gain.setValueAtTime(0.75 * volume, now);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
    } else if (profile === 'clack') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(460 * pitchJitter, now);
      osc.frequency.exponentialRampToValueAtTime(160 * pitchJitter, now + 0.035);
      oscGain.gain.setValueAtTime(0.55 * volume, now);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);
    } else {
      // creamy (deeper, soft dampened bottom-out)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220 * pitchJitter, now);
      osc.frequency.exponentialRampToValueAtTime(75 * pitchJitter, now + 0.055);
      oscGain.gain.setValueAtTime(0.65 * volume, now);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);
    }

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);

  } catch {
    // Ignore audio context errors silently
  }
}
