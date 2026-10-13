import { useLive } from '../lib/live.jsx';
import { useT } from '../lib/i18n.jsx';
import HScroll from './HScroll.jsx';
import { classify, describeDepth, formatHour } from '../lib/weather.js';

const TONE = {
  safe: 'bg-secondary-container text-primary',
  caution: 'bg-surface-container-high text-primary',
  danger: 'bg-primary text-secondary-container',
};
const BAR = { safe: 'bg-secondary-fixed-dim', caution: 'bg-secondary', danger: 'bg-primary-container' };

function Loading({ error }) {
  const { t } = useT();
  return (
    <section className="bg-surface-container-lowest rounded-xl p-5 text-on-surface-variant font-body-sm">
      {error
        ? `${t('Hindi ma-load ang forecast', 'Could not load the forecast')}: ${error}`
        : t('Kinukuha ang pinakabagong forecast…', 'Getting the latest forecast…')}
    </section>
  );
}

export function LiveForecastHero() {
  const { data, place, error } = useLive();
  const { t, lang } = useT();
  if (!data) return <Loading error={error} />;
  const peak = data.peak;
  const status = classify(peak.depth);
  const body = describeDepth(peak.depth, lang).split(' • ')[0];

  return (
    <section className="relative bg-primary-container text-on-primary rounded-xl p-6 shadow-[0_16px_36px_-6px_rgba(15,43,72,0.35)] overflow-hidden">
      <div className="flex items-center justify-between">
        <span className="font-label-badge text-[11px] uppercase tracking-wider bg-secondary-container text-primary px-2.5 py-1 rounded-full font-bold">
          {t('Pinakamataas sa susunod na 24 oras', 'Peak in the next 24 hours')}
        </span>
        <span className="font-body-sm text-[13px] text-on-primary/80 flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px]">schedule</span>
          {peak.depth >= 0.15 ? formatHour(peak.time) : t('Walang pagtaas', 'No rise')}
        </span>
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="font-stat-metric text-stat-metric-mobile font-bold">{peak.depth.toFixed(1)}m</span>
        <span className="font-headline-sm text-on-primary/90">({body})</span>
      </div>
      <div className={`mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-label-badge text-[13px] font-bold ${TONE[status.key]}`}>
        <span className="material-symbols-outlined text-[18px]">{status.key === 'safe' ? 'verified' : 'warning'}</span>
        {status.label}
      </div>
      <div className="mt-5 flex items-center justify-between bg-primary/60 rounded-2xl px-4 py-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="material-symbols-outlined text-secondary-container text-[26px]">
            {data.rainNow >= 0.1 ? 'rainy' : 'cloud'}
          </span>
          <div className="min-w-0">
            <div className="font-headline-sm text-[14px] truncate">{place.name}</div>
            <div className="font-body-sm text-[12px] text-on-primary/80">
              {data.rainNow.toFixed(1)} mm/h • {t('hangin', 'wind')} {data.windNow} km/h
            </div>
          </div>
        </div>
        <span className="font-label-badge text-[12px] bg-secondary-container/20 text-secondary-container px-2.5 py-1 rounded-full font-bold">
          {data.signal > 0 ? `Signal #${data.signal} (est.)` : t('Walang signal', 'No signal')}
        </span>
      </div>
    </section>
  );
}

export function LiveTide() {
  const { data } = useLive();
  const { t } = useT();
  if (!data) return null;
  const peakTime = data.peak.time;
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="font-headline-sm text-headline-sm text-primary flex items-center gap-1.5">
          <span className="material-symbols-outlined text-secondary text-[22px]">show_chart</span>
          {t('Taas ng Tubig sa 24 Oras', 'Water Level, Next 24 Hours')}
        </h2>
        <span className="font-body-sm text-body-sm text-on-surface-variant font-semibold">{t('bawat 3 oras', 'every 3 hours')}</span>
      </div>
      <HScroll className="gap-3 pb-2 touch-pan-x">
        {data.steps.map((s, i) => {
          const status = classify(s.depth);
          const isPeak = s.time === peakTime && s.depth >= 0.15;
          return (
            <div
              key={s.time}
              className={`flex-shrink-0 w-28 rounded-lg p-3 flex flex-col items-center justify-between gap-2 ${
                isPeak ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest shadow-[0_8px_20px_rgba(15,43,72,0.06)]'
              }`}
            >
              <span className="font-body-sm text-body-sm font-bold">{i === 0 ? t('Ngayon', 'Now') : formatHour(s.time)}</span>
              <span className="material-symbols-outlined text-[26px] text-secondary">{s.icon}</span>
              <div className="w-7 h-20 bg-surface-container rounded-full relative overflow-hidden flex flex-col justify-end p-0.5">
                <div
                  className={`w-full rounded-full transition-all duration-500 ${BAR[status.key]}`}
                  style={{ height: `${Math.max(6, Math.min(100, (s.depth / 2) * 100))}%` }}
                />
              </div>
              <span className="font-headline-sm text-headline-sm">{s.depth.toFixed(1)}m</span>
              <span className={`font-label-badge text-[10px] px-2 py-0.5 rounded-full font-bold ${TONE[status.key]}`}>
                {isPeak ? t('Pinakamataas', 'Peak') : status.label}
              </span>
            </div>
          );
        })}
      </HScroll>
    </section>
  );
}

