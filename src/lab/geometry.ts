/* ============================================================
   geometry.ts — procedural point-cloud generators
   Everything the world shows is generated here: the water
   bottle, the rabbit, the tree and the binary lattice are all
   emitted as clouds of dots + line edges. Monochrome, unit-scale.
   ============================================================ */

export type Pt = [number, number, number];
export type Edge = [Pt, Pt];
export interface Cloud {
  points: Pt[];
  edges: Edge[];
}

// deterministic pseudo-random so the lab regenerates identically
let _seed = 0x9e3779b9;
export function rng(): number {
  _seed ^= _seed << 13;
  _seed ^= _seed >>> 17;
  _seed ^= _seed << 5;
  return ((_seed >>> 0) % 100000) / 100000;
}
export function reseed(n: number) {
  _seed = n >>> 0 || 1;
}

const TAU = Math.PI * 2;

/* ---------- primitives ---------- */

// points scattered on the surface of a sphere (shell), lightly jittered
function sphereShell(cx: number, cy: number, cz: number, r: number, count: number, squashY = 1): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i < count; i++) {
    // fibonacci sphere for even coverage
    const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    const j = 0.06 * r;
    pts.push([
      cx + r * Math.sin(phi) * Math.cos(theta) + (rng() - 0.5) * j,
      cy + r * squashY * Math.cos(phi) + (rng() - 0.5) * j,
      cz + r * Math.sin(phi) * Math.sin(theta) + (rng() - 0.5) * j,
    ]);
  }
  return pts;
}

// a ring of points in the XZ plane at height y
function ring(cx: number, cy: number, cz: number, r: number, count: number): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i < count; i++) {
    const a = (i / count) * TAU;
    pts.push([cx + Math.cos(a) * r, cy, cz + Math.sin(a) * r]);
  }
  return pts;
}

// sample dots evenly along a segment
function alongSegment(a: Pt, b: Pt, count: number, jitter = 0): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i <= count; i++) {
    const t = i / count;
    pts.push([
      a[0] + (b[0] - a[0]) * t + (rng() - 0.5) * jitter,
      a[1] + (b[1] - a[1]) * t + (rng() - 0.5) * jitter,
      a[2] + (b[2] - a[2]) * t + (rng() - 0.5) * jitter,
    ]);
  }
  return pts;
}

/* ---------- OBJECT: water bottle ---------- */
// radius profile as a function of height y ∈ [-5, 5.4]
function bottleRadius(y: number): number {
  if (y < -4) return 2.6 * Math.sqrt(Math.max(0, 1 - ((y + 4) / 1.6) ** 2)); // rounded base
  if (y < 1) return 2.6;                                   // body
  if (y < 2.6) return 2.6 - (y - 1) * (1.6 / 1.6);         // shoulder taper -> 1.0
  if (y < 4.4) return 1.0;                                 // neck
  if (y < 5.4) return 1.0 + (y - 4.4) * 0.45;              // cap flare
  return 0;
}

export function generateBottle(): Cloud {
  const points: Pt[] = [];
  for (let y = -5; y <= 5.4; y += 0.34) {
    const r = bottleRadius(y);
    if (r <= 0.02) continue;
    const n = Math.max(6, Math.round(r * 7));
    points.push(...ring(0, y, 0, r, n));
  }
  // faint "water level" disc inside the body
  for (let k = 0; k < 40; k++) {
    const rr = Math.sqrt(rng()) * 2.4;
    const a = rng() * TAU;
    points.push([Math.cos(a) * rr, -1.2 + (rng() - 0.5) * 0.1, Math.sin(a) * rr]);
  }
  return { points, edges: [] };
}

/* ---------- OBJECT: rabbit ---------- */
export function generateRabbit(): Cloud {
  const points: Pt[] = [];
  points.push(...sphereShell(0, -1.6, 0, 2.5, 150, 1.05));   // body
  points.push(...sphereShell(0, 1.7, 0.4, 1.55, 90, 1.0));   // head
  // ears — two tilted ellipsoid columns
  for (const side of [-1, 1]) {
    for (let i = 0; i < 26; i++) {
      const t = i / 25;
      const y = 2.7 + t * 3.2;
      const r = 0.5 * Math.sin(Math.min(1, t + 0.15) * Math.PI) + 0.12;
      const cx = side * (0.6 + t * 0.5);
      points.push(...ring(cx, y, 0.4, r, 6));
    }
  }
  points.push(...sphereShell(0, -2.6, -2.1, 0.7, 22));       // tail
  // eyes (denser marker dots)
  for (const side of [-1, 1]) {
    points.push([side * 0.62, 1.9, 1.75], [side * 0.6, 1.86, 1.78], [side * 0.64, 1.94, 1.72]);
  }
  return { points, edges: [] };
}

