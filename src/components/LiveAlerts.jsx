import { useEffect, useState } from 'react';
import { useLive } from '../lib/live.jsx';
import { useT } from '../lib/i18n.jsx';
import { classify, describeDepth, describeRain, formatHour } from '../lib/weather.js';

const TONE = {
  safe: 'bg-secondary-container text-primary',
  caution: 'bg-surface-container-high text-primary',
  danger: 'bg-primary text-secondary-container',
};
const ORDER = ['safe', 'caution', 'danger'];

function buildAlerts(live, t, lang) {
  const { data, ai, terrain } = live;
  const out = [];
  const peak = data.peak;
  const status = classify(peak.depth);
  const aiSource = t('Tantiya ng AI', 'AI estimate');

  out.push({
    key: 'flood',
    level: status.key,
    badge: `${status.label} • ${peak.depth.toFixed(1)} m`,
    icon: 'flood',
    title:
      peak.depth >= 0.15
        ? t(
            `Maaaring umabot sa ${peak.depth.toFixed(1)} m ang baha mga ${formatHour(peak.time)}`,
            `Floodwater could reach ${peak.depth.toFixed(1)} m around ${formatHour(peak.time)}`
          )
        : t('Walang inaasahang baha sa susunod na 24 oras', 'No flooding expected in the next 24 hours'),
    body: t(
      `Sa ngayon: ${data.nowDepth.toFixed(1)} m. ${describeDepth(peak.depth, lang)}.`,
      `Right now: ${data.nowDepth.toFixed(1)} m. ${describeDepth(peak.depth, lang)}.`
    ),
    source: ai.status === 'ok' ? aiSource : t('Kalkulasyon (taas ng lugar at ulan)', 'Calculation (elevation and rainfall)'),
  });

  const maxMm = Math.max(0, ...data.steps.map((s) => s.mm));
  if (data.rainNow >= 2.5 || maxMm >= 20) {
    out.push({
      key: 'rain',
      level: data.rainNow >= 7.6 || maxMm >= 60 ? 'danger' : 'caution',
      badge: describeRain(data.rainNow, lang),
      icon: 'rainy',
      title: t(
        `Umuulan ng ${data.rainNow.toFixed(1)} mm/h ngayon. Hanggang ${maxMm.toFixed(0)} mm ang inaasahan sa loob ng 3 oras.`,
        `Raining ${data.rainNow.toFixed(1)} mm/h now. Up to ${maxMm.toFixed(0)} mm expected within 3 hours.`
      ),
      body: t(
        'Mabilis tumataas ang tubig sa mabababang lugar kapag tuloy-tuloy ang ulan.',
        'Water rises quickly in low-lying areas when the rain keeps falling.'
      ),
      source: 'Open-Meteo forecast',
    });
  }

  if (data.signal > 0 || data.maxWind >= 40) {
    out.push({
      key: 'wind',
      level: data.signal >= 3 ? 'danger' : 'caution',
      badge: data.signal > 0 ? `Signal #${data.signal} (est.)` : t('Malakas na hangin', 'Strong wind'),
      icon: 'air',
      title: t(
        `Malakas na hangin, hanggang ${data.maxWind} km/h sa susunod na 24 oras`,
        `Strong wind, up to ${data.maxWind} km/h in the next 24 hours`
      ),
      body: t(
        `Bugso ngayon: ${data.gustNow} km/h. Tantiya lang ang signal mula sa forecast at hindi galing sa opisyal na bulletin.`,
        `Gusts now: ${data.gustNow} km/h. The signal is only an estimate from the forecast, not from an official bulletin.`
      ),
      source: 'Open-Meteo forecast',
    });
  }

  if (ai.status === 'ok') {
    out.push({
      key: 'ai',
      level: ai.risk,
      badge: `AI • ${ai.confidence}`,
      icon: 'auto_awesome',
      title: ai.headline,
      body: ai.advice.join(' • '),
      source: aiSource,
    });
  }

  if (terrain && terrain.belowMean >= 1.5) {
    out.push({
      key: 'terrain',
      level: 'caution',
      badge: t('Mababang lugar', 'Low ground'),
      icon: 'landscape',
      title: t(
        `Mas mababa nang ${terrain.belowMean.toFixed(1)} m ang lugar na ito kaysa sa paligid`,
        `This spot is ${terrain.belowMean.toFixed(1)} m lower than its surroundings`
      ),
      body: t(
        'Dito kasi naiipon ang tubig mula sa mas mataas na bahagi, kaya mag-ingat kahit katamtaman lang ang ulan.',
        'Water from higher ground collects here, so be careful even with moderate rain.'
      ),
      source: t('Datos ng taas ng lugar', 'Elevation data'),
    });
  }
  return out;
}

