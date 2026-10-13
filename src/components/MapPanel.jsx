import { useEffect, useState } from 'react';
import { useLive } from '../lib/live.jsx';
import { fetchNearby } from '../lib/nearby.js';
import { classify, describeDepth } from '../lib/weather.js';
import { useT } from '../lib/i18n.jsx';

const TONE = {
  safe: 'bg-secondary-container text-primary',
  caution: 'bg-surface-container-high text-primary',
  danger: 'bg-primary text-secondary-container',
};
const dist = (m) => (m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${m} m`);

function passability(depth, t) {
  if (depth < 0.2) return t('Lahat ng sasakyan', 'All vehicles');
  if (depth < 0.3) return t('Karamihan ng sasakyan', 'Most vehicles');
  if (depth < 0.5) return t('SUV / jeep / truck', 'SUV / jeep / truck');
  if (depth < 0.7) return t('Truck lang', 'Trucks only');
  return t('Walang makadaraan', 'Nothing can pass');
}

const HOTLINES = [
  { tl: 'National Emergency', en: 'National Emergency', number: '911' },
  { tl: 'Philippine Red Cross', en: 'Philippine Red Cross', number: '143' },
];

export default function MapPanel({ stepIndex = 0 }) {
  const { place, data } = useLive();
  const { t, lang } = useT();
  const [near, setNear] = useState({ status: 'loading', items: [] });

  useEffect(() => {
    const ctrl = new AbortController();
    setNear({ status: 'loading', items: [] });
    fetchNearby(place, ctrl.signal)
      .then((r) => setNear({ status: r.sheltersFailed ? 'error' : 'ok', items: r.shelters.slice(0, 3) }))
      .catch((e) => e.name !== 'AbortError' && setNear({ status: 'error', items: [] }));
    return () => ctrl.abort();
  }, [place.lat, place.lon]);

  const depth = data?.steps?.[stepIndex]?.depth ?? 0;
  const status = classify(depth);

  return (
    <section className="px-margin-mobile flex flex-col gap-4 my-2 z-20">
      <div className="bg-surface-container-lowest rounded-3xl p-5 shadow-[0_8px_24px_-4px_rgba(15,43,72,0.08)] flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="font-headline-sm text-headline-sm text-primary truncate">{place.name}</div>
            <div className="font-body-sm text-[13px] text-on-surface-variant">{place.admin || t('Pinakabagong forecast', 'Latest forecast')}</div>
          </div>
          <span className={`font-label-badge text-[12px] px-3 py-1.5 rounded-full font-bold flex-shrink-0 ${TONE[status.key]}`}>
            {status.label} ({depth.toFixed(1)}m)
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-surface-container rounded-2xl p-3">
            <div className="font-label-badge text-[11px] text-on-surface-variant uppercase">{t('Taas ng tubig', 'Water level')}</div>
            <div className="font-headline-sm text-body-md text-primary font-bold">{describeDepth(depth, lang).split(' • ')[0]}</div>
          </div>
          <div className="bg-surface-container rounded-2xl p-3">
            <div className="font-label-badge text-[11px] text-on-surface-variant uppercase">{t('Puwedeng daanan', 'Passable by')}</div>
            <div className="font-headline-sm text-body-md text-primary font-bold">{passability(depth, t)}</div>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-3xl p-5 shadow-[0_8px_24px_-4px_rgba(15,43,72,0.08)] flex flex-col gap-3">
        <div className="font-headline-sm text-body-lg text-primary font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary">night_shelter</span>
          {t('Pinakamalapit na evacuation center', 'Nearest evacuation centers')}
        </div>
        {near.status === 'loading' && <p className="font-body-sm text-on-surface-variant">{t('Hinahanap…', 'Searching…')}</p>}
        {near.status === 'error' && <p className="font-body-sm text-on-surface-variant">{t('Hindi ma-load ngayon. Subukan ulit mamaya.', 'Could not load right now. Please try again later.')}</p>}
        {near.status === 'ok' && near.items.length === 0 && (
          <p className="font-body-sm text-on-surface-variant">{t('Walang nakitang paaralan o hall sa malapit.', 'No schools or halls found nearby.')}</p>
        )}
        {near.items.map((s) => (
          <a
            key={s.id}
            href={`https://www.openstreetmap.org/directions?to=${s.lat}%2C${s.lon}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between gap-3 bg-surface-container rounded-2xl px-4 py-3 active:scale-[0.99] transition-transform"
          >
            <span className="flex items-center gap-3 min-w-0">
              <span className="material-symbols-outlined text-secondary">{s.icon}</span>
              <span className="min-w-0">
                <span className="block font-headline-sm text-body-sm text-primary font-bold truncate">{s.name}</span>
                <span className="block font-body-sm text-[12.5px] text-on-surface-variant">{s.kind}</span>
              </span>
            </span>
            <span className="font-label-badge text-[12px] text-secondary font-bold flex-shrink-0">{dist(s.distance)}</span>
          </a>
        ))}
        <p className="font-body-sm text-[12px] text-on-surface-variant">
          {t('Kadalasang ginagawang evacuation center ang malapit na public school, covered court, hall, convention center, o simbahan. Magtanong muna sa barangay kung bukas ito.', 'Nearby public schools, covered courts, halls, convention centers and churches are often used as evacuation centers. Ask your barangay first if one is open.')}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {HOTLINES.map((h) => (
          <a
            key={h.number}
            href={`tel:${h.number}`}
            className="bg-primary text-on-primary rounded-2xl px-4 py-3 flex items-center gap-3 active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-secondary-container">call</span>
            <span>
              <span className="block font-headline-sm text-[18px] leading-tight">{h.number}</span>
              <span className="block font-body-sm text-[11.5px] text-on-primary/80">{t(h.tl, h.en)}</span>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
