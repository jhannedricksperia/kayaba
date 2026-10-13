import { useEffect, useState } from 'react';
import { useLive } from '../lib/live.jsx';
import { fetchNearby } from '../lib/nearby.js';
import { classify, describeDepth } from '../lib/weather.js';
import { useT } from '../lib/i18n.jsx';

const dist = (m) => (m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${m} m`);

export function NearbyShelters() {
  const { place } = useLive();
  const { t } = useT();
  const [state, setState] = useState({ status: 'loading', items: [] });

  useEffect(() => {
    const ctrl = new AbortController();
    setState({ status: 'loading', items: [] });
    fetchNearby(place, ctrl.signal)
      .then((r) => setState({ status: r.sheltersFailed ? 'error' : 'ok', items: r.shelters.slice(0, 4) }))
      .catch((e) => e.name !== 'AbortError' && setState({ status: 'error', items: [] }));
    return () => ctrl.abort();
  }, [place.lat, place.lon]);

  return (
    <section className="bg-primary text-on-primary rounded-3xl p-4 shadow-[0_12px_28px_rgba(15,43,72,0.22)] flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-secondary-container text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">night_shelter</span>
          </div>
          <span className="font-headline-sm text-body-lg font-bold text-on-primary">{t('Pinakamalapit na Evacuation Center', 'Nearest Evacuation Centers')}</span>
        </div>
      </div>

      {state.status === 'loading' && <p className="font-body-sm text-on-primary/80">{t('Hinahanap ang mga malapit na lugar…', 'Looking for places nearby…')}</p>}
      {state.status === 'error' && (
        <p className="font-body-sm text-on-primary/80">{t('Hindi ma-load ang mga lugar ngayon. Subukan ulit mamaya.', 'Could not load nearby places right now. Please try again later.')}</p>
      )}
      {state.status === 'ok' && state.items.length === 0 && (
        <p className="font-body-sm text-on-primary/80">{t('Walang nakitang paaralan o hall sa malapit sa OpenStreetMap.', 'No schools or halls found nearby in OpenStreetMap.')}</p>
      )}

      <ul className="flex flex-col gap-2">
        {state.items.map((s) => (
          <li key={s.id}>
            <a
              href={`https://www.openstreetmap.org/directions?to=${s.lat}%2C${s.lon}`}
              target="_blank"
              rel="noreferrer"
              className="bg-primary-container/80 rounded-2xl p-3 flex items-center justify-between gap-3 active:scale-[0.99] transition-transform"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-surface-container-highest/20 flex items-center justify-center text-secondary-container flex-shrink-0">
                  <span className="material-symbols-outlined text-[20px]">{s.icon}</span>
                </div>
                <div className="min-w-0">
                  <p className="font-headline-sm text-body-sm text-on-primary font-bold truncate">{s.name}</p>
                  <p className="font-body-sm text-[12.5px] text-primary-fixed-dim">{s.kind}</p>
                </div>
              </div>
              <span className="font-label-badge text-[12px] text-secondary-container font-bold flex-shrink-0">{dist(s.distance)}</span>
            </a>
          </li>
        ))}
      </ul>
      <p className="font-body-sm text-[11.5px] text-on-primary/70">
        {t('Kadalasang ginagawang evacuation center ang malapit na public school, covered court, hall, convention center, o simbahan. Magtanong muna sa barangay kung bukas ito.', 'Nearby public schools, covered courts, halls, convention centers and churches are often used as evacuation centers. Ask your barangay first if one is open.')}
      </p>
    </section>
  );
}

export function ShareStatus() {
  const { place, data } = useLive();
  const { t, lang } = useT();
  const [note, setNote] = useState('');

  const share = async () => {
    const depth = data ? data.peak.depth : 0;
    const text = t(
      `Kaya Ba? ${place.name}: ${classify(depth).label} Pinakamataas na baha sa susunod na 24 oras: ${depth.toFixed(1)} m (${describeDepth(depth, 'tl').split(' • ')[0]}). Tantiya lang ito.`,
      `Kaya Ba? ${place.name}: ${classify(depth).label} Highest flood in the next 24 hours: ${depth.toFixed(1)} m (${describeDepth(depth, 'en').split(' • ')[0]}). Estimate only.`
    );
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Kaya Ba?', text, url: window.location.origin });
        return;
      }
      await navigator.clipboard.writeText(`${text} ${window.location.origin}`);
      setNote(t('Nakopya na! I-paste sa group chat.', 'Copied! Paste it in your group chat.'));
    } catch {
      setNote(t('Hindi ma-share dito.', 'Cannot share from here.'));
    }
    setTimeout(() => setNote(''), 3000);
  };

  return (
    <section className="bg-surface-container-lowest rounded-3xl p-4 shadow-[0_8px_24px_-4px_rgba(15,43,72,0.07)] flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-11 h-11 rounded-2xl bg-secondary-container/20 flex items-center justify-center text-primary flex-shrink-0">
          <span className="material-symbols-outlined text-[24px]">share</span>
        </div>
        <div className="min-w-0">
          <h4 className="font-headline-sm text-body-md text-primary font-bold">{t('Ipaalam sa mga kapitbahay', 'Tell your neighbors')}</h4>
          <p className="font-body-sm text-[12.5px] text-on-surface-variant">{note || t('Ibahagi ang lagay ng baha sa inyong lugar', 'Share the flood status in your area')}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={share}
        className="bg-primary text-on-primary font-label-badge text-[12px] px-4 py-2.5 rounded-full active:scale-95 transition-transform flex-shrink-0 font-bold shadow-md"
      >
        {t('Ibahagi', 'Share')}
      </button>
    </section>
  );
}
