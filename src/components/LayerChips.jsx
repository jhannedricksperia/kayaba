import HScroll from './HScroll.jsx';

const CHIPS = [
  { key: 'flood', label: 'Flood Depth', icon: 'water' },
  { key: 'water', label: 'Mga Ilog', icon: 'waves' },
  { key: 'shelters', label: 'Evacuation Center', icon: 'night_shelter' },
];

export default function LayerChips({ layers, onChange }) {
  return (
    <HScroll className="items-center gap-2 py-2.5">
      {CHIPS.map((c) => {
        const on = layers[c.key];
        return (
          <button
            key={c.key}
            type="button"
            aria-pressed={on}
            onClick={() => onChange({ ...layers, [c.key]: !on })}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-label-badge text-label-badge flex-shrink-0 active:scale-95 transition-all ${
              on
                ? 'bg-secondary-container text-primary shadow-[0_4px_12px_rgba(0,227,253,0.35)]'
                : 'bg-surface-container-lowest text-on-surface-variant shadow-sm'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">{c.icon}</span>
            {c.label}
          </button>
        );
      })}
    </HScroll>
  );
}
