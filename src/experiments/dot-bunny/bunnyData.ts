// ============================================================================
//  DOT-BUNNY — deterministic 1,000-pixel bunny-head bitmap + reveal order
// ============================================================================
//  This module contains NO rendering code. It only *computes* the data:
//    1. A predetermined set of exactly 1,000 integer pixel coordinates whose
//       union forms a Playboy-style bunny-head silhouette (head + 2 ears + bow).
//    2. A deliberate reveal order (sparse scatter -> contours -> full fill).
//
//  Everything is deterministic (seeded RNG) so the final bunny and the reveal
//  sequence are identical on every run. The values below are the tuning knobs.
// ============================================================================

// ----------------------------------------------------------------------------
//  Tunable configuration  (see README-style block at bottom for meaning)
// ----------------------------------------------------------------------------
export const TOTAL_DOTS = 1000;      // exact number of dots
export const DOT_SIZE = 1;           // logical bitmap size of each dot (1x1 px)
export const INTERVAL_MS = 100;      // one new dot every 100ms
export const BACKGROUND = '#FFFFFF'; // page + canvas background
export const BLACK = '#000000';      // dot state 0
export const WHITE = '#FFFFFF';      // dot state 1

const SEED = 1337;                   // change for a different reveal scatter
const EDGE_BIAS = 0.4;               // 0 = pure random reveal, 1 = strict edge-first

// ----------------------------------------------------------------------------
//  Public dot model
// ----------------------------------------------------------------------------
export interface Dot {
  id: number;          // 0..999 — also the reveal index (order it appears)
  x: number;           // integer bitmap coordinate (0-based)
  y: number;           // integer bitmap coordinate (0-based)
  state: 0 | 1;        // 0 = BLACK, 1 = WHITE
  creationTime: number;// seconds after start that this dot appears
}

export interface BunnyData {
  dots: Dot[];         // length 1000, ordered by reveal (dots[0] appears first)
  width: number;       // bitmap width  (in logical pixels)
  height: number;      // bitmap height (in logical pixels)
}

// ----------------------------------------------------------------------------
//  Deterministic PRNG (mulberry32)
// ----------------------------------------------------------------------------
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ----------------------------------------------------------------------------
//  Silhouette definition — pure geometry, tested per integer grid cell.
//  Everything scales with the head radius R so we can hunt for the R that
//  yields ~1000 filled pixels.
// ----------------------------------------------------------------------------
function insideBunny(px: number, py: number, cx: number, cy: number, R: number): boolean {
  // --- Head: slightly tall ellipse -----------------------------------------
  {
    const rx = R;
    const ry = R * 1.0;
    const dx = (px - cx) / rx;
    const dy = (py - cy) / ry;
    if (dx * dx + dy * dy <= 1) return true;
  }

  // --- Ears: two long ellipses, tilted outward, overlapping the head top ----
  const earRx = R * 0.30;
  const earRy = R * 0.95;
  const earTilt = 0.28; // radians (~16deg)
  const earOffsetX = R * 0.42;
  const earCenterY = cy - R * 1.35;
  for (const side of [-1, 1] as const) {
    const ecx = cx + side * earOffsetX;
    const ecy = earCenterY;
    const theta = side * earTilt; // tops splay away from center
    const c = Math.cos(-theta);
    const s = Math.sin(-theta);
    const tx = px - ecx;
    const ty = py - ecy;
    const rxp = (tx * c - ty * s) / earRx;
    const ryp = (tx * s + ty * c) / earRy;
    if (rxp * rxp + ryp * ryp <= 1) return true;
  }

  // --- Bow tie: two triangles + a small knot, just under the head ----------
  {
    const knotX = cx;
    const knotY = cy + R * 0.92;
    const bowW = R * 0.95;
    const bowH = R * 0.55;
    // knot
    if (Math.abs(px - knotX) <= R * 0.14 && Math.abs(py - knotY) <= R * 0.22) return true;
    // triangles: widen linearly from the knot outward
    const relY = Math.abs(py - knotY);
    if (relY <= bowH / 2) {
      const spanAtY = (relY / (bowH / 2)); // 0 at center-line, 1 at top/bottom edge
      const halfWidthHere = bowW * (0.35 + 0.65 * spanAtY);
      const dxk = Math.abs(px - knotX);
      if (dxk >= R * 0.12 && dxk <= halfWidthHere) return true;
    }
  }

  return false;
}

// ----------------------------------------------------------------------------
//  Build the raster mask for a given R inside a padded grid.
// ----------------------------------------------------------------------------
function rasterize(R: number) {
  const width = Math.ceil(R * 2.6);
  const height = Math.ceil(R * 4.0);
  const cx = width / 2;
  const cy = height * 0.55; // head sits a little below vertical center (room for ears)

  const mask: boolean[] = new Array(width * height).fill(false);
  const inside: number[] = [];
  for (let gy = 0; gy < height; gy++) {
    for (let gx = 0; gx < width; gx++) {
      if (insideBunny(gx + 0.5, gy + 0.5, cx, cy, R)) {
        mask[gy * width + gx] = true;
        inside.push(gy * width + gx);
      }
    }
  }
  return { width, height, cx, cy, mask, inside };
}

