import { useState } from 'react';

export type ThemeMode = 'dark' | 'light';
const preferenceKey = 'open-design-theme';

export function readTheme(): ThemeMode {
  const linkedMode = new URLSearchParams(window.location.search).get('mode');
  if (linkedMode === 'dark' || linkedMode === 'light') return linkedMode;
  try { return localStorage.getItem(preferenceKey) === 'light' ? 'light' : 'dark'; }
  catch { /* Browser storage may be disabled; keep the default appearance usable. */ return 'dark'; }
}

export function useAppearance() {
  const [theme, setTheme] = useState(readTheme);
  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    applyTheme(next, true);
    const url = new URL(window.location.href);
    if (url.searchParams.has('mode') || url.searchParams.has('preview')) {
      url.searchParams.set('mode', next);
      window.history.replaceState(null, '', url);
    }
    setTheme(next);
  }
  return { theme, toggleTheme };
}

export function applyTheme(mode: ThemeMode, save = false): void {
  document.documentElement.dataset.theme = mode;
  if (save) {
    try { localStorage.setItem(preferenceKey, mode); }
    catch { /* Theme switching works even when browser storage is unavailable. */ }
  }
}
