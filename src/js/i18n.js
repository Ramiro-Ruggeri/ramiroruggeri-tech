// =============================================================
// src/js/i18n.js
// Alpine store for ES/EN switching. Reads local JSON dictionaries
// bundled by Vite at build time.
// =============================================================
import esDict from '../data/es.json';
import enDict from '../data/en.json';

const dicts = { es: esDict, en: enDict };
const STORAGE_KEY = 'rr.lang';

function normalizeLang(lang) {
  return lang === 'en' ? 'en' : 'es';
}

function detectInitial() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'es' || saved === 'en') return saved;

  const navLang = (navigator.language || 'es').slice(0, 2);
  return normalizeLang(navLang);
}

export function registerI18n(Alpine) {
  Alpine.store('i18n', {
    lang: detectInitial(),
    version: 0,

    init() {
      document.documentElement.lang = this.lang;
    },

    setLang(lang) {
      const nextLang = normalizeLang(lang);

      if (this.lang === nextLang) return;

      this.lang = nextLang;
      this.version += 1;

      document.documentElement.lang = nextLang;
      localStorage.setItem(STORAGE_KEY, nextLang);
    },

    toggle() {
      this.setLang(this.lang === 'es' ? 'en' : 'es');
    },

    t(path) {
      this.version;

      const parts = path.split('.');
      let cur = dicts[this.lang];

      for (const p of parts) {
        if (cur == null) return path;
        cur = cur[p];
      }

      return cur ?? path;
    },
  });
}