const RIDES = [
  { icon: 'directions_walk', tl: 'Naglalakad', en: 'On foot', max: 0.3 },
  { icon: 'two_wheeler', tl: 'Motorsiklo', en: 'Motorcycle', max: 0.2 },
  { icon: 'directions_car', tl: 'Sedan / kotse', en: 'Sedan / car', max: 0.3 },
  { icon: 'airport_shuttle', tl: 'Jeep / SUV / van', en: 'Jeep / SUV / van', max: 0.5 },
  { icon: 'local_shipping', tl: 'Truck / 6-wheeler', en: 'Truck / 6-wheeler', max: 0.7 },
];

export function RideCheck() {
  const { data } = useLive();
  const { t } = useT();
  if (!data) return null;
  const now = data.nowDepth;
  const peak = data.peak.depth;
  return (
    <section className="bg-surface-container-lowest rounded-xl p-5 shadow-[0_10px_25px_-5px_rgba(15,43,72,0.08)] flex flex-col gap-4">
      <div>
        <h2 className="font-headline-sm text-headline-sm text-primary">{t('Kaya bang tumawid?', 'Can you get through?')}</h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          {t('Ngayon', 'Now')}: {now.toFixed(1)} m • {t('Pinakamataas', 'Peak')}: {peak.toFixed(1)} m.{' '}
          {t('Gabay lang ito, hindi garantiya.', 'A rough guide only, not a guarantee.')}
        </p>
      </div>
      <ul className="flex flex-col gap-2.5">
        {RIDES.map((r) => {
          const verdict = now > r.max ? 'danger' : peak > r.max ? 'caution' : 'safe';
          const label = { safe: 'Kaya pa!', caution: 'Ingat!', danger: 'Hindi na kaya!' }[verdict];
          return (
            <li key={r.en} className="flex items-center justify-between bg-surface-container rounded-2xl px-4 py-3">
              <span className="flex items-center gap-3 font-headline-sm text-body-md text-primary">
                <span className="material-symbols-outlined text-secondary">{r.icon}</span>
                {t(r.tl, r.en)}
              </span>
              <span className={`font-label-badge text-[12px] px-3 py-1 rounded-full font-bold ${TONE[verdict]}`}>{label}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function LiveOutlook() {
  const { data } = useLive();
  const { t, lang } = useT();
  if (!data?.daily?.length) return null;
  const fmt = new Intl.DateTimeFormat(lang === 'en' ? 'en-PH' : 'fil-PH', { weekday: 'short', month: 'short', day: 'numeric' });
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-headline-sm text-headline-sm text-primary flex items-center gap-1.5">
        <span className="material-symbols-outlined text-secondary text-[22px]">calendar_month</span>
        {t('Forecast sa Susunod na 5 Araw', '5-Day Forecast')}
      </h2>
      <ul className="flex flex-col gap-2.5">
        {data.daily.map((d) => {
          const status = classify(d.worstDepth);
          return (
            <li key={d.date} className="bg-surface-container-lowest rounded-xl p-4 flex items-center gap-4 shadow-[0_6px_20px_rgba(15,43,72,0.06)]">
              <span className="material-symbols-outlined text-secondary text-[30px]">{d.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="font-headline-sm text-body-md text-primary">{fmt.format(new Date(`${d.date}T12:00:00`))}</div>
                <div className="font-body-sm text-[12.5px] text-on-surface-variant">
                  {t('Ulan', 'Rain')}: {d.mm.toFixed(0)} mm • {d.prob ?? '—'}% {t('tsansa', 'chance')} • {t('hangin', 'wind')}:{' '}
                  {Math.round(d.windMax)} km/h
                </div>
              </div>
              <div className="text-right">
                <div className="font-headline-sm text-body-md text-primary">{d.worstDepth.toFixed(1)}m</div>
                <span className={`font-label-badge text-[10px] px-2 py-0.5 rounded-full font-bold ${TONE[status.key]}`}>{status.label}</span>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="font-body-sm text-[12px] text-on-surface-variant">
        {t(
          'Pinakamataas na tantiya sa araw na iyon, batay sa dami ng ulan at taas ng lugar.',
          'Highest estimate for that day, based on rainfall and ground elevation.'
        )}
      </p>
    </section>
  );
}
