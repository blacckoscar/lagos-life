export type Place = "home" | "city";
export type PersonId = "you" | "amaka" | "tunde";

export type XZ = { x: number; z: number };

export const SPAWNS: Record<Place, Record<PersonId, XZ>> = {
  home: {
    you: { x: -2.15, z: 3.15 },
    amaka: { x: 4.35, z: 1.05 },
    tunde: { x: 2.35, z: -4.35 },
  },
  city: {
    you: { x: 0.2, z: 5.4 },
    amaka: { x: -2.5, z: 3.3 },
    tunde: { x: 2.7, z: 3.6 },
  },
};

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

export function clampSpot(place: Place, x: number, z: number): XZ {
  if (place === "home") {
    return { x: clamp(x, -7.25, 7.25), z: clamp(z, -6.35, 11.4) };
  }
  return { x: clamp(x, -21.5, 21.5), z: clamp(z, -14.5, 13.5) };
}
