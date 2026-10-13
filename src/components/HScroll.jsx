import { useCallback, useEffect, useRef, useState } from 'react';

// Horizontal scroller with < > arrows that appear only when there is more to see on that side.
export default function HScroll({ children, className = '' }) {
  const ref = useRef(null);
  const [edge, setEdge] = useState({ left: false, right: false });

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setEdge({
      left: el.scrollLeft > 4,
      right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    update();
    const el = ref.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    Array.from(el.children).forEach((c) => ro.observe(c));
    return () => ro.disconnect();
  }, [update, children]);

  const scrollBy = (dir) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  const arrow = (side, show) =>
    show && (
      <button
        type="button"
        aria-label={side === 'left' ? 'Scroll pakaliwa' : 'Scroll pakanan'}
        onClick={() => scrollBy(side === 'left' ? -1 : 1)}
        className={`absolute top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/95 text-primary shadow-[0_4px_14px_rgba(15,43,72,0.25)] flex items-center justify-center active:scale-90 hover:bg-white transition ${
          side === 'left' ? 'left-1' : 'right-1'
        }`}
      >
        <span className="material-symbols-outlined text-[22px]">{side === 'left' ? 'chevron_left' : 'chevron_right'}</span>
      </button>
    );

  return (
    <div className="relative">
      <div ref={ref} onScroll={update} className={`flex overflow-x-auto no-scrollbar scroll-smooth ${className}`}>
        {children}
      </div>
      {arrow('left', edge.left)}
      {arrow('right', edge.right)}
    </div>
  );
}
