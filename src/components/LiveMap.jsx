import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useLive } from '../lib/live.jsx';
import { fetchNearby } from '../lib/nearby.js';
import { classify } from '../lib/weather.js';
import { floodCells } from '../lib/terrain.js';
import { useT } from '../lib/i18n.jsx';

const COLORS = { safe: '#00daf3', caution: '#006875', danger: '#0f2b48' };
const FLOOD_FILL = { safe: '#38bdf8', caution: '#1d6fd8', danger: '#0b2a6b' };

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

export default function LiveMap({ stepIndex = 0, className = '', onNearby, layers = { flood: true, water: true, shelters: true } }) {
  const { place, setPlace, data, terrain } = useLive();
  const { t } = useT();
  const host = useRef(null);
  const map = useRef(null);
  const layersRef = useRef({ flood: null, user: null, shelters: null, water: null });
  const [status, setStatus] = useState('');
  const [pinMode, setPinMode] = useState(false);
  const pinRef = useRef(false);
  const layers_ref = () => layersRef.current;

  // create the map once
  useEffect(() => {
    const m = L.map(host.current, { zoomControl: false, attributionControl: true }).setView([place.lat, place.lon], 14);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(m);
    L.control.zoom({ position: 'topright' }).addTo(m);
    layersRef.current.flood = L.layerGroup().addTo(m);
    layersRef.current.water = L.layerGroup().addTo(m);
    layersRef.current.shelters = L.layerGroup().addTo(m);
    layersRef.current.user = L.layerGroup().addTo(m);
    // "pin a location": the next click on the map becomes the place we forecast for
    m.on('click', (e) => {
      if (!pinRef.current) return;
      pinRef.current = false;
      setPinMode(false);
      m.getContainer().style.cursor = '';
      dropPin(e.latlng.lat, e.latlng.lng);
    });
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
    setStatus(t('Hinahanap ang mga evacuation center…', 'Loading nearby shelters…'));
    fetchNearby(place, ctrl.signal)
      .then((res) => {
        const { shelters, water } = layersRef.current;
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
        setStatus(res.shelters.length ? '' : t('Walang nakitang evacuation center sa malapit', 'No mapped shelters nearby'));
        if (onNearby) onNearby(res);
      })
      .catch((e) => {
        if (e.name !== 'AbortError') setStatus(t('Hindi makuha ang mga evacuation center', 'Shelter data unavailable'));
      });
    return () => ctrl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [place.lat, place.lon]);

  // flood zone + "you are here" follow the selected time step
  useEffect(() => {
    const { flood, user } = layersRef.current;
    if (!flood) return;
    flood.clearLayers();
    user.clearLayers();
    const step = data?.steps?.[stepIndex];
    const depth = step ? step.depth : 0;
    const key = classify(depth).key;
    const color = COLORS[key];
    // Possible flood extent: every ~200 m cell lower than the estimated water surface.
    const cells = floodCells(terrain?.grid, depth);
    const g = terrain?.grid;
    if (g && cells.length) {
      const hLat = g.dLat / 2;
      const hLon = g.dLon / 2;
      cells.forEach((c) => {
        const k = c.depth < 0.35 ? 'safe' : c.depth < 1 ? 'caution' : 'danger';
        L.rectangle(
          [
            [c.lat - hLat, c.lon - hLon],
            [c.lat + hLat, c.lon + hLon],
          ],
          { stroke: false, fillColor: FLOOD_FILL[k], fillOpacity: 0.5, interactive: false }
        ).addTo(flood);
      });
    } else if (depth > 0) {
      // no terrain yet: a soft circle around the pin instead
      L.circle([place.lat, place.lon], { radius: 150 + depth * 500, stroke: false, fillColor: color, fillOpacity: 0.25 }).addTo(flood);
    }
    L.marker([place.lat, place.lon], { icon: pinIcon(`${t('Ikaw', 'You')} • ${depth.toFixed(1)} m`), draggable: true })
      .on('dragend', (e) => {
        const p = e.target.getLatLng();
        dropPin(p.lat, p.lng);
      })
      .addTo(user);
  }, [data, terrain, stepIndex, place.lat, place.lon, t]);

  useEffect(() => {
    const m = map.current;
    const g = layers_ref();
    if (!m || !g.flood) return;
    [['flood', g.flood], ['water', g.water], ['shelters', g.shelters]].forEach(([key, grp]) => {
      if (layers[key] === false) m.removeLayer(grp);
      else if (!m.hasLayer(grp)) m.addLayer(grp);
    });
  }, [layers.flood, layers.water, layers.shelters]);

  function dropPin(lat, lon) {
    const pinned = { name: t('Naka-pin na lugar', 'Pinned location'), admin: '', lat, lon, source: 'pin' };
    setPlace(pinned);
    // best effort: give the pin a readable name
    fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`)
      .then((res) => (res.ok ? res.json() : null))
      .then((j) => {
        if (!j) return;
        const name = j.locality || j.city;
        if (name) setPlace({ ...pinned, name, admin: j.principalSubdivision || '' });
      })
      .catch(() => {});
  }

  const togglePin = () => {
    const on = !pinRef.current;
    pinRef.current = on;
    setPinMode(on);
    if (map.current) map.current.getContainer().style.cursor = on ? 'crosshair' : '';
    setStatus(on ? t('I-click ang mapa kung saan mo gustong mag-pin', 'Click the map where you want to drop a pin') : '');
  };

  const locate = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setPlace({ name: 'Your location', admin: '', lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => setStatus(t('Hindi pinayagan ang lokasyon', 'Location permission denied'))
    );
  };

  return (
    <div className={`relative isolate ${className}`}>
      <div ref={host} className="absolute inset-0" />
      <button
        type="button"
        onClick={locate}
        title={t('Hanapin ang lokasyon ko', 'Find my location')}
        className="absolute z-[500] left-3 top-3 w-10 h-10 rounded-full bg-white text-secondary shadow-md flex items-center justify-center active:scale-90 transition-transform"
      >
        <span className="material-symbols-outlined text-[20px]">my_location</span>
      </button>
      <button
        type="button"
        onClick={togglePin}
        aria-pressed={pinMode}
        title={t('Mag-pin ng lugar sa mapa', 'Drop a pin on the map')}
        className={`absolute z-[500] left-3 top-16 w-10 h-10 rounded-full shadow-md flex items-center justify-center active:scale-90 transition-all ${
          pinMode ? 'bg-primary text-secondary-container' : 'bg-white text-secondary'
        }`}
      >
        <span className="material-symbols-outlined text-[22px]">add_location_alt</span>
      </button>
      {status && (
        <div className="absolute z-[500] left-1/2 -translate-x-1/2 bottom-8 bg-white/95 text-primary font-label-badge text-[11px] px-3 py-1 rounded-full shadow">
          {status}
        </div>
      )}
      <div className="absolute z-[500] left-3 bottom-8 bg-white/95 rounded-2xl shadow px-2.5 py-1.5 flex items-center gap-2 font-label-badge text-[10px] text-primary">
        <span className="flex items-center gap-1"><i className="w-2.5 h-2.5 rounded-full" style={{ background: FLOOD_FILL.safe }} />{t('Mababaw', 'Shallow')}</span>
        <span className="flex items-center gap-1"><i className="w-2.5 h-2.5 rounded-full" style={{ background: FLOOD_FILL.caution }} />{t('Mataas', 'High')}</span>
        <span className="flex items-center gap-1"><i className="w-2.5 h-2.5 rounded-full" style={{ background: FLOOD_FILL.danger }} />{t('Malalim', 'Deep')}</span><span className="text-on-surface-variant">• {t('tantiya lang', 'estimate')}</span>
      </div>
    </div>
  );
}
