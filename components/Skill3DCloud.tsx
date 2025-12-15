import React, { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, TrackballControls, Float, Line, Sphere, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { content } from '../data';

// Add types for R3F elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      fog: any;
      torusGeometry: any;
    }
  }
}

// ------------------------------------------------------------------
// Sub-components
// ------------------------------------------------------------------

const Word = ({ children, position, color }: { children: string, position: THREE.Vector3, color: string }) => {
  const fontUrl = 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff';
  const ref = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ camera }) => {
    if (ref.current) {
      // Billboard behavior: always face camera
      ref.current.quaternion.copy(camera.quaternion);
      // Pulse scale on hover
      const targetScale = hovered ? 1.2 : 1;
      ref.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <Text
        ref={ref}
        position={position}
        fontSize={hovered ? 0.65 : 0.45}
        color={hovered ? '#ffffff' : color}
        font={fontUrl}
        anchorX="center"
        anchorY="middle"
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        fillOpacity={0.9}
      >
        {children}
      </Text>
    </Float>
  );
};

const NeuralConnections = ({ positions }: { positions: [THREE.Vector3, string, string][] }) => {
  // Generate lines between nearby nodes
  const lines = useMemo(() => {
    const points: THREE.Vector3[][] = [];
    positions.forEach((start, i) => {
       positions.forEach((end, j) => {
          if (i < j) { // Avoid duplicates
             const dist = start[0].distanceTo(end[0]);
             if (dist < 8) { // Threshold for connection
                points.push([start[0], end[0]]);
             }
          }
       });
    });
    return points;
  }, [positions]);

  return (
    <group>
      {lines.map((pts, i) => (
        <Line 
          key={i} 
          points={pts} 
          color="#38bdf8" 
          transparent 
          opacity={0.08} 
          lineWidth={1} 
        />
      ))}
    </group>
  );
};

const OrbitalRings = () => {
   const groupRef = useRef<THREE.Group>(null);
   
   useFrame((state) => {
      if(groupRef.current) {
         groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
         groupRef.current.rotation.y += 0.002;
         groupRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.1) * 0.1;
      }
   });

   return (
     <group ref={groupRef}>
        <mesh rotation={[Math.PI / 3, 0, 0]}>
           <torusGeometry args={[14, 0.05, 16, 100]} />
           <meshBasicMaterial color="#38bdf8" transparent opacity={0.15} />
        </mesh>
        <mesh rotation={[-Math.PI / 3, 0, 0]}>
           <torusGeometry args={[16, 0.03, 16, 100]} />
           <meshBasicMaterial color="#38bdf8" transparent opacity={0.1} />
        </mesh>
        <mesh rotation={[0, Math.PI / 2, 0]}>
           <torusGeometry args={[18, 0.02, 16, 100]} />
           <meshBasicMaterial color="#38bdf8" transparent opacity={0.05} />
        </mesh>
     </group>
   )
}

const CoreSystem = () => {
    return (
        <group>
            {/* Inner solid core */}
            <mesh>
                <sphereGeometry args={[4, 32, 32]} />
                <meshBasicMaterial color="#020617" transparent opacity={0.9} />
            </mesh>
            {/* Outer wireframe shield */}
            <mesh>
                <sphereGeometry args={[4.2, 16, 16]} />
                <meshBasicMaterial color="#38bdf8" wireframe transparent opacity={0.05} />
            </mesh>
        </group>
    )
}

const Cloud = ({ count = 4, radius = 20 }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Slow auto-rotation of the entire cloud
  useFrame(() => {
     if(groupRef.current) groupRef.current.rotation.y += 0.001;
  });

  const words = useMemo(() => {
    const temp = [];
    const spherical = new THREE.Spherical();
    const phiSpan = Math.PI * (3 - Math.sqrt(5));
    const allSkills = content.skills;

    for (let i = 0; i < allSkills.length; i++) {
      const y = 1 - (i / (allSkills.length - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = phiSpan * i;
      spherical.set(radius, Math.acos(y), theta);
      const pos = new THREE.Vector3().setFromSpherical(spherical);
      
      const skill = allSkills[i];
      // Tech-focused color palette
      const color = skill.category === 'core' ? '#38bdf8' :  // Sky Blue
                    skill.category === 'tech' ? '#94a3b8' :  // Slate
                    '#e2e8f0';                               // White
      temp.push([pos, skill.name, color] as const);
    }
    return temp;
  }, [radius]);

  return (
    <group ref={groupRef}>
      <NeuralConnections positions={words} />
      <OrbitalRings />
      <CoreSystem />
      
      {words.map(([pos, word, color], index) => (
        <Word key={index} position={pos} color={color}>{word}</Word>
      ))}
    </group>
  );
};

// ------------------------------------------------------------------
// Main Component
// ------------------------------------------------------------------

export const Skill3DCloud = () => {
  return (
    <div className="w-full h-[400px] cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 35], fov: 50 }} gl={{ alpha: true, antialias: true }}>
        <fog attach="fog" args={['#0b1221', 20, 50]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} color="#38bdf8" intensity={1} />
        <pointLight position={[-10, -10, -10]} color="#38bdf8" intensity={0.5} />
        
        <Cloud radius={11} />
        <Stars radius={40} depth={20} count={1000} factor={4} saturation={0} fade speed={0.5} />
        
        <TrackballControls noZoom rotateSpeed={1.5} />
      </Canvas>
    </div>
  );
};