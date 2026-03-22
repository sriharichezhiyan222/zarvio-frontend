"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sphere, MeshDistortMaterial, Stars } from "@react-three/drei";
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
  const count = 500;

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 20;
      positions[i3 + 1] = (Math.random() - 0.5) * 20;
      positions[i3 + 2] = (Math.random() - 0.5) * 20;

      // Purple to blue gradient
      colors[i3] = 0.6 + Math.random() * 0.2;
      colors[i3 + 1] = 0.2 + Math.random() * 0.3;
      colors[i3 + 2] = 0.8 + Math.random() * 0.2;
    }

    return [positions, colors];
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
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
        size={0.05}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

function FloatingRings() {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = state.clock.elapsedTime * 0.2;
      ring1Ref.current.rotation.z = state.clock.elapsedTime * 0.1;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = -state.clock.elapsedTime * 0.15;
      ring2Ref.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <>
      <mesh ref={ring1Ref} position={[2, 0, -2]}>
        <torusGeometry args={[1.5, 0.02, 16, 100]} />
        <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={0.5} />
      </mesh>
      <mesh ref={ring2Ref} position={[-2, 1, -1]}>
        <torusGeometry args={[1, 0.02, 16, 100]} />
        <meshStandardMaterial color="#7c3aed" emissive="#7c3aed" emissiveIntensity={0.5} />
      </mesh>
    </>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#a855f7" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#7c3aed" />
      <spotLight
        position={[0, 10, 0]}
        angle={0.3}
        penumbra={1}
        intensity={1}
        color="#c084fc"
      />

      <AnimatedSphere
        position={[3, 1, -3]}
        scale={1.2}
        speed={1.5}
        distort={0.4}
        color="#a855f7"
      />
      <AnimatedSphere
        position={[-3, -1, -2]}
        scale={0.8}
        speed={2}
        distort={0.3}
        color="#7c3aed"
      />
      <AnimatedSphere
        position={[0, 2, -4]}
        scale={0.5}
        speed={2.5}
        distort={0.5}
        color="#c084fc"
      />

      <FloatingRings />
      <ParticleField />
      <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
    </>
  );
}

export function HeroScene() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene />
      </Canvas>
      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background pointer-events-none" />
    </div>
  );
}
