"use client";

import { useRef, useMemo, Suspense, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sphere, MeshDistortMaterial, Stars, Environment, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

// Smoother animated sphere with glass-like material
function GlassSphere({ position, scale, speed, color }: {
  position: [number, number, number];
  scale: number;
  speed: number;
  color: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialY = position[1];

  useFrame((state) => {
    if (meshRef.current) {
      // Smooth floating motion
      meshRef.current.position.y = initialY + Math.sin(state.clock.elapsedTime * speed * 0.3) * 0.4;
      meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.05;
      meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.08;
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial
        color={color}
        metalness={0.9}
        roughness={0.1}
        envMapIntensity={1}
      />
    </mesh>
  );
}

// Organic distorting sphere
function OrganicSphere({ position, scale, speed, distort, color }: {
  position: [number, number, number];
  scale: number;
  speed: number;
  distort: number;
  color: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.08;
      meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.1;
    }
  });

  return (
    <Float speed={speed * 0.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <Sphere ref={meshRef} args={[1, 64, 64]} scale={scale} position={position}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={distort}
          speed={1.5}
          roughness={0.15}
          metalness={0.85}
        />
      </Sphere>
    </Float>
  );
}

// Elegant particle field
function ParticleField() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 600;

  const [positions, colors, sizes] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Spherical distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 8 + Math.random() * 12;
      
      positions[i3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = r * Math.cos(phi);

      // Subtle purple to blue gradient
      const t = Math.random();
      colors[i3] = 0.45 + t * 0.25;     // R
      colors[i3 + 1] = 0.15 + t * 0.15; // G
      colors[i3 + 2] = 0.75 + t * 0.2;  // B

      sizes[i] = 0.02 + Math.random() * 0.03;
    }

    return [positions, colors, sizes];
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.01;
      particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.05;
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
        size={0.03}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Elegant floating torus rings
function FloatingRings() {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 0.1;
      ring1Ref.current.rotation.z = t * 0.05;
      ring1Ref.current.position.y = 0.5 + Math.sin(t * 0.3) * 0.3;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = -t * 0.08;
      ring2Ref.current.rotation.y = t * 0.06;
      ring2Ref.current.position.y = 1.5 + Math.sin(t * 0.4 + 1) * 0.2;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.y = t * 0.12;
      ring3Ref.current.rotation.z = -t * 0.04;
      ring3Ref.current.position.y = -1 + Math.sin(t * 0.35 + 2) * 0.25;
    }
  });

  return (
    <>
      <mesh ref={ring1Ref} position={[3.5, 0.5, -4]}>
        <torusGeometry args={[2.2, 0.02, 16, 100]} />
        <meshStandardMaterial 
          color="#a855f7" 
          emissive="#a855f7" 
          emissiveIntensity={0.5} 
          transparent 
          opacity={0.7}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      <mesh ref={ring2Ref} position={[-3, 1.5, -3]}>
        <torusGeometry args={[1.8, 0.015, 16, 100]} />
        <meshStandardMaterial 
          color="#7c3aed" 
          emissive="#7c3aed" 
          emissiveIntensity={0.5} 
          transparent 
          opacity={0.7}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      <mesh ref={ring3Ref} position={[0, -1, -5]}>
        <torusGeometry args={[2.8, 0.012, 16, 100]} />
        <meshStandardMaterial 
          color="#c084fc" 
          emissive="#c084fc" 
          emissiveIntensity={0.3} 
          transparent 
          opacity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    </>
  );
}

// Glowing accent orbs
function GlowingOrb({ position, scale, color, speed = 1 }: { 
  position: [number, number, number]; 
  scale: number; 
  color: string;
  speed?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialY = position[1];

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = initialY + Math.sin(state.clock.elapsedTime * speed * 0.5) * 0.4;
      // Pulsing scale
      const pulse = 1 + Math.sin(state.clock.elapsedTime * speed) * 0.1;
      meshRef.current.scale.setScalar(scale * pulse);
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.2}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}

