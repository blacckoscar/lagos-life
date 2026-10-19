"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { facadeTextures, moonTexture, roadTexture, signTexture, stoneTexture } from "@/lib/textures";
import { Block, Car, Palm } from "@/components/primitives";
import { Water } from "@/components/Water";
import { clampSpot } from "@/lib/bounds";

const TOWERS: { x: number; z: number; w: number; d: number; h: number; color: string; seed: number }[] = [
  { x: -20, z: -24, w: 5, d: 5, h: 11, color: "#31445f", seed: 3 },
  { x: -14, z: -27, w: 4.2, d: 4.2, h: 18, color: "#24344a", seed: 8 },
  { x: -8, z: -23, w: 6, d: 5, h: 9, color: "#5a4632", seed: 13 },
  { x: -2, z: -29, w: 5, d: 5, h: 24, color: "#2c3b52", seed: 21 },
  { x: 5, z: -24, w: 6.5, d: 5.5, h: 13, color: "#3a4d68", seed: 34 },
  { x: 12, z: -28, w: 4.4, d: 4.4, h: 20, color: "#4a3828", seed: 55 },
  { x: 18, z: -23, w: 5, d: 5, h: 10, color: "#2a3c50", seed: 89 },
  { x: -16, z: -36, w: 7, d: 6, h: 28, color: "#1d2b3d", seed: 144 },
  { x: -6, z: -37, w: 6, d: 6, h: 16, color: "#3d3428", seed: 233 },
  { x: 6, z: -36, w: 8, d: 6, h: 22, color: "#243246", seed: 377 },
  { x: 16, z: -35, w: 5, d: 5, h: 14, color: "#4e3b2a", seed: 610 },
  { x: -22, z: -18, w: 3.2, d: 4, h: 6, color: "#6a5038", seed: 17 },
  { x: 22, z: -18, w: 3.4, d: 4, h: 7, color: "#35506a", seed: 29 },
];

export function CityWorld({ onWalk }: { onWalk: (x: number, z: number) => void }) {
  const stone = useMemo(() => stoneTexture(), []);
  const road = useMemo(() => roadTexture(), []);
  const sign = useMemo(() => signTexture(), []);
  const moon = useMemo(() => moonTexture(), []);

  const pointer = useRef({ x: 0, y: 0, down: false });
  const walk = (event: ThreeEvent<MouseEvent>) => {
    if (pointer.current.down) {
      const dx = event.clientX - pointer.current.x;
      const dy = event.clientY - pointer.current.y;
      if (dx * dx + dy * dy > 64) return;
    }
    event.stopPropagation();
    const spot = clampSpot("city", event.point.x, event.point.z);
    onWalk(spot.x, spot.z);
  };

  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.08, -6]} receiveShadow raycast={() => null}>
        <circleGeometry args={[70, 48]} />
        <meshStandardMaterial color="#102218" roughness={1} />
      </mesh>

      <mesh
        rotation-x={-Math.PI / 2}
        position={[0, 0, -0.4]}
        receiveShadow
        onPointerDown={(event) => {
          pointer.current = { x: event.clientX, y: event.clientY, down: true };
        }}
        onClick={walk}
      >
        <planeGeometry args={[44, 28]} />
        <meshStandardMaterial map={stone} color="#e7e0d4" roughness={0.86} />
      </mesh>

      <mesh
        rotation-x={-Math.PI / 2}
        position={[0, 0.01, -14.2]}
        receiveShadow
        onPointerDown={(event) => {
          pointer.current = { x: event.clientX, y: event.clientY, down: true };
        }}
        onClick={walk}
      >
        <planeGeometry args={[48, 3.2]} />
        <meshStandardMaterial map={road} roughness={0.95} />
      </mesh>
      {[-18, -12, -6, 0, 6, 12, 18].map((x) => (
        <mesh key={x} rotation-x={-Math.PI / 2} position={[x, 0.03, -14.2]} raycast={() => null}>
          <planeGeometry args={[1.4, 0.12]} />
          <meshBasicMaterial color="#f2e2b0" />
        </mesh>
      ))}

      <Block position={[0, 0.05, 14.2]} size={[46, 0.1, 2.2]} color="#e6d3a4" roughness={1} />
      <Water position={[0, -0.08, 21]} size={[78, 14]} deep="#127a96" shallow="#b7f4ff" />
      <mesh position={[0, 2.3, 14.35]} raycast={() => null}>
        <planeGeometry args={[10.5, 2.3]} />
        <meshStandardMaterial map={sign} roughness={0.45} metalness={0.25} emissive="#6a5428" emissiveIntensity={0.25} />
      </mesh>

      {TOWERS.map((tower) => (
        <Tower key={`${tower.x}-${tower.z}`} {...tower} />
      ))}

      <Fountain />
      <Traffic />

      {[-16, -10, -4, 4, 10, 16].map((x) => (
        <Palm key={x} position={[x, 0, 12.2]} />
      ))}
      {[-12, -4, 6, 14].map((x) => (
        <StreetLamp key={x} position={[x, 0, 8.5]} />
      ))}
      {[-8, 0, 8].map((x) => (
        <Bench key={x} position={[x, 0, 9.6]} />
      ))}

      <sprite position={[-18, 22, -18]} scale={[16, 16, 1]} raycast={() => null}>
        <spriteMaterial map={moon} transparent depthWrite={false} />
      </sprite>

      <directionalLight position={[-12, 18, 8]} intensity={1.15} color="#d5e2ff" castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} shadow-bias={-0.001} />
      <ambientLight intensity={0.46} color="#c5d4ea" />
      <hemisphereLight args={["#6d8fbf", "#3a2a1c", 0.55]} />
      <pointLight position={[0, 3.2, 2]} intensity={10} distance={14} color="#ffc98a" />
      <pointLight position={[-8, 3, 8]} intensity={6} distance={9} color="#ffd7a8" />
      <pointLight position={[10, 3, 7]} intensity={6} distance={9} color="#ffd7a8" />
    </group>
  );
}

