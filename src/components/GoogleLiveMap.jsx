import { useEffect, useRef, useState } from 'react';
import { useLive } from '../lib/live.jsx';
import { fetchNearby } from '../lib/nearby.js';
import { classify } from '../lib/weather.js';

const COLORS = { safe: '#00daf3', caution: '#006875', danger: '#0f2b48' };
let loader;

// Loads the Maps JavaScript API once. Rejects on a bad key so the caller can fall back.
function loadGoogleMaps(key) {
  if (window.google?.maps) return Promise.resolve(window.google.maps);
  if (!loader) {
    loader = new Promise((resolve, reject) => {
      window.__kbMapsReady = () => resolve(window.google.maps);
      window.gm_authFailure = () => reject(new Error('Google Maps key rejected'));
      const s = document.createElement('script');
      s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&callback=__kbMapsReady&v=weekly`;
      s.async = true;
      s.onerror = () => reject(new Error('Google Maps failed to load'));
      document.head.appendChild(s);
    });
  }
  return loader;
}

export default function GoogleLiveMap({ apiKey, stepIndex = 0, className = '', onFail }) {
  const { place, setPlace, data } = useLive();
  const host = useRef(null);
  const state = useRef({ map: null, g: null, flood: [], user: null, shelters: [], water: [] });
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    let dead = false;
    loadGoogleMaps(apiKey)
      .then((g) => {
        if (dead) return;
        state.current.g = g;
        state.current.map = new g.Map(host.current, {
          center: { lat: place.lat, lng: place.lon },
          zoom: 14,
          disableDefaultUI: true,
          zoomControl: true,
          clickableIcons: false,
        });
        setReady(true);
      })
      .catch((e) => !dead && onFail && onFail(e));
    return () => {
      dead = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey]);

  useEffect(() => {
    const { map } = state.current;
    if (ready && map) map.panTo({ lat: place.lat, lng: place.lon });
  }, [ready, place.lat, place.lon]);

  // nearby shelters + waterways (OpenStreetMap data, drawn on Google Maps)
  useEffect(() => {
    if (!ready) return undefined;
    const ctrl = new AbortController();
    const s = state.current;
    setStatus('Loading nearby shelters…');
    fetchNearby(place, ctrl.signal)
      .then((res) => {
        [...s.shelters, ...s.water].forEach((o) => o.setMap(null));
        s.water = res.waterways.map(
          (w) =>
            new s.g.Polyline({
              map: s.map,
              path: w.points.map(([lat, lng]) => ({ lat, lng })),
              strokeColor: '#00b8d4',
              strokeWeight: 5,
              strokeOpacity: 0.85,
            })
        );
        const info = new s.g.InfoWindow();
        s.shelters = res.shelters.map((sh) => {
          const m = new s.g.Marker({
            map: s.map,
            position: { lat: sh.lat, lng: sh.lon },
            title: sh.name,
            icon: { path: s.g.SymbolPath.CIRCLE, scale: 9, fillColor: '#0f2b48', fillOpacity: 1, strokeColor: '#fff', strokeWeight: 2 },
          });
          m.addListener('click', () => {
            const box = document.createElement('div');
            const b = document.createElement('b');
            b.textContent = sh.name;
            box.append(b, document.createElement('br'), `${sh.kind} · ${sh.distance} m away`);
            info.setContent(box);
            info.open({ map: s.map, anchor: m });
          });
          return m;
        });
        setStatus(res.shelters.length ? '' : 'No mapped shelters nearby');
      })
      .catch((e) => e.name !== 'AbortError' && setStatus('Shelter data unavailable'));
    return () => ctrl.abort();
  }, [ready, place.lat, place.lon]);

  // flood zone + "you are here"
  useEffect(() => {
    if (!ready) return;
    const s = state.current;
    [...s.flood, s.user].filter(Boolean).forEach((o) => o.setMap(null));
    const depth = data?.steps?.[stepIndex]?.depth ?? 0;
    const color = COLORS[classify(depth).key];
    s.flood = [1, 0.66, 0.36].map(
      (f, i) =>
        new s.g.Circle({
          map: s.map,
          center: { lat: place.lat, lng: place.lon },
          radius: (200 + depth * 700) * f,
          strokeWeight: 0,
          fillColor: color,
          fillOpacity: 0.12 + i * 0.1,
          clickable: false,
        })
    );
    s.user = new s.g.Marker({
      map: s.map,
      position: { lat: place.lat, lng: place.lon },
      label: { text: `Ikaw • ${depth.toFixed(1)} m`, color: '#00e3fd', fontWeight: '700', fontSize: '11px' },
      icon: {
        path: s.g.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: '#00e3fd',
        fillOpacity: 1,
        strokeColor: '#0f2b48',
        strokeWeight: 3,
        labelOrigin: new s.g.Point(0, -2.4),
      },
      zIndex: 999,
    });
  }, [ready, data, stepIndex, place.lat, place.lon]);

  const locate = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setPlace({ name: 'Your location', admin: '', lat: pos.coords.latitude, lng: pos.coords.longitude, lon: pos.coords.longitude }),
      () => setStatus('Location permission denied')
    );
  };

  return (
    <div className={`relative isolate ${className}`}>
      <div ref={host} className="absolute inset-0" />
      <button
        type="button"
        onClick={locate}
        title="Find my location"
        className="absolute z-[5] left-3 top-3 w-10 h-10 rounded-full bg-white text-secondary shadow-md flex items-center justify-center active:scale-90 transition-transform"
      >
        <span className="material-symbols-outlined text-[20px]">my_location</span>
      </button>
      {status && (
        <div className="absolute z-[5] left-1/2 -translate-x-1/2 bottom-8 bg-white/95 text-primary font-label-badge text-[11px] px-3 py-1 rounded-full shadow">
          {status}
        </div>
      )}
      <div className="absolute z-[5] left-3 bottom-8 bg-white/95 rounded-2xl shadow px-2.5 py-1.5 flex items-center gap-2 font-label-badge text-[10px] text-primary">
        <span className="flex items-center gap-1"><i className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS.safe }} />Kaya pa</span>
        <span className="flex items-center gap-1"><i className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS.caution }} />Ingat</span>
        <span className="flex items-center gap-1"><i className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS.danger }} />Bawal</span>
      </div>
    </div>
  );
}
