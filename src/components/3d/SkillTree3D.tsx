"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Line, Text, Float } from "@react-three/drei";
import * as THREE from "three";

function Node({ position, label, color, unlocked, onClick, isMissing }: any) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group position={position} onClick={onClick} className="cursor-pointer">
        <Sphere ref={meshRef} args={[unlocked ? 0.5 : 0.3, 32, 32]}>
          <meshStandardMaterial 
            color={color} 
            emissive={color} 
            emissiveIntensity={unlocked ? 1.5 : (isMissing ? 1 : 0.2)} 
            transparent
            opacity={unlocked ? 0.9 : 0.6}
            wireframe={!unlocked && !isMissing}
          />
        </Sphere>
        
        {/* Outer Glow */}
        {(unlocked || isMissing) && (
          <Sphere args={[0.7, 16, 16]}>
            <meshBasicMaterial color={color} transparent opacity={0.15} />
          </Sphere>
        )}

        <Text
          position={[0, -0.8, 0]}
          fontSize={0.25}
          color={unlocked ? "white" : (isMissing ? "#FCA5A5" : "gray")}
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

function Connections({ nodes, edges }: { nodes: any[], edges: any[][] }) {
  const points = useMemo(() => {
    const validEdges = edges.filter(edge => {
      const start = nodes.find(n => n.id === edge[0]);
      const end = nodes.find(n => n.id === edge[1]);
      return start && end;
    });

    return validEdges.map(edge => {
      const startNode = nodes.find(n => n.id === edge[0]);
      const endNode = nodes.find(n => n.id === edge[1]);
      return {
        pts: [
          new THREE.Vector3(startNode.position[0], startNode.position[1], startNode.position[2]),
          new THREE.Vector3(endNode.position[0], endNode.position[1], endNode.position[2])
        ],
        color: startNode.status === "acquired" && endNode.status === "acquired" ? startNode.color : "#666",
        opacity: startNode.status === "acquired" && endNode.status === "acquired" ? 0.6 : 0.3
      };
    });
  }, [nodes, edges]);

  return (
    <>
      {points.map((connection, i) => (
        <Line
          key={i}
          points={connection.pts}
          color={connection.color}
          lineWidth={1.5}
          transparent
          opacity={connection.opacity}
        />
      ))}
    </>
  );
}

export function SkillTree3D({ data, onNodeClick }: { data?: any, onNodeClick?: (node: any) => void }) {
  // If no data, render a cool placeholder network
  const skillNodes = useMemo(() => {
    if (!data?.skillNodes) {
      return [
        { id: "core", position: [0, 0, 0], label: "Awaiting Sync...", color: "#3B82F6", status: "acquired" }
      ];
    }

    // Assign simple 3D coordinates based on index (golden spiral layout)
    const count = data.skillNodes.length;
    return data.skillNodes.map((n: any, i: number) => {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      const r = 3 + (Math.random() * 1.5);

      const x = r * Math.cos(theta) * Math.sin(phi);
      const y = r * Math.sin(theta) * Math.sin(phi);
      const z = r * Math.cos(phi);

      const isAcquired = n.status === "acquired";
      return {
        ...n,
        position: [x, y, z],
        color: isAcquired ? "#10B981" : "#EF4444", // Green if acquired, Red if missing
        unlocked: isAcquired,
        isMissing: !isAcquired
      };
    });
  }, [data]);

  const skillEdges = data?.skillEdges || [];

  return (
    <div className="w-full h-full relative min-h-[500px]">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }} className="rounded-[32px] overflow-hidden">
        <color attach="background" args={["#000"]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <group position={[0, 0, 0]}>
          <Connections nodes={skillNodes} edges={skillEdges} />
          {skillNodes.map((node: any) => (
            <Node 
              key={node.id} 
              {...node} 
              onClick={(e: any) => {
                e.stopPropagation();
                if (onNodeClick) onNodeClick(node);
              }}
            />
          ))}
        </group>

        <OrbitControls 
          enablePan={false}
          minDistance={3}
          maxDistance={15}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
      <div className="absolute top-6 left-6 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
             {data ? "Dynamic Path Generated" : "3D Neural Network Standby"}
          </span>
        </div>
      </div>
      {data && (
        <div className="absolute bottom-6 left-6 pointer-events-none flex flex-col gap-2">
           <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#10B981]" /><span className="text-xs text-white">Acquired Skill</span></div>
           <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#EF4444]" /><span className="text-xs text-white">Missing Skill (Click to Learn)</span></div>
        </div>
      )}
    </div>
  );
}
