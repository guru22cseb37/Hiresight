"use client";

import React, { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { CameraControls, Sphere, Line, Text, Float } from "@react-three/drei";
import * as THREE from "three";

// ─────────────────────────────────────────────
// Node component — individual skill sphere
// ─────────────────────────────────────────────
function Node({ position, label, color, unlocked, onClick, isMissing }: any) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group 
        position={position} 
        onClick={onClick} 
        onPointerOver={() => { document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { document.body.style.cursor = "auto"; }}
      >
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
          position={[0, -0.85, 0]}
          fontSize={0.22}
          color={unlocked ? "white" : (isMissing ? "#FCA5A5" : "#888")}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000"
          maxWidth={3}
        >
          {label}
        </Text>
      </group>
    </Float>
  );
}

// ─────────────────────────────────────────────
// Edges between nodes
// ─────────────────────────────────────────────
function Connections({ nodes, edges }: { nodes: any[]; edges: any[][] }) {
  const connections = useMemo(() => {
    return edges
      .map((edge) => {
        const start = nodes.find((n) => n.id === edge[0]);
        const end = nodes.find((n) => n.id === edge[1]);
        if (!start || !end) return null;
        return {
          pts: [
            new THREE.Vector3(...start.position),
            new THREE.Vector3(...end.position),
          ],
          color:
            start.status === "acquired" && end.status === "acquired"
              ? start.color
              : "#444",
          opacity:
            start.status === "acquired" && end.status === "acquired" ? 0.6 : 0.25,
        };
      })
      .filter(Boolean) as { pts: THREE.Vector3[]; color: string; opacity: number }[];
  }, [nodes, edges]);

  return (
    <>
      {connections.map((c, i) => (
        <Line
          key={i}
          points={c.pts}
          color={c.color}
          lineWidth={1.5}
          transparent
          opacity={c.opacity}
        />
      ))}
    </>
  );
}

// ─────────────────────────────────────────────
// Demo placeholder network shown before sync
// ─────────────────────────────────────────────
const PLACEHOLDER_NODES = [
  { id: "ml",  position: [ 2.5,  1.5,  0],   label: "Machine Learning",   color: "#3B82F6", status: "acquired" },
  { id: "ds",  position: [-2.5,  1.5,  0],   label: "Data Structures",    color: "#10B981", status: "acquired" },
  { id: "py",  position: [ 0.5,  0,    1],   label: "Python",             color: "#10B981", status: "acquired" },
  { id: "js",  position: [ 2,   -1.5,  0],   label: "JavaScript",         color: "#F59E0B", status: "missing" },
  { id: "dl",  position: [ 0,   -2,    0],   label: "Deep Learning",      color: "#EF4444", status: "missing" },
  { id: "cc",  position: [ 3.5,  0,   -1],   label: "Cloud Computing",    color: "#EF4444", status: "missing" },
  { id: "tm",  position: [-1.5, -1,    0],   label: "Team Management",    color: "#8B5CF6", status: "acquired" },
];
const PLACEHOLDER_EDGES = [
  ["ml", "py"], ["ds", "py"], ["py", "dl"], ["ml", "dl"],
  ["js", "cc"], ["tm", "js"], ["ml", "cc"],
];

// ─────────────────────────────────────────────
// Main exported component
// ─────────────────────────────────────────────
export function SkillTree3D({
  data,
  onNodeClick,
}: {
  data?: any;
  onNodeClick?: (node: any) => void;
}) {
  const [contextLost, setContextLost] = useState(false);

  // Build nodes from data or fall back to placeholder
  const skillNodes = useMemo(() => {
    if (!data?.skillNodes) {
      return PLACEHOLDER_NODES.map((n) => ({
        ...n,
        unlocked: n.status === "acquired",
        isMissing: n.status === "missing",
      }));
    }

    const count = data.skillNodes.length;
    return data.skillNodes.map((n: any, i: number) => {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      const r = 3 + Math.random() * 1.5;
      return {
        ...n,
        position: [
          r * Math.cos(theta) * Math.sin(phi),
          r * Math.sin(theta) * Math.sin(phi),
          r * Math.cos(phi),
        ],
        color: n.status === "acquired" ? "#10B981" : "#EF4444",
        unlocked: n.status === "acquired",
        isMissing: n.status !== "acquired",
      };
    });
  }, [data]);

  const skillEdges: any[][] = data?.skillEdges || PLACEHOLDER_EDGES;

  return (
    <div
      className="w-full h-full relative"
      style={{
        background: "#000",
        borderRadius: "28px",
        overflow: "hidden",
        minHeight: "500px",
      }}
    >
      {/* Hard black backdrop — prevents any white flash */}
      <div
        className="absolute inset-0"
        style={{ background: "#000", zIndex: 0 }}
      />

      {contextLost ? (
        // Graceful fallback when WebGL context is unavailable
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10">
          <div className="w-16 h-16 rounded-2xl bg-violet-600/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
            </svg>
          </div>
          <p className="text-slate-400 text-sm font-medium">3D Neural Network</p>
          <p className="text-slate-600 text-xs">WebGL context unavailable — try refreshing.</p>
          <button
            onClick={() => { setContextLost(false); }}
            className="mt-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded-xl transition-colors"
          >
            Retry
          </button>
        </div>
      ) : (
        <Canvas
          camera={{ position: [0, 0, 10], fov: 60 }}
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            inset: 0,
            background: "#000",
            zIndex: 1,
          }}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: "high-performance",
            failIfMajorPerformanceCaveat: false,
          }}
          onCreated={({ gl }) => {
            gl.setClearColor(new THREE.Color("#000000"), 1);
            const canvas = gl.domElement;
            canvas.addEventListener("webglcontextlost", () => setContextLost(true));
          }}
        >
          <color attach="background" args={["#000000"]} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <pointLight position={[0, 0, 10]} intensity={0.3} color="#6366f1" />

          <group position={[0, 0, 0]}>
            <Connections nodes={skillNodes} edges={skillEdges} />
            {skillNodes.map((node: any) => (
              <Node
                key={node.id}
                {...node}
                onClick={(e: any) => {
                  e.stopPropagation();
                  const controls = (window as any).cameraControls;
                  if (controls) {
                    controls.setLookAt(
                      node.position[0], node.position[1], node.position[2] + 5,
                      node.position[0], node.position[1], node.position[2],
                      true
                    );
                  }
                  if (onNodeClick) onNodeClick(node);
                }}
              />
            ))}
          </group>

          <CameraControls
            ref={(ref) => { (window as any).cameraControls = ref; }}
            makeDefault
            minDistance={3}
            maxDistance={18}
          />
        </Canvas>
      )}

      {/* Status badge */}
      <div className="absolute top-5 left-5 pointer-events-none z-20">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-sm">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
            {data ? "Dynamic Path Generated" : "3D Neural Network Standby"}
          </span>
        </div>
      </div>

      {/* Legend */}
      {(data || true) && (
        <div className="absolute bottom-5 left-5 pointer-events-none z-20 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#10B981]" />
            <span className="text-xs text-white/70 font-medium">Acquired Skill</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
            <span className="text-xs text-white/70 font-medium">Missing Skill (Click to Learn)</span>
          </div>
        </div>
      )}
    </div>
  );
}
