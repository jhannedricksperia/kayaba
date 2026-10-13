// Live weather via Open-Meteo (free, no API key). Flood depth and wind signal are
// estimates derived from the forecast; they are not official PAGASA / NDRRMC products.
const FORECAST = 'https://api.open-meteo.com/v1/forecast';
const GEOCODE = 'https://geocoding-api.open-meteo.com/v1/search';

export const DEFAULT_PLACE = { name: 'Manila', admin: 'Metro Manila', lat: 14.5995, lon: 120.9842 };

export async function searchPlaces(query, signal) {
  const url = `${GEOCODE}?name=${encodeURIComponent(query)}&count=6&language=en&countryCode=PH`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error('Geocoding failed');
  const data = await res.json();
  return (data.results || []).map((r) => ({
    name: r.name,
    admin: [r.admin2, r.admin1].filter(Boolean).join(', '),
    lat: r.latitude,
    lon: r.longitude,
  }));
}

export async function fetchForecast(place, signal) {
  const params = new URLSearchParams({
    latitude: place.lat,
    longitude: place.lon,
    current: 'precipitation,wind_speed_10m,wind_gusts_10m,weather_code,is_day',
    hourly: 'precipitation,weather_code,wind_speed_10m',
    daily: 'precipitation_sum,precipitation_probability_max,wind_speed_10m_max,weather_code',
    forecast_days: '5',
    past_hours: '6',
    wind_speed_unit: 'kmh',
    timezone: 'auto',
  });
  const res = await fetch(`${FORECAST}?${params}`, { signal });
  if (!res.ok) throw new Error('Forecast request failed');
  return summarize(await res.json());
}

// PAGASA tropical cyclone wind signal thresholds (km/h, sustained wind).
export function windSignal(kmh) {
  if (kmh >= 185) return 5;
  if (kmh >= 118) return 4;
  if (kmh >= 89) return 3;
  if (kmh >= 62) return 2;
  if (kmh >= 39) return 1;
  return 0;
}

const lowlandFactor = (elev) => (elev < 5 ? 1.3 : elev < 15 ? 1 : elev < 40 ? 0.6 : elev < 100 ? 0.3 : 0.1);

// `terrain` is the local-basin multiplier from terrain.js (1 = flat surroundings).
export function depthFromRain(mm3h, elevation, terrain = 1) {
  return +Math.min(2.5, mm3h * 0.012 * lowlandFactor(elevation) * terrain).toFixed(2);
}

// Re-derive depths once the surrounding terrain is known.
export function withTerrain(data, terrainFactor) {
  const steps = data.steps.map((s) => ({ ...s, depth: depthFromRain(s.mm, data.elevation, terrainFactor) }));
  const nowDepth = depthFromRain(data.nowMm, data.elevation, terrainFactor);
  const best = steps.reduce((b, s) => (s.depth > b.depth ? s : b), steps[0]);
  return {
    ...data,
    steps,
    nowDepth,
    peak: best.depth >= nowDepth ? best : { ...best, depth: nowDepth, time: data.fetchedAt },
    terrainFactor,
  };
}

export function classify(depth) {
  if (depth < 0.35) return { key: 'safe', label: 'Kaya pa!' };
  if (depth < 1.0) return { key: 'caution', label: 'Ingat!' };
  return { key: 'danger', label: 'Hindi na kaya!' };
}

export function describeDepth(d) {
  if (d < 0.1) return 'Dry streets • Walang baha';
  if (d < 0.35) return 'Ankle-deep • All vehicles pass';
  if (d < 0.65) return 'Knee-deep • Sedan risk';
  if (d < 1.1) return 'Waist-deep • SUV only / Stalling';
  if (d < 1.6) return 'Chest-deep • Impassable to all';
  return 'Overhead • Evacuate immediately';
}

export function describeRain(mmh) {
  if (mmh < 0.1) return 'No rain right now';
  if (mmh < 2.5) return 'Light rain';
  if (mmh < 7.6) return 'Moderate rain';
  if (mmh < 50) return 'Heavy rain';
  return 'Torrential downpour';
}

export function weatherIcon(code) {
  if (code === 0) return 'sunny';
  if (code <= 2) return 'partly_cloudy_day';
  if (code === 3) return 'cloud';
  if (code <= 48) return 'foggy';
  if (code <= 57) return 'grain';
  if (code <= 67) return 'rainy';
  if (code <= 77) return 'cloudy_snowing';
  if (code <= 82) return 'rainy';
  return 'thunderstorm';
}

function summarize(d) {
  const times = d.hourly.time;
  const precip = d.hourly.precipitation.map((v) => v ?? 0);
  const wind = d.hourly.wind_speed_10m.map((v) => v ?? 0);
  const codes = d.hourly.weather_code;
  const elevation = Math.round(d.elevation ?? 0);

  // Hourly index closest to "now" (hourly data starts 6 h in the past).
  const nowIdx = Math.max(0, times.findIndex((t) => t >= d.current.time));
  const acc3 = (i) => precip.slice(Math.max(0, i - 2), i + 1).reduce((a, b) => a + b, 0);

  const steps = [];
  for (let i = nowIdx; i <= Math.min(times.length - 1, nowIdx + 24); i += 3) {
    const mm = acc3(i + 2 < times.length ? i + 2 : i);
    steps.push({
      time: times[i],
      icon: weatherIcon(codes[i]),
      mm,
      depth: depthFromRain(mm, elevation),
    });
  }
  let peak = steps.reduce((best, s) => (s.depth > best.depth ? s : best), steps[0]);
  const nowDepth = depthFromRain(acc3(nowIdx), elevation);
  const maxWind = Math.max(d.current.wind_speed_10m, ...wind.slice(nowIdx, nowIdx + 24));

  return {
    fetchedAt: d.current.time,
    elevation,
    rainNow: d.current.precipitation ?? 0,
    windNow: Math.round(d.current.wind_speed_10m),
    gustNow: Math.round(d.current.wind_gusts_10m ?? d.current.wind_speed_10m),
    maxWind: Math.round(maxWind),
    signal: windSignal(maxWind),
    nowDepth,
    nowMm: acc3(nowIdx),
    isDay: d.current.is_day === 1,
    weatherCode: d.current.weather_code,
    daily: (d.daily?.time || []).slice(0, 5).map((date, i) => ({
      date,
      mm: d.daily.precipitation_sum[i] ?? 0,
      prob: d.daily.precipitation_probability_max?.[i] ?? null,
      windMax: d.daily.wind_speed_10m_max[i] ?? 0,
      icon: weatherIcon(d.daily.weather_code[i]),
      worstDepth: depthFromRain((d.daily.precipitation_sum[i] ?? 0) * 0.3, elevation),
    })),
    peak: peak.depth >= nowDepth ? peak : { ...peak, depth: nowDepth, time: d.current.time },
    steps,
  };
}

export function formatHour(iso) {
  const h = Number(iso.slice(11, 13));
  const suffix = h >= 12 ? 'PM' : 'AM';
  return `${((h + 11) % 12) + 1}:00 ${suffix}`;
}

// Scene weather follows the forecast: rain wins, otherwise day or night at the location.
export function sceneMode(data) {
  if (data.rainNow >= 0.1 || data.weatherCode >= 51) return 'rain';
  return data.isDay ? 'day' : 'night';
}
