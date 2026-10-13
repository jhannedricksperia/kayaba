import { useEffect, useState } from 'react';
import { useLive } from '../lib/live.jsx';
import { classify, describeDepth, describeRain, formatHour } from '../lib/weather.js';

const TONE = {
  safe: 'bg-secondary-container text-primary',
  caution: 'bg-surface-container-high text-primary',
  danger: 'bg-primary text-secondary-container',
};

function buildAlerts(live) {
  const { data, ai, terrain } = live;
  const out = [];
  const peak = data.peak;
  const status = classify(peak.depth);

  out.push({
    key: 'flood',
    level: status.key,
    badge: `${status.label} • ${peak.depth.toFixed(1)} m`,
    icon: 'flood',
    title:
      peak.depth >= 0.1
        ? `Posibleng baha hanggang ${peak.depth.toFixed(1)} m sa paligid ng ${formatHour(peak.time)}`
        : 'Walang inaasahang baha sa susunod na 24 oras',
    body: `${describeDepth(peak.depth)}. Ngayon: ${data.nowDepth.toFixed(1)} m.`,
    source: ai.status === 'ok' ? `AI estimate (${ai.model})` : 'Elevation + rainfall formula',
  });

  const maxMm = Math.max(0, ...data.steps.map((s) => s.mm));
  if (data.rainNow >= 2.5 || maxMm >= 20) {
    out.push({
      key: 'rain',
      level: data.rainNow >= 7.6 || maxMm >= 60 ? 'danger' : 'caution',
      badge: describeRain(data.rainNow),
      icon: 'rainy',
      title: `Ulan: ${data.rainNow.toFixed(1)} mm/h ngayon, hanggang ${maxMm.toFixed(0)} mm sa loob ng 3 oras`,
      body: 'Mabilis tumaas ang tubig sa mabababang lugar kapag tuloy-tuloy ang ulan.',
      source: 'Open-Meteo forecast',
    });
  }

  if (data.signal > 0 || data.maxWind >= 40) {
    out.push({
      key: 'wind',
      level: data.signal >= 3 ? 'danger' : 'caution',
      badge: data.signal > 0 ? `Signal #${data.signal} (est.)` : 'Malakas na hangin',
      icon: 'air',
      title: `Hangin hanggang ${data.maxWind} km/h sa susunod na 24 oras`,
      body: `Gusts ngayon: ${data.gustNow} km/h. Ang signal ay estimate mula sa forecast, hindi opisyal na bulletin.`,
      source: 'Open-Meteo forecast',
    });
  }

  if (ai.status === 'ok') {
    out.push({
      key: 'ai',
      level: ai.risk,
      badge: `AI • ${ai.confidence} confidence`,
      icon: 'auto_awesome',
      title: ai.headline,
      body: ai.advice.join(' • '),
      source: `AI estimate (${ai.model})`,
    });
  }

  if (terrain && terrain.belowMean >= 1.5) {
    out.push({
      key: 'terrain',
      level: 'caution',
      badge: 'Mababang lugar',
      icon: 'landscape',
      title: `Mas mababa ng ${terrain.belowMean.toFixed(1)} m ang lugar na ito kaysa sa paligid`,
      body: 'Dito naiipon ang tubig galing sa mas mataas na bahagi. Mag-ingat kahit katamtaman lang ang ulan.',
      source: 'Elevation data',
    });
  }
  return out;
}

export default function LiveAlerts() {
  const live = useLive();
  const { data, error, place } = live;
  const [speaking, setSpeaking] = useState(false);
  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  if (!data) {
    return (
      <div className="bg-surface-container-lowest rounded-lg p-5 text-on-surface-variant font-body-sm">
        {error ? `Hindi ma-load ang forecast: ${error}` : 'Kinukuha ang live na babala…'}
      </div>
    );
  }

  const alerts = buildAlerts(live);
  const speak = () => {
    if (!('speechSynthesis' in window)) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const text = alerts.map((a) => `${a.title}. ${a.body}`).join(' ');
    const u = new SpeechSynthesisUtterance(`${place.name}. ${text}`);
    u.lang = 'fil-PH';
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(u);
  };
  const top = alerts.reduce((a, b) => (['safe', 'caution', 'danger'].indexOf(b.level) > ['safe', 'caution', 'danger'].indexOf(a.level) ? b : a), alerts[0]);

  return (
    <>
      <div className="relative overflow-hidden rounded-lg bg-primary text-on-primary p-space-md shadow-[0_16px_36px_-6px_rgba(0,227,253,0.25)]">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-secondary-container text-[30px]">
            {top.level === 'safe' ? 'verified' : 'warning'}
          </span>
          <div className="min-w-0">
            <div className="font-headline-sm text-headline-sm text-secondary-container">{classify(data.peak.depth).label}</div>
            <div className="font-body-sm text-[13px] text-on-primary/80 truncate">{place.name} • live forecast</div>
          </div>
        </div>
        <button
          type="button"
          onClick={speak}
          className="mt-3 w-full flex items-center justify-between bg-white/10 hover:bg-white/15 rounded-2xl px-4 py-3 active:scale-[0.99] transition"
        >
          <span className="flex items-center gap-2 font-headline-sm text-[15px]">
            <span className="material-symbols-outlined text-secondary-container">{speaking ? 'stop_circle' : 'volume_up'}</span>
            {speaking ? 'Itigil' : 'Pakinggan ang babala'}
          </span>
          <span className="font-label-badge text-[11px] bg-secondary-container/20 text-secondary-container px-2 py-0.5 rounded-full">TL</span>
        </button>
        <p className="mt-3 font-body-sm text-body-sm text-on-primary/90">
          Estimate lang ito at hindi opisyal na babala. Sundin ang PAGASA, NDRRMC at ang inyong LGU o barangay.
        </p>
      </div>

      <ul className="flex flex-col gap-5">
        {alerts.map((a) => (
          <li key={a.key} className="bg-surface-container-lowest rounded-xl p-5 shadow-[0_8px_24px_-4px_rgba(15,43,72,0.07)] flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-label-badge text-[12px] font-bold ${TONE[a.level]}`}>
                <span className="material-symbols-outlined text-[16px]">{a.icon}</span>
                {a.badge}
              </span>
              <span className="font-body-sm text-[12px] text-on-surface-variant">Ngayon</span>
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
