import { classify, formatHour } from '../lib/weather.js';
import { useLive } from '../lib/live.jsx';

const BAR = { safe: 'bg-secondary-container', caution: 'bg-secondary', danger: 'bg-primary-container' };

export default function ForecastCards() {
  const { data, error } = useLive();
  if (!data) {
    return (
      <p className="font-body-sm text-on-surface-variant px-1">
        {error ? `Forecast unavailable: ${error}` : 'Kinukuha ang pinakabagong forecast…'}
      </p>
    );
  }
  const peakTime = data.peak.time;
  return data.steps.map((s, i) => {
    const status = classify(s.depth);
    const isPeak = s.time === peakTime && s.depth >= 0.1;
    const prev = i > 0 ? data.steps[i - 1].depth : s.depth;
    let trend = 'Pareho lang';
    if (isPeak) trend = status.label;
    else if (s.depth < 0.1) trend = 'Kaya pa!';
    else if (s.depth > prev) trend = 'Tumataas';
    else if (s.depth < prev) trend = 'Bumababa';
    return (
      <div
        key={s.time}
        className={`flex-shrink-0 w-24 rounded-3xl p-3 flex flex-col items-center justify-between ${
          isPeak
            ? 'bg-surface-container-low shadow-[0_6px_18px_-2px_rgba(0,227,253,0.3)]'
            : 'bg-surface-container-lowest shadow-[0_4px_14px_-2px_rgba(15,43,72,0.06)]'
        }`}
      >
        {isPeak && (
          <div className="bg-secondary-container px-2 py-0.5 rounded-full font-label-badge text-[9px] text-primary font-bold uppercase tracking-wider mb-0.5">
            Peak
          </div>
        )}
        <span className="font-label-badge text-[12px] text-on-surface-variant font-bold">
          {i === 0 ? 'Ngayon' : formatHour(s.time)}
        </span>
        <div className="my-2 flex flex-col items-center">
          <span className="material-symbols-outlined text-secondary text-[26px]">{s.icon}</span>
          <span className="font-headline-sm text-[16px] text-primary font-bold mt-0.5">{s.depth.toFixed(1)}m</span>
        </div>
        <div className="w-3 h-12 bg-surface-container rounded-full overflow-hidden flex flex-col justify-end p-0.5">
          <div
            className={`w-full rounded-full ${BAR[status.key]}`}
            style={{ height: `${Math.max(6, Math.min(100, (s.depth / 2) * 100))}%` }}
          />
        </div>
        <span className="font-label-badge text-[10px] text-primary mt-1 font-bold">{trend}</span>
      </div>
    );
  });
}
