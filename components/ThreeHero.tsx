import React, { useRef, useMemo, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Float, Html, Text, useTexture, Trail } from '@react-three/drei';
import * as THREE from 'three';

// Add types for R3F elements to fix IntrinsicElements errors
declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      planeGeometry: any;
      meshBasicMaterial: any;
      group: any;
      sphereGeometry: any;
      ringGeometry: any;
      gridHelper: any;
      ambientLight: any;
      pointLight: any;
      color: any;
    }
  }
}

// --- Constants ---
const MAP_WIDTH = 12;
const MAP_HEIGHT = 6;
const MAX_ATTACKS = 12; // Fewer, slower, more deliberate movements
const ATTACK_COLORS = ["#38bdf8", "#ffffff", "#94a3b8"]; // Corporate Blue, White, Slate

const CITIES = [
  { lat: 12.9716, lng: 77.5946, name: "Bangalore" },
  { lat: 28.6139, lng: 77.2090, name: "New Delhi" },
  { lat: 37.7749, lng: -122.4194, name: "San Francisco" },
  { lat: 40.7128, lng: -74.0060, name: "New York" },
  { lat: 51.5074, lng: -0.1278, name: "London" },
  { lat: 55.7558, lng: 37.6173, name: "Moscow" },
  { lat: 35.6762, lng: 139.6503, name: "Tokyo" },
  { lat: -33.8688, lng: 151.2093, name: "Sydney" },
  { lat: -23.5505, lng: -46.6333, name: "Sao Paulo" },
  { lat: 1.3521, lng: 103.8198, name: "Singapore" },
  { lat: 25.2048, lng: 55.2708, name: "Dubai" },
  { lat: 52.5200, lng: 13.4050, name: "Berlin" },
  { lat: 39.9042, lng: 116.4074, name: "Beijing" },
  { lat: -26.2041, lng: 28.0473, name: "Johannesburg" },
  { lat: 48.8566, lng: 2.3522, name: "Paris" },
  { lat: 30.0444, lng: 31.2357, name: "Cairo" },
  { lat: 64.1466, lng: -21.9426, name: "Reykjavik" },
  { lat: -12.0464, lng: -77.0428, name: "Lima" }
];

// --- Types ---
type Attack = {
  id: number;
  startPos: THREE.Vector3;
  endPos: THREE.Vector3;
  controlPos: THREE.Vector3;
  startName: string;
  endName: string;
  progress: number;
  speed: number;
  color: string;
  active: boolean;
};

// --- Math Helpers ---
const latLonToVector3 = (lat: number, lng: number) => {
  const x = (lng / 180) * (MAP_WIDTH / 2);
  const y = (lat / 90) * (MAP_HEIGHT / 2);
  return new THREE.Vector3(x, y, 0.02);
};

const getBezierPoint = (p0: THREE.Vector3, p1: THREE.Vector3, p2: THREE.Vector3, t: number, target: THREE.Vector3) => {
  const oneMinusT = 1 - t;
  target.x = oneMinusT * oneMinusT * p0.x + 2 * oneMinusT * t * p1.x + t * t * p2.x;
  target.y = oneMinusT * oneMinusT * p0.y + 2 * oneMinusT * t * p1.y + t * t * p2.y;
  target.z = oneMinusT * oneMinusT * p0.z + 2 * oneMinusT * t * p1.z + t * t * p2.z;
};

// --- Components ---

