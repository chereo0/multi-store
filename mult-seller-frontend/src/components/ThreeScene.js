import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Enhanced floating geometric shapes component
function FloatingShape({ position, color, shape = 'box', isActive = false, index = 0 }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      const speed = isActive ? 3 : 0.8;
      const amplitude = isActive ? 1.5 : 0.7;
      const time = state.clock.elapsedTime;
      const offset = index * 0.5; // Stagger animations
      
      // More complex rotation patterns
      meshRef.current.rotation.x = Math.sin(time * speed + offset) * 0.4 + Math.cos(time * speed * 0.3) * 0.2;
      meshRef.current.rotation.y = Math.sin(time * speed * 0.7 + offset) * 0.6 + Math.cos(time * speed * 0.2) * 0.3;
      meshRef.current.rotation.z = Math.sin(time * speed * 0.4 + offset) * 0.3;
      
      // Enhanced floating motion
      meshRef.current.position.y = position[1] + 
        Math.sin(time * speed * 0.8 + offset) * amplitude +
        Math.cos(time * speed * 0.3 + offset) * (amplitude * 0.5);
      
      meshRef.current.position.x = position[0] + 
        Math.sin(time * speed * 0.2 + offset) * 0.3;
      
      meshRef.current.position.z = position[2] + 
        Math.cos(time * speed * 0.15 + offset) * 0.2;
      
      // Dynamic scaling with interaction
      const baseScale = isActive ? 1.2 : 0.8;
      const pulseScale = Math.sin(time * (isActive ? 4 : 2) + offset) * 0.3;
      const hoverScale = hovered ? 0.2 : 0;
      meshRef.current.scale.setScalar(baseScale + pulseScale + hoverScale);
    }
  });

  const geometry = useMemo(() => {
    switch (shape) {
      case 'sphere':
        return new THREE.SphereGeometry(0.8, 32, 32);
      case 'torus':
        return new THREE.TorusGeometry(0.6, 0.3, 16, 32);
      case 'octahedron':
        return new THREE.OctahedronGeometry(0.7, 2);
      case 'dodecahedron':
        return new THREE.DodecahedronGeometry(0.7, 2);
      case 'icosahedron':
        return new THREE.IcosahedronGeometry(0.7, 1);
      case 'tetrahedron':
        return new THREE.TetrahedronGeometry(0.8, 0);
      default:
        return new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
    }
  }, [shape]);

  return (
    <mesh 
      ref={meshRef} 
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <primitive object={geometry} />
      <meshStandardMaterial 
        color={color} 
        transparent 
        opacity={isActive ? 0.9 : 0.7}
        roughness={isActive ? 0.1 : 0.4}
        metalness={isActive ? 0.9 : 0.6}
        emissive={isActive ? color : '#000000'}
        emissiveIntensity={isActive ? 0.4 : 0.1}
        wireframe={hovered}
      />
    </mesh>
  );
}

// Enhanced animated background particles with colors
function Particles({ count = 150, formInteraction = 0 }) {
  const points = useRef();
  
  const { particlesPosition, particleColors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const colorPalette = [
      [0.231, 0.510, 0.965],  // Primary Blue #3B82F6
      [0.961, 0.620, 0.043],  // Secondary Amber #F59E0B
      [0.067, 0.094, 0.153],  // Dark Text #111827
      [0.420, 0.447, 0.502],  // Muted Text #6B7280
      [0.976, 0.980, 0.984],  // Background #F9FAFB
      [0.145, 0.400, 0.800],  // Darker Blue variant
    ];
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 25;
      
      const colorIndex = Math.floor(Math.random() * colorPalette.length);
      const color = colorPalette[colorIndex];
      colors[i * 3] = color[0];
      colors[i * 3 + 1] = color[1];
      colors[i * 3 + 2] = color[2];
    }
    return { particlesPosition: positions, particleColors: colors };
  }, [count]);

  useFrame((state) => {
    if (points.current) {
      const time = state.clock.elapsedTime;
      const interactionSpeed = 0.1 + formInteraction * 0.05;
      
      points.current.rotation.y = time * interactionSpeed;
      points.current.rotation.x = time * (interactionSpeed * 0.5);
      points.current.rotation.z = Math.sin(time * 0.1) * 0.1;
      
      // Pulsing effect based on interaction
      const scale = 1 + Math.sin(time * 2) * 0.1 + formInteraction * 0.05;
      points.current.scale.setScalar(scale);
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particlesPosition}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={particleColors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.08 + formInteraction * 0.02} 
        transparent 
        opacity={0.8} 
        vertexColors
        sizeAttenuation
      />
    </points>
  );
}

// Enhanced 3D Scene component with more shapes and effects
function Scene3D({ formInteraction = 0 }) {
  const [activeShapes, setActiveShapes] = useState(new Set());
  
  useEffect(() => {
    // More dynamic shape activation based on form interaction
    const shapes = [0, 1, 2, 3, 4, 5, 6, 7];
    const numActive = Math.min(Math.floor(formInteraction / 1.5) + 2, shapes.length);
    const shuffled = shapes.sort(() => 0.5 - Math.random());
    setActiveShapes(new Set(shuffled.slice(0, numActive)));
  }, [formInteraction]);

  return (
    <>
      {/* Enhanced Dynamic Lighting with new color palette */}
      <ambientLight intensity={0.4 + formInteraction * 0.15} color="#F9FAFB" />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={0.8 + formInteraction * 0.3} 
        color="#F59E0B" 
        castShadow
      />
      <pointLight 
        position={[-10, -10, -5]} 
        color="#3B82F6" 
        intensity={0.6 + formInteraction * 0.2} 
      />
      <pointLight 
        position={[5, -5, 3]} 
        color="#F59E0B" 
        intensity={0.4 + formInteraction * 0.15} 
      />
      <pointLight 
        position={[-5, 5, -3]} 
        color="#3B82F6" 
        intensity={0.5 + formInteraction * 0.1} 
      />
      
      {/* Enhanced floating shapes with new color palette */}
      <FloatingShape position={[-3, 2, -2]} color="#3B82F6" shape="dodecahedron" isActive={activeShapes.has(0)} index={0} />
      <FloatingShape position={[3, -1, -3]} color="#F59E0B" shape="icosahedron" isActive={activeShapes.has(1)} index={1} />
      <FloatingShape position={[-2, -2, -1]} color="#3B82F6" shape="torus" isActive={activeShapes.has(2)} index={2} />
      <FloatingShape position={[2, 3, -4]} color="#F59E0B" shape="octahedron" isActive={activeShapes.has(3)} index={3} />
      <FloatingShape position={[0, 0, -5]} color="#3B82F6" shape="tetrahedron" isActive={activeShapes.has(4)} index={4} />
      <FloatingShape position={[-4, 0, -3]} color="#F59E0B" shape="sphere" isActive={activeShapes.has(5)} index={5} />
      <FloatingShape position={[4, 1, -2]} color="#3B82F6" shape="box" isActive={activeShapes.has(6)} index={6} />
      <FloatingShape position={[0, -3, -4]} color="#F59E0B" shape="dodecahedron" isActive={activeShapes.has(7)} index={7} />
      
      {/* Enhanced background particles */}
      <Particles count={80 + formInteraction * 15} formInteraction={formInteraction} />
    </>
  );
}

// Main component that renders the Canvas
export default function ThreeScene({ formInteraction = 0 }) {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 75 }}
        style={{ background: 'transparent' }}
        performance={{ min: 0.5 }}
      >
        <Scene3D formInteraction={formInteraction} />
      </Canvas>
    </div>
  );
}
