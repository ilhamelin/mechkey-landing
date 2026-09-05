/**
 * Easing functions for smooth 3D animations
 */
export const easing = {
  easeInOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  easeOutExpo: (t: number) =>
    t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
  easeInOutQuart: (t: number) =>
    t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2,
};

/**
 * Linear interpolation
 */
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Clamp a value between min and max
 */
export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

/**
 * Map a value from one range to another
 */
export const mapRange = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
) => {
  return ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
};

/**
 * Normalize a value within a sub-range of [0,1]
 * e.g. progress = 0.3, start = 0.2, end = 0.5 → 0.33
 */
export const normalizeInRange = (
  progress: number,
  start: number,
  end: number
) => clamp(mapRange(progress, start, end, 0, 1), 0, 1);

/**
 * Exploded view layer positions for each keyboard part
 * [x, y, z] offsets at full explosion (progress = 1)
 */
export const EXPLODE_POSITIONS = {
  case_top:    [0,  1.90, 0] as [number, number, number],
  knob:        [0,  2.15, 0] as [number, number, number],
  keycaps:     [0,  1.36, 0] as [number, number, number],
  switches:    [0,  0.82, 0] as [number, number, number],
  plate:       [0,  0.28, 0] as [number, number, number],
  foam:        [0, -0.28, 0] as [number, number, number],
  pcb:         [0, -0.88, 0] as [number, number, number],
  case_bottom: [0, -1.55, 0] as [number, number, number],
};

/**
 * Section scroll ranges [start, end] in normalized progress (0-1)
 */
export const SECTIONS = {
  hero:      [0.00, 0.12],
  caseTop:   [0.12, 0.25],
  switches:  [0.25, 0.38],
  pcb:       [0.38, 0.51],
  foam:      [0.51, 0.64],
  materials: [0.64, 0.76],
  specs:     [0.76, 0.88],
  cta:       [0.88, 1.00],
};
