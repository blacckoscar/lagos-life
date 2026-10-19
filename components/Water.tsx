"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function Water({
  position,
  size,
  deep = "#083846",
  shallow = "#8ee7f6",
}: {
  position: [number, number, number];
  size: [number, number];
  deep?: string;
  shallow?: string;
}) {
  const material = useRef<THREE.MeshStandardMaterial>(null);
  const map = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const wash = ctx.createLinearGradient(0, 0, 512, 512);
    wash.addColorStop(0, deep);
    wash.addColorStop(0.45, shallow);
    wash.addColorStop(1, deep);
    ctx.fillStyle = wash;
    ctx.fillRect(0, 0, 512, 512);
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 3;
    for (let y = 20; y < 512; y += 36) {
      ctx.beginPath();
      for (let x = 0; x <= 512; x += 12) {
        const wave = y + Math.sin(x * 0.04 + y) * 5;
        if (x === 0) ctx.moveTo(x, wave);
        else ctx.lineTo(x, wave);
      }
      ctx.stroke();
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1.5, 1.5);
    return texture;
  }, [deep, shallow]);

  useFrame((_, delta) => {
    if (material.current?.map) material.current.map.offset.x += delta * 0.02;
  });

  return (
    <mesh position={position} rotation-x={-Math.PI / 2} raycast={() => null}>
      <planeGeometry args={size} />
      <meshStandardMaterial
        ref={material}
        map={map ?? undefined}
        color={shallow}
        emissive={deep}
        emissiveIntensity={0.45}
        roughness={0.16}
        metalness={0.08}
      />
    </mesh>
  );
}