function Tower({
  x,
  z,
  w,
  d,
  h,
  color,
  seed,
}: {
  x: number;
  z: number;
  w: number;
  d: number;
  h: number;
  color: string;
  seed: number;
}) {
  const maps = useMemo(() => facadeTextures(color, seed), [color, seed]);
  const side = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#ffffff",
        map: maps.map,
        emissive: "#ffc27a",
        emissiveMap: maps.glow,
        emissiveIntensity: 1.15,
        roughness: 0.62,
      }),
    [maps],
  );
  const roof = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#0e1218", roughness: 0.9 }),
    [],
  );
  return (
    <group position={[x, h / 2, z]}>
      <mesh castShadow receiveShadow material={[side, side, roof, roof, side, side]} raycast={() => null}>
        <boxGeometry args={[w, h, d]} />
      </mesh>
      {h > 15 && (
        <mesh position={[0, h / 2 + 0.7, 0]} raycast={() => null}>
          <cylinderGeometry args={[0.04, 0.04, 1.4, 6]} />
          <meshStandardMaterial color="#d7dde6" metalness={0.6} />
        </mesh>
      )}
      <mesh position={[0, h / 2 + 0.05, d / 2 + 0.01]} raycast={() => null}>
        <boxGeometry args={[w * 0.35, 0.08, 0.05]} />
        <meshStandardMaterial color="#ffbf73" emissive="#ffbf73" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}

function Fountain() {
  return (
    <group position={[0, 0, 2]}>
      <mesh receiveShadow raycast={() => null}>
        <cylinderGeometry args={[1.7, 1.85, 0.28, 24]} />
        <meshStandardMaterial color="#e7e0d4" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.2, 0]} raycast={() => null}>
        <cylinderGeometry args={[1.25, 1.25, 0.16, 24]} />
        <meshStandardMaterial color="#7fd7ea" emissive="#1a6e86" emissiveIntensity={0.35} roughness={0.15} />
      </mesh>
      <mesh position={[0, 0.55, 0]} raycast={() => null}>
        <cylinderGeometry args={[0.18, 0.22, 0.7, 12]} />
        <meshStandardMaterial color="#d9d3c8" />
      </mesh>
    </group>
  );
}

function StreetLamp({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.3, 0]} raycast={() => null}>
        <cylinderGeometry args={[0.05, 0.07, 2.6, 8]} />
        <meshStandardMaterial color="#1c1c1c" metalness={0.5} />
      </mesh>
      <mesh position={[0, 2.65, 0]} raycast={() => null}>
        <sphereGeometry args={[0.14, 12, 12]} />
        <meshStandardMaterial color="#fff1d2" emissive="#ffc56a" emissiveIntensity={2} />
      </mesh>
    </group>
  );
}

function Bench({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <Block position={[0, 0.32, 0]} size={[1.3, 0.08, 0.4]} color="#6a4328" />
      <Block position={[0, 0.55, -0.16]} size={[1.3, 0.36, 0.08]} color="#6a4328" />
      <Block position={[-0.55, 0.18, 0]} size={[0.08, 0.28, 0.36]} color="#111" />
      <Block position={[0.55, 0.18, 0]} size={[0.08, 0.28, 0.36]} color="#111" />
    </group>
  );
}

function Traffic() {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    group.current?.children.forEach((car, index) => {
      const width = 52;
      const speed = 3.2 + index * 0.45;
      const offset = index * 9;
      const t = ((clock.elapsedTime * speed + offset) % width) - width / 2;
      const flip = index % 2 === 0;
      car.position.x = flip ? t : -t;
      car.rotation.y = flip ? Math.PI / 2 : -Math.PI / 2;
    });
  });
  return (
    <group ref={group} position={[0, 0, -14.2]}>
      <Car position={[0, 0, 0.55]} color="#f2f4f7" />
      <Car position={[0, 0, -0.55]} color="#c83b45" />
      <Car position={[0, 0, 0.55]} color="#1d1f24" />
      <Car position={[0, 0, -0.55]} color="#e7c98a" />
    </group>
  );
}
