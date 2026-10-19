"use client";

import { useMemo, useRef } from "react";
import type { ThreeEvent } from "@react-three/fiber";
import { grassTexture, marbleTexture } from "@/lib/textures";
import { Block, Car, Palm, Plant } from "@/components/primitives";
import { Water } from "@/components/Water";
import { clampSpot } from "@/lib/bounds";

export function HomeWorld({ onWalk }: { onWalk: (x: number, z: number) => void }) {
  const marble = useMemo(() => marbleTexture(), []);
  const grass = useMemo(() => grassTexture(), []);

  const pointer = useRef({ x: 0, y: 0, down: false });
  const walk = (event: ThreeEvent<MouseEvent>) => {
    if (pointer.current.down) {
      const dx = event.clientX - pointer.current.x;
      const dy = event.clientY - pointer.current.y;
      if (dx * dx + dy * dy > 64) return;
    }
    event.stopPropagation();
    const spot = clampSpot("home", event.point.x, event.point.z);
    onWalk(spot.x, spot.z);
  };

  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.04, 1]} receiveShadow raycast={() => null}>
        <circleGeometry args={[24, 48]} />
        <meshStandardMaterial map={grass} color="#1e6b40" roughness={1} />
      </mesh>

      <mesh
        rotation-x={-Math.PI / 2}
        position={[0, 0, 0.15]}
        receiveShadow
        onPointerDown={(event) => {
          pointer.current = { x: event.clientX, y: event.clientY, down: true };
        }}
        onClick={walk}
      >
        <planeGeometry args={[14.5, 13]} />
        <meshStandardMaterial map={marble} color="#f3eee6" roughness={0.32} metalness={0.08} />
      </mesh>
      <mesh
        rotation-x={-Math.PI / 2}
        position={[0, 0.01, 9.15]}
        receiveShadow
        onPointerDown={(event) => {
          pointer.current = { x: event.clientX, y: event.clientY, down: true };
        }}
        onClick={walk}
      >
        <planeGeometry args={[14.5, 4.6]} />
        <meshStandardMaterial color="#d9d0c2" roughness={0.92} />
      </mesh>

      <Block position={[0, 1.25, -7]} size={[16.2, 2.5, 0.16]} color="#1a1612" />
      <Block position={[-8, 1.25, 0]} size={[0.16, 2.5, 14.1]} color="#221c17" />
      <Block position={[8, 0.16, 0]} size={[0.14, 0.32, 14.1]} color="#c8b48a" />
      <Block position={[-4.2, 0.16, 7]} size={[7.2, 0.32, 0.14]} color="#c8b48a" />
      <Block position={[4.2, 0.16, 7]} size={[7.2, 0.32, 0.14]} color="#c8b48a" />

      <Block position={[-1.5, 1.05, -4.2]} size={[0.1, 2.1, 4.4]} color="#2a241c" />
      <Block position={[1.6, 0.9, 3.5]} size={[0.1, 1.5, 0.18]} color="#141210" />
      <Block position={[1.6, 0.9, 4.15]} size={[0.1, 1.5, 0.18]} color="#141210" />
      <Block position={[1.6, 0.9, 4.8]} size={[0.1, 1.5, 0.18]} color="#141210" />

      <Bedroom />
      <Living />
      <Dining />
      <Kitchen />
      <Bath />
      <Outside />

      <pointLight position={[-1.2, 2.1, -5]} intensity={8} distance={7} color="#ffc48a" />
      <pointLight position={[-4.2, 2.1, 1.4]} intensity={7} distance={7} color="#ffd2a2" />
      <pointLight position={[5.6, 2, -4.2]} intensity={5} distance={6} color="#ffe0b8" />
      <pointLight position={[2.4, 1.4, 4.6]} intensity={4} distance={4.5} color="#9ae7ff" />

      <directionalLight
        position={[8, 14, 10]}
        intensity={1.25}
        color="#fff2df"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={1}
        shadow-camera-far={40}
        shadow-camera-left={-16}
        shadow-camera-right={16}
        shadow-camera-top={16}
        shadow-camera-bottom={-16}
        shadow-bias={-0.0008}
      />
      <ambientLight intensity={0.48} color="#fff5ea" />
      <hemisphereLight args={["#9eb6dd", "#3d4a32", 0.45]} />
    </group>
  );
}

function Sconce({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <Block position={[0, 0, 0]} size={[0.08, 0.28, 0.06]} color="#d7b56a" metalness={0.7} roughness={0.3} />
      <mesh position={[0, -0.02, 0.08]} raycast={() => null}>
        <sphereGeometry args={[0.055, 12, 12]} />
        <meshStandardMaterial color="#fff1d4" emissive="#ffb15e" emissiveIntensity={2} />
      </mesh>
    </group>
  );
}

