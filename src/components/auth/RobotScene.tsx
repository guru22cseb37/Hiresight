"use client";

import React, { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { 
  Float, 
  Environment, 
  ContactShadows, 
  PerspectiveCamera, 
  Text,
  useTexture,
  Html
} from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

interface RobotProps {
  isPasswordFocused: boolean;
  isLoggedIn: boolean;
}

// Sound generator utility
const playRobotSound = (type: 'focus' | 'blur') => {
  if (typeof window === 'undefined') return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(type === 'focus' ? 440 : 220, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(type === 'focus' ? 880 : 110, ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {
    // Ignore audio errors in production
  }
};

function RobotContent({ isPasswordFocused, isLoggedIn }: RobotProps) {
  const bodyRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  
  const leftShoulderRef = useRef<THREE.Group>(null);
  const rightShoulderRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const logoPlateRef = useRef<THREE.Group>(null);

  // Load texture with a fallback handler
  const logoTexture = useTexture("/logo.png");

  const [welcomeVisible, setWelcomeVisible] = useState(false);

  useEffect(() => {
    const ls = leftShoulderRef.current;
    const rs = rightShoulderRef.current;
    const la = leftArmRef.current;
    const ra = rightArmRef.current;
    const le = leftEyeRef.current;
    const re = rightEyeRef.current;
    const lp = logoPlateRef.current;
    const h = headRef.current;

    if (!ls || !rs || !la || !ra || !le || !re || !lp || !h) return;

    if (isPasswordFocused) {
      playRobotSound('focus');
      const tl = gsap.timeline({ defaults: { duration: 0.4, ease: "back.out(1.7)" } });
      tl.to(le.scale, { y: 0.01 }, 0);
      tl.to(re.scale, { y: 0.01 }, 0);
      tl.to(h.rotation, { x: 0.3 }, 0);
      tl.to(lp.position, { y: 2.1, z: 0.2 }, 0);
    } else {
      playRobotSound('blur');
      const tl = gsap.timeline({ defaults: { duration: 0.4, ease: "power2.out" } });
      tl.to(le.scale, { y: 1 }, 0);
      tl.to(re.scale, { y: 1 }, 0);
      tl.to(h.rotation, { x: 0 }, 0);
      tl.to(lp.position, { y: 2.4, z: 0 }, 0);
    }
  }, [isPasswordFocused]);

  useEffect(() => {
    if (isLoggedIn) {
      setTimeout(() => setWelcomeVisible(true), 500);
    }
  }, [isLoggedIn]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (bodyRef.current) {
      bodyRef.current.position.y = Math.sin(time * 1.5) * 0.1;
      if (!isPasswordFocused && !isLoggedIn) {
        bodyRef.current.rotation.y = Math.sin(time * 2) * 0.05;
      }
    }

    if (!isPasswordFocused && leftEyeRef.current && rightEyeRef.current) {
      const blink = Math.sin(time * 5) > 0.98;
      const targetScale = blink ? 0.1 : 1;
      leftEyeRef.current.scale.y = THREE.MathUtils.lerp(leftEyeRef.current.scale.y, targetScale, 0.4);
      rightEyeRef.current.scale.y = THREE.MathUtils.lerp(rightEyeRef.current.scale.y, targetScale, 0.4);
    }

    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, state.mouse.x * 0.5, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 1.2 + state.mouse.y * 0.2, 0.05);
    state.camera.lookAt(0, 1.2, 0);
  });

  const bodyColor = "#FFFFFF";
  const eyeColor = "#3B82F6";

  return (
    <group ref={bodyRef}>
      <group ref={logoPlateRef} position={[0, 2.4, 0]}>
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
          <mesh castShadow>
            <boxGeometry args={[1.0, 1.0, 0.05]} />
            <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0, 0.03]}>
            <planeGeometry args={[0.9, 0.9]} />
            <meshStandardMaterial 
              map={logoTexture} 
              emissiveMap={logoTexture} 
              emissiveIntensity={1.5}
              transparent 
              emissive={new THREE.Color("#FFFFFF")}
            />
          </mesh>
          <mesh position={[-0.45, -0.7, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 1.2]} />
            <meshStandardMaterial color="#CBD5E1" />
          </mesh>
          <mesh position={[0.45, -0.7, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 1.2]} />
            <meshStandardMaterial color="#CBD5E1" />
          </mesh>
        </Float>
      </group>

      <group ref={headRef} position={[0, 1.6, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1, 0.9, 0.8]} />
          <meshStandardMaterial color={bodyColor} metalness={0.6} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0, 0.41]}>
          <planeGeometry args={[0.85, 0.7]} />
          <meshStandardMaterial color="#020617" />
        </mesh>
        <group position={[0, 0, 0.42]}>
          <mesh ref={leftEyeRef} position={[-0.25, 0.05, 0]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color={eyeColor} emissive={eyeColor} emissiveIntensity={4} />
          </mesh>
          <mesh ref={rightEyeRef} position={[0.25, 0.05, 0]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color={eyeColor} emissive={eyeColor} emissiveIntensity={4} />
          </mesh>
        </group>
      </group>

      <mesh position={[0, 0.7, 0]} castShadow>
        <boxGeometry args={[1.2, 1.2, 0.7]} />
        <meshStandardMaterial color={bodyColor} metalness={0.6} roughness={0.1} />
      </mesh>

      <group position={[-0.65, 1.2, 0]} ref={leftShoulderRef}>
        <mesh position={[-0.1, 0.35, 0]} rotation={[0, 0, -0.2]} ref={leftArmRef}>
          <capsuleGeometry args={[0.08, 0.9, 4, 8]} />
          <meshStandardMaterial color={bodyColor} />
        </mesh>
      </group>

      <group position={[0.65, 1.2, 0]} ref={rightShoulderRef}>
        <mesh position={[0.1, 0.35, 0]} rotation={[0, 0, 0.2]} ref={rightArmRef}>
          <capsuleGeometry args={[0.08, 0.9, 4, 8]} />
          <meshStandardMaterial color={bodyColor} />
        </mesh>
      </group>

      <mesh position={[-0.35, 0.05, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 0.3]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>
      <mesh position={[0.35, 0.05, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 0.3]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>

      {isLoggedIn && welcomeVisible && (
        <Float speed={4} rotationIntensity={0.5} floatIntensity={0.5}>
          <Text position={[0, 3.5, 0]} fontSize={0.4} color="#3B82F6" anchorX="center" anchorY="middle">
            WELCOME TO HIRESIGHT!
          </Text>
        </Float>
      )}
    </group>
  );
}

export default function RobotScene({ isPasswordFocused, isLoggedIn }: RobotProps) {
  return (
    <div className="w-full h-[450px] mb-4 relative z-10">
      <Canvas shadows={{ type: THREE.PCFShadowMap }}>
        <PerspectiveCamera makeDefault position={[0, 1.5, 5]} fov={40} />
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={2.5} castShadow />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        
        <Suspense fallback={<Html center><div className="text-blue-500 font-bold animate-pulse">Initializing AI...</div></Html>}>
          <RobotContent isPasswordFocused={isPasswordFocused} isLoggedIn={isLoggedIn} />
          <Environment preset="city" />
          <ContactShadows position={[0, -0.2, 0]} opacity={0.6} scale={10} blur={2.5} far={4} />
        </Suspense>
      </Canvas>
    </div>
  );
}