const MapTexture = () => {
  const texture = useTexture('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_lights_2048.png');
  return (
    <mesh position={[0, 0, 0]}>
      <planeGeometry args={[MAP_WIDTH, MAP_HEIGHT]} />
      <meshBasicMaterial 
        map={texture} 
        transparent={true} 
        opacity={0.6}
        color="#a5b4fc" // Tint to a soft professional indigo/blue
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

const MapGridFallback = () => (
  <mesh position={[0, 0, 0]}>
    <planeGeometry args={[MAP_WIDTH, MAP_HEIGHT, 24, 12]} />
    <meshBasicMaterial color="#1e293b" wireframe transparent opacity={0.2} />
  </mesh>
);

const ThreatController = () => {
  const nodes = useMemo(() => CITIES.map((city, i) => ({
    ...city,
    id: i,
    pos: latLonToVector3(city.lat, city.lng)
  })), []);

  const attacksRef = useRef<Attack[]>([]);
  const projectileRefs = useRef<(THREE.Mesh | null)[]>([]);
  const tempVec = useMemo(() => new THREE.Vector3(), []);
  const [logs, setLogs] = useState<{id: number, text: string, color: string}[]>([]);
  const lastSpawnTime = useRef(0);

  useMemo(() => {
    attacksRef.current = Array.from({ length: MAX_ATTACKS }).map((_, i) => ({
      id: i,
      active: false,
      startPos: new THREE.Vector3(),
      endPos: new THREE.Vector3(),
      controlPos: new THREE.Vector3(),
      startName: '',
      endName: '',
      progress: 0,
      speed: 0,
      color: "#fff"
    }));
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    if (time - lastSpawnTime.current > 0.8) { 
      const inactiveAttack = attacksRef.current.find(a => !a.active);
      if (inactiveAttack) {
        const source = nodes[Math.floor(Math.random() * nodes.length)];
        const target = nodes[Math.floor(Math.random() * nodes.length)];
        
        if (source.name !== target.name) {
          lastSpawnTime.current = time;
          inactiveAttack.active = true;
          inactiveAttack.startPos.copy(source.pos);
          inactiveAttack.endPos.copy(target.pos);
          inactiveAttack.startName = source.name;
          inactiveAttack.endName = target.name;
          inactiveAttack.progress = 0;
          inactiveAttack.speed = 0.2 + Math.random() * 0.2; // Slower, elegant speed
          inactiveAttack.color = ATTACK_COLORS[Math.floor(Math.random() * ATTACK_COLORS.length)];
          
          const distance = source.pos.distanceTo(target.pos);
          const midPoint = new THREE.Vector3().addVectors(source.pos, target.pos).multiplyScalar(0.5);
          midPoint.z = Math.min(distance * 0.5, 2.5); 
          inactiveAttack.controlPos.copy(midPoint);

          setLogs(prev => [{
            id: Date.now(),
            text: `${source.name} ➔ ${target.name}`,
            color: inactiveAttack.color
          }, ...prev].slice(0, 3));
        }
      }
    }

    attacksRef.current.forEach((attack, i) => {
      const mesh = projectileRefs.current[i];
      if (!mesh) return;

      if (!attack.active) {
        mesh.visible = false;
        return;
      }

      mesh.visible = true;
      attack.progress += attack.speed * delta;

      if (attack.progress >= 1) {
        attack.active = false;
        mesh.visible = false;
      } else {
        getBezierPoint(attack.startPos, attack.controlPos, attack.endPos, attack.progress, tempVec);
        mesh.position.copy(tempVec);
        (mesh.material as THREE.MeshBasicMaterial).color.set(attack.color);
        mesh.scale.setScalar(0.6); // Smaller, more refined
      }
    });
  });

  return (
    <group>
      {nodes.map((node) => (
        <group key={node.id} position={node.pos}>
          <mesh>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color="#94a3b8" />
          </mesh>
        </group>
      ))}

      {attacksRef.current.map((_, i) => (
        <mesh 
          key={`proj-${i}`} 
          ref={(el) => { projectileRefs.current[i] = el; }}
          visible={false}
        >
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshBasicMaterial color="#fff" />
          <Trail width={0.2} length={6} color={new THREE.Color(0.2, 0.5, 1)} attenuation={(t) => t} />
        </mesh>
      ))}

      <Html position={[MAP_WIDTH/2 + 0.5, 1.5, 0]} transform>
        <div className="bg-slate-900/90 border border-slate-700 p-4 rounded-sm w-56 font-sans text-xs shadow-xl backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-700 text-primary font-semibold tracking-wider">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            LIVE DATA STREAM
          </div>
          <div className="space-y-2">
            {logs.map(log => (
              <div key={log.id} className="flex justify-between text-slate-400">
                <span className="truncate w-32">{log.text}</span>
                <span className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: log.color}}></span>
              </div>
            ))}
             {logs.length === 0 && <span className="text-slate-600">Initializing...</span>}
          </div>
        </div>
      </Html>
    </group>
  );
};

export default function ThreeHero() {
  return (
    <div className="absolute inset-0 z-0 h-screen w-full bg-[#0f172a]">
      <Canvas 
        camera={{ position: [0, -5, 7], fov: 45, rotation: [0.6, 0, 0] }} 
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={['#0f172a']} />
        
        <ambientLight intensity={2} />
        <pointLight position={[0, 0, 10]} intensity={1} color="#ffffff" />
        
        <group rotation={[0.4, 0, 0]}>
          {/* Subtle Grid Floor */}
          <gridHelper args={[MAP_WIDTH + 8, 40, 0x1e293b, 0x0f172a]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.1]} />
          
          <Suspense fallback={<MapGridFallback />}>
            <MapTexture />
          </Suspense>

          <ThreatController />
        </group>

        <Stars radius={100} depth={50} count={1500} factor={4} saturation={0} fade speed={0.2} />
        
        {/* Professional Titles */}
        <Float speed={1.5} rotationIntensity={0.02} floatIntensity={0.05} position={[-4, 3, 0]}>
          <group rotation={[0.2, 0, 0]}>
            <Text 
              fontSize={0.3} 
              color="#f8fafc" 
              font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
              anchorX="center" 
              anchorY="middle"
              letterSpacing={0.05}
            >
              GLOBAL INFRASTRUCTURE
            </Text>
            <Text 
              position={[0, -0.2, 0]} 
              fontSize={0.12} 
              color="#94a3b8" 
              font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
              anchorX="center" 
              anchorY="middle"
              letterSpacing={0.02}
            >
              SECURE • SCALABLE • RESILIENT
            </Text>
          </group>
        </Float>

        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          enableRotate={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>
    </div>
  );
}