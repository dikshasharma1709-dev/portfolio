import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float } from '@react-three/drei';
import * as THREE from 'three';

// Add types for R3F elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      gridHelper: any;
      instancedMesh: any;
      icosahedronGeometry: any;
      meshBasicMaterial: any;
      group: any;
      mesh: any;
      sphereGeometry: any;
      boxGeometry: any;
      fog: any;
      ambientLight: any;
    }
  }
}

const FloatingGrid = () => {
  return (
    <gridHelper 
      args={[100, 60, 0x1e293b, 0x0f172a]} 
      position={[0, -10, 0]} 
      rotation={[0, 0, 0]} 
    />
  );
};

const DataNodes = ({ count = 60 }) => {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.005 + Math.random() / 500; // Very slow, stable
      const xFactor = -50 + Math.random() * 100;
      const yFactor = -50 + Math.random() * 100;
      const zFactor = -50 + Math.random() * 100;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
      t = particle.t += speed / 2;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      
      dummy.position.set(
        (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      );
      dummy.scale.setScalar(0.4); 
      dummy.rotation.set(0, t * 0.5, 0); // Steady rotation
      dummy.updateMatrix();
      
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#38bdf8" transparent opacity={0.15} wireframe />
    </instancedMesh>
  );
};

const StrategicGeometry = () => {
  return (
    <group>
      {/* Large stable geometric shapes indicating structure */}
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.2} position={[18, 5, -15]}>
        <mesh>
          <sphereGeometry args={[4, 16, 16]} />
          <meshBasicMaterial color="#1e293b" wireframe transparent opacity={0.1} />
        </mesh>
      </Float>
       <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.2} position={[-18, -8, -10]}>
        <mesh>
          <boxGeometry args={[5, 5, 5]} />
          <meshBasicMaterial color="#38bdf8" wireframe transparent opacity={0.05} />
        </mesh>
      </Float>
    </group>
  );
}

export const GlobalBackground = () => {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none">
      <Canvas camera={{ position: [0, 0, 25], fov: 50 }} gl={{ antialias: true, alpha: true }}>
        <fog attach="fog" args={['#0f172a', 10, 60]} />
        <ambientLight intensity={0.5} />
        
        <StrategicGeometry />
        <DataNodes count={80} />
        <FloatingGrid />
      </Canvas>
    </div>
  );
};