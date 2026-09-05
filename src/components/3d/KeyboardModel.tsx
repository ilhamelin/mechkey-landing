'use client';
import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { lerp, normalizeInRange, EXPLODE_POSITIONS, easing } from '@/lib/animation';

interface KeyboardModelProps {
  scrollProgress: number;
}

// ─── Module-level geometries (allocated once for optimal WebGL performance) ───
const key1uGeo      = new THREE.BoxGeometry(0.19, 0.09, 0.19);
const spacebarGeo  = new THREE.BoxGeometry(1.22, 0.09, 0.19);
const enterKeyGeo  = new THREE.BoxGeometry(0.38, 0.09, 0.19);
const shiftKeyGeo  = new THREE.BoxGeometry(0.46, 0.09, 0.19);

// Switch components
const switchTopGeo   = new THREE.BoxGeometry(0.14, 0.065, 0.14);
const switchBaseGeo  = new THREE.BoxGeometry(0.145, 0.045, 0.145);
const switchStemGeo  = new THREE.BoxGeometry(0.04, 0.065, 0.04);
const switchSpringGeo = new THREE.CylinderGeometry(0.016, 0.016, 0.07, 8);

// Gasket & Plate geometries
const plateGeo     = new THREE.BoxGeometry(3.56, 0.032, 1.44);
const gasketTabGeo = new THREE.BoxGeometry(0.07, 0.045, 0.045);
const foamGeo      = new THREE.BoxGeometry(3.52, 0.048, 1.40);

// PCB geometries
const pcbGeo       = new THREE.BoxGeometry(3.54, 0.045, 1.42);
const mcuChipGeo   = new THREE.BoxGeometry(0.16, 0.02, 0.16);
const usbcPortGeo  = new THREE.BoxGeometry(0.18, 0.065, 0.10);
const usbcSlotGeo  = new THREE.BoxGeometry(0.14, 0.035, 0.02);

// Weight bar & knob
const weightBarGeo = new THREE.BoxGeometry(2.4, 0.015, 0.52);
const knobBaseGeo  = new THREE.CylinderGeometry(0.11, 0.11, 0.12, 24);
const knobTopGeo   = new THREE.CylinderGeometry(0.095, 0.095, 0.025, 24);
const footGeo      = new THREE.CylinderGeometry(0.085, 0.095, 0.03, 16);

// ─── Key Layout Positions ───
interface KeyDef {
  pos: [number, number, number];
  type: '1u' | 'spacebar' | 'enter' | 'shift';
  isAccent?: boolean;
}

const KEY_LAYOUT: KeyDef[] = (() => {
  const keys: KeyDef[] = [];
  const startX = -1.55;
  const startZ = -0.52;
  const step = 0.235;

  // Row 0: Function Row (14 keys)
  for (let c = 0; c < 14; c++) {
    keys.push({
      pos: [startX + c * step, 0, startZ],
      type: '1u',
      isAccent: c === 0 || c === 13, // Esc and Delete
    });
  }

  // Row 1: Number Row (14 keys)
  for (let c = 0; c < 14; c++) {
    keys.push({
      pos: [startX + c * step, 0, startZ + step],
      type: '1u',
      isAccent: c === 13, // Backspace
    });
  }

  // Row 2: QWERTY Row (14 keys)
  for (let c = 0; c < 14; c++) {
    keys.push({
      pos: [startX + c * step, 0, startZ + step * 2],
      type: '1u',
    });
  }

  // Row 3: ASDF Row (12 keys + Enter)
  for (let c = 0; c < 12; c++) {
    keys.push({
      pos: [startX + c * step, 0, startZ + step * 3],
      type: '1u',
    });
  }
  keys.push({
    pos: [startX + 12.4 * step, 0, startZ + step * 3],
    type: 'enter',
    isAccent: true, // Gold Enter key
  });

  // Row 4: Bottom Row (Left mods + Spacebar + Right mods + Arrows)
  // Left mods: Ctrl, Win, Alt
  keys.push({ pos: [startX, 0, startZ + step * 4], type: '1u' });
  keys.push({ pos: [startX + step, 0, startZ + step * 4], type: '1u' });
  keys.push({ pos: [startX + step * 2, 0, startZ + step * 4], type: '1u' });

  // Spacebar 6.25u in center
  keys.push({
    pos: [-0.08, 0, startZ + step * 4],
    type: 'spacebar',
    isAccent: true, // Gold Spacebar
  });

  // Right mods & Arrows
  keys.push({ pos: [0.72, 0, startZ + step * 4], type: '1u' });
  keys.push({ pos: [0.955, 0, startZ + step * 4], type: '1u' });
  keys.push({ pos: [1.19, 0, startZ + step * 4], type: '1u' }); // Left arrow
  keys.push({ pos: [1.425, 0, startZ + step * 4], type: '1u', isAccent: true }); // Right arrow

  return keys;
})();

