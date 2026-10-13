// Local terrain from Open-Meteo's elevation API (Copernicus DEM, ~90 m).
// An 11x11 grid (±1 km, 200 m spacing) tells whether the point sits in a bowl or on a rise,
// and lets the map show where water would pool.
const ELEVATION = 'https://api.open-meteo.com/v1/elevation';
const N = 5; // grid half-width -> (2N+1)^2 = 121 points
const STEP_M = 200;
const CHUNK = 100; // API limit per request

export async function fetchTerrain(place, signal) {
  const dLat = STEP_M / 111320;
  const dLon = STEP_M / (111320 * Math.cos((place.lat * Math.PI) / 180));
  const lats = [];
  const lons = [];
  for (let y = -N; y <= N; y++) {
    for (let x = -N; x <= N; x++) {
      lats.push(+(place.lat + y * dLat).toFixed(5));
      lons.push(+(place.lon + x * dLon).toFixed(5));
    }
  }
  const requests = [];
  for (let i = 0; i < lats.length; i += CHUNK) {
    const url = `${ELEVATION}?latitude=${lats.slice(i, i + CHUNK).join(',')}&longitude=${lons.slice(i, i + CHUNK).join(',')}`;
    requests.push(
      fetch(url, { signal }).then((r) => {
        if (!r.ok) throw new Error('Elevation request failed');
        return r.json();
      })
    );
  }
  const parts = await Promise.all(requests);
  const elevation = parts.flatMap((p) => p.elevation);
  const summary = summarizeTerrain(elevation, N);
  return {
    ...summary,
    grid: { n: N, lat0: place.lat, lon0: place.lon, dLat, dLon, elev: elevation },
  };
}

export function summarizeTerrain(grid, n = N) {
  const size = 2 * n + 1;
  const center = grid[Math.floor(grid.length / 2)];
  const sorted = [...grid].sort((a, b) => a - b);
  const mean = grid.reduce((a, b) => a + b, 0) / grid.length;
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const higher = grid.filter((e) => e > center + 0.5).length;
  const lower = grid.filter((e) => e < center - 0.5).length;
  // Inner ring average vs centre: positive = centre sits below its surroundings.
  const inner = [];
  for (let y = n - 1; y <= n + 1; y++) for (let x = n - 1; x <= n + 1; x++) if (!(x === n && y === n)) inner.push(grid[y * size + x]);
  const innerMean = inner.reduce((a, b) => a + b, 0) / inner.length;
  return {
    pointElevation: Math.round(center),
    meanElevation: +mean.toFixed(1),
    minElevation: Math.round(min),
    maxElevation: Math.round(max),
    relief: Math.round(max - min),
    belowMean: +(mean - center).toFixed(1),
    belowInnerRing: +(innerMean - center).toFixed(1),
    percentHigherAround: Math.round((higher / grid.length) * 100),
    percentLowerAround: Math.round((lower / grid.length) * 100),
    gridSpacingM: STEP_M,
    gridRadiusM: STEP_M * n,
  };
}

// Water pools where ground is lower than its surroundings and drains away from rises.
// Returns a multiplier on rain-derived depth: ~0.5 (hill-top) … ~1.8 (deep bowl).
export function terrainFactor(t) {
  if (!t) return 1;
  const basin = Math.max(-6, Math.min(6, t.belowMean)); // metres below/above area mean
  const f = 1 + basin * 0.14 + Math.max(-2, Math.min(2, t.belowInnerRing)) * 0.1;
  return +Math.max(0.5, Math.min(1.8, f)).toFixed(2);
}

// Simple "bathtub" estimate: water at the user's spot is `depth` deep, so every cell lower than
// that water surface holds water. Illustrative only, it ignores drainage and flow paths.
export function floodCells(grid, depth) {
  if (!grid || depth <= 0) return [];
  const size = 2 * grid.n + 1;
  const level = grid.elev[Math.floor(grid.elev.length / 2)] + depth;
  const cells = [];
  grid.elev.forEach((e, i) => {
    const d = level - e;
    if (d < 0.05) return;
    const y = Math.floor(i / size) - grid.n;
    const x = (i % size) - grid.n;
    cells.push({
      lat: grid.lat0 + y * grid.dLat,
      lon: grid.lon0 + x * grid.dLon,
      depth: Math.min(d, 3),
    });
  });
  return cells;
}
