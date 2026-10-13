import { useEffect, useState } from 'react';
import PlaceSearch from '../components/PlaceSearch.jsx';
import ForecastCards from '../components/ForecastCards.jsx';
import { useLive } from '../lib/live.jsx';
import AiAssessment from '../components/AiAssessment.jsx';
import LiveMap from '../components/LiveMap.jsx';
import TimeSteps from '../components/TimeSteps.jsx';
import { classify, describeDepth, describeRain } from '../lib/weather.js';
import ThreeScene from '../components/ThreeScene.jsx';
import init from './scripts/home.js';

export default function Home({ go }) {
  const live = useLive();
  const [mapStep, setMapStep] = useState(0);
  useEffect(() => { init(); }, []);
  useEffect(() => {
    if (!live.data || !window.__applyLiveDepth) return;
    const d = live.data.peak.depth;
    window.__applyLiveDepth(d, classify(d).key, describeDepth(d));
  }, [live.data]);
  return (
    <div data-screen="home" className="bg-surface font-body-md text-on-surface flex flex-col min-h-screen selection:bg-secondary-container">
      <header className="fixed top-0 inset-x-0 z-50 pt-safe bg-surface/85 backdrop-blur-xl shadow-[0_4px_20px_-4px_rgba(15,43,72,0.06)]">
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
                Live Status
              </span>
            </div>
          </div>
          <div className="flex items-center gap-space-xs flex-shrink-0">
            <button className="flex items-center gap-1 bg-surface-container hover:bg-surface-container-high active:scale-95 transition-transform px-3 py-1.5 rounded-full min-h-[44px] touch-manipulation" type="button">
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
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-md shadow-primary/20">
              <span className="material-symbols-outlined text-on-primary text-[18px]">
                person
              </span>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col relative w-full pt-16 pb-28 bg-surface">
        <div className="flex flex-col w-full px-margin-mobile pb-8 space-y-5">
          <section className="flex flex-col gap-2.5 pt-1">
            <div className="relative w-full flex items-center bg-surface-container-lowest rounded-full shadow-[0_8px_20px_-4px_rgba(15,43,72,0.07)] p-1.5 transition-all">
              <div className="w-10 h-10 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary flex-shrink-0">
                <span className="material-symbols-outlined text-[22px]">
                  location_on
                </span>
              </div>
              <PlaceSearch />
              <div className="flex items-center gap-1 pr-1 flex-shrink-0">
                <button aria-label="Voice search" className="w-9 h-9 rounded-full hover:bg-surface-container flex items-center justify-center text-on-surface-variant active:scale-95 transition-transform" type="button">
                  <span className="material-symbols-outlined text-[20px]">
                    mic
                  </span>
                </button>
                <button aria-label="Filter locations" className="w-9 h-9 rounded-full bg-primary-container text-secondary-container flex items-center justify-center active:scale-95 transition-transform shadow-sm" type="button">
                  <span className="material-symbols-outlined text-[18px]">
                    tune
                  </span>
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between bg-primary-container text-on-primary px-3.5 py-2 rounded-full shadow-[0_4px_14px_rgba(15,43,72,0.12)]">
              <div className="flex items-center gap-2 min-w-0">
                <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-container opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary-container"></span>
                </span>
                <span className="font-label-badge text-[12px] truncate">
                  {live.data ? (live.data.signal > 0 ? `Wind Signal No. ${live.data.signal} (est.) expected` : 'No tropical cyclone winds forecast') : live.error ? 'Live data unavailable' : 'Loading live forecast…'}
                </span>
              </div>
              <span className="font-label-badge text-[11px] bg-secondary-container/20 text-secondary-container px-2 py-0.5 rounded-full flex-shrink-0 font-bold ml-1">
                Open-Meteo
              </span>
            </div>
          </section>
          <section className="bg-surface-container-lowest rounded-3xl p-4 shadow-[0_12px_30px_-6px_rgba(15,43,72,0.08)] flex flex-col gap-3 relative overflow-hidden">
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-secondary animate-pulse"></span>
                <span className="font-headline-sm text-body-sm text-on-surface-variant font-bold">
                  Live Water Gauge
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-surface-container-low text-primary px-3.5 py-1 rounded-full shadow-[0_4px_12px_rgba(0,227,253,0.2)]" id="status-badge">
                <span className="material-symbols-outlined text-secondary text-[18px]">
                  warning
                </span>
                <span className="font-label-badge text-label-badge text-primary" id="status-badge-text">
                  Ingat!
                </span>
              </div>
            </div>
            <div className="relative w-full rounded-3xl overflow-hidden shadow-inner bg-gradient-to-b from-surface-container-low via-secondary-container/15 to-secondary/20">
              <div className="w-full h-[320px] rounded-3xl relative overflow-hidden bg-transparent" style={{"display":"block"}}>
                <ThreeScene />
              </div>
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent pointer-events-none rounded-b-3xl"></div>
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between z-10 text-on-primary pointer-events-none">
                <div>
                  <span className="font-label-badge text-[11px] uppercase tracking-wider text-secondary-container block">
                    Predicted Height
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-stat-metric-mobile text-stat-metric-mobile text-on-primary font-bold drop-shadow-md" id="depth-number">
                      0.9
                    </span>
                    <span className="font-headline-md text-headline-md text-secondary-container font-bold">
                      m
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-primary/90 font-semibold drop-shadow" id="depth-subtext">
                    Waist-deep • ~3 hrs surge peak
                  </p>
                </div>
                <div className="bg-primary/70 backdrop-blur-md rounded-2xl p-2 flex flex-col items-center gap-1 text-[10px] font-label-badge text-secondary-container shadow-lg">
                  <span className="text-on-primary/60">
                    2.0m
                  </span>
                  <div className="w-1.5 h-16 bg-surface-container-highest/40 rounded-full relative overflow-hidden flex flex-col justify-end">
                    <div className="w-full bg-secondary-container rounded-full transition-all duration-500" id="gauge-fill-bar" style={{"height":"45%"}}></div>
                  </div>
                  <span className="text-secondary-container font-bold">
                    0.0m
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 pt-1">
              <div className="flex items-center justify-between text-on-surface-variant px-1">
                <span className="font-label-badge text-[11px]">
                  Tap stage to test "Kaya pa?":
                </span>
                <span className="font-body-sm text-[11px] text-secondary font-bold">
                  {"Pedestrian & Vehicle"}
                </span>
              </div>
              <div className="grid grid-cols-5 gap-1.5" id="stage-selector">
                <button className="stage-btn flex flex-col items-center justify-center py-2 px-1 rounded-2xl bg-surface-container hover:bg-surface-container-high transition-all active:scale-95 touch-manipulation" data-badge="safe" data-depth="0.2" data-name="Ankle" data-status="Kaya pa!" data-sub="Ankle-deep • All vehicles pass" type="button">
                  <span className="font-label-badge text-[11px] text-on-surface-variant font-bold">
                    Ankle
                  </span>
                  <span className="font-headline-sm text-[12px] text-primary">
                    0.2m
                  </span>
                </button>
                <button className="stage-btn flex flex-col items-center justify-center py-2 px-1 rounded-2xl bg-surface-container hover:bg-surface-container-high transition-all active:scale-95 touch-manipulation" data-badge="caution" data-depth="0.5" data-name="Knee" data-status="Ingat!" data-sub="Knee-deep • Sedan risk" type="button">
                  <span className="font-label-badge text-[11px] text-on-surface-variant font-bold">
                    Knee
                  </span>
                  <span className="font-headline-sm text-[12px] text-primary">
                    0.5m
                  </span>
                </button>
                <button className="stage-btn active-stage flex flex-col items-center justify-center py-2 px-1 rounded-2xl bg-secondary-container text-primary font-bold shadow-[0_4px_12px_rgba(0,227,253,0.35)] transition-all active:scale-95 touch-manipulation" data-badge="caution" data-depth="0.9" data-name="Waist" data-status="Ingat!" data-sub="Waist-deep • SUV only / Stalling" type="button">
                  <span className="font-label-badge text-[11px] text-primary font-bold">
                    Waist
                  </span>
                  <span className="font-headline-sm text-[12px] text-primary">
                    0.9m
                  </span>
                </button>
                <button className="stage-btn flex flex-col items-center justify-center py-2 px-1 rounded-2xl bg-surface-container hover:bg-surface-container-high transition-all active:scale-95 touch-manipulation" data-badge="danger" data-depth="1.3" data-name="Chest" data-status="Hindi na kaya!" data-sub="Chest-deep • Impassable to all" type="button">
                  <span className="font-label-badge text-[11px] text-on-surface-variant font-bold">
                    Chest
                  </span>
                  <span className="font-headline-sm text-[12px] text-primary">
                    1.3m
                  </span>
                </button>
                <button className="stage-btn flex flex-col items-center justify-center py-2 px-1 rounded-2xl bg-surface-container hover:bg-surface-container-high transition-all active:scale-95 touch-manipulation" data-badge="danger" data-depth="2.0" data-name="Overhead" data-status="Hindi na kaya!" data-sub="Overhead • Evacuate immediately" type="button">
                  <span className="font-label-badge text-[11px] text-on-surface-variant font-bold">
                    Roof
                  </span>
                  <span className="font-headline-sm text-[12px] text-primary">
                    2.0m
                  </span>
                </button>
              </div>
            </div>
          </section>
          <AiAssessment />
          <section className="grid grid-cols-2 gap-2.5">
            <div className="bg-surface-container-lowest rounded-3xl p-3.5 flex items-center gap-3 shadow-[0_6px_20px_-4px_rgba(15,43,72,0.06)] hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-secondary-container/20 flex items-center justify-center text-secondary flex-shrink-0">
                <span className="material-symbols-outlined text-[26px]">
                  rainy
                </span>
              </div>
              <div className="min-w-0">
                <span className="font-label-badge text-[11px] text-on-surface-variant block uppercase">
                  Rainfall
                </span>
                <span className="font-headline-sm text-headline-sm text-primary font-bold truncate block">{live.data ? live.data.rainNow.toFixed(1) : '—'} <span className="text-[13px] font-normal text-on-surface-variant">
                    mm/h
                  </span>
                </span>
                <span className="font-body-sm text-[11px] text-secondary font-bold">
                  {live.data ? describeRain(live.data.rainNow) : '…'}
                </span>
              </div>
            </div>
            <div className="bg-surface-container-lowest rounded-3xl p-3.5 flex items-center gap-3 shadow-[0_6px_20px_-4px_rgba(15,43,72,0.06)] hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-surface-container-highest flex items-center justify-center text-primary flex-shrink-0">
                <span className="material-symbols-outlined text-[26px]">
                  cyclone
                </span>
              </div>
              <div className="min-w-0">
                <span className="font-label-badge text-[11px] text-on-surface-variant block uppercase">
                  Wind Signal (est.)
                </span>
                <span className="font-headline-sm text-headline-sm text-primary font-bold truncate block">{live.data ? (live.data.signal > 0 ? `Signal #${live.data.signal}` : 'None') : '—'}</span>
                <span className="font-body-sm text-[11px] text-on-surface-variant font-bold">
                  {live.data ? `Peak wind ${live.data.maxWind} km/h` : '…'}
                </span>
              </div>
            </div>
            <div className="bg-surface-container-lowest rounded-3xl p-3.5 flex items-center gap-3 shadow-[0_6px_20px_-4px_rgba(15,43,72,0.06)] hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-surface-container-low flex items-center justify-center text-primary flex-shrink-0">
                <span className="material-symbols-outlined text-[26px]">
                  air
                </span>
              </div>
              <div className="min-w-0">
                <span className="font-label-badge text-[11px] text-on-surface-variant block uppercase">
                  Wind Speed
                </span>
                <span className="font-headline-sm text-headline-sm text-primary font-bold truncate block">{live.data ? live.data.windNow : '—'} <span className="text-[13px] font-normal text-on-surface-variant">
                    km/h
                  </span>
                </span>
                <span className="font-body-sm text-[11px] text-secondary font-bold">
                  {live.data ? `Gusts up to ${live.data.gustNow} km/h` : '…'}
                </span>
              </div>
            </div>
            <div className="bg-surface-container-lowest rounded-3xl p-3.5 flex items-center gap-3 shadow-[0_6px_20px_-4px_rgba(15,43,72,0.06)] hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-error-container/40 flex items-center justify-center text-error flex-shrink-0">
                <span className="material-symbols-outlined text-[26px]">
                  landscape
                </span>
              </div>
              <div className="min-w-0">
                <span className="font-label-badge text-[11px] text-on-surface-variant block uppercase">
                  Local Height
                </span>
                <span className="font-headline-sm text-headline-sm text-primary font-bold truncate block">{live.data ? live.data.elevation : '—'} <span className="text-[13px] font-normal text-on-surface-variant">
                    m ASL
                  </span>
                </span>
                <span className="font-body-sm text-[11px] text-error font-bold truncate block">
                  {live.data ? (live.data.elevation < 15 ? 'Low-lying area' : live.data.elevation < 50 ? 'Moderate elevation' : 'High ground') : '…'}
                </span>
              </div>
            </div>
          </section>
          <section className="bg-surface-container-lowest rounded-3xl p-4 shadow-[0_12px_30px_-6px_rgba(15,43,72,0.08)] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-secondary-container/30 flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-[16px]">
                    waves
                  </span>
                </div>
                <div>
                  <h2 className="font-headline-sm text-body-lg text-primary font-bold leading-tight">
                    {live.place.name} Area
                  </h2>
                  <p className="font-body-sm text-[12px] text-on-surface-variant">
                    Hydro-crest forecast model
                  </p>
                </div>
              </div>
              <span className="font-label-badge text-[11px] bg-surface-container text-primary font-bold px-2.5 py-1 rounded-full">
                Tumana Sector
              </span>
            </div>
            <TimeSteps variant="pills" value={mapStep} onChange={setMapStep} />
            <LiveMap stepIndex={mapStep} className="w-full h-64 rounded-2xl overflow-hidden shadow-inner" />
          </section>
          <section className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary text-[20px]">
                  timelapse
                </span>
                <h3 className="font-headline-sm text-body-lg text-primary font-bold">
                  {"Next 24 Hours Rise & Fall"}
                </h3>
              </div>
              <span className="font-label-badge text-[12px] text-on-surface-variant">
                Next 24 hrs • 3-hr steps
              </span>
            </div>
            <div className="flex gap-2.5 overflow-x-auto pb-2 pt-0.5 no-scrollbar -mx-margin-mobile px-margin-mobile">
<ForecastCards />
</div>
          </section>
          <section className="bg-surface-container-lowest rounded-3xl p-4 shadow-[0_8px_24px_-4px_rgba(15,43,72,0.07)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-secondary-container/20 flex items-center justify-center text-primary flex-shrink-0">
                <span className="material-symbols-outlined text-[24px]">
                  campaign
                </span>
              </div>
              <div>
                <h4 className="font-headline-sm text-body-md text-primary font-bold">
                  See flood on your street?
                </h4>
                <p className="font-body-sm text-[12px] text-on-surface-variant">
                  Help neighbors in Tumana check depth
                </p>
              </div>
            </div>
            <button className="bg-primary text-on-primary font-label-badge text-[12px] px-3.5 py-2.5 rounded-full active:scale-95 transition-transform flex-shrink-0 font-bold shadow-md" type="button">
              Report
            </button>
          </section>
          <section className="bg-primary text-on-primary rounded-3xl p-4 shadow-[0_12px_28px_rgba(15,43,72,0.22)] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-secondary-container text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">
                    shelves
                  </span>
                </div>
                <span className="font-headline-sm text-body-lg font-bold text-on-primary">
                  Nearest Safe Shelters
                </span>
              </div>
              <span className="font-label-badge text-[12px] bg-secondary-container/20 text-secondary-container px-2.5 py-1 rounded-full font-bold">
                3 Active Nearby
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <div className="bg-primary-container/80 rounded-2xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-surface-container-highest/20 flex items-center justify-center text-secondary-container flex-shrink-0">
                    <span className="material-symbols-outlined text-[18px]">
                      school
                    </span>
                  </div>
                  <div className="truncate">
                    <p className="font-headline-sm text-body-sm text-on-primary font-bold truncate">
                      Tumana High School
                    </p>
                    <p className="font-body-sm text-[12px] text-primary-fixed-dim">
                      450m • Ground + 3 floors
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end flex-shrink-0">
                  <span className="font-label-badge text-[11px] text-secondary-container font-bold">
                    82% Cap
                  </span>
                  <span className="font-body-sm text-[10px] text-on-primary/70">
                    Open Now
                  </span>
                </div>
              </div>
              <div className="bg-primary-container/80 rounded-2xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-surface-container-highest/20 flex items-center justify-center text-secondary-container flex-shrink-0">
                    <span className="material-symbols-outlined text-[18px]">
                      sports_basketball
                    </span>
                  </div>
                  <div className="truncate">
                    <p className="font-headline-sm text-body-sm text-on-primary font-bold truncate">
                      Concepcion Covered Gym
                    </p>
                    <p className="font-body-sm text-[12px] text-primary-fixed-dim">
                      800m • High ground pad
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end flex-shrink-0">
                  <span className="font-label-badge text-[11px] text-secondary-fixed-dim font-bold">
                    45% Cap
                  </span>
                  <span className="font-body-sm text-[10px] text-on-primary/70">
                    Open Now
                  </span>
                </div>
              </div>
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
          <a aria-current="page" className="flex flex-col items-center justify-center gap-1 min-w-[48px] min-h-[48px] px-3 py-1.5 rounded-full transition-all bg-secondary-container/30 text-primary scale-105 font-bold shadow-[0_4px_16px_rgba(0,227,253,0.35)]" href="#home" onClick={(e)=>{e.preventDefault();go("home");}}>
            <span className="material-symbols-outlined text-[24px]">
              water_drop
            </span>
            <span className="font-label-badge text-[11px]">
              Home
            </span>
          </a>
          <a className="flex flex-col items-center justify-center gap-1 min-w-[48px] min-h-[48px] px-3 py-1.5 rounded-full text-on-surface-variant hover:text-primary transition-all" href="#map" onClick={(e)=>{e.preventDefault();go("map");}}>
            <span className="material-symbols-outlined text-[24px]">
              map
            </span>
            <span className="font-label-badge text-[11px]">
              Map
            </span>
          </a>
          <a className="flex flex-col items-center justify-center gap-1 min-w-[48px] min-h-[48px] px-3 py-1.5 rounded-full text-on-surface-variant hover:text-primary transition-all" href="#forecast" onClick={(e)=>{e.preventDefault();go("forecast");}}>
            <span className="material-symbols-outlined text-[24px]">
              rainy
            </span>
            <span className="font-label-badge text-[11px]">
              Forecast
            </span>
          </a>
          <a className="flex flex-col items-center justify-center gap-1 min-w-[48px] min-h-[48px] px-3 py-1.5 rounded-full text-on-surface-variant hover:text-primary transition-all" href="#alerts" onClick={(e)=>{e.preventDefault();go("alerts");}}>
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
