import * as THREE from "three";

function canvasTexture(draw: (ctx: CanvasRenderingContext2D, size: number) => void, size = 512) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  draw(ctx, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 8;
  return texture;
}

export function marbleTexture() {
  const texture = canvasTexture((ctx, size) => {
    ctx.fillStyle = "#f7f3ec";
    ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 14; i += 1) {
      ctx.strokeStyle = `rgba(176, 164, 146, ${0.12 + (i % 3) * 0.05})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      let x = Math.random() * size;
      let y = Math.random() * size;
      ctx.moveTo(x, y);
      for (let k = 0; k < 7; k += 1) {
        x += (Math.random() - 0.5) * 180;
        y += (Math.random() - 0.4) * 90;
        ctx.quadraticCurveTo(x, y, x + 20, y + 10);
      }
      ctx.stroke();
    }
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    for (let i = 0; i < 40; i += 1) {
      ctx.fillRect(Math.random() * size, Math.random() * size, 18, 2);
    }
  });
  texture.repeat.set(2.4, 2.1);
  return texture;
}

export function grassTexture() {
  const texture = canvasTexture((ctx, size) => {
    ctx.fillStyle = "#1d5a38";
    ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 700; i += 1) {
      const shade = 40 + Math.floor(Math.random() * 50);
      ctx.fillStyle = `rgba(${shade * 0.4}, ${shade + 50}, ${shade * 0.45}, 0.35)`;
      ctx.fillRect(Math.random() * size, Math.random() * size, 3, 8);
    }
  }, 256);
  texture.repeat.set(8, 8);
  return texture;
}

export function stoneTexture() {
  const texture = canvasTexture((ctx, size) => {
    ctx.fillStyle = "#d9d3c8";
    ctx.fillRect(0, 0, size, size);
    const tile = 64;
    for (let y = 0; y < size; y += tile) {
      for (let x = 0; x < size; x += tile) {
        const shift = (y / tile) % 2 === 0 ? 0 : tile / 2;
        ctx.fillStyle = (x + y) % (tile * 2) === 0 ? "#e6e0d6" : "#cfc6b8";
        ctx.fillRect(x + shift, y, tile - 3, tile - 3);
      }
    }
  });
  texture.repeat.set(6, 4);
  return texture;
}

export function roadTexture() {
  const texture = canvasTexture((ctx, size) => {
    ctx.fillStyle = "#2a2e33";
    ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 80; i += 1) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.04})`;
      ctx.fillRect(Math.random() * size, Math.random() * size, 20, 8);
    }
  }, 256);
  texture.repeat.set(10, 2);
  return texture;
}

function mulberry(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function facadeTextures(base: string, seed: number) {
  const colorCanvas = document.createElement("canvas");
  const glowCanvas = document.createElement("canvas");
  colorCanvas.width = glowCanvas.width = 128;
  colorCanvas.height = glowCanvas.height = 256;
  const colorCtx = colorCanvas.getContext("2d");
  const glowCtx = glowCanvas.getContext("2d");
  if (!colorCtx || !glowCtx) throw new Error("Canvas unavailable");
  const rand = mulberry(seed);
  colorCtx.fillStyle = base;
  colorCtx.fillRect(0, 0, 128, 256);
  glowCtx.fillStyle = "#000";
  glowCtx.fillRect(0, 0, 128, 256);
  for (let y = 0; y < 9; y += 1) {
    for (let x = 0; x < 4; x += 1) {
      const lit = rand() > 0.32;
      const warm = rand() > 0.7;
      colorCtx.fillStyle = lit ? (warm ? "#ffc27a" : "#fff0cc") : "#141a22";
      colorCtx.fillRect(12 + x * 28, 14 + y * 26, 16, 16);
      if (lit) {
        glowCtx.fillStyle = warm ? "#ff9a3c" : "#ffd89a";
        glowCtx.fillRect(12 + x * 28, 14 + y * 26, 16, 16);
      }
    }
  }
  const map = new THREE.CanvasTexture(colorCanvas);
  const glow = new THREE.CanvasTexture(glowCanvas);
  map.colorSpace = THREE.SRGBColorSpace;
  glow.colorSpace = THREE.SRGBColorSpace;
  return { map, glow };
}

export function signTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  ctx.clearRect(0, 0, 1024, 256);
  ctx.fillStyle = "#140e08";
  roundRect(ctx, 8, 18, 1008, 220, 28);
  ctx.fill();
  ctx.strokeStyle = "#e8c98a";
  ctx.lineWidth = 6;
  roundRect(ctx, 22, 32, 980, 192, 18);
  ctx.stroke();
  ctx.fillStyle = "#f3dfb4";
  ctx.font = "700 92px Georgia, serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("OSCAR LIFE", 512, 118);
  ctx.font = "500 28px Georgia, serif";
  ctx.fillStyle = "#c6a56a";
  ctx.fillText("VICTORIA ISLAND", 512, 176);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function moonTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  const glow = ctx.createRadialGradient(128, 128, 20, 128, 128, 120);
  glow.addColorStop(0, "rgba(255,248,230,1)");
  glow.addColorStop(0.32, "rgba(255,236,196,0.85)");
  glow.addColorStop(1, "rgba(255,236,196,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 256, 256);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
