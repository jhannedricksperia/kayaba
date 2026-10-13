import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_PLACE, fetchForecast, withTerrain, classify } from './weather.js';
import { fetchTerrain, terrainFactor } from './terrain.js';
import { useT } from './i18n.jsx';

const LiveContext = createContext(null);
const KEY = 'kayaba.place';

function loadPlace() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || DEFAULT_PLACE;
  } catch {
    return DEFAULT_PLACE;
  }
}

async function askAi(place, data, terrain, signal, lang) {
  const res = await fetch('/api/assess', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      lang,
      place: { name: place.name, lat: place.lat, lon: place.lon },
      elevation: data.elevation,
      rainNow: data.rainNow,
      windNow: data.windNow,
      maxWind: data.maxWind,
      terrain: terrain ? Object.fromEntries(Object.entries(terrain).filter(([k]) => k !== 'grid')) : null,
      steps: data.steps.map((s, i) => ({ hours: i * 3, mm: s.mm, depth: s.depth })),
    }),
    signal,
  });
  const type = res.headers.get('content-type') || '';
  if (!res.ok || !type.includes('application/json')) throw new Error(`AI assessment unavailable (${res.status})`);
  return res.json();
}

// Replace the formula depths with the AI's, keeping the rain/icon data from the forecast.
function applyAi(data, ai) {
  const byHour = new Map(ai.steps.map((s) => [s.hours, s.depth_m]));
  const steps = data.steps.map((s, i) => {
    const d = byHour.get(i * 3) ?? s.depth;
    return { ...s, depth: d < 0.15 ? 0 : d };
  });
  const nowDepth = steps[0].depth;
  const best = steps.reduce((b, s) => (s.depth > b.depth ? s : b), steps[0]);
  return { ...data, steps, nowDepth, peak: best.depth >= nowDepth ? best : { ...best, depth: nowDepth } };
}

export function LiveProvider({ children }) {
  const { lang } = useT();
  const [place, setPlaceState] = useState(loadPlace);
  const [data, setData] = useState(null);
  const [terrain, setTerrain] = useState(null);
  const [ai, setAi] = useState({ status: 'idle' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // On load, ask for the visitor's current location. A place they searched for on purpose
  // is kept; if they decline, the last place or the default is used.
  useEffect(() => {
    if (place.source === 'search' || place.source === 'pin' || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        let name = 'Your location';
        let admin = '';
        try {
          const r = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
          );
          if (r.ok) {
            const j = await r.json();
            name = j.locality || j.city || name;
            admin = j.principalSubdivision || '';
          }
        } catch {
          /* keep the generic name */
        }
        setPlaceState({ name, admin, lat, lon, source: 'gps' });
      },
      () => {},
      { timeout: 10000, maximumAge: 5 * 60 * 1000 }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setPlace = (p) => {
    setPlaceState(p);
    try {
      localStorage.setItem(KEY, JSON.stringify(p));
    } catch {
      /* storage unavailable */
    }
  };

  useEffect(() => {
    const ctrl = new AbortController();
    const load = async () => {
      setLoading(true);
      setAi({ status: 'loading' });
      try {
        const forecast = await fetchForecast(place, ctrl.signal);
        setData(forecast);
        setError(null);

        // elevation-aware estimate (formula), then the AI assessment on top of it
        let t = null;
        try {
          t = await fetchTerrain(place, ctrl.signal);
        } catch (e) {
          if (e.name === 'AbortError') throw e;
        }
        setTerrain(t);
        const adjusted = withTerrain(forecast, terrainFactor(t));
        setData(adjusted);

        try {
          const result = await askAi(place, adjusted, t, ctrl.signal, lang);
          setData(applyAi(adjusted, result));
          setAi({ status: 'ok', ...result });
        } catch (e) {
          if (e.name === 'AbortError') throw e;
          setAi({ status: 'unavailable', reason: e.message });
        }
      } catch (e) {
        if (e.name !== 'AbortError') setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
    const timer = setInterval(load, 30 * 60 * 1000); // refresh every 30 minutes
    return () => {
      ctrl.abort();
      clearInterval(timer);
    };
  }, [place.lat, place.lon, lang]);

  const value = useMemo(
    () => ({ place, setPlace, data, terrain, ai, error, loading, classify }),
    [place, data, terrain, ai, error, loading]
  );
  return <LiveContext.Provider value={value}>{children}</LiveContext.Provider>;
}

export const useLive = () => useContext(LiveContext);
