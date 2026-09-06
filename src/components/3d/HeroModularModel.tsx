'use client';
import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Html } from '@react-three/drei';
import * as THREE from 'three';
import { lerp } from '@/lib/animation';
import {
  getPBTTexture,
  getBrushedMetalTexture,
  getCarbonFiberTexture,
  getChassisSerigraphyTexture,
} from '@/lib/textures';

export type ModularFinish = 'bronce' | 'carbono' | 'titanium';

interface HeroModularModelProps {
  finish: ModularFinish;
  isExpanded: boolean;
  accentColor?: string;
  onHoverPart?: (part: string | null) => void;
}

// ── Key layout matching Image 1 ──
interface KeyPos {
  x: number;
  z: number;
  w?: number;
  isAccent?: boolean;
}

const HERO_KEYS: KeyPos[] = (() => {
  const keys: KeyPos[] = [];
  const startX = -1.36;
  const startZ = -0.38;
  const stepX = 0.21;
  const stepZ = 0.205;

  // Row 0: Function row (14 keys)
  for (let c = 0; c < 14; c++) {
    keys.push({
      x: startX + c * stepX,
      z: startZ,
      isAccent: c === 0 || c === 13, // Esc and top-right corner are gold (Image 1)
    });
  }
  // Row 1: Number row (14 keys)
  for (let c = 0; c < 14; c++) {
    keys.push({
      x: startX + c * stepX,
      z: startZ + stepZ,
      isAccent: c === 0, // Key directly below Esc is gold (Image 1)
    });
  }
  // Row 2: QWERTY (14 keys)
  for (let c = 0; c < 14; c++) {
    keys.push({
      x: startX + c * stepX,
      z: startZ + stepZ * 2,
    });
  }
  // Row 3: ASDF (13 keys)
  for (let c = 0; c < 13; c++) {
    keys.push({
      x: startX + c * stepX,
      z: startZ + stepZ * 3,
    });
  }
  // Row 4: Bottom row (Left mods + Spacebar + Arrows)
  keys.push({ x: startX, z: startZ + stepZ * 4, isAccent: true }); // Bottom-left mod is gold (Image 1)
  keys.push({ x: startX + stepX, z: startZ + stepZ * 4 });
  keys.push({ x: startX + stepX * 2, z: startZ + stepZ * 4 });
  // Spacebar (wide, matte dark PBT as in Image 1)
  keys.push({ x: -0.06, z: startZ + stepZ * 4, w: 1.08, isAccent: false });
  keys.push({ x: 0.64, z: startZ + stepZ * 4 });
  keys.push({ x: 0.85, z: startZ + stepZ * 4 });
  keys.push({ x: 1.06, z: startZ + stepZ * 4 });
  keys.push({ x: 1.27, z: startZ + stepZ * 4 });

  return keys;
})();

