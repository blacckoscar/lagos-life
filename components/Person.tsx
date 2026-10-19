"use client";

import { useMemo, useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Group } from "three";
import type { PersonId, XZ } from "@/lib/bounds";

export type PersonLook = {
  id: PersonId;
  name: string;
  skin: string;
  hair: string;
  top: string;
  bottom: string;
  shoes: string;
  longHair: boolean;
};

export const PEOPLE: PersonLook[] = [
  {
    id: "you",
    name: "You",
    skin: "#8d5a3c",
    hair: "#1b120e",
    top: "#f7f3ec",
    bottom: "#1b1916",
    shoes: "#111111",
    longHair: false,
  },
  {
    id: "amaka",
    name: "Amaka",
    skin: "#a86b45",
    hair: "#2a160f",
    top: "#d64552",
    bottom: "#d64552",
    shoes: "#2a1214",
    longHair: true,
  },
  {
    id: "tunde",
    name: "Tunde",
    skin: "#6b4330",
    hair: "#120e0c",
    top: "#243356",
    bottom: "#171c27",
    shoes: "#101114",
    longHair: false,
  },
];

export type WalkGoal = { id: PersonId; x: number; z: number; n: number };

export function Person({
  look,
  spawn,
  goal,
  selected,
  onSelect,
  poses,
}: {
  look: PersonLook;
  spawn: XZ;
  goal: WalkGoal | null;
  selected: boolean;
  onSelect: (id: PersonId) => void;
  poses: MutableRefObject<Record<PersonId, XZ>>;
}) {
  const root = useRef<Group>(null);
  const bob = useRef<Group>(null);
  const legL = useRef<Group>(null);
  const legR = useRef<Group>(null);
  const armL = useRef<Group>(null);
  const armR = useRef<Group>(null);
  const pos = useRef({ x: spawn.x, z: spawn.z });
  const aim = useRef({ x: spawn.x, z: spawn.z, n: -1 });
  const facing = useRef(0);
  const dress = look.top === look.bottom;

  useFrame(({ clock }, delta) => {
    if (goal && goal.id === look.id && goal.n !== aim.current.n) {
      aim.current = { x: goal.x, z: goal.z, n: goal.n };
    }
    const dx = aim.current.x - pos.current.x;
    const dz = aim.current.z - pos.current.z;
    const dist = Math.hypot(dx, dz);
    const walking = dist > 0.07;
    if (walking) {
      const step = Math.min(dist, 2.25 * delta);
      pos.current.x += (dx / dist) * step;
      pos.current.z += (dz / dist) * step;
      facing.current = Math.atan2(dx, dz);
    }
    poses.current[look.id] = { x: pos.current.x, z: pos.current.z };
    if (root.current) {
      root.current.position.x = pos.current.x;
      root.current.position.z = pos.current.z;
      let turn = facing.current - root.current.rotation.y;
      while (turn > Math.PI) turn -= Math.PI * 2;
      while (turn < -Math.PI) turn += Math.PI * 2;
      root.current.rotation.y += turn * Math.min(1, delta * 12);
    }
    const swing = walking ? Math.sin(clock.elapsedTime * 10) : 0;
    if (legL.current) legL.current.rotation.x = swing * 0.8;
    if (legR.current) legR.current.rotation.x = -swing * 0.8;
    if (armL.current) armL.current.rotation.x = -swing * 0.55;
    if (armR.current) armR.current.rotation.x = swing * 0.55;
    if (bob.current) {
      bob.current.position.y = walking
        ? Math.abs(Math.sin(clock.elapsedTime * 10)) * 0.06
        : Math.sin(clock.elapsedTime * 1.8) * 0.015;
    }
  });

  return (
    <group ref={root} position={[spawn.x, 0, spawn.z]} scale={1.18}>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.025, 0]} raycast={() => null}>
        <circleGeometry args={[0.28, 20]} />
        <meshBasicMaterial color="#000" transparent opacity={0.28} />
      </mesh>
      {selected && (
        <mesh rotation-x={-Math.PI / 2} position={[0, 0.04, 0]} raycast={() => null}>
          <ringGeometry args={[0.36, 0.46, 28]} />
          <meshBasicMaterial color="#f0d090" />
        </mesh>
      )}
      <group ref={bob}>
        <group ref={legL} position={[-0.1, 0.78, 0]}>
          <mesh position={[0, -0.26, 0]} castShadow>
            <boxGeometry args={[0.12, 0.42, 0.14]} />
            <meshStandardMaterial color={dress ? look.skin : look.bottom} />
          </mesh>
          <mesh position={[0, -0.5, 0.04]}>
            <boxGeometry args={[0.13, 0.08, 0.22]} />
            <meshStandardMaterial color={look.shoes} />
          </mesh>
        </group>
        <group ref={legR} position={[0.1, 0.78, 0]}>
          <mesh position={[0, -0.26, 0]} castShadow>
            <boxGeometry args={[0.12, 0.42, 0.14]} />
            <meshStandardMaterial color={dress ? look.skin : look.bottom} />
          </mesh>
          <mesh position={[0, -0.5, 0.04]}>
            <boxGeometry args={[0.13, 0.08, 0.22]} />
            <meshStandardMaterial color={look.shoes} />
          </mesh>
        </group>
        {dress && (
          <mesh position={[0, 0.78, 0]} castShadow>
            <cylinderGeometry args={[0.24, 0.16, 0.48, 12]} />
            <meshStandardMaterial color={look.top} roughness={0.55} />
          </mesh>
        )}
        <mesh position={[0, 1.05, 0]} castShadow>
          <boxGeometry args={[0.4, 0.42, 0.22]} />
          <meshStandardMaterial color={look.top} roughness={0.58} />
        </mesh>
        <group ref={armL} position={[-0.26, 1.2, 0]}>
          <mesh position={[0, -0.2, 0]}>
            <boxGeometry args={[0.1, 0.36, 0.1]} />
            <meshStandardMaterial color={look.top} />
          </mesh>
          <mesh position={[0, -0.4, 0]}>
            <sphereGeometry args={[0.055, 10, 10]} />
            <meshStandardMaterial color={look.skin} />
          </mesh>
        </group>
        <group ref={armR} position={[0.26, 1.2, 0]}>
          <mesh position={[0, -0.2, 0]}>
            <boxGeometry args={[0.1, 0.36, 0.1]} />
            <meshStandardMaterial color={look.top} />
          </mesh>
          <mesh position={[0, -0.4, 0]}>
            <sphereGeometry args={[0.055, 10, 10]} />
            <meshStandardMaterial color={look.skin} />
          </mesh>
        </group>
        <mesh position={[0, 1.46, 0]} castShadow>
          <sphereGeometry args={[0.16, 20, 20]} />
          <meshStandardMaterial color={look.skin} roughness={0.62} />
        </mesh>
        <mesh position={[0, 1.56, -0.01]}>
          <sphereGeometry args={[0.168, 18, 16, 0, Math.PI * 2, 0, Math.PI / 1.7]} />
          <meshStandardMaterial color={look.hair} roughness={0.8} />
        </mesh>
        {look.longHair && (
          <mesh position={[0, 1.28, -0.12]}>
            <boxGeometry args={[0.28, 0.42, 0.08]} />
            <meshStandardMaterial color={look.hair} />
          </mesh>
        )}
        <mesh position={[-0.055, 1.48, 0.13]}>
          <sphereGeometry args={[0.018, 8, 8]} />
          <meshStandardMaterial color="#1a120e" />
        </mesh>
        <mesh position={[0.055, 1.48, 0.13]}>
          <sphereGeometry args={[0.018, 8, 8]} />
          <meshStandardMaterial color="#1a120e" />
        </mesh>
      </group>
      <mesh
        position={[0, 0.9, 0]}
        onClick={(event) => {
          event.stopPropagation();
          onSelect(look.id);
        }}
      >
        <cylinderGeometry args={[0.42, 0.42, 1.9, 10]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <NameSprite name={look.name} selected={selected} />
    </group>
  );
}

function NameSprite({ name, selected }: { name: string; selected: boolean }) {
  const map = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 72;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.clearRect(0, 0, 256, 72);
    ctx.fillStyle = selected ? "rgba(28, 22, 12, 0.88)" : "rgba(8, 10, 14, 0.78)";
    ctx.beginPath();
    ctx.roundRect(28, 8, 200, 52, 26);
    ctx.fill();
    if (selected) {
      ctx.strokeStyle = "#e8c98a";
      ctx.lineWidth = 4;
      ctx.stroke();
    }
    ctx.fillStyle = selected ? "#f6e7c4" : "#ffffff";
    ctx.font = "700 32px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(name, 128, 36);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, [name, selected]);

  if (!map) return null;
  return (
    <sprite position={[0, 2.08, 0]} scale={[1.15, 0.32, 1]} raycast={() => null}>
      <spriteMaterial map={map} transparent depthWrite={false} />
    </sprite>
  );
}