function Bedroom() {
  return (
    <group>
      <Block position={[0.5, 0.04, -5.05]} size={[2.7, 0.04, 3.1]} color="#1a1714" />
      <Block position={[0.5, 0.16, -5]} size={[2.15, 0.22, 2.45]} color="#241c16" />
      <Block position={[0.5, 0.34, -5]} size={[2.05, 0.16, 2.3]} color="#f7f4ef" />
      <Block position={[0.5, 0.4, -5]} size={[0.7, 0.05, 2.2]} color="#c6a15b" metalness={0.4} roughness={0.4} />
      <Block position={[0.5, 0.7, -6.15]} size={[2.2, 0.7, 0.12]} color="#14110e" />
      <Block position={[-0.15, 0.48, -5.7]} size={[0.55, 0.16, 0.32]} color="#f4f1ea" />
      <Block position={[1.15, 0.48, -5.7]} size={[0.55, 0.16, 0.32]} color="#111" />
      <Block position={[-1.15, 0.28, -5.5]} size={[0.42, 0.42, 0.42]} color="#1c1a17" />
      <Block position={[2.15, 0.28, -5.5]} size={[0.42, 0.42, 0.42]} color="#1c1a17" />
      <mesh position={[-1.15, 0.62, -5.5]} raycast={() => null}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial color="#fff4df" emissive="#ffc98a" emissiveIntensity={1.5} />
      </mesh>
      <mesh position={[2.15, 0.62, -5.5]} raycast={() => null}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial color="#fff4df" emissive="#ffc98a" emissiveIntensity={1.5} />
      </mesh>
      <Block position={[-6.55, 1.05, -5.2]} size={[0.55, 2.1, 2.4]} color="#2a241c" />
      <Block position={[-6.22, 1.15, -5.7]} size={[0.04, 1.5, 0.7]} color="#0e0e0e" />
      <Block position={[-6.22, 1.15, -4.7]} size={[0.04, 1.5, 0.7]} color="#3a332c" />
      <Sconce position={[-2.2, 1.7, -6.85]} />
      <Sconce position={[2.8, 1.7, -6.85]} />
      <Block position={[-3.4, 1.45, -6.88]} size={[0.7, 0.5, 0.04]} color="#c6a15b" metalness={0.45} />
      <Block position={[-3.4, 1.45, -6.84]} size={[0.55, 0.36, 0.02]} color="#1d3550" />
    </group>
  );
}

function Living() {
  return (
    <group>
      <Block position={[-3.6, 0.035, 1.35]} size={[3.3, 0.03, 2.2]} color="#efe6d4" />
      <Block position={[-3.7, 0.28, 1.15]} size={[2.5, 0.38, 0.85]} color="#f7f5f1" />
      <Block position={[-3.7, 0.58, 0.82]} size={[2.5, 0.42, 0.16]} color="#f7f5f1" />
      <Block position={[-4.7, 0.48, 1.2]} size={[0.35, 0.22, 0.35]} color="#1a1a1a" />
      <Block position={[-2.7, 0.48, 1.25]} size={[0.4, 0.22, 0.4]} color="#c9a36a" />
      <Block position={[-3.5, 0.22, 2.15]} size={[1.15, 0.28, 0.55]} color="#f7f5f1" />
      <Block position={[-3.55, 0.28, 1.85]} size={[0.9, 0.08, 0.5]} color="#1a1714" metalness={0.35} roughness={0.25} />
      <Block position={[-7.72, 0.85, 1.2]} size={[0.12, 1.15, 1.9]} color="#111" />
      <Block position={[-7.62, 0.95, 1.2]} size={[0.04, 0.85, 1.55]} color="#8fd0ff" emissive="#1a3c66" emissiveIntensity={0.7} />
      <Block position={[-7.55, 0.28, 1.2]} size={[0.35, 0.32, 2.1]} color="#1c1a17" />
      <Plant position={[-6.4, 0, 3.4]} />
      <Plant position={[-6.8, 0, -1.2]} scale={0.85} />
      <Sconce position={[-7.85, 1.7, -1.5]} />
      <Sconce position={[-7.85, 1.7, 3.3]} />
    </group>
  );
}

function Dining() {
  return (
    <group>
      <mesh position={[3.15, 0.42, -0.35]} castShadow raycast={() => null}>
        <cylinderGeometry args={[0.62, 0.62, 0.08, 24]} />
        <meshStandardMaterial color="#f7f4ee" roughness={0.35} />
      </mesh>
      <mesh position={[3.15, 0.2, -0.35]} raycast={() => null}>
        <cylinderGeometry args={[0.08, 0.1, 0.4, 12]} />
        <meshStandardMaterial color="#c6a15b" metalness={0.55} roughness={0.35} />
      </mesh>
      <Chair position={[2.35, 0, -0.35]} rotation={Math.PI / 2} />
      <Chair position={[3.95, 0, -0.35]} rotation={-Math.PI / 2} />
      <mesh position={[3.15, 0.5, -0.35]} raycast={() => null}>
        <cylinderGeometry args={[0.08, 0.1, 0.08, 10]} />
        <meshStandardMaterial color="#f2d48a" />
      </mesh>
      <mesh position={[3.15, 0.58, -0.35]} raycast={() => null}>
        <sphereGeometry args={[0.05, 10, 10]} />
        <meshStandardMaterial color="#7d1d2a" />
      </mesh>
    </group>
  );
}

