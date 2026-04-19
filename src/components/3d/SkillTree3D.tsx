"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Line, Text, Float } from "@react-three/drei";
import * as THREE from "three";

// Simulated RPG Skill Tree Data
const nodes = [
  { id: 0, position: [0, 0, 0], label: "Core Developer", color: "#8B5CF6", unlocked: true },
  
  // Frontend Path
  { id: 1, position: [-2, 2, 0], label: "Frontend", color: "#3B82F6", unlocked: true },
  { id: 2, position: [-3, 4, 1], label: "React Native", color: "#3B82F6", unlocked: false },
  { id: 3, position: [-1, 4, -1], label: "WebGL/3D", color: "#3B82F6", unlocked: false },

  // Backend Path
  { id: 4, position: [2, 2, 0], label: "Backend", color: "#10B981", unlocked: true },
  { id: 5, position: [3, 4, 1], label: "Microservices", color: "#10B981", unlocked: false },
  { id: 6, position: [1, 4, -1], label: "Database Internals", color: "#10B981", unlocked: false },

  // Advanced Path
  { id: 7, position: [0, 6, 0], label: "Principal Architect", color: "#F59E0B", unlocked: false },
];

const edges = [
  [0, 1], [0, 4],
  [1, 2], [1, 3],
  [4, 5], [4, 6],
  [2, 7], [3, 7], [5, 7], [6, 7]
];

function Node({ position, label, color, unlocked }: any) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current && unlocked) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group position={position}>
        <Sphere ref={meshRef} args={[unlocked ? 0.4 : 0.2, 32, 32]}>
          <meshStandardMaterial 
            color={color} 
            emissive={color} 
            emissiveIntensity={unlocked ? 2 : 0.2} 
            transparent
            opacity={unlocked ? 0.9 : 0.3}
            wireframe={!unlocked}
          />
        </Sphere>
        
        {/* Outer Glow for unlocked nodes */}
        {unlocked && (
          <Sphere args={[0.6, 16, 16]}>
            <meshBasicMaterial color={color} transparent opacity={0.1} />
          </Sphere>
        )}

        <Text
          position={[0, -0.8, 0]}
          fontSize={0.25}
          color={unlocked ? "white" : "gray"}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000"
        >
          {label}
        </Text>
      </group>
    </Float>
  );
}

function Connections() {
  const points = useMemo(() => {
    return edges.map(([start, end]) => [
      new THREE.Vector3(nodes[start].position[0], nodes[start].position[1], nodes[start].position[2]),
      new THREE.Vector3(nodes[end].position[0], nodes[end].position[1], nodes[end].position[2])
    ]);
  }, []);

  return (
    <>
      {points.map((pts, i) => {
        const startNode = nodes[edges[i][0]];
        const endNode = nodes[edges[i][1]];
        const isUnlocked = startNode.unlocked && endNode.unlocked;
        
        return (
          <Line
            key={i}
            points={pts}
            color={isUnlocked ? startNode.color : "#333"}
            lineWidth={isUnlocked ? 2 : 1}
            dashed={!isUnlocked}
            dashScale={5}
            transparent
            opacity={isUnlocked ? 0.6 : 0.2}
          />
        );
      })}
    </>
  );
}

export function SkillTree3D() {
  return (
    <div className="w-full h-full relative min-h-[500px]">
      <Canvas camera={{ position: [0, 2, 8], fov: 60 }} className="rounded-[32px] overflow-hidden">
        <color attach="background" args={["#000"]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <group position={[0, -2, 0]}>
          <Connections />
          {nodes.map((node) => (
            <Node key={node.id} {...node} />
          ))}
        </group>

        <OrbitControls 
          enablePan={false}
          minDistance={3}
          maxDistance={15}
          maxPolarAngle={Math.PI / 1.5}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
      <div className="absolute top-6 left-6 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">3D Neural Network</span>
        </div>
      </div>
    </div>
  );
}
