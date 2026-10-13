import { classify } from '../lib/weather.js';
import { useLive } from '../lib/live.jsx';
import HScroll from './HScroll.jsx';
import { useT } from '../lib/i18n.jsx';

// Forecast steps are 3 h apart: index 0 = now, 1 = +3h, 2 = +6h, 4 = +12h, 8 = +24h.
export const STEPS = [
  { label: 'Ngayon', en: 'Now', idx: 0 },
  { label: '+3h', idx: 1 },
  { label: '+6h', idx: 2 },
  { label: '+12h', idx: 4 },
  { label: '+24h', idx: 8 },
];

export default function TimeSteps({ value, onChange, variant = 'grid' }) {
  const { data } = useLive();
  const { t } = useT();
  const depthAt = (i) => data?.steps?.[i]?.depth;

  if (variant === 'pills') {
    return (
      <HScroll className="items-center gap-1.5 pb-1">
        {STEPS.map((s) => (
          <button
            key={s.idx}
            type="button"
            onClick={() => onChange(s.idx)}
            className={`px-3 py-1.5 rounded-full font-label-badge text-[12px] font-bold flex-shrink-0 active:scale-95 transition-all ${
              value === s.idx ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container text-on-surface-variant'
            }`}
          >
            {s.en ? t(s.label, s.en) : s.label}
            {depthAt(s.idx) != null && ` • ${depthAt(s.idx).toFixed(1)}m`}
          </button>
        ))}
      </HScroll>
    );
  }

  return (
    <div className="grid grid-cols-5 gap-1.5">
      {STEPS.map((s) => {
        const d = depthAt(s.idx);
        const status = d != null ? classify(d) : null;
        return (
          <button
            key={s.idx}
            type="button"
            onClick={() => onChange(s.idx)}
            className={`py-1.5 px-1 rounded-xl text-center active:scale-95 transition-transform cursor-pointer ${
              value === s.idx ? 'bg-primary-container text-secondary-container shadow-sm' : 'bg-surface-container text-primary'
            }`}
          >
            <div className="font-headline-sm text-[12px] leading-tight font-bold">{s.en ? t(s.label, s.en) : s.label}</div>
            <div className="font-body-sm text-[10px] font-bold">
              {d != null ? `${d.toFixed(1)}m` : '—'}
              {status?.key === 'danger' && ' ⚠️'}
            </div>
          </button>
        );
      })}
    </div>
  );
}
