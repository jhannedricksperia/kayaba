// Real nearby evacuation candidates and waterways from OpenStreetMap (Overpass API).
const ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
];

const KINDS = {
  school: { label: 'School', icon: 'school' },
  community_centre: { label: 'Community center', icon: 'groups' },
  townhall: { label: 'Town / barangay hall', icon: 'account_balance' },
  hospital: { label: 'Hospital', icon: 'local_hospital' },
  shelter: { label: 'Shelter', icon: 'night_shelter' },
  assembly_point: { label: 'Assembly point', icon: 'flag' },
};

export function distanceM(a, b) {
  const R = 6371000;
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLon = (b.lon - a.lon) * rad;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export async function fetchNearby(place, signal) {
  const { lat, lon } = place;
  const query = `[out:json][timeout:25];
(
  nwr(around:3000,${lat},${lon})[amenity~"^(school|community_centre|townhall|hospital|shelter)$"];
  nwr(around:3000,${lat},${lon})[emergency=assembly_point];
);
out center 60;
way(around:2000,${lat},${lon})[waterway~"^(river|stream|canal)$"];
out geom 40;`;

  let lastError;
  for (const url of ENDPOINTS) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        body: 'data=' + encodeURIComponent(query),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        signal,
      });
      if (!res.ok) throw new Error(`Overpass ${res.status}`);
      const json = await res.json();
      return parse(json.elements || [], place);
    } catch (e) {
      if (e.name === 'AbortError') throw e;
      lastError = e;
    }
  }
  throw lastError;
}

function parse(elements, place) {
  const shelters = [];
  const waterways = [];
  for (const el of elements) {
    const tags = el.tags || {};
    if (tags.waterway && el.geometry) {
      waterways.push({
        name: tags.name || tags.waterway,
        points: el.geometry.map((g) => [g.lat, g.lon]),
      });
      continue;
    }
    const lat = el.lat ?? el.center?.lat;
    const lon = el.lon ?? el.center?.lon;
    if (lat == null || lon == null) continue;
    const kind = tags.amenity || tags.emergency;
    const meta = KINDS[kind];
    if (!meta) continue;
    shelters.push({
      id: `${el.type}/${el.id}`,
      name: tags.name || meta.label,
      kind: meta.label,
      icon: meta.icon,
      lat,
      lon,
      distance: Math.round(distanceM(place, { lat, lon })),
    });
  }
  shelters.sort((a, b) => a.distance - b.distance);
  return { shelters: shelters.slice(0, 25), waterways };
}