/* ---------- OBJECT: recursive binary tree ---------- */
// a real binary-branching structure: dots along every branch + node edges
export function generateTree(depth = 7): Cloud {
  const points: Pt[] = [];
  const edges: Edge[] = [];

  function grow(base: Pt, dir: Pt, len: number, d: number) {
    const tip: Pt = [base[0] + dir[0] * len, base[1] + dir[1] * len, base[2] + dir[2] * len];
    edges.push([base, tip]);
    points.push(...alongSegment(base, tip, Math.max(2, Math.round(len * 1.6)), 0.05 * d));
    if (d <= 0) {
      // canopy leaf cluster
      for (let k = 0; k < 10; k++) {
        points.push([
          tip[0] + (rng() - 0.5) * 1.1,
          tip[1] + (rng() - 0.5) * 1.1,
          tip[2] + (rng() - 0.5) * 1.1,
        ]);
      }
      return;
    }
    const spread = 0.5 + rng() * 0.25;
    const nextLen = len * (0.68 + rng() * 0.06);
    // two children, mirrored, with a little z wander so it lives in 3D
    for (const s of [-1, 1]) {
      const ang = spread * s;
      const nx = dir[0] * Math.cos(ang) - dir[1] * Math.sin(ang);
      const ny = dir[0] * Math.sin(ang) + dir[1] * Math.cos(ang);
      const nz = dir[2] + (rng() - 0.5) * 0.28;
      const m = Math.hypot(nx, ny, nz) || 1;
      grow(tip, [nx / m, ny / m, nz / m], nextLen, d - 1);
    }
  }

  reseed(1337);
  grow([0, -6, 0], [0, 1, 0], 4.4, depth);
  return { points, edges };
}

/* ---------- STRUCTURE: 3D binary lattice through depth ---------- */
// nodes fan out in x/y while marching along -Z: the "data → structure" spine
export function generateLattice(depth = 5, zStep = -34): Cloud {
  const points: Pt[] = [];
  const edges: Edge[] = [];

  function branch(pos: Pt, d: number, spreadX: number) {
    points.push(pos);
    if (d <= 0) return;
    const z = pos[2] + zStep;
    for (const s of [-1, 1]) {
      const child: Pt = [
        pos[0] + s * spreadX,
        pos[1] + (rng() - 0.5) * spreadX * 0.5,
        z,
      ];
      edges.push([pos, child]);
      points.push(...alongSegment(pos, child, 5));
      branch(child, d - 1, spreadX * 0.62);
    }
  }

  reseed(2027);
  branch([0, 0, 0], depth, 30);
  return { points, edges };
}

/* ---------- ambient dust field (with 4D coordinate) ---------- */
export interface Field {
  positions: Float32Array; // xyz home
  w: Float32Array;         // 4th coordinate
  seed: Float32Array;      // per-point randomness
  count: number;
}

export function generateField(count: number): Field {
  const positions = new Float32Array(count * 3);
  const w = new Float32Array(count);
  const seed = new Float32Array(count);
  reseed(99);
  for (let i = 0; i < count; i++) {
    positions[i * 3 + 0] = (rng() - 0.5) * 220;
    positions[i * 3 + 1] = (rng() - 0.5) * 150;
    positions[i * 3 + 2] = 60 - rng() * 680;
    w[i] = (rng() - 0.5) * 2;
    seed[i] = rng();
  }
  return { positions, w, seed, count };
}

/* ---------- helpers to bake clouds into flat buffers ---------- */
export function offset(points: Pt[], dx: number, dy: number, dz: number): Pt[] {
  return points.map(([x, y, z]) => [x + dx, y + dy, z + dz] as Pt);
}

export function toFloat32(points: Pt[]): Float32Array {
  const arr = new Float32Array(points.length * 3);
  for (let i = 0; i < points.length; i++) {
    arr[i * 3] = points[i][0];
    arr[i * 3 + 1] = points[i][1];
    arr[i * 3 + 2] = points[i][2];
  }
  return arr;
}

export function edgesToFloat32(edges: Edge[]): Float32Array {
  const arr = new Float32Array(edges.length * 6);
  for (let i = 0; i < edges.length; i++) {
    const [a, b] = edges[i];
    arr[i * 6 + 0] = a[0]; arr[i * 6 + 1] = a[1]; arr[i * 6 + 2] = a[2];
    arr[i * 6 + 3] = b[0]; arr[i * 6 + 4] = b[1]; arr[i * 6 + 5] = b[2];
  }
  return arr;
}
