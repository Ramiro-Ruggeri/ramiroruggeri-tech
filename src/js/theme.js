// =============================================================
// src/js/theme.js
// Alpine store for dark/light theme. Default: dark.
// Persists in localStorage.
// =============================================================
const STORAGE_KEY = 'rr.theme';

function detectInitial() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'dark' || saved === 'light') return saved;
  return 'dark';
}

export function registerTheme(Alpine) {
  Alpine.store('theme', {
    mode: detectInitial(),

    init() {
      document.documentElement.setAttribute('data-theme', this.mode);
    },

    toggle() {
      this.mode = this.mode === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', this.mode);
      localStorage.setItem(STORAGE_KEY, this.mode);
    },
  });
}
