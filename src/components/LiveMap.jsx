import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useLive } from '../lib/live.jsx';
import { fetchNearby } from '../lib/nearby.js';
import { classify } from '../lib/weather.js';

const COLORS = { safe: '#00daf3', caution: '#006875', danger: '#0f2b48' };

const pinIcon = (label) =>
  L.divIcon({
    className: '',
    iconSize: [0, 0],
    html: `<div style="transform:translate(-50%,-100%);display:flex;flex-direction:column;align-items:center">
      <div style="background:#0f2b48;color:#00e3fd;font:700 11px Quicksand,sans-serif;padding:4px 10px;border-radius:999px;white-space:nowrap;box-shadow:0 4px 12px rgba(15,43,72,.3)">${label}</div>
      <div style="width:16px;height:16px;margin-top:4px;border-radius:999px;background:#00e3fd;border:3px solid #0f2b48;box-shadow:0 0 0 6px rgba(0,227,253,.35)"></div>
    </div>`,
  });

const shelterIcon = () =>
  L.divIcon({
    className: '',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    html: `<div style="width:30px;height:30px;border-radius:999px;background:#0f2b48;border:2px solid #fff;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 10px rgba(15,43,72,.35)">
      <span class="material-symbols-outlined" style="color:#00e3fd;font-size:17px">night_shelter</span></div>`,
  });

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export default function LiveMap({ stepIndex = 0, className = '', onNearby }) {
  const { place, setPlace, data } = useLive();
  const host = useRef(null);
  const map = useRef(null);
  const layers = useRef({ flood: null, user: null, shelters: null, water: null });
  const [status, setStatus] = useState('');

  // create the map once
  useEffect(() => {
    const m = L.map(host.current, { zoomControl: false, attributionControl: true }).setView([place.lat, place.lon], 14);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(m);
    L.control.zoom({ position: 'topright' }).addTo(m);
    layers.current.flood = L.layerGroup().addTo(m);
    layers.current.water = L.layerGroup().addTo(m);
    layers.current.shelters = L.layerGroup().addTo(m);
    layers.current.user = L.layerGroup().addTo(m);
    map.current = m;
    // container may have been laid out after creation
    const t = setTimeout(() => m.invalidateSize(), 100);
    return () => {
      clearTimeout(t);
      m.remove();
      map.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // recentre when the place changes
  useEffect(() => {
    if (map.current) map.current.setView([place.lat, place.lon], map.current.getZoom() || 14);
  }, [place.lat, place.lon]);

  // nearby shelters + waterways (real OSM data)
  useEffect(() => {
    const ctrl = new AbortController();
    setStatus('Loading nearby shelters…');
    fetchNearby(place, ctrl.signal)
      .then((res) => {
        const { shelters, water } = layers.current;
        if (!shelters) return;
        shelters.clearLayers();
        water.clearLayers();
        res.waterways.forEach((w) =>
          L.polyline(w.points, { color: '#00b8d4', weight: 5, opacity: 0.85 }).bindTooltip(esc(w.name)).addTo(water)
        );
        res.shelters.forEach((s) =>
          L.marker([s.lat, s.lon], { icon: shelterIcon() })
            .bindPopup(`<b>${esc(s.name)}</b><br>${esc(s.kind)} · ${s.distance} m away`)
            .addTo(shelters)
        );
        setStatus(res.shelters.length ? '' : 'No mapped shelters nearby');
        if (onNearby) onNearby(res);
      })
      .catch((e) => {
        if (e.name !== 'AbortError') setStatus('Shelter data unavailable');
      });
    return () => ctrl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [place.lat, place.lon]);

  // flood zone + "you are here" follow the selected time step
  useEffect(() => {
    const { flood, user } = layers.current;
    if (!flood) return;
    flood.clearLayers();
    user.clearLayers();
    const step = data?.steps?.[stepIndex];
    const depth = step ? step.depth : 0;
    const key = classify(depth).key;
    const color = COLORS[key];
    // Illustrative zone: radius grows with estimated depth (not a surveyed flood extent).
    [1, 0.66, 0.36].forEach((f, i) =>
      L.circle([place.lat, place.lon], {
        radius: (200 + depth * 700) * f,
        stroke: false,
        fillColor: color,
        fillOpacity: 0.12 + i * 0.1,
      }).addTo(flood)
    );
    L.marker([place.lat, place.lon], { icon: pinIcon(`Ikaw • ${depth.toFixed(1)} m`) }).addTo(user);
  }, [data, stepIndex, place.lat, place.lon]);

  const locate = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setPlace({ name: 'Your location', admin: '', lat: pos.coords.latitude, lon: pos.coords.longitude }),
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
        className="absolute z-[500] left-3 top-3 w-10 h-10 rounded-full bg-white text-secondary shadow-md flex items-center justify-center active:scale-90 transition-transform"
      >
        <span className="material-symbols-outlined text-[20px]">my_location</span>
      </button>
      {status && (
        <div className="absolute z-[500] left-1/2 -translate-x-1/2 bottom-8 bg-white/95 text-primary font-label-badge text-[11px] px-3 py-1 rounded-full shadow">
          {status}
        </div>
      )}
      <div className="absolute z-[500] left-3 bottom-8 bg-white/95 rounded-2xl shadow px-2.5 py-1.5 flex items-center gap-2 font-label-badge text-[10px] text-primary">
        <span className="flex items-center gap-1"><i className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS.safe }} />Kaya pa</span>
        <span className="flex items-center gap-1"><i className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS.caution }} />Ingat</span>
        <span className="flex items-center gap-1"><i className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS.danger }} />Bawal</span>
      </div>
    </div>
  );
}
