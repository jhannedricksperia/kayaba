import { useState } from 'react';
import { useLive } from '../lib/live.jsx';
import LiveMap from '../components/MapView.jsx';
import LayerChips from '../components/LayerChips.jsx';
import MapPanel from '../components/MapPanel.jsx';
import PlaceSearch from '../components/PlaceSearch.jsx';
import TimeSteps from '../components/TimeSteps.jsx';
import { useEffect } from 'react';
import init from './scripts/map.js';

export default function MapScreen({ go }) {
  const live = useLive();
  const [step, setStep] = useState(0);
  const [layers, setLayers] = useState({ flood: true, water: true, shelters: true });
  useEffect(() => { init(); }, []);
  return (
    <div data-screen="map" className="bg-surface font-body-md text-on-surface flex flex-col min-h-screen selection:bg-secondary-container">
      <header className="fixed top-0 inset-x-0 z-50 pt-safe bg-surface/90 backdrop-blur-xl shadow-[0_4px_20px_-4px_rgba(15,43,72,0.06)]">
        <div className="h-16 px-margin-mobile flex items-center justify-between gap-space-xs">
          <div className="flex items-center gap-space-xs min-w-0">
            <img alt="Kaya Ba Logo" className="h-8 w-auto object-contain flex-shrink-0" src="/img/3cae5cf9ab.jpg" />
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-headline-sm text-headline-sm text-primary tracking-tight truncate">
                  Kaya Ba?
                </span>
                <span className="h-2 w-2 rounded-full bg-secondary-container animate-pulse flex-shrink-0"></span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant font-semibold truncate">
                Live Flood Forecast
              </span>
            </div>
          </div>
          <div className="flex items-center gap-space-xs flex-shrink-0">
            <button className="flex items-center gap-1.5 bg-surface-container hover:bg-surface-container-high active:scale-95 transition-transform px-3.5 py-2 rounded-full min-h-[44px] touch-manipulation shadow-sm" type="button">
              <span className="material-symbols-outlined text-secondary text-[18px]">
                near_me
              </span>
              <span className="font-label-badge text-label-badge text-primary">
                {live.place.name}
              </span>
              <span className="material-symbols-outlined text-on-surface-variant text-[16px]">
                expand_more
              </span>
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col relative w-full pt-16 pb-28 bg-surface">
        <div className="flex flex-col w-full relative">
          <section className="px-margin-mobile pt-space-xs pb-space-xs z-30">
            <div className="relative flex items-center bg-surface-container-lowest rounded-full shadow-[0_8px_24px_-6px_rgba(15,43,72,0.1)] p-1.5 transition-all">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-surface-container text-secondary flex-shrink-0">
                <span className="material-symbols-outlined text-[20px]">
                  search
                </span>
              </div>
              <PlaceSearch />
            </div>
            <LayerChips layers={layers} onChange={setLayers} />
            <div className="bg-surface-container-lowest rounded-2xl p-2.5 shadow-[0_4px_16px_rgba(15,43,72,0.06)] flex flex-col gap-1.5">
              <div className="flex items-center justify-between px-1">
                <span className="flex items-center gap-1 font-label-badge text-[11px] text-secondary">
                  <span className="material-symbols-outlined text-[14px]">
                    history_toggle_off
                  </span>
                  {live.place.name} flood estimate
                </span>
                <span className="font-label-badge text-[11px] text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">
                  {live.data ? `Peak: ${live.data.peak.time.slice(11, 16)} (${live.data.peak.depth.toFixed(1)}m)` : 'Loading…'}
                </span>
              </div>
              <TimeSteps value={step} onChange={setStep} />
            </div>
          </section>
          <section className="relative w-full h-[420px] my-2"><LiveMap stepIndex={step} layers={layers} className="w-full h-full" /></section>
          <MapPanel stepIndex={step} />
        </div>
      </main>
      <div className="fixed bottom-24 right-margin-mobile z-40">
        <a className="flex items-center gap-2 bg-secondary-container text-primary font-label-btn text-label-btn px-4 py-3 rounded-full shadow-[0_12px_28px_-4px_rgba(0,227,253,0.5)] hover:scale-105 active:scale-95 transition-all touch-manipulation min-h-[44px]" href="#map" onClick={(e)=>{e.preventDefault();go("map");}}>
          <span className="material-symbols-outlined text-[22px]">
            emergency
          </span>
          <span className="pr-1">
            Evac Safe Zone
          </span>
        </a>
      </div>
      <nav className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_-8px_30px_rgba(15,43,72,0.08)]" data-active-classes="bg-secondary-container/30 text-primary scale-105 font-bold shadow-[0_4px_16px_rgba(0,227,253,0.35)]">
        <div className="flex justify-around items-center h-20 px-space-xs">
          <a className="flex flex-col items-center justify-center gap-1 min-w-[48px] min-h-[48px] px-3.5 py-1.5 rounded-full text-on-surface-variant hover:text-primary transition-all" href="#home" onClick={(e)=>{e.preventDefault();go("home");}}>
            <span className="material-symbols-outlined text-[24px]">
              water_drop
            </span>
            <span className="font-label-badge text-[11px]">
              Home
            </span>
          </a>
          <a aria-current="page" className="flex flex-col items-center justify-center gap-1 min-w-[48px] min-h-[48px] px-3.5 py-1.5 rounded-full transition-all bg-secondary-container/30 text-primary scale-105 font-bold shadow-[0_4px_16px_rgba(0,227,253,0.35)]" href="#map" onClick={(e)=>{e.preventDefault();go("map");}}>
            <span className="material-symbols-outlined text-[24px]">
              map
            </span>
            <span className="font-label-badge text-[11px]">
              Map
            </span>
          </a>
          <a className="flex flex-col items-center justify-center gap-1 min-w-[48px] min-h-[48px] px-3.5 py-1.5 rounded-full text-on-surface-variant hover:text-primary transition-all" href="#forecast" onClick={(e)=>{e.preventDefault();go("forecast");}}>
            <span className="material-symbols-outlined text-[24px]">
              rainy
            </span>
            <span className="font-label-badge text-[11px]">
              Forecast
            </span>
          </a>
          <a className="flex flex-col items-center justify-center gap-1 min-w-[48px] min-h-[48px] px-3.5 py-1.5 rounded-full text-on-surface-variant hover:text-primary transition-all" href="#alerts" onClick={(e)=>{e.preventDefault();go("alerts");}}>
            <span className="material-symbols-outlined text-[24px]">
              notifications_active
            </span>
            <span className="font-label-badge text-[11px]">
              Alerts
            </span>
          </a>
        </div>
      </nav>
    </div>
  );
}
