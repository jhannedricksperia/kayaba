import { useEffect, useState } from 'react';
import { searchPlaces } from '../lib/weather.js';
import { useLive } from '../lib/live.jsx';

export default function PlaceSearch() {
  const { place, setPlace } = useLive();
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (q.trim().length < 2) {
      setResults([]);
      return undefined;
    }
    const ctrl = new AbortController();
    const t = setTimeout(() => {
      searchPlaces(q.trim(), ctrl.signal).then(setResults).catch(() => {});
    }, 300);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [q]);

  const pick = (p) => {
    setPlace(p);
    setQ('');
    setResults([]);
    setOpen(false);
  };

  return (
    <div className="relative w-full min-w-0">
      <input
        aria-label="Search your location"
        className="w-full bg-transparent border-0 outline-none px-2.5 font-headline-sm text-body-md text-primary font-bold placeholder-on-surface-variant truncate"
        type="text"
        value={q}
        placeholder={`${place.name}${place.admin ? `, ${place.admin}` : ''}`}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
      />
      {open && results.length > 0 && (
        <ul className="absolute left-0 right-0 top-full mt-3 z-50 bg-surface-container-lowest rounded-2xl shadow-[0_12px_30px_-6px_rgba(15,43,72,0.18)] p-1.5">
          {results.map((r) => (
            <li key={`${r.lat},${r.lon}`}>
              <button
                type="button"
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-surface-container font-label-badge text-[13px] text-primary"
                onMouseDown={() => pick(r)}
              >
                {r.name}
                {r.admin && <span className="block text-[11px] text-on-surface-variant font-normal">{r.admin}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
