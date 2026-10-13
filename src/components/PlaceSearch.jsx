import { useEffect, useRef, useState } from 'react';
import { searchPlaces } from '../lib/weather.js';
import { useLive } from '../lib/live.jsx';

const QUICK = [
  { name: 'Manila', admin: 'Metro Manila', lat: 14.5995, lon: 120.9842 },
  { name: 'Quezon City', admin: 'Metro Manila', lat: 14.676, lon: 121.0437 },
  { name: 'Marikina', admin: 'Metro Manila', lat: 14.6507, lon: 121.1029 },
  { name: 'Pasig', admin: 'Metro Manila', lat: 14.5764, lon: 121.0851 },
  { name: 'Cebu City', admin: 'Cebu', lat: 10.3157, lon: 123.8854 },
  { name: 'Tacloban', admin: 'Leyte', lat: 11.2543, lon: 125.0 },
  { name: 'Iloilo City', admin: 'Iloilo', lat: 10.7202, lon: 122.5621 },
  { name: 'Cagayan de Oro', admin: 'Misamis Oriental', lat: 8.4542, lon: 124.6319 },
  { name: 'Davao City', admin: 'Davao del Sur', lat: 7.1907, lon: 125.4553 },
  { name: 'Baguio', admin: 'Benguet', lat: 16.4023, lon: 120.596 },
];

const SpeechRecognition = typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null;

export default function PlaceSearch() {
  const { place, setPlace } = useLive();
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState(false); // quick-pick filter panel
  const [listening, setListening] = useState(false);
  const [note, setNote] = useState('');
  const recRef = useRef(null);

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
    setPlace({ ...p, source: 'search' });
    setQ('');
    setResults([]);
    setOpen(false);
    setPanel(false);
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) return setNote('Walang location support ang browser na ito.');
    setNote('Hinahanap ang location mo…');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPlace({ name: 'Your location', admin: '', lat: pos.coords.latitude, lon: pos.coords.longitude, source: 'gps' });
        setNote('');
        setPanel(false);
      },
      () => setNote('Hindi pinayagan ang location. I-allow ito sa browser settings.')
    );
  };

  const toggleVoice = () => {
    if (!SpeechRecognition) return setNote('Hindi supported ang voice search sa browser na ito. Subukan ang Chrome o Edge.');
    if (listening) {
      recRef.current?.stop();
      return;
    }
    const rec = new SpeechRecognition();
    rec.lang = 'fil-PH';
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onstart = () => {
      setListening(true);
      setNote('Nakikinig… sabihin ang pangalan ng lugar.');
    };
    rec.onresult = (e) => {
      const text = e.results[0][0].transcript.replace(/[.,]$/, '');
      setQ(text);
      setOpen(true);
      setNote('');
    };
    rec.onerror = (e) =>
      setNote(e.error === 'not-allowed' ? 'Hindi pinayagan ang microphone.' : 'Hindi narinig. Subukan ulit.');
    rec.onend = () => setListening(false);
    recRef.current = rec;
    rec.start();
  };

  return (
    <div className="relative w-full min-w-0">
      <div className="flex items-center gap-1 w-full">
        <input
          aria-label="Search your location"
          className="flex-1 min-w-0 bg-transparent border-0 outline-none px-2.5 font-headline-sm text-body-md text-primary font-bold placeholder-on-surface-variant truncate"
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
        <button
          type="button"
          aria-label="Voice search"
          title="Voice search"
          onClick={toggleVoice}
          className={`w-9 h-9 flex-shrink-0 rounded-full flex items-center justify-center active:scale-95 transition-all ${
            listening ? 'bg-secondary-container text-primary animate-pulse' : 'text-on-surface-variant hover:bg-surface-container'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">{listening ? 'graphic_eq' : 'mic'}</span>
        </button>
        <button
          type="button"
          aria-label="Filter locations"
          title="Mga lugar"
          aria-expanded={panel}
          onClick={() => setPanel((v) => !v)}
          className={`w-9 h-9 flex-shrink-0 rounded-full flex items-center justify-center active:scale-95 transition-all shadow-sm ${
            panel ? 'bg-secondary-container text-primary' : 'bg-primary-container text-secondary-container'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">tune</span>
        </button>
      </div>

      {note && <p className="absolute left-2 top-full mt-1 z-40 font-body-sm text-[12px] text-on-surface-variant">{note}</p>}

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

      {panel && (
        <div className="absolute right-0 top-full mt-3 z-50 w-72 max-w-[85vw] bg-surface-container-lowest rounded-2xl shadow-[0_12px_30px_-6px_rgba(15,43,72,0.22)] p-3">
          <button
            type="button"
            onClick={useMyLocation}
            className="w-full flex items-center gap-2 bg-secondary-container text-primary font-label-badge text-[13px] font-bold px-3 py-2.5 rounded-xl active:scale-[0.98] transition-transform"
          >
            <span className="material-symbols-outlined text-[18px]">my_location</span>
            Gamitin ang current location
          </button>
          <p className="font-label-badge text-[11px] uppercase text-on-surface-variant mt-3 mb-1.5 px-1">Mga lugar</p>
          <div className="flex flex-wrap gap-1.5">
            {QUICK.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => pick(p)}
                className={`px-3 py-1.5 rounded-full font-label-badge text-[12px] font-bold active:scale-95 transition-transform ${
                  p.name === place.name ? 'bg-primary text-on-primary' : 'bg-surface-container text-primary hover:bg-surface-container-high'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
