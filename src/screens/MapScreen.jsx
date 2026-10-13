import { useState } from 'react';
import { useLive } from '../lib/live.jsx';
import LiveMap from '../components/LiveMap.jsx';
import TimeSteps from '../components/TimeSteps.jsx';
import { useEffect } from 'react';
import init from './scripts/map.js';

export default function MapScreen({ go }) {
  const live = useLive();
  const [step, setStep] = useState(0);
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
              <input className="w-full bg-transparent px-3 font-body-md text-body-md text-primary placeholder:text-outline font-semibold focus:outline-none" placeholder="Search street, barangay, landmark..." type="text" defaultValue="Brgy. Tumana, Marikina City" />
              <button className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-primary hover:bg-secondary-container active:scale-90 transition-transform flex-shrink-0" title="Voice or Filter" type="button">
                <span className="material-symbols-outlined text-[18px]">
                  mic
                </span>
              </button>
              <button className="w-9 h-9 ml-1 rounded-full bg-surface-container-high flex items-center justify-center text-primary hover:bg-secondary-container active:scale-90 transition-transform flex-shrink-0" title="Map Layers" type="button">
                <span className="material-symbols-outlined text-[18px]">
                  tune
                </span>
              </button>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto py-2.5 no-scrollbar -mx-margin-mobile px-margin-mobile">
              <button className="layer-chip active-layer flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-secondary-container text-primary font-label-badge text-label-badge shadow-[0_4px_12px_rgba(0,227,253,0.35)] active:scale-95 transition-transform flex-shrink-0 cursor-pointer" data-chip="flood" type="button">
                <span className="material-symbols-outlined text-[16px]">
                  water
                </span>
                <span>
                  Flood Depth
                </span>
              </button>
              <button className="layer-chip flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-container-lowest text-on-surface-variant font-label-badge text-label-badge shadow-sm active:scale-95 transition-transform flex-shrink-0 cursor-pointer" data-chip="routes" type="button">
                <span className="material-symbols-outlined text-[16px]">
                  alt_route
                </span>
                <span>
                  Safe Routes
                </span>
              </button>
              <button className="layer-chip flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-container-lowest text-on-surface-variant font-label-badge text-label-badge shadow-sm active:scale-95 transition-transform flex-shrink-0 cursor-pointer" data-chip="shelters" type="button">
                <span className="material-symbols-outlined text-[16px]">
                  domain
                </span>
                <span>
                  Open Shelters
                </span>
              </button>
              <button className="layer-chip flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-container-lowest text-on-surface-variant font-label-badge text-label-badge shadow-sm active:scale-95 transition-transform flex-shrink-0 cursor-pointer" data-chip="reports" type="button">
                <span className="material-symbols-outlined text-[16px]">
                  campaign
                </span>
                <span>
                  Live Reports
                </span>
              </button>
            </div>
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
          <section className="relative w-full h-[420px] my-2"><LiveMap stepIndex={step} className="w-full h-full" /></section>
          <section className="px-margin-mobile flex flex-col gap-3 my-2 z-20">
            <div className="bg-surface-container-lowest rounded-3xl p-4 shadow-[0_10px_25px_-5px_rgba(15,43,72,0.08)] flex flex-col gap-3 border-2 border-surface-container-low">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-secondary text-[18px]">
                      location_on
                    </span>
                    <span className="font-headline-sm text-[16px] text-primary truncate">
                      Brgy. Tumana, Sector 4
                    </span>
                  </div>
                  <span className="font-body-sm text-[12px] text-on-surface-variant pl-6">
                    Marikina River 2nd Alarm Level
                  </span>
                </div>
                <span className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low text-primary font-label-badge text-[12px] shadow-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary-container animate-pulse"></span>
                  <span>
                    Ingat! (0.9m)
                  </span>
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 bg-surface-container-low/60 p-2.5 rounded-2xl text-center">
                <div className="flex flex-col items-center">
                  <span className="font-body-sm text-[10px] text-on-surface-variant">
                    Street Water
                  </span>
                  <span className="font-headline-sm text-[15px] font-bold text-primary">
                    Waist Deep
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-body-sm text-[10px] text-on-surface-variant">
                    River Trend
                  </span>
                  <span className="font-headline-sm text-[15px] font-bold text-error flex items-center gap-0.5">
                    Rising
                    <span className="material-symbols-outlined text-[14px]">
                      trending_up
                    </span>
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-body-sm text-[10px] text-on-surface-variant">
                    Safe Passability
                  </span>
                  <span className="font-headline-sm text-[15px] font-bold text-secondary">
                    High Trucks
                  </span>
                </div>
              </div>
              <div className="bg-surface-container p-3 rounded-2xl flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-secondary-container flex items-center justify-center text-primary flex-shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-[24px]">
                    directions_walk
                  </span>
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-headline-sm text-[13px] font-bold text-primary truncate">
                      To Tumana High Evac
                    </span>
                    <span className="font-label-badge text-[11px] text-secondary font-bold">
                      6 mins
                    </span>
                  </div>
                  <p className="font-body-sm text-[12px] text-on-surface-variant line-clamp-1">
                    450m via elevated walkway •
                    <span className="text-error font-semibold">
                      Avoid JP Rizal
                    </span>
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2 pt-1">
                <button className="w-full h-13 py-3 px-4 rounded-full bg-secondary-container hover:bg-secondary-fixed-dim text-primary font-label-btn text-label-btn shadow-[0_8px_20px_-4px_rgba(0,227,253,0.45)] active:scale-97 transition-all flex items-center justify-center gap-2 cursor-pointer" type="button">
                  <span className="material-symbols-outlined text-[22px]">
                    navigation
                  </span>
                  <span>
                    Start Safe Walking Guidance
                  </span>
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button className="h-11 px-3 rounded-full bg-surface-container hover:bg-surface-container-high text-primary font-label-badge text-label-badge active:scale-95 transition-transform flex items-center justify-center gap-1.5 cursor-pointer shadow-sm" type="button">
                    <span className="material-symbols-outlined text-secondary text-[18px]">
                      add_a_photo
                    </span>
                    <span>
                      Report Flood
                    </span>
                  </button>
                  <button className="h-11 px-3 rounded-full bg-surface-container hover:bg-surface-container-high text-primary font-label-badge text-label-badge active:scale-95 transition-transform flex items-center justify-center gap-1.5 cursor-pointer shadow-sm" type="button">
                    <span className="material-symbols-outlined text-error text-[18px]">
                      sos
                    </span>
                    <span>
                      Barangay Hotlines
                    </span>
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-surface-container-lowest rounded-2xl p-3 shadow-sm flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-fixed text-primary flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[18px]">
                  forum
                </span>
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-headline-sm text-[12px] text-primary font-bold">
                    Kuya Jun (Tricycle Driver)
                  </span>
                  <span className="font-body-sm text-[10px] text-on-surface-variant">
                    4m ago
                  </span>
                </div>
                <p className="font-body-sm text-[11px] text-on-surface-variant truncate">
                  "Tubig baha lampas tuhod na sa kanto ng Champaca! Huwag nang pumasok ang mga sedan."
                </p>
              </div>
              <span className="material-symbols-outlined text-outline text-[18px]">
                chevron_right
              </span>
            </div>
          </section>
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