// Neural network lines connecting points
function NeuralConnections() {
  const linesRef = useRef<THREE.Group>(null);
  
  const points = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i < 8; i++) {
      pts.push([
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 6,
        -3 - Math.random() * 4
      ]);
    }
    return pts;
  }, []);

  const connections = useMemo(() => {
    const conns: { start: [number, number, number]; end: [number, number, number] }[] = [];
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dist = Math.sqrt(
          Math.pow(points[i][0] - points[j][0], 2) +
          Math.pow(points[i][1] - points[j][1], 2) +
          Math.pow(points[i][2] - points[j][2], 2)
        );
        if (dist < 6) {
          conns.push({ start: points[i], end: points[j] });
        }
      }
    }
    return conns;
  }, [points]);

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <group ref={linesRef}>
      {points.map((point, i) => (
        <mesh key={i} position={point}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial 
            color="#a855f7" 
            emissive="#a855f7" 
            emissiveIntensity={0.8}
          />
        </mesh>
      ))}
      {connections.map((conn, i) => {
        const midPoint = [
          (conn.start[0] + conn.end[0]) / 2,
          (conn.start[1] + conn.end[1]) / 2,
          (conn.start[2] + conn.end[2]) / 2
        ];
        const direction = new THREE.Vector3(
          conn.end[0] - conn.start[0],
          conn.end[1] - conn.start[1],
          conn.end[2] - conn.start[2]
        );
        const length = direction.length();
        direction.normalize();
        
        return (
          <mesh 
            key={`line-${i}`} 
            position={midPoint as [number, number, number]}
            quaternion={new THREE.Quaternion().setFromUnitVectors(
              new THREE.Vector3(0, 1, 0),
              direction
            )}
          >
            <cylinderGeometry args={[0.005, 0.005, length, 8]} />
            <meshStandardMaterial 
              color="#7c3aed" 
              emissive="#7c3aed" 
              emissiveIntensity={0.4}
              transparent
              opacity={0.4}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function Scene() {
  return (
    <>
      {/* Ambient and point lighting */}
      <ambientLight intensity={0.15} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#a855f7" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#7c3aed" />
      <pointLight position={[0, 5, 5]} intensity={0.7} color="#c084fc" />
      <spotLight
        position={[0, 15, 0]}
        angle={0.3}
        penumbra={1}
        intensity={1.2}
        color="#a855f7"
      />

      {/* Main organic spheres */}
      <OrganicSphere
        position={[4, 0.5, -5]}
        scale={1.5}
        speed={1}
        distort={0.35}
        color="#a855f7"
      />
      <OrganicSphere
        position={[-4, -0.5, -4]}
        scale={1.1}
        speed={1.4}
        distort={0.3}
        color="#7c3aed"
      />
      <OrganicSphere
        position={[0, 2.5, -6]}
        scale={0.8}
        speed={1.8}
        distort={0.4}
        color="#c084fc"
      />

      {/* Glass spheres for depth */}
      <GlassSphere
        position={[-2.5, -1.5, -3]}
        scale={0.6}
        speed={1.2}
        color="#9333ea"
      />
      <GlassSphere
        position={[2, -2, -4]}
        scale={0.45}
        speed={1.5}
        color="#a855f7"
      />

      {/* Glowing accent orbs */}
      <GlowingOrb position={[5.5, 2, -7]} scale={0.12} color="#a855f7" speed={0.8} />
      <GlowingOrb position={[-5.5, 3, -6]} scale={0.08} color="#7c3aed" speed={1.2} />
      <GlowingOrb position={[2.5, -3, -5]} scale={0.1} color="#c084fc" speed={1} />
      <GlowingOrb position={[-3, 1, -4]} scale={0.06} color="#9333ea" speed={1.4} />

      {/* Decorative elements */}
      <FloatingRings />
      <NeuralConnections />
      <ParticleField />
      <Stars radius={100} depth={60} count={1000} factor={3} saturation={0.3} fade speed={0.5} />
    </>
  );
}

export function Hero3DScene() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) {
    return <div className="absolute inset-0 -z-10 bg-background" />;
  }

  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        dpr={[1, 2]}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
      {/* Gradient overlays for depth and blending */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-transparent to-background pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/20 via-transparent to-background/20 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--background)_70%)] pointer-events-none" />
    </div>
  );
}
