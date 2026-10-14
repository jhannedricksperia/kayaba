// Vercel serverless function: looks up nearby evacuation candidates and waterways in
// OpenStreetMap (Overpass) from the server, where it is faster and more reliable than from a
// phone. Responses are cached at the CDN so each area is only fetched once a day.
const ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
  'https://lz4.overpass-api.de/api/interpreter',
];

async function post(url, query) {
  const res = await fetch(url, {
    method: 'POST',
    body: 'data=' + encodeURIComponent(query),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'kaya-ba/1.0 (flood forecast demo; https://kayaba.vercel.app)',
    },
    signal: AbortSignal.timeout(7000),
  });
  if (!res.ok) throw new Error(`Overpass ${res.status}`);
  return (await res.json()).elements || [];
}

// first good answer from any mirror wins
const run = (query) => Promise.any(ENDPOINTS.map((url) => post(url, query)));

// Fallback when every Overpass mirror is down: Nominatim (a separate OSM service) searched
// for the same kinds of places inside a box around the point, shaped like Overpass elements.
const NOMINATIM_TERMS = ['school', 'barangay hall', 'city hall', 'covered court', 'gymnasium', 'community center', 'church'];

async function viaNominatim(lat, lon) {
  const dLat = 0.022;
  const dLon = 0.024;
  const viewbox = [lon - dLon, lat + dLat, lon + dLon, lat - dLat].join(',');
  const seen = new Map();
  for (const term of NOMINATIM_TERMS) {
    try {
      const url =
        'https://nominatim.openstreetmap.org/search?' +
        new URLSearchParams({ q: term, viewbox, bounded: '1', format: 'jsonv2', limit: '30', extratags: '1' });
      const res = await fetch(url, {
        headers: { 'User-Agent': 'kaya-ba/1.0 (flood forecast demo; https://kayaba.vercel.app)' },
        signal: AbortSignal.timeout(6000),
      });
      if (res.ok) {
        for (const r of await res.json()) {
          if (seen.has(r.place_id)) continue;
          seen.set(r.place_id, {
            type: r.osm_type,
            id: r.osm_id,
            lat: Number(r.lat),
            lon: Number(r.lon),
            tags: { ...(r.extratags || {}), [r.category]: r.type, ...(r.name ? { name: r.name } : {}) },
          });
        }
      }
    } catch {
      /* skip this term */
    }
    await new Promise((r) => setTimeout(r, 1100)); // Nominatim allows ~1 request/second
  }
  if (!seen.size) throw new Error('Nominatim returned nothing');
  return [...seen.values()];
}

export default async function handler(req, res) {
  const lat = Number(req.query?.lat);
  const lon = Number(req.query?.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
    return res.status(400).json({ error: 'Invalid location' });
  }
  // round so nearby visitors share one cached answer (~110 m)
  const la = lat.toFixed(3);
  const lo = lon.toFixed(3);
  const near = `around:2500,${la},${lo}`;

  const sheltersQuery = `[out:json][timeout:20];
(
  nwr(${near})[amenity~"^(school|college|community_centre|townhall|conference_centre|events_venue|shelter)$"];
  nwr(${near})[leisure~"^(sports_centre|sports_hall)$"];
  nwr(${near})[building~"^(sports_hall|civic|church|cathedral|chapel)$"];
  nwr(${near})[emergency=assembly_point];
);
out center 120;`;
  const waterQuery = `[out:json][timeout:20];
way(around:1500,${la},${lo})[waterway~"^(river|stream|canal)$"];
out geom 30;`;

  const [s0, w] = await Promise.allSettled([run(sheltersQuery), run(waterQuery)]);
  let s = s0;
  let fallback = false;
  if (s.status === 'rejected') {
    // Overpass is overloaded: look the shelters up through Nominatim instead
    try {
      s = { status: 'fulfilled', value: await viaNominatim(lat, lon) };
      fallback = true;
    } catch {
      /* keep the rejection */
    }
  }
  if (s.status === 'rejected' && w.status === 'rejected') {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(502).json({ error: 'OpenStreetMap lookup unavailable' });
  }
  const complete = s.status === 'fulfilled' && w.status === 'fulfilled' && !fallback;
  res.setHeader('Cache-Control', complete ? 's-maxage=86400, stale-while-revalidate=604800' : fallback ? 's-maxage=1800' : 'no-store');
  return res.status(200).json({
    elements: [...(s.value || []), ...(w.value || [])],
    sheltersFailed: s.status === 'rejected',
  });
}
