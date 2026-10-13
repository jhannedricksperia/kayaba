import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const KEY = 'kayaba.lang';
const LangContext = createContext({ lang: 'tl', setLang: () => {}, t: (tl) => tl });

function initial() {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === 'en' || saved === 'tl') return saved;
  } catch {
    /* storage unavailable */
  }
  return 'tl';
}

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(initial);

  const setLang = useCallback((l) => {
    setLangState(l);
    try {
      localStorage.setItem(KEY, l);
    } catch {
      /* storage unavailable */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === 'en' ? 'en' : 'fil';
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t: (tl, en) => (lang === 'en' ? en : tl) }), [lang, setLang]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

// t('Tagalog text', 'English text')
export const useT = () => useContext(LangContext);
