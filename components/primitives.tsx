"use client";

export function Block({
  position,
  size,
  color,
  roughness = 0.72,
  metalness = 0,
  emissive,
  emissiveIntensity = 1,
  opacity = 1,
}: {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  roughness?: number;
  metalness?: number;
  emissive?: string;
  emissiveIntensity?: number;
  opacity?: number;
}) {
  return (
    <mesh position={position} castShadow receiveShadow raycast={() => null}>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        roughness={roughness}
        metalness={metalness}
        emissive={emissive ?? "#000"}
        emissiveIntensity={emissive ? emissiveIntensity : 0}
        transparent={opacity < 1}
        opacity={opacity}
        depthWrite={opacity === 1}
      />
    </mesh>
  );
}

export function Plant({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.16, 0]} castShadow raycast={() => null}>
        <cylinderGeometry args={[0.16, 0.13, 0.28, 12]} />
        <meshStandardMaterial color="#f4f1ea" roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.22, 0]} raycast={() => null}>
        <cylinderGeometry args={[0.18, 0.18, 0.05, 12]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[0, 0.52, 0]} castShadow raycast={() => null}>
        <sphereGeometry args={[0.26, 14, 14]} />
        <meshStandardMaterial color="#246846" roughness={0.85} />
      </mesh>
      <mesh position={[0.16, 0.68, 0.04]} castShadow raycast={() => null}>
        <sphereGeometry args={[0.16, 12, 12]} />
        <meshStandardMaterial color="#318256" roughness={0.85} />
      </mesh>
    </group>
  );
}

export function Palm({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.2, 0]} castShadow raycast={() => null}>
        <cylinderGeometry args={[0.08, 0.15, 2.4, 7]} />
        <meshStandardMaterial color="#6d4c2f" roughness={0.9} />
      </mesh>
      <mesh position={[0, 2.35, 0]} raycast={() => null}>
        <sphereGeometry args={[0.28, 12, 12]} />
        <meshStandardMaterial color="#1f6b3d" />
      </mesh>
      {Array.from({ length: 7 }).map((_, index) => {
        const angle = (index / 7) * Math.PI * 2;
        return (
          <mesh
            key={index}
            position={[Math.cos(angle) * 0.42, 2.28, Math.sin(angle) * 0.42]}
            raycast={() => null}
          >
            <sphereGeometry args={[0.22, 10, 10]} />
            <meshStandardMaterial color={index % 2 ? "#217a46" : "#39a265"} />
          </mesh>
        );
      })}
    </group>
  );
}

export function Car({
  position,
  color,
  rotation = 0,
}: {
  position: [number, number, number];
  color: string;
  rotation?: number;
}) {
  const wheels: [number, number, number][] = [
    [-0.42, 0.16, 0.72],
    [0.42, 0.16, 0.72],
    [-0.42, 0.16, -0.72],
    [0.42, 0.16, -0.72],
  ];
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.28, 0]} castShadow raycast={() => null}>
        <boxGeometry args={[1.12, 0.32, 2.35]} />
        <meshStandardMaterial color={color} metalness={0.62} roughness={0.28} />
      </mesh>
      <mesh position={[0, 0.52, -0.12]} raycast={() => null}>
        <boxGeometry args={[0.96, 0.28, 1.15]} />
        <meshStandardMaterial color="#d5e4ef" metalness={0.15} roughness={0.12} />
      </mesh>
      <mesh position={[0, 0.34, 1.16]} raycast={() => null}>
        <boxGeometry args={[0.7, 0.08, 0.06]} />
        <meshStandardMaterial color="#ffe7b8" emissive="#ffd27a" emissiveIntensity={0.8} />
      </mesh>
      {wheels.map((wheel) => (
        <mesh key={wheel.join()} position={wheel} rotation={[0, 0, Math.PI / 2]} raycast={() => null}>
          <cylinderGeometry args={[0.16, 0.16, 0.14, 14]} />
          <meshStandardMaterial color="#151515" />
        </mesh>
      ))}
    </group>
  );
}