export default function LiveAlerts() {
  const live = useLive();
  const { t, lang } = useT();
  const { data, error, place } = live;
  const [speaking, setSpeaking] = useState(false);
  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  if (!data) {
    return (
      <div className="bg-surface-container-lowest rounded-lg p-5 text-on-surface-variant font-body-sm">
        {error
          ? `${t('Hindi ma-load ang forecast', 'Could not load the forecast')}: ${error}`
          : t('Kinukuha ang pinakabagong babala…', 'Getting the latest alerts…')}
      </div>
    );
  }

  const alerts = buildAlerts(live, t, lang);
  const speak = () => {
    if (!('speechSynthesis' in window)) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const text = alerts.map((a) => `${a.title}. ${a.body}`).join(' ');
    const u = new SpeechSynthesisUtterance(`${place.name}. ${text}`);
    u.lang = lang === 'en' ? 'en-PH' : 'fil-PH';
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(u);
  };
  const top = alerts.reduce((a, b) => (ORDER.indexOf(b.level) > ORDER.indexOf(a.level) ? b : a), alerts[0]);

  return (
    <>
      <div className="relative overflow-hidden rounded-lg bg-primary text-on-primary p-space-md shadow-[0_16px_36px_-6px_rgba(0,227,253,0.25)]">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-secondary-container text-[30px]">
            {top.level === 'safe' ? 'verified' : 'warning'}
          </span>
          <div className="min-w-0">
            <div className="font-headline-sm text-headline-sm text-secondary-container">{classify(data.peak.depth).label}</div>
            <div className="font-body-sm text-[13px] text-on-primary/80 truncate">
              {place.name} • {t('pinakabagong forecast', 'latest forecast')}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={speak}
          className="mt-3 w-full flex items-center justify-between bg-white/10 hover:bg-white/15 rounded-2xl px-4 py-3 active:scale-[0.99] transition"
        >
          <span className="flex items-center gap-2 font-headline-sm text-[15px]">
            <span className="material-symbols-outlined text-secondary-container">{speaking ? 'stop_circle' : 'volume_up'}</span>
            {speaking ? t('Itigil', 'Stop') : t('Pakinggan ang babala', 'Listen to the alerts')}
          </span>
          <span className="font-label-badge text-[11px] bg-secondary-container/20 text-secondary-container px-2 py-0.5 rounded-full">
            {lang === 'en' ? 'EN' : 'TL'}
          </span>
        </button>
        <p className="mt-3 font-body-sm text-body-sm text-on-primary/90">
          {t(
            'Tantiya lang ito at hindi opisyal na babala. Sundin ang abiso ng PAGASA, NDRRMC, at ng inyong LGU o barangay.',
            'This is an estimate, not an official warning. Follow advisories from PAGASA, NDRRMC, and your LGU or barangay.'
          )}
        </p>
      </div>

      <div className="bg-surface-container-lowest rounded-xl p-5 shadow-[0_8px_24px_-4px_rgba(15,43,72,0.07)] flex flex-col gap-3">
        <h3 className="font-headline-sm text-headline-sm text-primary">{t('Opisyal na impormasyon', 'Official information')}</h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          {t(
            'Galing sa weather model ng Open-Meteo ang mga numero dito, hindi sa PAGASA. Para sa opisyal na babala, bisitahin ang:',
            'The numbers here come from the Open-Meteo weather model, not PAGASA. For official warnings, visit:'
          )}
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            ['PAGASA', 'https://bagong.pagasa.dost.gov.ph/'],
            ['NDRRMC', 'https://ndrrmc.gov.ph/'],
          ].map(([label, href]) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-on-primary font-label-badge text-[13px] font-bold active:scale-95 transition-transform"
            >
              {label}
              <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            </a>
          ))}
        </div>
      </div>

      <ul className="flex flex-col gap-5">
        {alerts.map((a) => (
          <li key={a.key} className="bg-surface-container-lowest rounded-xl p-5 shadow-[0_8px_24px_-4px_rgba(15,43,72,0.07)] flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-label-badge text-[12px] font-bold ${TONE[a.level]}`}>
                <span className="material-symbols-outlined text-[16px]">{a.icon}</span>
                {a.badge}
              </span>
              <span className="font-body-sm text-[12px] text-on-surface-variant">{t('Ngayon', 'Now')}</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-primary">{a.title}</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">{a.body}</p>
            <span className="font-body-sm text-[12px] text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">info</span>
              {a.source}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}
