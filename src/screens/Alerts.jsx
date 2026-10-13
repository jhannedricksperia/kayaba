import { useLive } from '../lib/live.jsx';
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
          <div className="relative overflow-hidden rounded-lg bg-primary text-on-primary p-space-md shadow-[0_16px_36px_-6px_rgba(0,227,253,0.35)]">
            <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-secondary-container/20 blur-xl pointer-events-none"></div>
            <div className="absolute bottom-0 right-4 w-20 h-20 rounded-full bg-tertiary-fixed/10 pointer-events-none"></div>
            <div className="relative z-10 flex flex-col space-y-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-secondary-container text-primary font-headline-sm text-headline-sm shadow-sm flex-shrink-0 animate-bounce">
                  <span className="material-symbols-outlined text-[20px]" style={{"fontVariationSettings":"'FILL' 1"}}>
                    warning
                  </span>
                </span>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-headline-sm text-headline-sm tracking-tight text-secondary-container">
                      PAGASA Red Rainfall
                    </span>
                    <span className="inline-block w-2 h-2 rounded-full bg-secondary-container animate-ping"></span>
                  </div>
                  <span className="font-body-sm text-body-sm text-primary-fixed-dim">
                    {"Metro Manila & Rizal • Torrential Rain"}
                  </span>
                </div>
              </div>
              <p className="font-body-md text-body-md text-on-primary leading-snug">
                Severe flooding expected within 1–3 hours. Move to upper floors or nearest designated shelter now.
              </p>
              <button className="mt-1 w-full flex items-center justify-between bg-surface-container-lowest/15 hover:bg-surface-container-lowest/25 active:scale-95 transition-all duration-200 px-4 py-3 rounded-full shadow-sm text-left touch-manipulation group" id="sirenBtn" onClick={(e)=>window.__run(e.currentTarget, "toggleSirenPreview()", e)} type="button">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-secondary-container text-[22px] transition-transform group-hover:scale-110" id="sirenIcon">
                    volume_up
                  </span>
                  <span className="font-label-btn text-label-btn text-on-primary">
                    Sound Siren / Voice Warning
                  </span>
                </div>
                <span className="font-label-badge text-label-badge text-primary-fixed bg-surface-container-lowest/20 px-2.5 py-0.5 rounded-full">
                  TL / EN
                </span>
              </button>
              <div className="hidden flex items-center justify-between gap-2 bg-primary-container px-3.5 py-2.5 rounded-full shadow-inner" id="voicePlayerBar">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary-container animate-pulse"></span>
                  <span className="font-body-sm text-body-sm text-secondary-container font-bold">
                    Patunog: “Maghanda sa paglikas...”
                  </span>
                </div>
                <button className="text-on-primary-container hover:text-on-primary p-1" onClick={(e)=>window.__run(e.currentTarget, "toggleSirenPreview()", e)} type="button">
                  <span className="material-symbols-outlined text-[18px]">
                    close
                  </span>
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-margin-mobile px-margin-mobile">
            <button className="filter-tab active flex-shrink-0 px-4 py-2 rounded-full font-label-badge text-label-badge bg-primary text-on-primary shadow-sm active:scale-95 transition-all" onClick={(e)=>window.__run(e.currentTarget, "filterAlerts('all', this)", e)}>
              All Alerts (5)
            </button>
            <button className="filter-tab flex-shrink-0 px-4 py-2 rounded-full font-label-badge text-label-badge bg-surface-container-high text-on-surface-variant hover:text-primary active:scale-95 transition-all" onClick={(e)=>window.__run(e.currentTarget, "filterAlerts('typhoon', this)", e)}>
              {" Typhoon & Rain (2) "}
            </button>
            <button className="filter-tab flex-shrink-0 px-4 py-2 rounded-full font-label-badge text-label-badge bg-surface-container-high text-on-surface-variant hover:text-primary active:scale-95 transition-all" onClick={(e)=>window.__run(e.currentTarget, "filterAlerts('dam', this)", e)}>
              River Dams (1)
            </button>
            <button className="filter-tab flex-shrink-0 px-4 py-2 rounded-full font-label-badge text-label-badge bg-surface-container-high text-on-surface-variant hover:text-primary active:scale-95 transition-all" onClick={(e)=>window.__run(e.currentTarget, "filterAlerts('road', this)", e)}>
              Road Closures (2)
            </button>
          </div>
          <div className="space-y-space-md" id="alertsList">
            <article className="alert-item bg-surface-container-lowest rounded-lg p-5 shadow-[0_10px_25px_-5px_rgba(15,43,72,0.08)] transition-all hover:shadow-[0_16px_32px_-6px_rgba(15,43,72,0.12)]" data-category="typhoon">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-secondary-container font-label-badge text-label-badge shadow-sm">
                  <span className="material-symbols-outlined text-[16px]">
                    dangerous
                  </span>
                  <span>
                    Hindi na kaya! • Immediate Action
                  </span>
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant font-bold">
                  12 mins ago
                </span>
              </div>
              <h2 className="font-headline-md text-headline-md text-primary tracking-tight leading-snug">
                {" Tumana & Malanday Low-Lying Evacuation Ordered "}
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                Marikina River reached
                <strong>
                  16.5m (2nd Alarm)
                </strong>
                . Evacuation centers at Tumana High School and Concepcion Gym are officially open with warm relief meals.
              </p>
              <div className="mt-3 bg-surface-container-low rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[24px]">
                    battery_very_low
                  </span>
                  <div>
                    <div className="font-label-badge text-label-badge text-primary">
                      Marikina River: 16.5m
                    </div>
                    <div className="font-body-sm text-body-sm text-error font-bold">
                      Critical Level (Alarm 2)
                    </div>
                  </div>
                </div>
                <span className="font-label-badge text-label-badge bg-error-container text-on-error-container px-2.5 py-1 rounded-full">
                  Rapid Rise
                </span>
              </div>
              <div className="mt-4 flex items-center gap-2 pt-1">
                <button className="flex-1 bg-secondary-container hover:bg-secondary-fixed text-primary font-label-btn text-label-btn px-4 py-3 rounded-full flex items-center justify-center gap-1.5 shadow-[0_8px_20px_-4px_rgba(0,227,253,0.4)] active:scale-95 transition-all" type="button">
                  <span className="material-symbols-outlined text-[20px]">
                    explore
                  </span>
                  <span>
                    View Shelter Route
                  </span>
                </button>
                <button aria-label="Share Alert" className="w-12 h-12 flex items-center justify-center bg-surface-container text-primary rounded-full hover:bg-surface-container-high active:scale-95 transition-all shadow-sm flex-shrink-0" type="button">
                  <span className="material-symbols-outlined text-[20px]">
                    share
                  </span>
                </button>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-on-surface-variant font-body-sm text-body-sm">
                <span className="material-symbols-outlined text-[16px] text-secondary">
                  verified
                </span>
                <span>
                  Marikina DRRMO Dispatch
                </span>
              </div>
            </article>
            <article className="alert-item bg-surface-container-lowest rounded-lg p-5 shadow-[0_10px_25px_-5px_rgba(15,43,72,0.08)] transition-all hover:shadow-[0_16px_32px_-6px_rgba(15,43,72,0.12)]" data-category="road">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-fixed text-primary font-label-badge text-label-badge shadow-sm">
                  <span className="material-symbols-outlined text-[16px]">
                    tsunami
                  </span>
                  <span>
                    Ingat! • Waist-deep (0.9m)
                  </span>
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant font-bold">
                  35 mins ago
                </span>
              </div>
              <h2 className="font-headline-md text-headline-md text-primary tracking-tight leading-snug">
                {" Katipunan Ave & Marcos Hwy Underpass Submerged "}
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                Not passable to light vehicles (sedans, motorbikes, tricycles). High-clearance trucks rerouted via C5 flyover. Pumping crews deployed.
              </p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <div className="bg-error-container text-on-error-container rounded-xl p-2.5 text-center flex flex-col items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">
                    motorcycle
                  </span>
                  <span className="font-label-badge text-[11px] mt-0.5 font-bold">
                    Bawal
                  </span>
                </div>
                <div className="bg-error-container text-on-error-container rounded-xl p-2.5 text-center flex flex-col items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">
                    directions_car
                  </span>
                  <span className="font-label-badge text-[11px] mt-0.5 font-bold">
                    Bawal Sedan
                  </span>
                </div>
                <div className="bg-surface-container text-primary rounded-xl p-2.5 text-center flex flex-col items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">
                    local_shipping
                  </span>
                  <span className="font-label-badge text-[11px] mt-0.5 font-bold">
                    High Trucks Only
                  </span>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between pt-1">
                <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-secondary">
                    traffic
                  </span>
                  <span>
                    MMDA Operations Center • 42 reports
                  </span>
                </span>
                <button className="bg-surface-container hover:bg-surface-container-high text-primary font-label-btn text-label-btn px-4 py-2 rounded-full text-body-sm active:scale-95 transition-all" type="button">
                  Alternate Roads
                </button>
              </div>
            </article>
            <article className="alert-item bg-surface-container-lowest rounded-lg p-5 shadow-[0_10px_25px_-5px_rgba(15,43,72,0.08)] transition-all hover:shadow-[0_16px_32px_-6px_rgba(15,43,72,0.12)]" data-category="dam">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-primary font-label-badge text-label-badge shadow-sm">
                  <span className="inline-block w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                  <span>
                    Monitoring • Kaya pa!
                  </span>
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant font-bold">
                  1 hr ago
                </span>
              </div>
              <h2 className="font-headline-md text-headline-md text-primary tracking-tight leading-snug">
                La Mesa Dam Elevation: 79.4m
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                Spill level is
                <strong>
                  80.1m
                </strong>
                (0.7m safe buffer remaining). No active spillway discharge yet. Downstream Tullahan River communities remain on passive alert.
              </p>
              <div className="mt-3 bg-surface-container-low rounded-xl p-3">
                <div className="flex justify-between font-label-badge text-label-badge text-primary mb-1.5">
                  <span>
                    Current: 79.4m
                  </span>
                  <span className="text-on-surface-variant">
                    Spill: 80.1m
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-surface-container-highest overflow-hidden">
                  <div className="h-full bg-secondary-fixed-dim rounded-full transition-all duration-500" style={{"width":"88%"}}></div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-secondary">
                    water
                  </span>
                  <span>
                    PAGASA Hydrology Division
                  </span>
                </div>
                <button className="text-secondary font-label-badge text-label-badge hover:underline" type="button">
                  Historical Curve →
                </button>
              </div>
            </article>
            <article className="alert-item bg-surface-container-lowest rounded-lg p-5 shadow-[0_10px_25px_-5px_rgba(15,43,72,0.08)] transition-all hover:shadow-[0_16px_32px_-6px_rgba(15,43,72,0.12)]" data-category="road">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed text-primary font-label-badge text-label-badge shadow-sm">
                  <span className="material-symbols-outlined text-[16px]">
                    groups
                  </span>
                  <span>
                    Ingat! • Knee-deep (0.5m)
                  </span>
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant font-bold">
                  1h 45m ago
                </span>
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <h2 className="font-headline-md text-headline-md text-primary tracking-tight leading-snug">
                    Rising water along JP Rizal St near bridge
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-1.5">
                    Clogged drainage causing fast backflow. Reported by 14 barangay neighbors with photo confirmation.
                  </p>
                </div>
                <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-surface-container">
                  <img className="w-full h-full object-cover" data-alt="Playful documentary style urban street in Manila during heavy rain, knee-deep clean water reflections on asphalt, colorful umbrella silhouettes, bright cyan wet raincoat vibe, warm atmospheric street photography" src="/img/48304da918.jpg" />
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between pt-2">
                <div className="flex items-center gap-1.5 bg-surface-container-low px-3 py-1 rounded-full">
                  <span className="material-symbols-outlined text-[16px] text-secondary">
                    thumb_up
                  </span>
                  <span className="font-label-badge text-label-badge text-primary">
                    14 Verified
                  </span>
                </div>
                <button className="text-primary font-label-badge text-label-badge bg-surface-container hover:bg-surface-container-high px-3 py-1.5 rounded-full active:scale-95 transition-all" type="button">
                  Update Status
                </button>
              </div>
            </article>
            <article className="alert-item bg-surface-container-lowest rounded-lg p-5 shadow-[0_10px_25px_-5px_rgba(15,43,72,0.08)] transition-all hover:shadow-[0_16px_32px_-6px_rgba(15,43,72,0.12)]" data-category="typhoon">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-fixed text-primary font-label-badge text-label-badge shadow-sm">
                  <span className="material-symbols-outlined text-[16px]">
                    cyclone
                  </span>
                  <span>
                    Tropical Storm Enteng Notice
                  </span>
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant font-bold">
                  2h ago
                </span>
              </div>
              <h2 className="font-headline-md text-headline-md text-primary tracking-tight leading-snug">
                {" Class & Government Office Suspensions Announced "}
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                All levels suspended across Manila, Quezon City, Caloocan, and Marikina. Work from home advised for private sector.
              </p>
              <div className="mt-4 flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
                <span className="material-symbols-outlined text-[16px] text-secondary">
                  campaign
                </span>
                <span>
                  NCR Local Chief Executives Announcement
                </span>
              </div>
            </article>
          </div>
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
          <div className="relative overflow-hidden rounded-lg bg-secondary-container text-primary p-5 shadow-[0_12px_28px_-4px_rgba(0,227,253,0.45)]">
            <div className="relative z-10 flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-primary text-secondary-container flex items-center justify-center shadow-md animate-bounce">
                <span className="material-symbols-outlined text-[26px]">
                  add_location_alt
                </span>
              </div>
              <h3 className="font-headline-md text-headline-md text-primary leading-tight">
                See flood rising on your street?
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-xs">
                Help your neighbors prepare in time. Share your water-level check in 10 seconds.
              </p>
              <button className="w-full mt-2 bg-primary hover:bg-primary-container text-on-primary font-label-btn text-label-btn py-3.5 px-6 rounded-full shadow-[0_8px_20px_-4px_rgba(15,43,72,0.4)] active:scale-95 transition-all flex items-center justify-center gap-2" onClick={(e)=>window.__run(e.currentTarget, "openReportModal()", e)} type="button">
                <span className="material-symbols-outlined text-[22px]">
                  campaign
                </span>
                <span>
                  Post Flood Report on your Street
                </span>
              </button>
            </div>
          </div>
          <div className="hidden fixed inset-0 z-50 bg-primary/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4" id="reportModal">
            <div className="w-full max-w-md bg-surface-container-lowest rounded-t-xl sm:rounded-lg p-6 shadow-2xl flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[24px]">
                    add_a_photo
                  </span>
                  <span className="font-headline-sm text-headline-sm text-primary">
                    Crowd Report
                  </span>
                </div>
                <button className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-surface-container-high" onClick={(e)=>window.__run(e.currentTarget, "closeReportModal()", e)} type="button">
                  <span className="material-symbols-outlined text-[20px]">
                    close
                  </span>
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block font-label-badge text-label-badge text-primary mb-1">
                    Your Street / Landmark
                  </label>
                  <input className="w-full bg-surface-container-low text-primary px-4 py-3 rounded-full font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-secondary-container" placeholder="e.g., España cor. Lacson, UST gate" type="text" />
                </div>
                <div>
                  <label className="block font-label-badge text-label-badge text-primary mb-1.5">
                    Water Depth Estimate
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button className="depth-btn bg-surface-container text-primary font-label-badge text-label-badge p-2.5 rounded-xl border-2 border-transparent active:scale-95 transition-all text-center" onClick={(e)=>window.__run(e.currentTarget, "selectDepth(this)", e)} type="button">
                      Gutter (10cm)
                    </button>
                    <button className="depth-btn bg-secondary-fixed text-primary font-label-badge text-label-badge p-2.5 rounded-xl border-2 border-transparent active:scale-95 transition-all text-center" onClick={(e)=>window.__run(e.currentTarget, "selectDepth(this)", e)} type="button">
                      Knee (50cm)
                    </button>
                    <button className="depth-btn bg-surface-container text-primary font-label-badge text-label-badge p-2.5 rounded-xl border-2 border-transparent active:scale-95 transition-all text-center" onClick={(e)=>window.__run(e.currentTarget, "selectDepth(this)", e)} type="button">
                      Waist (90cm+)
                    </button>
                  </div>
                </div>
              </div>
              <button className="w-full bg-secondary-container text-primary font-label-btn text-label-btn py-3.5 rounded-full shadow-[0_8px_20px_-4px_rgba(0,227,253,0.4)] active:scale-95 transition-all flex items-center justify-center gap-2" onClick={(e)=>window.__run(e.currentTarget, "submitReport()", e)} type="button">
                <span className="material-symbols-outlined text-[20px]">
                  send
                </span>
                <span>
                  Broadcast to Neighbors
                </span>
              </button>
            </div>
          </div>
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
