import { useLive } from '../lib/live.jsx';
import { useEffect } from 'react';
import init from './scripts/forecast.js';

export default function Forecast({ go }) {
  const live = useLive();
  useEffect(() => { init(); }, []);
  return (
    <div data-screen="forecast" className="bg-surface font-body-md text-on-surface flex flex-col min-h-screen selection:bg-secondary-container">
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
        <div className="flex flex-col w-full px-margin-mobile gap-space-md">
          <section className="relative bg-primary-container text-on-primary rounded-xl p-6 shadow-[0_16px_36px_-6px_rgba(15,43,72,0.35)] overflow-hidden">
            <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-secondary-container/10 blur-2xl pointer-events-none"></div>
            <div className="absolute top-2 right-4 opacity-15 text-secondary-container pointer-events-none">
              <span className="material-symbols-outlined text-[100px]">
                cyclone
              </span>
            </div>
            <div className="relative z-10 flex flex-col gap-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-primary font-label-badge text-label-badge shadow-[0_4px_12px_rgba(0,227,253,0.35)]">
                  <span className="h-2 w-2 rounded-full bg-primary animate-ping"></span>
                  CRITICAL PEAK
                </span>
                <div className="flex items-center gap-1 text-on-primary-container font-body-sm text-body-sm">
                  <span className="material-symbols-outlined text-[16px]">
                    schedule
                  </span>
                  <span>
                    Peak Surge: 5:00 PM
                  </span>
                </div>
              </div>
              <div className="mt-1 flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className="font-stat-metric-mobile text-stat-metric-mobile text-secondary-container tracking-tight">
                    1.1m
                  </span>
                  <span className="font-headline-sm text-headline-sm text-on-primary">
                    (Chest-deep)
                  </span>
                </div>
                <div className="mt-2 inline-flex items-center self-start gap-2 bg-primary text-secondary-container px-4 py-2 rounded-full shadow-md font-label-btn text-label-btn">
                  <span className="material-symbols-outlined text-[20px] text-error">
                    warning
                  </span>
                  <span>
                    Hindi na kaya! (Evacuate low ground)
                  </span>
                </div>
              </div>
              <div className="mt-2 bg-primary/60 backdrop-blur-md rounded-lg p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary-container flex-shrink-0 animate-spin" style={{"animationDuration":"8s"}}>
                    <span className="material-symbols-outlined text-[24px]">
                      storm
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-badge text-label-badge text-on-primary">
                      Typhoon Egay (140km NE)
                    </span>
                    <span className="font-body-sm text-body-sm text-on-primary-container">
                      Torrential: 52 mm/hr rate
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-error-container text-on-error-container font-label-badge text-[11px] font-bold">
                  Signal #3
                </span>
              </div>
            </div>
          </section>
          <section className="bg-surface-container-lowest rounded-lg p-3.5 shadow-[0_6px_20px_rgba(15,43,72,0.06)] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-full bg-secondary/10 text-secondary flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[20px]">
                  water
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-badge text-label-badge text-primary truncate">
                  Manila Bay High Tide
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                  8:15 PM (+0.4m sea backflow)
                </span>
              </div>
            </div>
            <span className="flex-shrink-0 font-label-badge text-label-badge px-3 py-1 rounded-full bg-surface-container-high text-primary">
              Pasig Spill
            </span>
          </section>
          <section className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary text-[22px]">
                  show_chart
                </span>
                <h2 className="font-headline-sm text-headline-sm text-primary">
                  24-Hour Water Tide
                </h2>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant font-semibold">
                12 PM - 12 PM
              </span>
            </div>
            <div className="flex overflow-x-auto gap-3 pb-2 -mx-margin-mobile px-margin-mobile no-scrollbar touch-pan-x">
              <div className="flex-shrink-0 w-28 bg-surface-container-lowest rounded-lg p-3 flex flex-col items-center justify-between shadow-[0_8px_20px_rgba(15,43,72,0.05)] text-center gap-2">
                <span className="font-body-sm text-body-sm text-on-surface-variant font-bold">
                  12:00 PM
                </span>
                <span className="material-symbols-outlined text-secondary text-[26px]">
                  rainy
                </span>
                <div className="w-7 h-20 bg-surface-container rounded-full relative overflow-hidden flex flex-col justify-end p-0.5">
                  <div className="w-full bg-secondary-fixed-dim rounded-full transition-all duration-500" style={{"height":"25%"}}></div>
                </div>
                <span className="font-headline-sm text-headline-sm text-primary">
                  0.3m
                </span>
                <span className="w-full py-1 rounded-full bg-surface-container-low text-primary font-label-badge text-[11px] shadow-sm">
                  Kaya pa!
                </span>
              </div>
              <div className="flex-shrink-0 w-28 bg-surface-container-lowest rounded-lg p-3 flex flex-col items-center justify-between shadow-[0_8px_20px_rgba(15,43,72,0.05)] text-center gap-2">
                <span className="font-body-sm text-body-sm text-on-surface-variant font-bold">
                  2:00 PM
                </span>
                <span className="material-symbols-outlined text-secondary text-[26px]">
                  weather_hail
                </span>
                <div className="w-7 h-20 bg-surface-container rounded-full relative overflow-hidden flex flex-col justify-end p-0.5">
                  <div className="w-full bg-secondary rounded-full transition-all duration-500" style={{"height":"55%"}}></div>
                </div>
                <span className="font-headline-sm text-headline-sm text-primary">
                  0.6m
                </span>
                <span className="w-full py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-badge text-[11px] font-bold">
                  Ingat!
                </span>
              </div>
              <div className="flex-shrink-0 w-32 bg-primary rounded-lg p-3 flex flex-col items-center justify-between shadow-[0_12px_28px_rgba(0,227,253,0.3)] text-center gap-2 relative">
                <span className="absolute -top-2 px-2 py-0.5 rounded-full bg-secondary-container text-primary font-label-badge text-[9px] font-bold">
                  PEAK SURGE
                </span>
                <span className="font-body-sm text-body-sm text-on-primary-container font-bold pt-1">
                  5:00 PM
                </span>
                <span className="material-symbols-outlined text-secondary-container text-[28px] animate-bounce">
                  thunderstorm
                </span>
                <div className="w-8 h-20 bg-primary-container rounded-full relative overflow-hidden flex flex-col justify-end p-0.5">
                  <div className="w-full bg-secondary-container rounded-full transition-all duration-500 shadow-[0_0_12px_#00e3fd]" style={{"height":"95%"}}></div>
                </div>
                <span className="font-headline-sm text-headline-sm text-secondary-container">
                  1.1m
                </span>
                <span className="w-full py-1 rounded-full bg-surface-container-lowest text-error font-label-badge text-[11px] font-extrabold shadow-sm">
                  Hindi na!
                </span>
              </div>
              <div className="flex-shrink-0 w-28 bg-surface-container-lowest rounded-lg p-3 flex flex-col items-center justify-between shadow-[0_8px_20px_rgba(15,43,72,0.05)] text-center gap-2">
                <span className="font-body-sm text-body-sm text-on-surface-variant font-bold">
                  8:00 PM
                </span>
                <span className="material-symbols-outlined text-secondary text-[26px]">
                  flood
                </span>
                <div className="w-7 h-20 bg-surface-container rounded-full relative overflow-hidden flex flex-col justify-end p-0.5">
                  <div className="w-full bg-secondary rounded-full transition-all duration-500" style={{"height":"80%"}}></div>
                </div>
                <span className="font-headline-sm text-headline-sm text-primary">
                  0.9m
                </span>
                <span className="w-full py-1 rounded-full bg-primary-container text-secondary-container font-label-badge text-[11px] font-bold">
                  Hindi na!
                </span>
              </div>
              <div className="flex-shrink-0 w-28 bg-surface-container-lowest rounded-lg p-3 flex flex-col items-center justify-between shadow-[0_8px_20px_rgba(15,43,72,0.05)] text-center gap-2">
                <span className="font-body-sm text-body-sm text-on-surface-variant font-bold">
                  11:00 PM
                </span>
                <span className="material-symbols-outlined text-secondary text-[26px]">
                  grain
                </span>
                <div className="w-7 h-20 bg-surface-container rounded-full relative overflow-hidden flex flex-col justify-end p-0.5">
                  <div className="w-full bg-secondary-fixed-dim rounded-full transition-all duration-500" style={{"height":"45%"}}></div>
                </div>
                <span className="font-headline-sm text-headline-sm text-primary">
                  0.5m
                </span>
                <span className="w-full py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-badge text-[11px] font-bold">
                  Ingat!
                </span>
              </div>
              <div className="flex-shrink-0 w-28 bg-surface-container-lowest rounded-lg p-3 flex flex-col items-center justify-between shadow-[0_8px_20px_rgba(15,43,72,0.05)] text-center gap-2">
                <span className="font-body-sm text-body-sm text-on-surface-variant font-bold">
                  6:00 AM
                </span>
                <span className="material-symbols-outlined text-secondary text-[26px]">
                  cloud
                </span>
                <div className="w-7 h-20 bg-surface-container rounded-full relative overflow-hidden flex flex-col justify-end p-0.5">
                  <div className="w-full bg-secondary-fixed rounded-full transition-all duration-500" style={{"height":"20%"}}></div>
                </div>
                <span className="font-headline-sm text-headline-sm text-primary">
                  0.2m
                </span>
                <span className="w-full py-1 rounded-full bg-surface-container-low text-primary font-label-badge text-[11px] shadow-sm">
                  Kaya pa!
                </span>
              </div>
            </div>
          </section>
          <section className="bg-surface-container-lowest rounded-xl p-5 shadow-[0_10px_25px_-5px_rgba(15,43,72,0.08)] flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[24px]">
                  commute
                </span>
                <h2 className="font-headline-sm text-headline-sm text-primary">
                  Can My Ride Cross?
                </h2>
              </div>
              <span className="font-label-badge text-[11px] px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-bold">
                Based on 1.1m
              </span>
            </div>
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-error-container text-on-error-container flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[22px]">
                      directions_car
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-[16px] text-primary">
                      {"Sedan & Motorcycle"}
                    </span>
                    <span className="font-body-sm text-body-sm text-error font-bold">
                      Submerged exhaust pipe
                    </span>
                  </div>
                </div>
                <span className="px-3 py-1.5 rounded-full bg-primary text-secondary-container font-label-badge text-[12px] font-bold shadow-sm whitespace-nowrap">
                  Hindi na kaya!
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[22px]">
                      directions_car_filled
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-[16px] text-primary">
                      {"SUV & Crossover"}
                    </span>
                    <span className="font-body-sm text-body-sm text-secondary font-semibold">
                      Tire-line risk, slow wake
                    </span>
                  </div>
                </div>
                <span className="px-3 py-1.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-badge text-[12px] font-bold shadow-sm whitespace-nowrap">
                  Ingat!
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary-container text-primary flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[22px]">
                      directions_bus
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-[16px] text-primary">
                      {"Heavy Truck & Bus"}
                    </span>
                    <span className="font-body-sm text-body-sm text-secondary font-semibold">
                      Safe ground clearance
                    </span>
                  </div>
                </div>
                <span className="px-3 py-1.5 rounded-full bg-surface-container-lowest text-primary font-label-badge text-[12px] font-bold shadow-sm whitespace-nowrap">
                  Kaya pa!
                </span>
              </div>
            </div>
          </section>
          <section className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[22px]">
                water_damage
              </span>
              <h2 className="font-headline-sm text-headline-sm text-primary">
                {"Dam & River Basins"}
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              <div className="bg-surface-container-lowest rounded-lg p-4 shadow-[0_6px_20px_rgba(15,43,72,0.06)] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-5 h-14 bg-surface-container rounded-full relative overflow-hidden flex flex-col justify-end p-0.5 flex-shrink-0">
                    <div className="w-full bg-error rounded-full animate-pulse" style={{"height":"90%"}}></div>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-headline-sm text-[17px] text-primary">
                        Marikina River
                      </span>
                      <span className="h-2 w-2 rounded-full bg-error"></span>
                    </div>
                    <span className="font-body-sm text-body-sm text-error font-bold">
                      16.8m / 18.0m (Alarm Level 2)
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant text-[12px]">
                      Sirens sounding in 8 barangays
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="px-2.5 py-1 rounded-full bg-error-container text-on-error-container font-label-badge text-[11px] font-bold">
                    Siren Active
                  </span>
                </div>
              </div>
              <div className="bg-surface-container-lowest rounded-lg p-4 shadow-[0_6px_20px_rgba(15,43,72,0.06)] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-5 h-14 bg-surface-container rounded-full relative overflow-hidden flex flex-col justify-end p-0.5 flex-shrink-0">
                    <div className="w-full bg-secondary-fixed-dim rounded-full" style={{"height":"60%"}}></div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-[17px] text-primary">
                      Wawa Dam Spillage
                    </span>
                    <span className="font-body-sm text-body-sm text-secondary font-semibold">
                      +0.2m Natural Overflow
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant text-[12px]">
                      Within monitored river threshold
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-surface-container text-primary font-label-badge text-[11px] font-bold flex-shrink-0">
                  Normal Over
                </span>
              </div>
              <div className="bg-surface-container-lowest rounded-lg p-4 shadow-[0_6px_20px_rgba(15,43,72,0.06)] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-5 h-14 bg-surface-container rounded-full relative overflow-hidden flex flex-col justify-end p-0.5 flex-shrink-0">
                    <div className="w-full bg-primary-fixed-dim rounded-full" style={{"height":"35%"}}></div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-[17px] text-primary">
                      {"Angat & Bustos Gates"}
                    </span>
                    <span className="font-body-sm text-body-sm text-secondary font-semibold">
                      Gates Closed (0 gates open)
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant text-[12px]">
                      Zero downstream flood contribution
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-secondary-container/40 text-primary font-label-badge text-[11px] font-bold flex-shrink-0">
                  Gated Safe
                </span>
              </div>
            </div>
          </section>
          <section className="flex flex-col gap-2.5 mb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">
                  calendar_month
                </span>
                <h2 className="font-headline-sm text-headline-sm text-primary">
                  5-Day Flood Outlook
                </h2>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant font-semibold">
                España Corridor
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <div className="bg-surface-container-lowest rounded-lg p-4 shadow-[0_8px_20px_rgba(15,43,72,0.06)] flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-container text-secondary-container flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[22px]">
                      thunderstorm
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-[16px] text-primary">
                      Today (Tue)
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      142 mm rain
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="font-headline-sm text-[18px] text-primary">
                      1.1m
                    </span>
                    <span className="block font-body-sm text-[11px] text-error font-bold">
                      Chest
                    </span>
                  </div>
                  <span className="w-24 text-center py-1.5 rounded-full bg-primary text-secondary-container font-label-badge text-[11px] font-bold">
                    Hindi na kaya!
                  </span>
                </div>
              </div>
              <div className="bg-surface-container-lowest rounded-lg p-4 shadow-[0_8px_20px_rgba(15,43,72,0.06)] flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary-fixed text-primary flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[22px]">
                      rainy
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-[16px] text-primary">
                      Tomorrow (Wed)
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      68 mm rain
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="font-headline-sm text-[18px] text-primary">
                      0.6m
                    </span>
                    <span className="block font-body-sm text-[11px] text-secondary font-bold">
                      Knee
                    </span>
                  </div>
                  <span className="w-24 text-center py-1.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-badge text-[11px] font-bold">
                    Ingat!
                  </span>
                </div>
              </div>
              <div className="bg-surface-container-lowest rounded-lg p-4 shadow-[0_8px_20px_rgba(15,43,72,0.06)] flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-container text-secondary flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[22px]">
                      grain
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-[16px] text-primary">
                      Thursday
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      24 mm rain
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="font-headline-sm text-[18px] text-primary">
                      0.2m
                    </span>
                    <span className="block font-body-sm text-[11px] text-secondary font-bold">
                      Gutter
                    </span>
                  </div>
                  <span className="w-24 text-center py-1.5 rounded-full bg-surface-container-low text-primary font-label-badge text-[11px] font-bold">
                    Kaya pa!
                  </span>
                </div>
              </div>
              <div className="bg-surface-container-lowest rounded-lg p-4 shadow-[0_8px_20px_rgba(15,43,72,0.06)] flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary-container/30 text-secondary flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[22px]">
                      partly_cloudy_day
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-[16px] text-primary">
                      Friday
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      5 mm drizzle
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="font-headline-sm text-[18px] text-primary">
                      0.0m
                    </span>
                    <span className="block font-body-sm text-[11px] text-secondary font-bold">
                      Dry
                    </span>
                  </div>
                  <span className="w-24 text-center py-1.5 rounded-full bg-secondary-container/40 text-primary font-label-badge text-[11px] font-bold">
                    {" Safe & Dry "}
                  </span>
                </div>
              </div>
              <div className="bg-surface-container-lowest rounded-lg p-4 shadow-[0_8px_20px_rgba(15,43,72,0.06)] flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-container text-secondary flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[22px]">
                      wb_sunny
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-[16px] text-primary">
                      Saturday
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Clear skies
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="font-headline-sm text-[18px] text-primary">
                      0.0m
                    </span>
                    <span className="block font-body-sm text-[11px] text-secondary font-bold">
                      Clear
                    </span>
                  </div>
                  <span className="w-24 text-center py-1.5 rounded-full bg-secondary-container/40 text-primary font-label-badge text-[11px] font-bold">
                    All Clear
                  </span>
                </div>
              </div>
            </div>
          </section>
          <section className="bg-surface-container rounded-xl p-4 flex items-center gap-3.5 mb-4">
            <div className="w-10 h-10 rounded-full bg-secondary-container text-primary flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[22px]">
                tips_and_updates
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-badge text-label-badge text-primary">
                Baha Survival Tip
              </span>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-snug">
                {" Wear boots and avoid wading! Leptospirosis prophylaxis is free at UST Health Center & Barangay 412 outpost. "}
              </p>
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
          <a aria-current="page" className="flex flex-col items-center justify-center gap-1 min-w-[48px] min-h-[48px] px-3.5 py-1.5 rounded-full transition-all bg-secondary-container/30 text-primary scale-105 font-bold shadow-[0_4px_16px_rgba(0,227,253,0.35)]" href="#forecast" onClick={(e)=>{e.preventDefault();go("forecast");}}>
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
