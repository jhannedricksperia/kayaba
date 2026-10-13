import { useLive } from '../lib/live.jsx';
import LiveAlerts from '../components/LiveAlerts.jsx';
import { useEffect } from 'react';
import init from './scripts/alerts.js';

export default function Alerts({ go }) {
  const live = useLive();
  useEffect(() => { init(); }, []);
  return (
    <div data-screen="alerts" className="bg-surface font-body-md text-on-surface flex flex-col min-h-screen selection:bg-secondary-container">
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
        <div className="flex flex-col w-full px-margin-mobile pb-8 space-y-space-md">
          <LiveAlerts />
          
          
          <section className="bg-surface-container-low rounded-lg p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">
                  phone_in_talk
                </span>
                <h3 className="font-headline-sm text-headline-sm text-primary">
                  Emergency Hotlines
                </h3>
              </div>
              <span className="font-label-badge text-label-badge text-secondary bg-surface-container-lowest px-2.5 py-0.5 rounded-full">
                One-Tap Dial
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Toll-free and priority response channels active 24/7 during storm season.
            </p>
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <a className="flex items-center gap-2.5 bg-surface-container-lowest hover:bg-surface-container-highest active:scale-95 transition-all p-3 rounded-2xl shadow-sm text-left" href="tel:911">
                <div className="w-10 h-10 rounded-full bg-error-container text-on-error-container flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[20px]">
                    sos
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="font-headline-sm text-[16px] text-primary truncate leading-tight">
                    911
                  </div>
                  <div className="font-body-sm text-[12px] text-on-surface-variant truncate">
                    National Emerg
                  </div>
                </div>
              </a>
              <a className="flex items-center gap-2.5 bg-surface-container-lowest hover:bg-surface-container-highest active:scale-95 transition-all p-3 rounded-2xl shadow-sm text-left" href="tel:161">
                <div className="w-10 h-10 rounded-full bg-secondary-fixed text-primary flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[20px]">
                    kayaking
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="font-headline-sm text-[16px] text-primary truncate leading-tight">
                    161
                  </div>
                  <div className="font-body-sm text-[12px] text-on-surface-variant truncate">
                    Marikina Rescue
                  </div>
                </div>
              </a>
              <a className="flex items-center gap-2.5 bg-surface-container-lowest hover:bg-surface-container-highest active:scale-95 transition-all p-3 rounded-2xl shadow-sm text-left" href="tel:143">
                <div className="w-10 h-10 rounded-full bg-error-container text-on-error-container flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[20px]">
                    medical_services
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="font-headline-sm text-[16px] text-primary truncate leading-tight">
                    143
                  </div>
                  <div className="font-body-sm text-[12px] text-on-surface-variant truncate">
                    Phil. Red Cross
                  </div>
                </div>
              </a>
              <a className="flex items-center gap-2.5 bg-surface-container-lowest hover:bg-surface-container-highest active:scale-95 transition-all p-3 rounded-2xl shadow-sm text-left" href="tel:0285278481">
                <div className="w-10 h-10 rounded-full bg-tertiary-fixed text-primary flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[20px]">
                    sailing
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="font-headline-sm text-[16px] text-primary truncate leading-tight">
                    Coast Guard
                  </div>
                  <div className="font-body-sm text-[12px] text-on-surface-variant truncate">
                    Water Rescue Ops
                  </div>
                </div>
              </a>
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
          <a className="flex flex-col items-center justify-center gap-1 min-w-[48px] min-h-[48px] px-3.5 py-1.5 rounded-full text-on-surface-variant hover:text-primary transition-all" href="#map" onClick={(e)=>{e.preventDefault();go("map");}}>
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
          <a aria-current="page" className="flex flex-col items-center justify-center gap-1 min-w-[48px] min-h-[48px] px-3.5 py-1.5 rounded-full transition-all bg-secondary-container/30 text-primary scale-105 font-bold shadow-[0_4px_16px_rgba(0,227,253,0.35)]" href="#alerts" onClick={(e)=>{e.preventDefault();go("alerts");}}>
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
