'use client';
import * as THREE from 'three';

/**
 * Procedural Texture Generator for High-End PBR 3D Custom Keyboards
 * Generates GPU-ready CanvasTextures without needing external image downloads.
 */

let cachedPBT: THREE.CanvasTexture | null = null;
let cachedBrushed: THREE.CanvasTexture | null = null;
let cachedCarbon: THREE.CanvasTexture | null = null;
let cachedChassisSerigraphy: THREE.CanvasTexture | null = null;

/**
 * PBT Sandblasted Matte Grain Texture
 * Recreates the subtle micro-grain feel of premium GMK / ePBT custom keycaps.
 */
export function getPBTTexture(): THREE.CanvasTexture {
  if (cachedPBT) return cachedPBT;
  if (typeof document === 'undefined') return new THREE.CanvasTexture(null as unknown as HTMLCanvasElement);

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 256, 256);

  // Micro-grain noise
  const imgData = ctx.getImageData(0, 0, 256, 256);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const grain = (Math.random() - 0.5) * 36;
    const val = Math.min(255, Math.max(0, 128 + grain));
    data[i] = val;
    data[i + 1] = val;
    data[i + 2] = val;
    data[i + 3] = 255;
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.needsUpdate = true;
  cachedPBT = texture;
  return texture;
}

/**
 * Anodized CNC Brushed Metal Texture
 * Generates horizontal directional micro-grooves that produce real anisotropic light glints.
 */
export function getBrushedMetalTexture(): THREE.CanvasTexture {
  if (cachedBrushed) return cachedBrushed;
  if (typeof document === 'undefined') return new THREE.CanvasTexture(null as unknown as HTMLCanvasElement);

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 512, 512);

  // Horizontal linear tool marks / brushed streaks
  ctx.lineWidth = 1;
  for (let y = 0; y < 512; y += 2) {
    const alpha = Math.random() * 0.25;
    const brightness = Math.random() > 0.5 ? 255 : 0;
    ctx.strokeStyle = `rgba(${brightness}, ${brightness}, ${brightness}, ${alpha})`;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 6);
  texture.needsUpdate = true;
  cachedBrushed = texture;
  return texture;
}

/**
 * Forged & Woven 2x2 Twill Carbon Fiber Texture
 * Generates authentic carbon fiber weave for the 'carbono' modular top-plate.
 */
export function getCarbonFiberTexture(): THREE.CanvasTexture {
  if (cachedCarbon) return cachedCarbon;
  if (typeof document === 'undefined') return new THREE.CanvasTexture(null as unknown as HTMLCanvasElement);

  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#141416';
  ctx.fillRect(0, 0, 128, 128);

  const size = 16;
  for (let x = 0; x < 128; x += size) {
    for (let y = 0; y < 128; y += size) {
      const isAlt = ((x / size) + (y / size)) % 2 === 0;
      const grad = ctx.createLinearGradient(x, y, x + size, y + size);
      if (isAlt) {
        grad.addColorStop(0, '#2a2a2e');
        grad.addColorStop(0.5, '#121214');
        grad.addColorStop(1, '#35353c');
      } else {
        grad.addColorStop(0, '#101012');
        grad.addColorStop(0.5, '#28282e');
        grad.addColorStop(1, '#0e0e10');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(x, y, size, size);

      // Fine fiber weave threads
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, y + size / 2);
      ctx.lineTo(x + size, y + size / 2);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 8);
  texture.needsUpdate = true;
  cachedCarbon = texture;
  return texture;
}

/**
 * Chassis Top Plate Serigraphy & Laser Routing Texture
 * Draws the exact industrial technical markings from Image 1:
 * - STRATA [J] 0067 T0
 * - [ DARE OPS ]
 * - Glowing laser trace routes and framing borders
 */
export function getChassisSerigraphyTexture(): THREE.CanvasTexture {
  if (cachedChassisSerigraphy) return cachedChassisSerigraphy;
  if (typeof document === 'undefined') return new THREE.CanvasTexture(null as unknown as HTMLCanvasElement);

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Transparent background
  ctx.clearRect(0, 0, 1024, 512);

  // Gold accent styling
  ctx.strokeStyle = 'rgba(232, 201, 125, 0.75)';
  ctx.fillStyle = 'rgba(232, 201, 125, 0.85)';
  ctx.lineWidth = 2.5;

  // 1. Perimeter laser routing line surrounding key area
  ctx.strokeRect(60, 140, 904, 300);

  // 2. Corner bracket accents
  const drawCornerBracket = (cx: number, cy: number, w: number, h: number) => {
    ctx.lineWidth = 3;
    // Top-left
    ctx.beginPath();
    ctx.moveTo(cx, cy + 18);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx + 18, cy);
    ctx.stroke();
    // Top-right
    ctx.beginPath();
    ctx.moveTo(cx + w - 18, cy);
    ctx.lineTo(cx + w, cy);
    ctx.lineTo(cx + w, cy + 18);
    ctx.stroke();
    // Bottom-left
    ctx.beginPath();
    ctx.moveTo(cx, cy + h - 18);
    ctx.lineTo(cx, cy + h);
    ctx.lineTo(cx + 18, cy + h);
    ctx.stroke();
    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(cx + w - 18, cy + h);
    ctx.lineTo(cx + w, cy + h);
    ctx.lineTo(cx + w, cy + h - 18);
    ctx.stroke();
  };

  drawCornerBracket(50, 130, 924, 320);

  // 3. Gold Laser Frame around Function Keys (Image 1)
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(232, 201, 125, 0.9)';
  ctx.strokeRect(70, 150, 750, 48);

  // 4. Laser-Etched Typography (Image 1)
  ctx.font = 'bold 22px monospace';
  ctx.letterSpacing = '0.14em';
  ctx.fillText('STRATA [J] 0067 T0', 70, 480);

  ctx.font = 'bold 24px monospace';
  ctx.letterSpacing = '0.16em';
  ctx.fillText('[ DARE OPS ]', 780, 480);

  // 5. Forehead laser lines and alignment marks
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = 'rgba(232, 201, 125, 0.45)';
  ctx.beginPath();
  ctx.moveTo(70, 70);
  ctx.lineTo(954, 70);
  ctx.stroke();

  // Alignment tick marks
  for (let x = 120; x <= 900; x += 130) {
    ctx.beginPath();
    ctx.moveTo(x, 62);
    ctx.lineTo(x, 78);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  cachedChassisSerigraphy = texture;
  return texture;
}
