const SOURCES = [
  {
    icon: 'cloud',
    name: 'Open-Meteo',
    what: 'Forecast ng ulan at hangin, taas ng lugar (elevation), at paghahanap ng bayan o lungsod.',
    href: 'https://open-meteo.com/',
  },
  {
    icon: 'map',
    name: 'OpenStreetMap',
    what: 'Mapa, mga ilog at estero, mga paaralan at hall na posibleng evacuation center, at paghahanap ng kalye.',
    href: 'https://www.openstreetmap.org/',
  },
  {
    icon: 'auto_awesome',
    name: 'Google Gemini',
    what: 'AI na nagbibigay ng tantiya sa taas ng baha at sumasagot sa chat. Gumagamit ito ng forecast at taas ng lugar.',
    href: 'https://ai.google.dev/',
  },
];

const LINKS = [
  { icon: 'language', label: 'Portfolio', value: 'jhannedrickperia.vercel.app', href: 'https://jhannedrickperia.vercel.app/' },
  { icon: 'work', label: 'LinkedIn', value: 'jhann-edrick-peria', href: 'https://www.linkedin.com/in/jhann-edrick-peria/' },
  { icon: 'mail', label: 'Email', value: 'jhannedricks.peria@gmail.com', href: 'mailto:jhannedricks.peria@gmail.com' },
];

function Card({ children, className = '' }) {
  return (
    <section className={`bg-surface-container-lowest rounded-3xl p-5 shadow-[0_8px_24px_-4px_rgba(15,43,72,0.07)] ${className}`}>
      {children}
    </section>
  );
}

export default function About() {
  return (
    <div data-screen="about" className="bg-surface font-body-md text-on-surface min-h-screen">
      <header className="fixed top-0 inset-x-0 z-50 pt-safe bg-surface/85 backdrop-blur-xl shadow-[0_4px_20px_-4px_rgba(15,43,72,0.06)]">
        <div className="h-16 px-5 flex items-center gap-3">
          <img alt="Kaya Ba? logo" className="h-8 w-auto object-contain" src="/logo.jpg" />
          <div>
            <div className="font-headline-sm text-headline-sm text-primary leading-tight">Kaya Ba?</div>
            <div className="font-body-sm text-[12.5px] text-on-surface-variant">Tungkol sa app</div>
          </div>
        </div>
      </header>

      <main className="pt-20 pb-40 px-5 mx-auto w-full max-w-[760px] flex flex-col gap-5">
        <section className="relative overflow-hidden rounded-3xl bg-primary text-on-primary p-6 shadow-[0_16px_36px_-6px_rgba(0,227,253,0.25)]">
          <span className="inline-flex items-center gap-1.5 bg-secondary-container text-primary font-label-badge text-[12px] font-bold px-3 py-1 rounded-full">
            <span className="material-symbols-outlined text-[16px]">science</span>
            Demo stage pa lang
          </span>
          <h1 className="mt-3 font-headline-sm text-headline-md">Demo pa lang ang website na ito</h1>
          <p className="mt-2 font-body-sm text-body-md text-on-primary/90">
            Sinusubukan pa ang app. Ang mga numero at babala rito ay nakabase sa mga pinagkukunan ng datos sa ibaba, at
            tantiya lang ang mga ito. Hindi ito opisyal na babala at hindi dapat gawing batayan sa paglikas.
          </p>
        </section>

        <Card>
          <h2 className="font-headline-sm text-headline-sm text-primary">Saan galing ang datos</h2>
          <ul className="mt-3 flex flex-col gap-3">
            {SOURCES.map((s) => (
              <li key={s.name}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-3 bg-surface-container rounded-2xl p-3.5 active:scale-[0.99] transition-transform"
                >
                  <span className="w-10 h-10 rounded-xl bg-secondary-container/40 text-primary flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined">{s.icon}</span>
                  </span>
                  <span className="min-w-0">
                    <span className="block font-headline-sm text-body-md text-primary font-bold">{s.name}</span>
                    <span className="block font-body-sm text-[13.5px] text-on-surface-variant">{s.what}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <h2 className="font-headline-sm text-headline-sm text-primary">Paano kinukuwenta ang baha</h2>
          <p className="mt-2 font-body-sm text-body-md text-on-surface-variant">
            Walang libreng serbisyo para sa taas ng baha sa mismong kalsada, kaya tinatantiya ito mula sa dami ng ulan sa
            loob ng 3 oras at sa taas ng lugar kumpara sa paligid. Mas tumataas ang tantiya sa mababang lugar. Ang
            typhoon signal ay tantiya rin mula sa bilis ng hangin, hindi galing sa bulletin ng PAGASA.
          </p>
        </Card>

        <Card>
          <h2 className="font-headline-sm text-headline-sm text-primary">Opisyal na impormasyon</h2>
          <p className="mt-2 font-body-sm text-body-md text-on-surface-variant">
            Para sa tunay na babala, sundin ang PAGASA, NDRRMC, at ang inyong LGU o barangay. Sa emergency, tumawag sa 911.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              ['PAGASA', 'https://bagong.pagasa.dost.gov.ph/'],
              ['NDRRMC', 'https://ndrrmc.gov.ph/'],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-on-primary font-label-badge text-[13px] font-bold active:scale-95 transition-transform"
              >
                {label}
                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              </a>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="font-headline-sm text-headline-sm text-primary">Gumawa</h2>
          <p className="mt-2 font-body-md text-primary font-bold">Jhann Edrick S. Peria</p>
          <p className="font-body-sm text-[13.5px] text-on-surface-variant">Build by • October 2026</p>
          <ul className="mt-4 flex flex-col gap-2.5">
            {LINKS.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  target={l.href.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  className="flex items-center gap-3 bg-surface-container rounded-2xl px-4 py-3 active:scale-[0.99] transition-transform"
                >
                  <span className="material-symbols-outlined text-secondary">{l.icon}</span>
                  <span className="min-w-0">
                    <span className="block font-label-badge text-[11px] uppercase text-on-surface-variant">{l.label}</span>
                    <span className="block font-body-sm text-[14px] text-primary font-bold truncate">{l.value}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Card>
      </main>
    </div>
  );
}