function Chair({ position, rotation }: { position: [number, number, number]; rotation: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <Block position={[0, 0.28, 0]} size={[0.42, 0.08, 0.42]} color="#e07a2f" />
      <Block position={[0, 0.52, -0.18]} size={[0.42, 0.42, 0.08]} color="#e07a2f" />
      <Block position={[-0.16, 0.16, -0.16]} size={[0.06, 0.28, 0.06]} color="#2a2118" />
      <Block position={[0.16, 0.16, -0.16]} size={[0.06, 0.28, 0.06]} color="#2a2118" />
      <Block position={[-0.16, 0.16, 0.16]} size={[0.06, 0.28, 0.06]} color="#2a2118" />
      <Block position={[0.16, 0.16, 0.16]} size={[0.06, 0.28, 0.06]} color="#2a2118" />
    </group>
  );
}

function Kitchen() {
  return (
    <group>
      <Block position={[6.15, 0.45, -5.3]} size={[3.2, 0.9, 0.7]} color="#f4f1ea" />
      <Block position={[6.15, 0.92, -5.3]} size={[3.2, 0.06, 0.74]} color="#1a1a1a" metalness={0.4} roughness={0.25} />
      <Block position={[5.3, 1.35, -6.75]} size={[1.5, 0.7, 0.28]} color="#f7f4ef" />
      <Block position={[6.9, 1.35, -6.75]} size={[1.4, 0.7, 0.28]} color="#f7f4ef" />
      <Block position={[6.2, 0.96, -5.15]} size={[0.7, 0.04, 0.4]} color="#2a2a2a" />
      <mesh position={[5.95, 0.99, -5.15]} raycast={() => null}>
        <cylinderGeometry args={[0.06, 0.06, 0.03, 12]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <mesh position={[6.45, 0.99, -5.15]} raycast={() => null}>
        <cylinderGeometry args={[0.06, 0.06, 0.03, 12]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <Plant position={[7.3, 0, -3.2]} scale={0.8} />
    </group>
  );
}

function Bath() {
  return (
    <group>
      <Block position={[3.4, 0.28, 4.7]} size={[2.5, 0.5, 1.25]} color="#f7f7f5" />
      <Block position={[3.4, 0.5, 4.7]} size={[2.15, 0.18, 0.9]} color="#b9f3ff" emissive="#6ad8f0" emissiveIntensity={0.35} />
      <Block position={[4.45, 0.7, 4.7]} size={[0.08, 0.28, 0.08]} color="#d7b56a" metalness={0.8} roughness={0.25} />
      <Block position={[1.15, 0.04, 4.5]} size={[1.5, 0.03, 1.5]} color="#111" />
      <Block position={[0.2, 0.45, 5.6]} size={[0.9, 0.7, 0.4]} color="#f7f4ef" />
      <Block position={[0.2, 1.15, 5.75]} size={[0.7, 0.55, 0.04]} color="#d9eef5" metalness={0.2} roughness={0.15} />
    </group>
  );
}

function Outside() {
  return (
    <group>
      <Block position={[0, 0.02, 9.4]} size={[6.2, 0.04, 4.2]} color="#cfc6b8" roughness={0.9} />
      <Car position={[-4.3, 0, 10]} color="#f4f6f8" rotation={Math.PI} />
      <Car position={[4.35, 0, 10.1]} color="#1b1d22" rotation={Math.PI} />
      <Plant position={[-6.6, 0, 8.6]} />
      <Plant position={[6.7, 0, 8.4]} scale={1.1} />
      <Palm position={[-15.2, 0, 8]} />
      <Palm position={[-14.4, 0, -4]} />
      <Palm position={[15.5, 0, 7]} />
      <Palm position={[15.2, 0, -5]} />
      <group position={[11.1, 0, 0.4]}>
        <Block position={[0, 0.2, 0]} size={[3.4, 0.28, 6.2]} color="#e7e1d6" />
        <Water position={[0, 0.38, 0]} size={[2.5, 5.2]} deep="#0c6e86" shallow="#b7f6ff" />
        <Block position={[-1.15, 0.28, 1.6]} size={[0.7, 0.1, 1.5]} color="#f4f1ea" />
        <Block position={[1.15, 0.28, -1.4]} size={[0.7, 0.1, 1.5]} color="#f7f4ef" />
      </group>
      {[-12, -8, -4, 0, 4, 8, 12].map((x) => (
        <group key={x} position={[x, 0, -9.3]}>
          <Block position={[0, 0.35, 0]} size={[3.6, 0.7, 0.18]} color="#241e18" />
          <mesh position={[0, 0.15, 0.16]} raycast={() => null}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial color="#ffd7a4" emissive="#ffb15e" emissiveIntensity={1.4} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
