import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_PLACE, fetchForecast, withTerrain, classify } from './weather.js';
import { fetchTerrain, terrainFactor } from './terrain.js';

const LiveContext = createContext(null);
const KEY = 'kayaba.place';

function loadPlace() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || DEFAULT_PLACE;
  } catch {
    return DEFAULT_PLACE;
  }
}

async function askAi(place, data, terrain, signal) {
  const res = await fetch('/api/assess', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      place: { name: place.name, lat: place.lat, lon: place.lon },
      elevation: data.elevation,
      rainNow: data.rainNow,
      windNow: data.windNow,
      maxWind: data.maxWind,
      terrain,
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
  const steps = data.steps.map((s, i) => ({ ...s, depth: byHour.get(i * 3) ?? s.depth }));
  const nowDepth = steps[0].depth;
  const best = steps.reduce((b, s) => (s.depth > b.depth ? s : b), steps[0]);
  return { ...data, steps, nowDepth, peak: best.depth >= nowDepth ? best : { ...best, depth: nowDepth } };
}

export function LiveProvider({ children }) {
  const [place, setPlaceState] = useState(loadPlace);
  const [data, setData] = useState(null);
  const [terrain, setTerrain] = useState(null);
  const [ai, setAi] = useState({ status: 'idle' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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
          const result = await askAi(place, adjusted, t, ctrl.signal);
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
  }, [place.lat, place.lon]);

  const value = useMemo(
    () => ({ place, setPlace, data, terrain, ai, error, loading, classify }),
    [place, data, terrain, ai, error, loading]
  );
  return <LiveContext.Provider value={value}>{children}</LiveContext.Provider>;
}

export const useLive = () => useContext(LiveContext);
