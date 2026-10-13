import { useT } from '../lib/i18n.jsx';

// Floating Tagalog / English switch, stacked above the chat button.
export default function LangToggle() {
  const { lang, setLang } = useT();
  return (
    <div
      role="group"
      aria-label="Language"
      className="kb-lang-btn fixed z-[60] flex rounded-full bg-white shadow-[0_8px_22px_rgba(15,43,72,0.25)] p-1 font-label-badge text-[12px] font-bold"
    >
      {[
        ['tl', 'TL'],
        ['en', 'EN'],
      ].map(([key, label]) => (
        <button
          key={key}
          type="button"
          onClick={() => setLang(key)}
          aria-pressed={lang === key}
          className={`px-2.5 py-1.5 rounded-full transition-colors ${
            lang === key ? 'bg-primary text-secondary-container' : 'text-on-surface-variant'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
