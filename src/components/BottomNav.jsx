const ITEMS = [
  { key: 'home', label: 'Home', icon: 'water_drop' },
  { key: 'map', label: 'Map', icon: 'map' },
  { key: 'forecast', label: 'Forecast', icon: 'rainy' },
  { key: 'alerts', label: 'Alerts', icon: 'notifications_active' },
  { key: 'about', label: 'About', icon: 'info' },
];

// One persistent nav so the active pill can slide between tabs instead of jumping.
export default function BottomNav({ active, go }) {
  const index = Math.max(0, ITEMS.findIndex((i) => i.key === active));

  return (
    <nav className="kb-nav fixed bottom-0 inset-x-0 z-50 pb-safe bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_-8px_30px_rgba(15,43,72,0.08)]">
      <div className="relative flex items-center h-20 px-space-xs">
        <span
          aria-hidden="true"
          className="kb-nav-pill absolute top-1/2 h-14 rounded-full bg-secondary-container/40 shadow-[0_4px_16px_rgba(0,227,253,0.35)]"
          style={{
            width: `calc((100% - 0.75rem) / ${ITEMS.length})`,
            left: '0.375rem',
            transform: `translate(${index * 100}%, -50%)`,
          }}
        />
        {ITEMS.map((item, i) => {
          const on = i === index;
          return (
            <a
              key={item.key}
              href={`#${item.key}`}
              aria-current={on ? 'page' : undefined}
              onClick={(e) => {
                e.preventDefault();
                go(item.key);
              }}
              className={`relative z-10 flex-1 flex flex-col items-center justify-center gap-1 min-h-[48px] py-1.5 rounded-full transition-colors duration-300 active:scale-90 ${
                on ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              <span
                key={on ? 'on' : 'off'}
                className={`material-symbols-outlined text-[24px] ${on ? 'kb-nav-icon-on' : ''}`}
                style={{ fontVariationSettings: on ? "'FILL' 1, 'wght' 500" : "'FILL' 0, 'wght' 400" }}
              >
                {item.icon}
              </span>
              <span className="font-label-badge text-[11px]">{item.label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
