import { useEffect, useRef, useState } from 'react';
import { useLive } from '../lib/live.jsx';
import { fetchNearby } from '../lib/nearby.js';
import { formatHour } from '../lib/weather.js';
import { useT } from '../lib/i18n.jsx';

// Client-side limits (the server enforces its own as well).
const MAX_CHARS = 280;
const DAILY_LIMIT = 15;
const COOLDOWN_MS = 4000;
const STORE = 'kayaba.chat';

const SUGGESTIONS = [
  ['Kaya bang dumaan ang motor ngayon?', 'Can a motorcycle get through right now?'],
  ['Ano ang dapat kong ihanda?', 'What should I prepare?'],
  ['Saan ang pinakamalapit na evacuation center?', 'Where is the nearest evacuation center?'],
];

function today() {
  return new Date().toISOString().slice(0, 10);
}
function loadUsage() {
  try {
    const u = JSON.parse(localStorage.getItem(STORE));
    if (u?.day === today()) return u;
  } catch {
    /* ignore */
  }
  return { day: today(), count: 0 };
}

export default function ChatWidget() {
  const { place, data, terrain } = useLive();
  const { t, lang } = useT();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', greeting: true, text: '' },
  ]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [usage, setUsage] = useState(loadUsage);
  const [cooldown, setCooldown] = useState(0);
  const endRef = useRef(null);
  const shelters = useRef([]);

  useEffect(() => {
    fetchNearby(place)
      .then((r) => {
        shelters.current = r.shelters.slice(0, 3);
      })
      .catch(() => {});
  }, [place.lat, place.lon]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const left = Math.max(0, DAILY_LIMIT - usage.count);

  const send = async (raw) => {
    const text = raw.trim().slice(0, MAX_CHARS);
    if (!text || busy || left === 0 || Date.now() < cooldown) return;
    const next = { day: today(), count: usage.count + 1 };
    setUsage(next);
    try {
      localStorage.setItem(STORE, JSON.stringify(next));
    } catch {
      /* ignore */
    }
    setCooldown(Date.now() + COOLDOWN_MS);
    setInput('');
    const history = messages.filter((m) => !m.greeting).map((m) => ({ role: m.role, text: m.text }));
    setMessages((m) => [...m, { role: 'user', text }]);
    setBusy(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          lang,
          history,
          context: {
            place: place.name,
            rainNow: data?.rainNow,
            depthNow: data?.nowDepth,
            depthPeak: data?.peak?.depth,
            peakTime: data?.peak ? formatHour(data.peak.time) : '',
            wind: data?.windNow,
            windPeak: data?.maxWind,
            elevation: data?.elevation,
            belowMean: terrain?.belowMean,
            shelters: shelters.current.map((s) => ({ name: s.name, distance: s.distance })),
          },
        }),
      });
      const type = res.headers.get('content-type') || '';
      const json = type.includes('application/json') ? await res.json() : {};
      setMessages((m) => [
        ...m,
        { role: 'model', text: res.ok && json.reply ? json.reply : json.error || t('Hindi available ang assistant ngayon.', 'The assistant is not available right now.') },
      ]);
    } catch {
      setMessages((m) => [...m, { role: 'model', text: t('Walang koneksyon. Subukan ulit mamaya.', 'No connection. Please try again later.') }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? t('Isara ang chat', 'Close chat') : t('Buksan ang chat', 'Open chat')}
        className="kb-chat-btn fixed z-[60] w-14 h-14 rounded-full bg-primary text-secondary-container shadow-[0_12px_28px_rgba(15,43,72,0.35)] flex items-center justify-center active:scale-90 hover:scale-105 transition-transform"
      >
        <span className="material-symbols-outlined text-[28px]">{open ? 'close' : 'chat'}</span>
      </button>

      {open && (
        <aside
          className="fixed z-[70] inset-x-0 bottom-0 top-16 md:left-auto md:right-4 md:top-20 md:bottom-24 md:w-[380px] bg-surface-container-lowest md:rounded-3xl rounded-t-3xl shadow-[0_20px_60px_rgba(15,43,72,0.3)] flex flex-col overflow-hidden kb-chat"
          role="dialog"
          aria-label="Kaya Ba? assistant"
        >
          <header className="flex items-center justify-between px-4 py-3 bg-primary text-on-primary">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary-container">smart_toy</span>
              <div>
                <div className="font-headline-sm text-[15px] leading-tight">Kaya Ba? Assistant</div>
                <div className="font-body-sm text-[11.5px] text-on-primary/70">{place.name} • {left} {t('tanong pa ang natitira ngayong araw', 'questions left today')}</div>
              </div>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label={t('Isara', 'Close')} className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </header>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl font-body-sm text-[14px] leading-snug whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'self-end bg-primary text-on-primary rounded-br-md'
                    : 'self-start bg-surface-container text-primary rounded-bl-md'
                }`}
              >
                {m.greeting
                  ? t('Kumusta! Puwede mo akong tanungin tungkol sa baha, ulan, at kung ano ang dapat gawin sa inyong lugar.', 'Hi! You can ask me about floods, rain, and what to do in your area.')
                  : m.text}
              </div>
            ))}
            {busy && <div className="self-start bg-surface-container text-on-surface-variant px-3.5 py-2.5 rounded-2xl text-[14px] animate-pulse">{t('Sandali lang…', 'One moment…')}</div>}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 mt-1">
                {SUGGESTIONS.map(([tl, en]) => (
                  <button
                    key={tl}
                    type="button"
                    onClick={() => send(t(tl, en))}
                    className="px-3 py-1.5 rounded-full bg-secondary-container/40 text-primary font-label-badge text-[12px] font-bold active:scale-95"
                  >
                    {t(tl, en)}
                  </button>
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form
            className="p-3 border-t border-surface-container flex flex-col gap-1.5"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <div className="flex items-center gap-2">
              <input
                value={input}
                maxLength={MAX_CHARS}
                onChange={(e) => setInput(e.target.value)}
                disabled={left === 0}
                placeholder={left === 0 ? t('Naubos na ang tanong mo para ngayong araw', 'No questions left for today') : t('Magtanong tungkol sa baha…', 'Ask about floods…')}
                className="flex-1 min-w-0 bg-surface-container rounded-full px-4 py-2.5 outline-none font-body-sm text-[14px] text-primary placeholder-on-surface-variant"
              />
              <button
                type="submit"
                disabled={busy || left === 0 || !input.trim()}
                className="w-10 h-10 rounded-full bg-secondary-container text-primary flex items-center justify-center disabled:opacity-40 active:scale-90 transition-transform"
                aria-label={t('Ipadala', 'Send')}
              >
                <span className="material-symbols-outlined text-[20px]">send</span>
              </button>
            </div>
            <p className="font-body-sm text-[11px] text-on-surface-variant px-1">
              {input.length}/{MAX_CHARS} • {t('Sagot ito ng AI at tantiya lang. Sa emergency, tumawag sa 911.', 'AI answer, estimate only. In an emergency, call 911.')}
            </p>
          </form>
        </aside>
      )}
    </>
  );
}
