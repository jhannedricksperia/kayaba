import { useLive } from '../lib/live.jsx';

const TONE = {
  safe: 'bg-secondary-container text-primary',
  caution: 'bg-surface-container-high text-primary',
  danger: 'bg-primary text-secondary-container',
};

export default function AiAssessment() {
  const { ai, terrain, data } = useLive();

  return (
    <section className="bg-surface-container-lowest rounded-3xl p-4 shadow-[0_8px_24px_-4px_rgba(15,43,72,0.07)] flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-secondary-container/30 flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
          </div>
          <span className="font-headline-sm text-body-lg text-primary font-bold">AI Flood Check</span>
        </div>
        {ai.status === 'ok' && (
          <span className={`font-label-badge text-[11px] px-2.5 py-1 rounded-full font-bold ${TONE[ai.risk] || TONE.caution}`}>
            Tiwala: {{mataas:"mataas",medium:"katamtaman",high:"mataas",low:"mababa"}[ai.confidence] || ai.confidence}
          </span>
        )}
      </div>

      {ai.status === 'loading' && (
        <p className="font-body-sm text-on-surface-variant">Tinitingnan ang taas ng lugar at ang ulan…</p>
      )}

      {ai.status === 'ok' && (
        <>
          <p className="font-headline-sm text-body-md text-primary font-bold">{ai.headline}</p>
          <ul className="flex flex-col gap-1">
            {ai.advice.map((a) => (
              <li key={a} className="font-body-sm text-[13px] text-on-surface-variant flex gap-1.5">
                <span className="text-secondary">•</span>
                {a}
              </li>
            ))}
          </ul>
          {ai.terrain_note && (
            <p className="font-body-sm text-[12px] text-on-surface-variant bg-surface-container rounded-2xl px-3 py-2">
              <b className="text-primary">Terrain:</b> {ai.terrain_note}
            </p>
          )}
        </>
      )}

      {ai.status === 'unavailable' && (
        <p className="font-body-sm text-[13px] text-on-surface-variant">
          Hindi magamit ang AI ngayon, kaya kalkulasyon batay sa taas ng lugar at dami ng ulan ang ginamit
          {data?.terrainFactor ? ` (terrain ×${data.terrainFactor})` : ''}.
        </p>
      )}

      {terrain && (
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            ['Taas ng lugar', `${terrain.pointElevation} m`],
            ['Kumpara sa paligid', `${terrain.belowMean > 0 ? '−' : '+'}${Math.abs(terrain.belowMean)} m`],
            ['Taas-baba (1 km)', `${terrain.relief} m`],
          ].map(([k, v]) => (
            <div key={k} className="bg-surface-container rounded-2xl py-1.5">
              <div className="font-label-badge text-[10px] text-on-surface-variant uppercase">{k}</div>
              <div className="font-headline-sm text-[14px] text-primary font-bold">{v}</div>
            </div>
          ))}
        </div>
      )}
      <p className="font-body-sm text-[10px] text-on-surface-variant">
        {ai.status === 'ok' ? 'Tantiya ng AI batay sa taas ng lugar at forecast. ' : ''}
        Tantiya lang ito at hindi opisyal na babala.
      </p>
    </section>
  );
}