// Filter standard 1u keys for instanced rendering
const STANDARD_1U_KEYS = KEY_LAYOUT.filter((k) => k.type === '1u' && !k.isAccent);
const ACCENT_1U_KEYS   = KEY_LAYOUT.filter((k) => k.type === '1u' && k.isAccent);
const SPECIAL_KEYS     = KEY_LAYOUT.filter((k) => k.type !== '1u');

// ─── Instanced Keycaps Component ───
function KeycapAssembly() {
  const stdRef    = useRef<THREE.InstancedMesh>(null!);
  const accentRef = useRef<THREE.InstancedMesh>(null!);

  useEffect(() => {
    const dummy = new THREE.Object3D();

    STANDARD_1U_KEYS.forEach((k, i) => {
      dummy.position.set(k.pos[0], k.pos[1], k.pos[2]);
      dummy.updateMatrix();
      stdRef.current?.setMatrixAt(i, dummy.matrix);
    });
    if (stdRef.current) stdRef.current.instanceMatrix.needsUpdate = true;

    ACCENT_1U_KEYS.forEach((k, i) => {
      dummy.position.set(k.pos[0], k.pos[1], k.pos[2]);
      dummy.updateMatrix();
      accentRef.current?.setMatrixAt(i, dummy.matrix);
    });
    if (accentRef.current) accentRef.current.instanceMatrix.needsUpdate = true;
  }, []);

  return (
    <group>
      {/* Standard Obsidian keys */}
      <instancedMesh ref={stdRef} args={[key1uGeo, undefined, STANDARD_1U_KEYS.length]} castShadow receiveShadow>
        <meshStandardMaterial
          color="#18181a"
          roughness={0.38}
          metalness={0.12}
        />
      </instancedMesh>

      {/* Gold Accent 1u keys (Esc, Delete, arrows) */}
      <instancedMesh ref={accentRef} args={[key1uGeo, undefined, ACCENT_1U_KEYS.length]} castShadow receiveShadow>
        <meshStandardMaterial
          color="#e8c97d"
          roughness={0.22}
          metalness={0.85}
        />
      </instancedMesh>

      {/* Special sculpted keys: Spacebar & Enter */}
      {SPECIAL_KEYS.map((k, i) => {
        const geo = k.type === 'spacebar' ? spacebarGeo : enterKeyGeo;
        return (
          <mesh key={i} position={k.pos} geometry={geo} castShadow receiveShadow>
            <meshStandardMaterial
              color={k.isAccent ? '#e8c97d' : '#18181a'}
              roughness={k.isAccent ? 0.22 : 0.38}
              metalness={k.isAccent ? 0.85 : 0.12}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// ─── Instanced Realistic Mechanical Switches ───
function SwitchesAssembly() {
  const topHousingRef = useRef<THREE.InstancedMesh>(null!);
  const baseHousingRef = useRef<THREE.InstancedMesh>(null!);
  const stemRef       = useRef<THREE.InstancedMesh>(null!);
  const springRef     = useRef<THREE.InstancedMesh>(null!);

  // Switch positions
  const switchPositions = useMemo(() => {
    return KEY_LAYOUT.map((k) => k.pos);
  }, []);

  useEffect(() => {
    const dummy = new THREE.Object3D();

    switchPositions.forEach((pos, i) => {
      // Top housing
      dummy.position.set(pos[0], 0.02, pos[2]);
      dummy.updateMatrix();
      topHousingRef.current?.setMatrixAt(i, dummy.matrix);

      // Base housing
      dummy.position.set(pos[0], -0.025, pos[2]);
      dummy.updateMatrix();
      baseHousingRef.current?.setMatrixAt(i, dummy.matrix);

      // Ruby/Gold Stem cross
      dummy.position.set(pos[0], 0.045, pos[2]);
      dummy.updateMatrix();
      stemRef.current?.setMatrixAt(i, dummy.matrix);

      // Internal spring
      dummy.position.set(pos[0], 0.015, pos[2]);
      dummy.updateMatrix();
      springRef.current?.setMatrixAt(i, dummy.matrix);
    });

    if (topHousingRef.current) topHousingRef.current.instanceMatrix.needsUpdate = true;
    if (baseHousingRef.current) baseHousingRef.current.instanceMatrix.needsUpdate = true;
    if (stemRef.current) stemRef.current.instanceMatrix.needsUpdate = true;
    if (springRef.current) springRef.current.instanceMatrix.needsUpdate = true;
  }, [switchPositions]);

  return (
    <group>
      {/* Translucent Polycarbonate Upper Housing */}
      <instancedMesh ref={topHousingRef} args={[switchTopGeo, undefined, switchPositions.length]} castShadow>
        <meshPhysicalMaterial
          color="#dbe6f0"
          transparent
          opacity={0.65}
          roughness={0.12}
          metalness={0.1}
          transmission={0.7}
          ior={1.48}
        />
      </instancedMesh>

      {/* Nylon Black Bottom Housing */}
      <instancedMesh ref={baseHousingRef} args={[switchBaseGeo, undefined, switchPositions.length]} castShadow>
        <meshStandardMaterial color="#1c1c22" roughness={0.6} metalness={0.2} />
      </instancedMesh>

      {/* Ruby Red / Amber Linear Stem */}
      <instancedMesh ref={stemRef} args={[switchStemGeo, undefined, switchPositions.length]} castShadow>
        <meshStandardMaterial color="#d44a3a" roughness={0.3} metalness={0.2} />
      </instancedMesh>

      {/* Internal Gold Coil Spring */}
      <instancedMesh ref={springRef} args={[switchSpringGeo, undefined, switchPositions.length]}>
        <meshStandardMaterial color="#e8c97d" roughness={0.15} metalness={0.95} />
      </instancedMesh>
    </group>
  );
}

// ─── Main Keyboard Model ───
export default function KeyboardModel({ scrollProgress }: KeyboardModelProps) {
  const rootRef     = useRef<THREE.Group>(null!);
  const caseTRef    = useRef<THREE.Group>(null!);
  const knobRef     = useRef<THREE.Group>(null!);
  const keycapsRef  = useRef<THREE.Group>(null!);
  const switchesRef = useRef<THREE.Group>(null!);
  const plateRef    = useRef<THREE.Group>(null!);
  const foamRef     = useRef<THREE.Group>(null!);
  const pcbRef      = useRef<THREE.Group>(null!);
  const caseBRef    = useRef<THREE.Group>(null!);

  // Smoothed explosion factor (spring-like physics)
  const ef = useRef(0);
  const efTarget = useRef(0);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    // Compute target explosion from scroll
    efTarget.current = easing.easeInOutCubic(
      normalizeInRange(scrollProgress, 0.05, 0.95)
    );

    // Smooth damping
    ef.current = lerp(ef.current, efTarget.current, 1 - Math.pow(0.001, delta));
    const e = ef.current;

    // Layer Y positions with synchronized explosion curves
    caseTRef.current.position.y    = lerp(0,     EXPLODE_POSITIONS.case_top[1],    e);
    knobRef.current.position.y     = lerp(0.06,  EXPLODE_POSITIONS.knob[1],        e);
    keycapsRef.current.position.y  = lerp(0.18,  EXPLODE_POSITIONS.keycaps[1],     e);
    switchesRef.current.position.y = lerp(0.04,  EXPLODE_POSITIONS.switches[1],    e);
    plateRef.current.position.y    = lerp(-0.03, EXPLODE_POSITIONS.plate[1],       e);
    foamRef.current.position.y     = lerp(-0.09, EXPLODE_POSITIONS.foam[1],        e);
    pcbRef.current.position.y      = lerp(-0.16, EXPLODE_POSITIONS.pcb[1],         e);
    caseBRef.current.position.y    = lerp(-0.25, EXPLODE_POSITIONS.case_bottom[1], e);

    // Subtle breathing/idle rotation (subdued during explosion)
    const idleMult = 1 - e * 0.65;
    rootRef.current.rotation.y = Math.sin(t * 0.28) * 0.12 * idleMult;
    rootRef.current.rotation.x = -0.12 - Math.sin(t * 0.18) * 0.03 * idleMult;
    rootRef.current.position.y = Math.sin(t * 0.4) * 0.02 * idleMult;

    // Slowly rotate rotary knob for visual intrigue
    if (knobRef.current) {
      knobRef.current.rotation.y = t * 0.5;
    }
  });

  return (
    <group ref={rootRef} scale={1.0}>

      {/* ── Layer 0: CNC Top Chassis ── */}
      <group ref={caseTRef}>
        {/* CNC Beveled Anodized Frame */}
        <RoundedBox args={[3.80, 0.12, 1.64]} radius={0.06} castShadow>
          <meshStandardMaterial
            color="#222226"
            roughness={0.22}
            metalness={0.88}
          />
        </RoundedBox>

        {/* Polished Chamfer Accent Ring */}
        <mesh position={[0, 0.061, 0]}>
          <boxGeometry args={[3.58, 0.003, 1.42]} />
          <meshStandardMaterial
            color="#e8c97d"
            roughness={0.1}
            metalness={0.98}
            emissive="#e8c97d"
            emissiveIntensity={0.08}
          />
        </mesh>
      </group>

      {/* ── Rotary Encoder Knob (Top Right) ── */}
      <group ref={knobRef} position={[1.62, 0.06, -0.52]}>
        {/* Diamond-knurled body */}
        <mesh geometry={knobBaseGeo} castShadow>
          <meshStandardMaterial
            color="#141416"
            roughness={0.35}
            metalness={0.85}
          />
        </mesh>
        {/* Gold beveled cap */}
        <mesh position={[0, 0.065, 0]} geometry={knobTopGeo}>
          <meshStandardMaterial
            color="#e8c97d"
            roughness={0.08}
            metalness={0.98}
          />
        </mesh>
      </group>

      {/* ── Layer 1: Sculpted Keycaps Assembly ── */}
      <group ref={keycapsRef}>
        <KeycapAssembly />
      </group>

      {/* ── Layer 2: Mechanical Switches Assembly ── */}
      <group ref={switchesRef}>
        <SwitchesAssembly />
      </group>

      {/* ── Layer 3: Switch Mounting Plate with Gasket Tabs ── */}
      <group ref={plateRef}>
        {/* Anodized Champagne Gold Plate */}
        <mesh geometry={plateGeo} castShadow receiveShadow>
          <meshStandardMaterial
            color="#d4b465"
            roughness={0.25}
            metalness={0.82}
          />
        </mesh>
        {/* Perimeter Poron Gasket Dampening Tabs */}
        {[
          [-1.78, 0, -0.4], [-1.78, 0, 0.4],
          [1.78, 0, -0.4],  [1.78, 0, 0.4],
          [-0.8, 0, -0.73], [0.8, 0, -0.73],
          [-0.8, 0, 0.73],  [0.8, 0, 0.73],
        ].map(([x, y, z], idx) => (
          <mesh key={idx} position={[x, y, z]} geometry={gasketTabGeo}>
            <meshStandardMaterial color="#111111" roughness={0.98} />
          </mesh>
        ))}
      </group>

      {/* ── Layer 4: Acoustic PORON & PE Dampener Foam ── */}
      <group ref={foamRef}>
        <mesh geometry={foamGeo} castShadow>
          <meshStandardMaterial color="#141416" roughness={0.96} />
        </mesh>
      </group>

      {/* ── Layer 5: Audiophile Circuit PCB with USB-C ── */}
      <group ref={pcbRef}>
        {/* Matte Black / Emerald Substrate */}
        <mesh geometry={pcbGeo} castShadow receiveShadow>
          <meshStandardMaterial color="#0c1a14" roughness={0.35} metalness={0.4} />
        </mesh>

        {/* Central ARM MCU Chip */}
        <mesh position={[0, 0.03, 0]} geometry={mcuChipGeo}>
          <meshStandardMaterial color="#111111" roughness={0.4} metalness={0.3} />
        </mesh>

        {/* Real CNC USB-C Female Port (Rear Center) */}
        <group position={[0, 0.015, -0.73]}>
          <mesh geometry={usbcPortGeo} castShadow>
            <meshStandardMaterial color="#a0a0a8" roughness={0.2} metalness={0.95} />
          </mesh>
          <mesh position={[0, 0, -0.045]} geometry={usbcSlotGeo}>
            <meshBasicMaterial color="#050505" />
          </mesh>
        </group>

        {/* Gold Circuit Traces & RGB LED Array */}
        {Array.from({ length: 9 }, (_, i) => (
          <group key={i} position={[-1.52 + i * 0.38, 0.026, 0]}>
            {/* Trace line */}
            <mesh>
              <boxGeometry args={[0.018, 0.005, 1.22]} />
              <meshStandardMaterial
                color="#e8c97d"
                roughness={0.12}
                metalness={0.95}
                emissive="#e8c97d"
                emissiveIntensity={0.25}
              />
            </mesh>
            {/* SMD RGB LED diode */}
            <mesh position={[0, 0.006, 0]}>
              <boxGeometry args={[0.035, 0.008, 0.035]} />
              <meshStandardMaterial
                color="#fff5db"
                emissive="#e8c97d"
                emissiveIntensity={0.8}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* ── Layer 6: Solid CNC Bottom Case with PVD Brass Weight Bar ── */}
      <group ref={caseBRef}>
        {/* Heavy Bottom Chassis */}
        <RoundedBox args={[3.80, 0.18, 1.64]} radius={0.06} castShadow receiveShadow>
          <meshStandardMaterial color="#151518" roughness={0.22} metalness={0.86} />
        </RoundedBox>

        {/* Inset Mirror-Polished PVD Brass Weight Bar (Iconic Custom Keyboard Detail) */}
        <mesh position={[0, -0.091, 0]} geometry={weightBarGeo}>
          <meshStandardMaterial
            color="#e8c97d"
            roughness={0.05}
            metalness={0.98}
          />
        </mesh>

        {/* Laser-Etched Emblem Bar */}
        <mesh position={[0, -0.092, 0]}>
          <boxGeometry args={[1.2, 0.002, 0.12]} />
          <meshStandardMaterial color="#a08544" roughness={0.3} metalness={0.9} />
        </mesh>

        {/* Recessed Non-Slip Silicone Feet */}
        {[[-1.64, -0.62], [1.64, -0.62], [-1.64, 0.62], [1.64, 0.62]].map(([x, z], i) => (
          <mesh key={i} position={[x, -0.098, z]} geometry={footGeo}>
            <meshStandardMaterial color="#1a1a1a" roughness={0.96} />
          </mesh>
        ))}
      </group>

    </group>
  );
}
