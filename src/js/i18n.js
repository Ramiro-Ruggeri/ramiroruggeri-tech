// =============================================================
// src/js/i18n.js
// Alpine store for ES/EN switching. Reads /es.json or /en.json
// from public assets at runtime — no rebuild needed for copy edits.
// =============================================================
import esDict from '../data/es.json';
import enDict from '../data/en.json';

const dicts = { es: esDict, en: enDict };
const STORAGE_KEY = 'rr.lang';

function detectInitial() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'es' || saved === 'en') return saved;
  const navLang = (navigator.language || 'es').slice(0, 2);
  return navLang === 'en' ? 'en' : 'es';
}

export function registerI18n(Alpine) {
  Alpine.store('i18n', {
    lang: detectInitial(),

    init() {
      document.documentElement.lang = this.lang;
    },

    t(path) {
      const parts = path.split('.');
      let cur = dicts[this.lang];
      for (const p of parts) {
        if (cur == null) return path;
        cur = cur[p];
      }
      return cur ?? path;
    },

    toggle() {
      this.lang = this.lang === 'es' ? 'en' : 'es';
      document.documentElement.lang = this.lang;
      localStorage.setItem(STORAGE_KEY, this.lang);
    },
  });
}
