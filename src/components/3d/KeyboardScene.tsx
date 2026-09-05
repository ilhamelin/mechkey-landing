'use client';
import { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows, PerformanceMonitor, Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import KeyboardModel from './KeyboardModel';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EffectComposerAny = EffectComposer as React.ComponentType<any>;

interface KeyboardSceneProps {
  scrollProgress: number;
}

function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={2.2}
        color="#fff8e7"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={18}
        shadow-camera-near={0.1}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
      />
      <directionalLight position={[-4, 2, -3]} intensity={0.5} color="#4a90d9" />
      <pointLight position={[0, -2, 2]} intensity={0.3} color="#e8c97d" />
    </>
  );
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[3, 0.2, 1.2]} />
      <meshStandardMaterial color="#1a1a1a" wireframe opacity={0.3} transparent />
    </mesh>
  );
}

function ResponsiveCameraController() {
  const { camera, size } = useThree();
  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      const isMobile = size.width < 768;
      if (isMobile) {
        camera.position.set(0, 2.0, 7.8);
        camera.fov = 46;
      } else {
        camera.position.set(0, 1.9, 6.2);
        camera.fov = 42;
      }
      camera.updateProjectionMatrix();
    }
  }, [camera, size.width]);
  return null;
}

// Cinematic camera: smoothly orbits the keyboard as user scrolls
function CinematicCamera({ scrollProgress }: { scrollProgress: number }) {
  const { camera, size } = useThree();
  const smoothed = useRef(0);

  useFrame((_, delta) => {
    // Smooth the scroll progress
    smoothed.current += (scrollProgress - smoothed.current) * (1 - Math.pow(0.005, delta));
    const s = smoothed.current;
    const isMobile = size.width < 768;

    // Base position
    const baseX = 0;
    const baseY = isMobile ? 2.0 : 1.9;
    const baseZ = isMobile ? 7.8 : 6.2;

    // Cinematic orbit: x shifts left → right, y tilts up, z zooms out slightly
    const targetX = baseX + Math.sin(s * Math.PI) * 0.8;
    const targetY = baseY + s * 0.6;
    const targetZ = baseZ + s * 0.5;

    camera.position.x += (targetX - camera.position.x) * 0.08;
    camera.position.y += (targetY - camera.position.y) * 0.06;
    camera.position.z += (targetZ - camera.position.z) * 0.06;

    // Always look slightly toward keyboard center
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export default function KeyboardScene({ scrollProgress }: KeyboardSceneProps) {
  // State-based DPR so PerformanceMonitor can actually update the canvas
  const [dpr, setDpr] = useState<number>(1.5);

  return (
    <Canvas
      camera={{ position: [0, 1.9, 6.2], fov: 42, near: 0.1, far: 80 }}
      shadows
      dpr={dpr}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.15,
        outputColorSpace: THREE.SRGBColorSpace,
        powerPreference: 'high-performance',
      }}
      onCreated={({ gl }) => {
        gl.shadowMap.type = THREE.PCFShadowMap;
      }}
      style={{ background: 'transparent', pointerEvents: 'none' }}
      frameloop="always"
    >
      <ResponsiveCameraController />
      <CinematicCamera scrollProgress={scrollProgress} />

      {/* Adaptive DPR — react to GPU load */}
      <PerformanceMonitor
        factor={0.5}
        onDecline={() => setDpr(Math.max(0.8, dpr - 0.25))}
        onIncline={() => setDpr(Math.min(2, dpr + 0.25))}
      />

      <SceneLights />

      {/* Studio environment for PBR reflections */}
      <Environment preset="studio" />

      {/* Soft shadow on ground */}
      <ContactShadows
        position={[0, -2.2, 0]}
        opacity={0.45}
        scale={10}
        blur={1.8}
        far={4}
        color="#000000"
        frames={1}
      />

      <Suspense fallback={<LoadingFallback />}>
        <KeyboardModel scrollProgress={scrollProgress} />
      </Suspense>

      {/* Cinematic ambient dust motes */}
      <Sparkles
        count={50}
        scale={[7, 4.5, 5]}
        size={2.2}
        speed={0.35}
        opacity={0.32}
        color="#e8c97d"
      />
      <Sparkles
        count={30}
        scale={[6, 4, 4]}
        size={1.4}
        speed={0.2}
        opacity={0.2}
        color="#ffffff"
      />

      {/* Lightweight post-processing — only Bloom */}
      <EffectComposerAny multisampling={0}>
        <Bloom
          intensity={0.35}
          luminanceThreshold={0.85}
          luminanceSmoothing={0.95}
          blendFunction={BlendFunction.ADD}
          mipmapBlur
        />
      </EffectComposerAny>
    </Canvas>
  );
}