// ----------------------------------------------------------------------------
//  Chamfer distance transform → distance from each inside pixel to the edge.
//  (used to gently prioritise contour/ear pixels in the reveal order)
// ----------------------------------------------------------------------------
function distanceToEdge(mask: boolean[], width: number, height: number): number[] {
  const INF = 1e9;
  const dist = new Array(width * height).fill(0);
  for (let i = 0; i < mask.length; i++) dist[i] = mask[i] ? INF : 0;

  const at = (x: number, y: number) =>
    x < 0 || y < 0 || x >= width || y >= height ? 0 : dist[y * width + x];

  // forward pass
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!mask[y * width + x]) continue;
      let d = dist[y * width + x];
      d = Math.min(d, at(x - 1, y) + 3);
      d = Math.min(d, at(x, y - 1) + 3);
      d = Math.min(d, at(x - 1, y - 1) + 4);
      d = Math.min(d, at(x + 1, y - 1) + 4);
      dist[y * width + x] = d;
    }
  }
  // backward pass
  for (let y = height - 1; y >= 0; y--) {
    for (let x = width - 1; x >= 0; x--) {
      if (!mask[y * width + x]) continue;
      let d = dist[y * width + x];
      d = Math.min(d, at(x + 1, y) + 3);
      d = Math.min(d, at(x, y + 1) + 3);
      d = Math.min(d, at(x + 1, y + 1) + 4);
      d = Math.min(d, at(x - 1, y + 1) + 4);
      dist[y * width + x] = d;
    }
  }
  return dist;
}

// ----------------------------------------------------------------------------
//  Main builder — runs once at import.
// ----------------------------------------------------------------------------
function buildBunny(): BunnyData {
  const rng = mulberry32(SEED);

  // 1. Find the head radius R that yields just over TOTAL_DOTS filled pixels.
  let chosen = rasterize(8);
  for (let R = 8; R <= 40; R += 0.25) {
    const r = rasterize(R);
    chosen = r;
    if (r.inside.length >= TOTAL_DOTS) break;
  }
  const { width, height, mask, inside } = chosen;

  // 2. Reduce to EXACTLY 1000 pixels. Keep every boundary (edge) pixel so the
  //    silhouette outline stays crisp; thin only the interior if we overshoot.
  const isBoundary = (idx: number) => {
    const x = idx % width;
    const y = Math.floor(idx / width);
    const nb = [
      [x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1],
    ];
    for (const [nx, ny] of nb) {
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) return true;
      if (!mask[ny * width + nx]) return true;
    }
    return false;
  };

  const boundary: number[] = [];
  const interior: number[] = [];
  for (const idx of inside) (isBoundary(idx) ? boundary : interior).push(idx);

  // deterministic shuffle helper
  const shuffle = (arr: number[]) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  let kept: number[];
  if (boundary.length >= TOTAL_DOTS) {
    kept = shuffle([...boundary]).slice(0, TOTAL_DOTS);
  } else {
    const needFromInterior = TOTAL_DOTS - boundary.length;
    const interiorKept = shuffle([...interior]).slice(0, needFromInterior);
    kept = [...boundary, ...interiorKept];
  }

  // 3. Compute reveal order: blend of edge-distance (contours/ears earlier)
  //    and seeded noise (keeps early dots sparse & ambiguous).
  const dist = distanceToEdge(mask, width, height);
  let maxDist = 1;
  for (const idx of kept) maxDist = Math.max(maxDist, dist[idx]);

  const keyOf = new Map<number, number>();
  for (const idx of kept) {
    const normEdge = dist[idx] / maxDist;          // 0 at edge, 1 at center
    const key = EDGE_BIAS * normEdge + (1 - EDGE_BIAS) * rng();
    keyOf.set(idx, key);
  }
  kept.sort((a, b) => keyOf.get(a)! - keyOf.get(b)!);

  // 4. Normalise coordinates to a tight bounding box starting at (0,0).
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const idx of kept) {
    const x = idx % width;
    const y = Math.floor(idx / width);
    minX = Math.min(minX, x); maxX = Math.max(maxX, x);
    minY = Math.min(minY, y); maxY = Math.max(maxY, y);
  }

  const dots: Dot[] = kept.map((idx, i) => ({
    id: i,
    x: (idx % width) - minX,
    y: Math.floor(idx / width) - minY,
    state: 0, // silhouette is drawn in BLACK on the WHITE field
    creationTime: (i * INTERVAL_MS) / 1000,
  }));

  return {
    dots,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  };
}

export const BUNNY: BunnyData = buildBunny();
