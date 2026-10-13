// Real nearby evacuation candidates and waterways from OpenStreetMap (Overpass API).
// In the Philippines evacuees usually go to the nearest public school, covered court / gym,
// barangay or city hall, convention center or church, so those are what we look for.
const ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
];

const KINDS = {
  public_school: { label: 'Public school', icon: 'school', weight: 1.0 },
  school: { label: 'School', icon: 'school', weight: 1.5 },
  campus: { label: 'College / university', icon: 'school', weight: 1.4 },
  covered_court: { label: 'Covered court / gym', icon: 'sports_basketball', weight: 1.0 },
  hall: { label: 'Barangay / city hall', icon: 'account_balance', weight: 1.0 },
  community: { label: 'Community center', icon: 'groups', weight: 1.0 },
  convention: { label: 'Convention / events center', icon: 'meeting_room', weight: 1.1 },
  church: { label: 'Church', icon: 'church', weight: 1.3 },
  assembly: { label: 'Evacuation / assembly point', icon: 'flag', weight: 0.7 },
  shelter: { label: 'Shelter', icon: 'night_shelter', weight: 1.0 },
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

function classify(tags) {
  const name = (tags.name || '').toLowerCase();
  const amenity = tags.amenity;
  const leisure = tags.leisure;
  const building = tags.building;

  if (tags.emergency === 'assembly_point') return 'assembly';
  if (amenity === 'shelter') return 'shelter';
  if (/covered court|gymnasium|\bgym\b|multi-?purpose|sports (complex|center|hall)|coliseum|arena/.test(name)) return 'covered_court';
  if (leisure === 'sports_hall' || leisure === 'sports_centre' || building === 'sports_hall' || leisure === 'stadium') return 'covered_court';
  if (leisure === 'pitch' && tags.covered === 'yes') return 'covered_court';
  if (amenity === 'townhall' || building === 'civic' || /barangay hall|brgy\.? hall|city hall|municipal hall|town hall/.test(name)) return 'hall';
  if (amenity === 'community_centre') return 'community';
  if (amenity === 'conference_centre' || amenity === 'events_venue' || /convention|conference|events? (center|centre|hall)/.test(name)) return 'convention';
  if (amenity === 'school') {
    const operatorType = tags['operator:type'];
    const isPublic =
      operatorType === 'public' ||
      operatorType === 'government' ||
      /national high school|elementary school|central school|integrated school|\bnhs\b|\bes\b|public/.test(name);
    const isPrivate = operatorType === 'private' || operatorType === 'religious';
    if (isPublic && !isPrivate) return 'public_school';
    return 'school';
  }
  if (amenity === 'college' || amenity === 'university') return 'campus';
  if (amenity === 'place_of_worship' || ['church', 'cathedral', 'chapel'].includes(building)) return 'church';
  return null;
}

async function post(url, query) {
  const res = await fetch(url, {
    method: 'POST',
    body: 'data=' + encodeURIComponent(query),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    signal: AbortSignal.timeout(25000),
  });
  if (!res.ok) throw new Error(`Overpass ${res.status}`);
  return (await res.json()).elements || [];
}

// Ask every mirror at once; the first good answer wins.
const run = (query) => Promise.any(ENDPOINTS.map((url) => post(url, query)));

async function load(place) {
  const { lat, lon } = place;
  const near = `around:2500,${lat},${lon}`;
  const sheltersQuery = `[out:json][timeout:20];
(
  nwr(${near})[amenity~"^(school|college|community_centre|townhall|conference_centre|events_venue|shelter)$"];
  nwr(${near})[leisure~"^(sports_centre|sports_hall)$"];
  nwr(${near})[building~"^(sports_hall|civic|church|cathedral|chapel)$"];
  nwr(${near})[emergency=assembly_point];
);
out center 120;`;
  const waterQuery = `[out:json][timeout:20];
way(around:1500,${lat},${lon})[waterway~"^(river|stream|canal)$"];
out geom 30;`;

  const [s, w] = await Promise.allSettled([run(sheltersQuery), run(waterQuery)]);
  if (s.status === 'rejected' && w.status === 'rejected') throw s.reason;
  const result = parse([...(s.value || []), ...(w.value || [])], place);
  result.sheltersFailed = s.status === 'rejected';
  return result;
}

function parse(elements, place) {
  const found = [];
  const waterways = [];
  for (const el of elements) {
    const tags = el.tags || {};
    if (tags.waterway && el.geometry) {
      waterways.push({ name: tags.name || tags.waterway, points: el.geometry.map((g) => [g.lat, g.lon]) });
      continue;
    }
    const lat = el.lat ?? el.center?.lat;
    const lon = el.lon ?? el.center?.lon;
    if (lat == null || lon == null) continue;
    const kind = classify(tags);
    if (!kind) continue;
    const meta = KINDS[kind];
    const distance = Math.round(distanceM(place, { lat, lon }));
    found.push({
      id: `${el.type}/${el.id}`,
      name: tags.name || meta.label,
      kind: meta.label,
      kindKey: kind,
      icon: meta.icon,
      lat,
      lon,
      distance,
      score: distance * meta.weight,
    });
  }

  // one entry per place (a node and its building outline are both returned)
  const unique = [];
  for (const s of found.sort((a, b) => a.score - b.score)) {
    const dup = unique.some(
      (u) => u.name.toLowerCase() === s.name.toLowerCase() && distanceM(u, s) < 120
    );
    if (!dup) unique.push(s);
  }
  return { shelters: unique.slice(0, 30), waterways };
}

// Map and shelter list share one request per place.
const cache = new Map();
export function fetchNearby(place, signal) {
  const key = `${place.lat.toFixed(3)},${place.lon.toFixed(3)}`;
  if (!cache.has(key)) {
    cache.set(
      key,
      load(place).catch((e) => {
        cache.delete(key);
        throw e;
      })
    );
  }
  return cache.get(key).then((res) => {
    if (res.sheltersFailed) cache.delete(key);
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
    return res;
  });
}
