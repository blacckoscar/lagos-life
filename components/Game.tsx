"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { clampSpot, SPAWNS, type PersonId, type Place, type XZ } from "@/lib/bounds";
import { CityWorld } from "@/components/CityWorld";
import { HomeWorld } from "@/components/HomeWorld";
import { PEOPLE, Person, type WalkGoal } from "@/components/Person";

export default function Game() {
  const [place, setPlace] = useState<Place>("home");
  const [fade, setFade] = useState(false);
  const [selected, setSelected] = useState<PersonId>("you");
  const [goal, setGoal] = useState<WalkGoal | null>(null);
  const [clock, setClock] = useState("");
  const poses = useRef<Record<PersonId, XZ>>({ ...SPAWNS.home });

  useEffect(() => {
    const tick = () =>
      setClock(
        new Date().toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        }),
      );
    tick();
    const id = window.setInterval(tick, 15000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    poses.current = { ...SPAWNS[place] };
    setGoal(null);
  }, [place]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const dir: Record<string, [number, number]> = {
        arrowup: [0, -1],
        w: [0, -1],
        arrowdown: [0, 1],
        s: [0, 1],
        arrowleft: [-1, 0],
        a: [-1, 0],
        arrowright: [1, 0],
        d: [1, 0],
      };
      const step = dir[key];
      if (!step) return;
      event.preventDefault();
      const current = poses.current[selected];
      const next = clampSpot(place, current.x + step[0] * 1.5, current.z + step[1] * 1.5);
      setGoal({ id: selected, x: next.x, z: next.z, n: Date.now() });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [place, selected]);

  const travel = (next: Place) => {
    if (fade || next === place) return;
    setFade(true);
    window.setTimeout(() => {
      setPlace(next);
      setFade(false);
    }, 420);
  };

  const walkTo = (x: number, z: number) => {
    const spot = clampSpot(place, x, z);
    setGoal({ id: selected, x: spot.x, z: spot.z, n: Date.now() });
  };

  const active = PEOPLE.find((person) => person.id === selected) ?? PEOPLE[0];

  return (
    <main className="stage">
      <div className="canvas-wrap">
        <Canvas
          shadows
          dpr={[1, 1.6]}
          camera={{ position: [13.5, 11.5, 13.5], fov: 38, near: 0.1, far: 220 }}
          gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
          onCreated={({ gl }) => {
            gl.toneMappingExposure = 1.08;
          }}
        >
          <color attach="background" args={["#102033"]} />
          <fog attach="fog" args={["#102033", place === "home" ? 28 : 55, place === "home" ? 80 : 140]} />
          <Stars radius={120} depth={40} count={900} factor={3} fade speed={0.25} />
          {place === "home" ? <HomeWorld onWalk={walkTo} /> : <CityWorld onWalk={walkTo} />}
          {PEOPLE.map((person) => (
            <Person
              key={`${place}-${person.id}`}
              look={person}
              spawn={SPAWNS[place][person.id]}
              goal={goal}
              selected={selected === person.id}
              onSelect={setSelected}
              poses={poses}
            />
          ))}
          <Marker goal={goal} />
          <CameraRig place={place} />
          <OrbitControls
            makeDefault
            enableDamping
            dampingFactor={0.08}
            maxPolarAngle={1.15}
            minPolarAngle={0.55}
            minDistance={place === "home" ? 8 : 14}
            maxDistance={place === "home" ? 26 : 52}
            enablePan
          />
        </Canvas>
      </div>

      <header className="top">
        <div className="brand-row">
          <p className="brand">Lagos Life</p>
          <p className="where">{place === "home" ? "Your house" : "Victoria Island"}</p>
        </div>
        <div className="pills">
          <span className="pill">
            {clock || "—"}
          </span>
          <span className="pill">{place === "home" ? "😊 At home" : "😊 In the city"}</span>
          <span className="pill money">₦10,000,000</span>
          <span className="pill">
            <span className="dot" /> 4.7k online
          </span>
        </div>
      </header>

      <footer className="bottom">
        <p className="hint">
          Drag to look around. Tap the floor and {active.name} will walk.
        </p>
        <div className="people" role="tablist" aria-label="People in the house">
          {PEOPLE.map((person) => (
            <button
              key={person.id}
              type="button"
              className={person.id === selected ? "person-btn active" : "person-btn"}
              onClick={() => setSelected(person.id)}
            >
              <span className="swatch" style={{ background: person.top }} />
              {person.name}
            </button>
          ))}
        </div>
        {place === "home" ? (
          <button type="button" className="go" onClick={() => travel("city")}>
            Visit the city
          </button>
        ) : (
          <button type="button" className="go" onClick={() => travel("home")}>
            Back home
          </button>
        )}
      </footer>

      <div className={fade ? "fade on" : "fade"} />
    </main>
  );
}

function CameraRig({ place }: { place: Place }) {
  const camera = useThree((state) => state.camera);
  const controls = useThree((state) => state.controls) as OrbitControlsImpl | null;
  const locked = useRef(false);
  const pose = useMemo(() => place, [place]);

  useFrame(() => {
    if (!controls) return;
    if (pose === "home" && !locked.current) {
      const angle = controls.getAzimuthalAngle();
      controls.minAzimuthAngle = angle - 0.85;
      controls.maxAzimuthAngle = angle + 0.85;
      locked.current = true;
    }
  });

  useEffect(() => {
    locked.current = false;
    if (place === "home") {
      camera.position.set(13.5, 11.2, 14);
      controls?.target.set(0.4, 0.4, 0.2);
      if (controls) {
        controls.minAzimuthAngle = -Infinity;
        controls.maxAzimuthAngle = Infinity;
      }
    } else {
      camera.position.set(26, 22, 32);
      controls?.target.set(0, 1.2, -4);
      if (controls) {
        controls.minAzimuthAngle = -Infinity;
        controls.maxAzimuthAngle = Infinity;
      }
    }
    controls?.update();
  }, [camera, controls, place]);

  return null;
}

function Marker({ goal }: { goal: WalkGoal | null }) {
  const mesh = useRef<THREE.Mesh>(null);
  const life = useRef(1);
  const seen = useRef(-1);

  useFrame((_, delta) => {
    const ring = mesh.current;
    if (!ring || !goal) return;
    if (goal.n !== seen.current) {
      seen.current = goal.n;
      life.current = 0;
      ring.visible = true;
      ring.position.set(goal.x, 0.06, goal.z);
    }
    life.current += delta;
    const scale = 0.45 + life.current * 1.8;
    ring.scale.setScalar(scale);
    const material = ring.material as THREE.MeshBasicMaterial;
    material.opacity = Math.max(0, 0.75 - life.current);
    if (life.current > 0.85) ring.visible = false;
  });

  return (
    <mesh ref={mesh} rotation-x={-Math.PI / 2} visible={false} raycast={() => null}>
      <ringGeometry args={[0.22, 0.32, 24]} />
      <meshBasicMaterial color="#f2d7a2" transparent opacity={0.8} />
    </mesh>
  );
}
