import { useEffect, useRef } from 'react';

export default function ThreeScene() {
  const ref = useRef(null);

  useEffect(() => {
    let cleanup;
    let cancelled = false;
    // three + the scene are loaded on demand to keep the first paint light.
    Promise.all([import('three'), import('../scenes/homeScene.js')]).then(([THREE, scene]) => {
      if (!cancelled && ref.current) cleanup = scene.default(ref.current, THREE);
    });
    return () => {
      cancelled = true;
      if (cleanup) cleanup();
    };
  }, []);

  return <div ref={ref} style={{ width: '100%', height: '100%' }} />;
}
