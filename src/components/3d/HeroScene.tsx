'use client';
import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import HeroModularModel, { type ModularFinish } from './HeroModularModel';

interface HeroSceneProps {
  finish: ModularFinish;
  isExpanded: boolean;
  accentColor?: string;
  onHoverPart?: (part: string | null) => void;
}

// Camera controller with subtle mouse parallax
function ParallaxCamera() {
  const targetX = useRef(0);
  const targetY = useRef(0);

  useFrame((state) => {
    // Mouse pointer ranges from -1 to 1
    const { pointer, camera } = state;
    targetX.current = THREE.MathUtils.lerp(targetX.current, pointer.x * 0.45, 0.05);
    targetY.current = THREE.MathUtils.lerp(targetY.current, pointer.y * 0.25, 0.05);

    camera.position.x = targetX.current;
    camera.position.y = 3.0 + targetY.current;
    camera.position.z = 4.8;
    camera.lookAt(0, -0.05, 0);
  });

  return null;
}

function HeroLights({ accentColor }: { accentColor: string }) {
  return (
    <>
      <ambientLight intensity={0.4} />

      {/* Main warm key light */}
      <directionalLight
        position={[4, 7, 5]}
        intensity={2.6}
        color="#fffaf0"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />

      {/* Cool contrasting fill */}
      <directionalLight position={[-4, 3, 2]} intensity={0.7} color="#5ba4e6" />

      {/* Rear rim light to carve aluminum chamfers */}
      <directionalLight position={[0, 4, -5]} intensity={1.9} color="#ffe8b0" />

      {/* Subtle under-glow */}
      <pointLight position={[0, -1, 1]} intensity={0.5} color={accentColor} distance={6} />
    </>
  );
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[3, 0.2, 1.3]} />
      <meshStandardMaterial color="#1a1a1e" wireframe opacity={0.3} transparent />
    </mesh>
  );
}

export default function HeroScene({
  finish,
  isExpanded,
  accentColor = '#e8c97d',
  onHoverPart,
}: HeroSceneProps) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 3.0, 4.8], fov: 36, near: 0.1, far: 50 }}
        shadows
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
          outputColorSpace: THREE.SRGBColorSpace,
          powerPreference: 'high-performance',
        }}
        style={{ background: 'transparent' }}
      >
        <ParallaxCamera />
        <HeroLights accentColor={accentColor} />
        <Environment preset="studio" />

        {/* Soft ground contact shadow */}
        <ContactShadows
          position={[0, -0.15, 0]}
          opacity={0.5}
          scale={7}
          blur={1.6}
          far={3}
          color="#000000"
          frames={1}
        />

        <Suspense fallback={<LoadingFallback />}>
          <HeroModularModel
            finish={finish}
            isExpanded={isExpanded}
            accentColor={accentColor}
            onHoverPart={onHoverPart}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
