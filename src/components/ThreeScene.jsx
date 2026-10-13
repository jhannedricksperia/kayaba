import { useEffect, useRef, useState } from 'react';

const RELOAD_FLAG = 'kayaba.chunk-reload';

export default function ThreeScene() {
  const ref = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cleanup;
    let cancelled = false;
    // three + the scene are loaded on demand to keep the first paint light.
    Promise.all([import('three'), import('../scenes/homeScene.js')])
      .then(([THREE, scene]) => {
        if (cancelled || !ref.current) return;
        cleanup = scene.default(ref.current, THREE);
        try {
          sessionStorage.removeItem(RELOAD_FLAG);
        } catch {
          /* storage unavailable */
        }
      })
      .catch(() => {
        if (cancelled) return;
        // A stale tab after a new deploy points at chunks that no longer exist: reload once.
        try {
          if (!sessionStorage.getItem(RELOAD_FLAG)) {
            sessionStorage.setItem(RELOAD_FLAG, '1');
            window.location.reload();
            return;
          }
        } catch {
          /* storage unavailable */
        }
        setFailed(true);
      });
    return () => {
      cancelled = true;
      if (cleanup) cleanup();
    };
  }, []);

  if (failed) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-center px-6 text-primary">
        <span className="material-symbols-outlined text-[40px] text-secondary">water_drop</span>
        <p className="font-body-sm text-[14px]">Hindi ma-load ang 3D scene. Gumagana pa rin ang forecast sa ibaba.</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-full bg-primary text-on-primary font-label-badge text-[12px] font-bold"
        >
          I-refresh
        </button>
      </div>
    );
  }

  return <div ref={ref} style={{ width: '100%', height: '100%' }} />;
}
