"use client";

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sphere, MeshDistortMaterial, Stars, Environment } from "@react-three/drei";
import * as THREE from "three";

function AnimatedSphere({ position, scale, speed, distort, color }: {
  position: [number, number, number];
  scale: number;
  speed: number;
  distort: number;
  color: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.1;
      meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.15;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere ref={meshRef} args={[1, 64, 64]} scale={scale} position={position}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={distort}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
}

function ParticleField() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 800;

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 25;
      positions[i3 + 1] = (Math.random() - 0.5) * 25;
      positions[i3 + 2] = (Math.random() - 0.5) * 25;

      // Purple to violet gradient
      colors[i3] = 0.55 + Math.random() * 0.25;
      colors[i3 + 1] = 0.2 + Math.random() * 0.2;
      colors[i3 + 2] = 0.85 + Math.random() * 0.15;
    }

    return [positions, colors];
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.015;
      particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.1;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
}

function FloatingRings() {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = state.clock.elapsedTime * 0.15;
      ring1Ref.current.rotation.z = state.clock.elapsedTime * 0.08;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = -state.clock.elapsedTime * 0.12;
      ring2Ref.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.y = state.clock.elapsedTime * 0.18;
      ring3Ref.current.rotation.z = -state.clock.elapsedTime * 0.06;
    }
  });

  return (
    <>
      <mesh ref={ring1Ref} position={[3, 0.5, -3]}>
        <torusGeometry args={[2, 0.015, 16, 100]} />
        <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={0.6} transparent opacity={0.8} />
      </mesh>
      <mesh ref={ring2Ref} position={[-2.5, 1.5, -2]}>
        <torusGeometry args={[1.5, 0.015, 16, 100]} />
        <meshStandardMaterial color="#7c3aed" emissive="#7c3aed" emissiveIntensity={0.6} transparent opacity={0.8} />
      </mesh>
      <mesh ref={ring3Ref} position={[0, -1, -4]}>
        <torusGeometry args={[2.5, 0.012, 16, 100]} />
        <meshStandardMaterial color="#c084fc" emissive="#c084fc" emissiveIntensity={0.4} transparent opacity={0.6} />
      </mesh>
    </>
  );
}

function GlowingOrb({ position, scale, color }: { position: [number, number, number]; scale: number; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[scale, 32, 32]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1}
        transparent
        opacity={0.5}
      />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1.2} color="#a855f7" />
      <pointLight position={[-10, -10, -10]} intensity={0.6} color="#7c3aed" />
      <pointLight position={[0, 5, 5]} intensity={0.8} color="#c084fc" />
      <spotLight
        position={[0, 15, 0]}
        angle={0.4}
        penumbra={1}
        intensity={1.5}
        color="#a855f7"
      />

      {/* Main spheres */}
      <AnimatedSphere
        position={[4, 1, -4]}
        scale={1.4}
        speed={1.2}
        distort={0.35}
        color="#a855f7"
      />
      <AnimatedSphere
        position={[-4, -0.5, -3]}
        scale={1}
        speed={1.8}
        distort={0.3}
        color="#7c3aed"
      />
      <AnimatedSphere
        position={[0, 3, -5]}
        scale={0.7}
        speed={2.2}
        distort={0.45}
        color="#c084fc"
      />
      <AnimatedSphere
        position={[-2, -2, -2]}
        scale={0.5}
        speed={2.5}
        distort={0.5}
        color="#9333ea"
      />

      {/* Glowing orbs */}
      <GlowingOrb position={[5, 2, -6]} scale={0.15} color="#a855f7" />
      <GlowingOrb position={[-5, 3, -5]} scale={0.1} color="#7c3aed" />
      <GlowingOrb position={[2, -3, -4]} scale={0.12} color="#c084fc" />

      <FloatingRings />
      <ParticleField />
      <Stars radius={80} depth={60} count={1500} factor={4} saturation={0} fade speed={0.8} />
    </>
  );
}

export function Hero3DScene() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 55 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/30 via-transparent to-background/30 pointer-events-none" />
    </div>
  );
}