export default function HeroModularModel({
  finish,
  isExpanded,
  accentColor = '#e8c97d',
  onHoverPart,
}: HeroModularModelProps) {
  const rootRef = useRef<THREE.Group>(null!);
  const topRailRef = useRef<THREE.Group>(null!);
  const leftRailRef = useRef<THREE.Group>(null!);
  const rightRailRef = useRef<THREE.Group>(null!);
  const [hoveredModule, setHoveredModule] = useState<'fn' | 'topRail' | 'leftRail' | 'rightRail' | null>(null);

  // Expansion animation factor (0 = snapped closed, 1 = modular expanded)
  const expandFactor = useRef(isExpanded ? 1 : 0);

  // Procedural PBR textures
  const pbtTexture = useMemo(() => getPBTTexture(), []);
  const brushedTexture = useMemo(() => getBrushedMetalTexture(), []);
  const carbonTexture = useMemo(() => getCarbonFiberTexture(), []);
  const serigraphyTexture = useMemo(() => getChassisSerigraphyTexture(), []);

  // ── Materials with procedural texture maps ──
  const matKeycapDark = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#16171b'),
      bumpMap: pbtTexture,
      bumpScale: 0.003,
      roughness: 0.58,
      metalness: 0.04,
      clearcoat: 0.12,
      clearcoatRoughness: 0.7,
    });
  }, [pbtTexture]);

  const matKeycapGold = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#d4aa48'),
      bumpMap: brushedTexture,
      bumpScale: 0.0015,
      roughness: 0.18,
      metalness: 0.92,
      clearcoat: 0.7,
      clearcoatRoughness: 0.08,
      envMapIntensity: 2.2,
    });
  }, [brushedTexture]);

  const matSwitchPlate = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#c59b48'),
      bumpMap: brushedTexture,
      bumpScale: 0.002,
      roughness: 0.20,
      metalness: 0.88,
      clearcoat: 0.4,
      clearcoatRoughness: 0.1,
    });
  }, [brushedTexture]);

  const matGasketDampener = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#0a0a0c'),
      roughness: 0.98,
      metalness: 0.0,
    });
  }, []);

  const matSwitchHousing = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#e0e8f0'),
      roughness: 0.15,
      metalness: 0.1,
      transparent: true,
      opacity: 0.75,
    });
  }, []);

  const matSwitchStem = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#d93829'), // Red switch stem (Image 2)
      roughness: 0.3,
      metalness: 0.1,
    });
  }, []);

  const matPogoPin = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#e8c97d'),
      roughness: 0.08,
      metalness: 1.0,
      emissive: new THREE.Color('#c89824'),
      emissiveIntensity: 0.35,
    });
  }, []);

  const matChassisBase = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#141418'),
      bumpMap: brushedTexture,
      bumpScale: 0.003,
      roughness: 0.22,
      metalness: 0.88,
      clearcoat: 0.45,
      clearcoatRoughness: 0.1,
      envMapIntensity: 1.5,
    });
  }, [brushedTexture]);

  // Modular finish material
  const matModular = useMemo(() => {
    switch (finish) {
      case 'carbono':
        return new THREE.MeshPhysicalMaterial({
          color: new THREE.Color('#1a1a1e'),
          map: carbonTexture,
          bumpMap: carbonTexture,
          bumpScale: 0.004,
          roughness: 0.32,
          metalness: 0.25,
          clearcoat: 0.85,
          clearcoatRoughness: 0.06,
          envMapIntensity: 2.0,
        });
      case 'bronce':
        return new THREE.MeshPhysicalMaterial({
          color: new THREE.Color('#c59b48'),
          bumpMap: brushedTexture,
          bumpScale: 0.003,
          roughness: 0.16,
          metalness: 0.94,
          clearcoat: 0.70,
          clearcoatRoughness: 0.06,
          envMapIntensity: 2.4,
        });
      case 'titanium':
      default:
        return new THREE.MeshPhysicalMaterial({
          color: new THREE.Color('#282a34'),
          bumpMap: brushedTexture,
          bumpScale: 0.0025,
          roughness: 0.22,
          metalness: 0.90,
          clearcoat: 0.55,
          clearcoatRoughness: 0.1,
          envMapIntensity: 1.8,
        });
    }
  }, [finish, carbonTexture, brushedTexture]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const targetExp = isExpanded ? 1 : 0;

    // Smooth spring-like lerp to target
    expandFactor.current = lerp(expandFactor.current, targetExp, 1 - Math.pow(0.002, delta));
    const ef = expandFactor.current;

    // Modular Quick-Release Rails expansion positions
    if (topRailRef.current) {
      topRailRef.current.position.y = 0.12 + ef * 0.32;
      topRailRef.current.position.z = -0.92 - ef * 0.48;
    }

    if (leftRailRef.current) {
      leftRailRef.current.position.x = -1.98 - ef * 0.65;
      leftRailRef.current.position.y = 0.02 + ef * 0.08;
    }

    if (rightRailRef.current) {
      rightRailRef.current.position.x = 1.98 + ef * 0.65;
      rightRailRef.current.position.y = 0.02 + ef * 0.08;
    }

    // Semi-frontal viewing angle: inclined slightly forward so all keycaps and top plate are visible
    if (rootRef.current) {
      rootRef.current.rotation.x = 0.16 + Math.sin(t * 0.4) * 0.015;
      rootRef.current.rotation.y = -0.04 + Math.sin(t * 0.25) * 0.02;
      rootRef.current.position.y = -0.08 + Math.sin(t * 0.5) * 0.02;
    }
  });

  return (
    <group ref={rootRef} position={[0, -0.08, 0]} scale={0.76}>

      {/* ── 1. Thick Sandwich Mechanical Keyboard Body (Image 2 + Image 1) ── */}
      <group>

        {/* ── Layer A: Heavy CNC Aluminum Bottom Chassis (Image 2) ── */}
        <RoundedBox args={[3.80, 0.18, 1.84]} radius={0.05} position={[0, -0.13, 0]} castShadow receiveShadow>
          <primitive object={matChassisBase} attach="material" />
        </RoundedBox>

        {/* ── Layer B: Acoustic Gasket & Dampening Core Lip (Visible Sandwich Split) ── */}
        <mesh position={[0, -0.03, 0]}>
          <boxGeometry args={[3.72, 0.045, 1.76]} />
          <primitive object={matGasketDampener} attach="material" />
        </mesh>

        {/* ── Layer C: Champagne Anodized Switch Mounting Plate (Sandwich Lip) ── */}
        <mesh position={[0, -0.005, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.76, 0.035, 1.78]} />
          <primitive object={matSwitchPlate} attach="material" />
        </mesh>

        {/* ── Layer D: Chunky Top Bezel CNC Plate with Wide Forehead (Image 1) ── */}
        <RoundedBox args={[3.80, 0.18, 1.84]} radius={0.05} position={[0, 0.09, 0]} castShadow receiveShadow>
          <primitive object={matModular} attach="material" />
        </RoundedBox>

        {/* Inner Recessed Key Well (Keys sit inside this pocket) */}
        <mesh position={[0, 0.14, 0.04]}>
          <boxGeometry args={[3.24, 0.08, 1.28]} />
          <meshStandardMaterial color="#0d0e12" roughness={0.8} metalness={0.2} />
        </mesh>

        {/* ── Decal Serigraphy directly on top of the 3D metal chassis (Image 1) ── */}
        <mesh position={[0, 0.181, 0.04]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[3.72, 1.78]} />
          <meshBasicMaterial map={serigraphyTexture} transparent opacity={0.92} depthWrite={false} />
        </mesh>

        {/* ── Forehead Details (Above Keys, exact match to Image 1) ── */}
        {/* Horizontal glowing gold light diffuser strip */}
        <mesh position={[0, 0.182, -0.66]}>
          <boxGeometry args={[1.65, 0.008, 0.028]} />
          <meshStandardMaterial color="#fff4cc" emissive="#e8c97d" emissiveIntensity={1.5} roughness={0.1} />
        </mesh>

        {/* Laser/CNC milled accent slot on the left of light strip */}
        <mesh position={[-1.15, 0.181, -0.66]}>
          <boxGeometry args={[0.38, 0.003, 0.014]} />
          <meshStandardMaterial color="#08080a" roughness={0.9} metalness={0.3} />
        </mesh>

        {/* Laser/CNC milled accent slot on the right of light strip */}
        <mesh position={[1.15, 0.181, -0.66]}>
          <boxGeometry args={[0.38, 0.003, 0.014]} />
          <meshStandardMaterial color="#08080a" roughness={0.9} metalness={0.3} />
        </mesh>

        {/* Mechanical Switches visible under keycaps (Image 2 detail) */}
        {HERO_KEYS.map((k, i) => (
          <group key={`sw-${i}`} position={[k.x, 0.12, k.z]}>
            {/* Clear switch housing */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.15, 0.05, 0.15]} />
              <primitive object={matSwitchHousing} attach="material" />
            </mesh>
            {/* Red stem */}
            <mesh position={[0, 0.035, 0]}>
              <boxGeometry args={[0.045, 0.04, 0.045]} />
              <primitive object={matSwitchStem} attach="material" />
            </mesh>
          </group>
        ))}

        {/* ── Sculpted Keycaps with Micro-Beveled Edges (Image 1 detail) ── */}
        <group>
          {HERO_KEYS.map((k, i) => {
            const isFnKey = k.z === -0.38;
            const w = k.w || 0.185;
            return (
              <RoundedBox
                key={`key-${i}`}
                args={[w, 0.09, 0.185]}
                radius={0.02}
                smoothness={4}
                position={[k.x, 0.19, k.z]}
                onPointerOver={(e) => {
                  e.stopPropagation();
                  if (isFnKey) {
                    setHoveredModule('fn');
                    onHoverPart?.('fn');
                  }
                }}
                onPointerOut={() => {
                  if (isFnKey) {
                    setHoveredModule(null);
                    onHoverPart?.(null);
                  }
                }}
                castShadow
              >
                <primitive object={k.isAccent ? matKeycapGold : matKeycapDark} attach="material" />
              </RoundedBox>
            );
          })}
        </group>

        {/* Magnetic contact pins on Core Flanks */}
        {[-0.5, 0, 0.5].map((z, idx) => (
          <group key={`pin-${idx}`}>
            <mesh position={[-1.905, 0.04, z]}>
              <cylinderGeometry args={[0.014, 0.014, 0.02, 10]} />
              <primitive object={matPogoPin} attach="material" />
            </mesh>
            <mesh position={[1.905, 0.04, z]}>
              <cylinderGeometry args={[0.014, 0.014, 0.02, 10]} />
              <primitive object={matPogoPin} attach="material" />
            </mesh>
          </group>
        ))}
      </group>

      {/* ── 2. Thick Detachable Modular Quick-Release Rails (Matching Image 1 & 2) ── */}

      {/* ── Top Rail (Floats upward) ── */}
      <group
        ref={topRailRef}
        position={[0, 0.12, -0.92]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredModule('topRail');
          onHoverPart?.('topRail');
        }}
        onPointerOut={() => {
          setHoveredModule(null);
          onHoverPart?.(null);
        }}
      >
        {/* Chunky Outer CNC Body */}
        <RoundedBox args={[3.96, 0.22, 0.22]} radius={0.04} castShadow>
          <primitive object={matModular} attach="material" />
        </RoundedBox>

        {/* Chamfer Accent Line */}
        <mesh position={[0, 0.112, 0]}>
          <boxGeometry args={[3.88, 0.002, 0.15]} />
          <meshStandardMaterial color={accentColor} roughness={0.1} metalness={0.9} emissive={accentColor} emissiveIntensity={0.15} />
        </mesh>

        {/* Stepped inner groove channel where it locks to chassis */}
        <mesh position={[0, -0.02, 0.095]}>
          <boxGeometry args={[3.80, 0.14, 0.02]} />
          <meshStandardMaterial color="#08080a" roughness={0.8} />
        </mesh>

        {/* Gold magnetic contact pads */}
        {[-0.9, 0, 0.9].map((x, i) => (
          <mesh key={`top-pin-${i}`} position={[x, 0, 0.112]}>
            <cylinderGeometry args={[0.016, 0.016, 0.01, 8]} />
            <primitive object={matPogoPin} attach="material" />
          </mesh>
        ))}
      </group>

      {/* ── Left Flank Rail (Floats left) ── */}
      <group
        ref={leftRailRef}
        position={[-1.98, 0.02, 0]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredModule('leftRail');
          onHoverPart?.('leftRail');
        }}
        onPointerOut={() => {
          setHoveredModule(null);
          onHoverPart?.(null);
        }}
      >
        {/* Chunky Outer CNC Body */}
        <RoundedBox args={[0.22, 0.22, 1.96]} radius={0.04} castShadow>
          <primitive object={matModular} attach="material" />
        </RoundedBox>

        {/* Inner stepped lip that mates with chassis */}
        <mesh position={[0.105, -0.01, 0]}>
          <boxGeometry args={[0.02, 0.15, 1.84]} />
          <meshStandardMaterial color="#0a0a0d" roughness={0.8} />
        </mesh>

        {/* Pogo pin contacts */}
        {[-0.5, 0, 0.5].map((z, idx) => (
          <mesh key={`left-pin-${idx}`} position={[0.112, 0.02, z]}>
            <cylinderGeometry args={[0.016, 0.016, 0.01, 8]} />
            <primitive object={matPogoPin} attach="material" />
          </mesh>
        ))}
      </group>

      {/* ── Right Flank Rail (Floats right) ── */}
      <group
        ref={rightRailRef}
        position={[1.98, 0.02, 0]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredModule('rightRail');
          onHoverPart?.('rightRail');
        }}
        onPointerOut={() => {
          setHoveredModule(null);
          onHoverPart?.(null);
        }}
      >
        {/* Chunky Outer CNC Body */}
        <RoundedBox args={[0.22, 0.22, 1.96]} radius={0.04} castShadow>
          <primitive object={matModular} attach="material" />
        </RoundedBox>

        {/* Inner stepped lip that mates with chassis */}
        <mesh position={[-0.105, -0.01, 0]}>
          <boxGeometry args={[0.02, 0.15, 1.84]} />
          <meshStandardMaterial color="#0a0a0d" roughness={0.8} />
        </mesh>

        {/* Pogo pin contacts */}
        {[-0.5, 0, 0.5].map((z, idx) => (
          <mesh key={`right-pin-${idx}`} position={[-0.112, 0.02, z]}>
            <cylinderGeometry args={[0.016, 0.016, 0.01, 8]} />
            <primitive object={matPogoPin} attach="material" />
          </mesh>
        ))}
      </group>

      {/* ── 3. Technical Blueprint Laser Floor Plane (Image 1) ── */}
      <group position={[0, -0.23, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <Html
          position={[0, 0, 0]}
          transform
          occlude={false}
          style={{
            width: 960,
            height: 560,
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          <div style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            opacity: 0.7,
          }}>
            {/* SVG Alignment laser lines and bracket connectors */}
            <svg width="100%" height="100%" viewBox="0 0 960 560" fill="none">
              {/* Outer boundary guides */}
              <rect x="40" y="30" width="880" height="500" stroke="rgba(232, 201, 125, 0.15)" strokeWidth="1" strokeDasharray="6 6" />

              {/* Bracket markings connecting to detached rails */}
              {/* Top rail alignment brackets */}
              <path d="M 110 65 L 110 38 L 850 38 L 850 65" stroke="rgba(232, 201, 125, 0.38)" strokeWidth="1.2" />
              <line x1="480" y1="38" x2="480" y2="75" stroke="rgba(232, 201, 125, 0.45)" strokeWidth="1.2" />

              {/* Left rail alignment bracket */}
              <path d="M 85 100 L 55 100 L 55 460 L 85 460" stroke="rgba(232, 201, 125, 0.38)" strokeWidth="1.2" />

              {/* Right rail alignment bracket */}
              <path d="M 875 100 L 905 100 L 905 460 L 875 460" stroke="rgba(232, 201, 125, 0.38)" strokeWidth="1.2" />

              {/* Center dimensional crosshairs */}
              <circle cx="480" cy="280" r="18" stroke="rgba(232, 201, 125, 0.2)" strokeWidth="1" />
              <line x1="480" y1="250" x2="480" y2="310" stroke="rgba(232, 201, 125, 0.25)" strokeWidth="1" />
              <line x1="450" y1="280" x2="510" y2="280" stroke="rgba(232, 201, 125, 0.25)" strokeWidth="1" />
            </svg>

            {/* Industrial Serigraphy Typography on Floor */}
            <div style={{
              position: 'absolute',
              bottom: 40,
              left: 65,
              fontFamily: 'monospace',
              fontSize: '11px',
              color: 'rgba(232, 201, 125, 0.75)',
              letterSpacing: '0.12em',
              fontWeight: 600,
            }}>
              STRATA [J] 0067 T0
            </div>

            <div style={{
              position: 'absolute',
              bottom: 40,
              right: 75,
              fontFamily: 'monospace',
              fontSize: '11px',
              color: 'rgba(232, 201, 125, 0.85)',
              letterSpacing: '0.14em',
              fontWeight: 700,
            }}>
              [ DARE OPS ]
            </div>
          </div>
        </Html>
      </group>

      {/* ── 4. Interactive Callout Tooltip matching Image 1 exactly ── */}
      <group position={[0.35, 0.25, -0.38]}>
        <Html center={false} style={{ pointerEvents: 'none' }}>
          <div
            style={{
              position: 'absolute',
              left: 16,
              top: -24,
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'row',
              opacity: 1,
              transition: 'all 0.3s ease',
            }}
          >
            {/* SVG Angled Leader Line */}
            <svg width="42" height="28" viewBox="0 0 42 28" style={{ overflow: 'visible', flexShrink: 0 }}>
              <path
                d="M 0 20 L 18 8 L 42 8"
                stroke="#e8c97d"
                strokeWidth="1.5"
                fill="none"
                style={{ filter: 'drop-shadow(0 0 4px rgba(232, 201, 125, 0.6))' }}
              />
            </svg>

            {/* Callout Card (Exact text from Image 1) */}
            <div
              style={{
                background: 'rgba(12, 13, 16, 0.94)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                border: '1px solid rgba(232, 201, 125, 0.45)',
                borderRadius: '6px',
                padding: '6px 12px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.65), 0 0 14px rgba(232, 201, 125, 0.15)',
                whiteSpace: 'nowrap',
              }}
            >
              <div
                style={{
                  fontFamily: 'monospace',
                  fontSize: '10px',
                  fontWeight: 700,
                  color: '#ffffff',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                {hoveredModule === 'topRail'
                  ? 'RIEL SUPERIOR QUICK-RELEASE CNC'
                  : hoveredModule === 'leftRail' || hoveredModule === 'rightRail'
                  ? 'RIEL LATERAL MAGNÉTICO POGO-PIN'
                  : 'MÓDULO DE TECLAS DE FUNCIÓN PROCESADAS POR CNC'}
              </div>
              <div
                style={{
                  fontFamily: 'sans-serif',
                  fontSize: '9px',
                  color: 'rgba(232, 201, 125, 0.85)',
                  marginTop: '2px',
                }}
              >
                {hoveredModule === 'topRail'
                  ? 'Desacoplamiento sin herramientas en 2 segundos'
                  : hoveredModule === 'leftRail' || hoveredModule === 'rightRail'
                  ? '3 pines magnéticos bañados en oro para continuidad a tierra'
                  : 'Fresado individual con tolerancias micrométricas'}
              </div>
            </div>

            {/* Target Reticle Anchor Dot */}
            <div
              style={{
                position: 'absolute',
                left: -6,
                top: 14,
                width: 12,
                height: 12,
                borderRadius: '50%',
                border: '2px solid #e8c97d',
                background: 'rgba(232, 201, 125, 0.35)',
                boxShadow: '0 0 8px #e8c97d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#ffffff' }} />
            </div>
          </div>
        </Html>
      </group>

    </group>
  );
}
