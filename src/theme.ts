import { useEffect, useState } from 'react';
import catalog from './catalog-themes.json';

export type ThemeMode = 'dark' | 'light';
type Palette = { adapted: boolean; tokens: Record<string, string>; siteOverrides: Record<string, string> };
export type CatalogTheme = { title: string; scheme: ThemeMode; modes: Record<ThemeMode, Palette> };
export const catalogThemes = catalog as Record<string, CatalogTheme>;
const modeKey = 'open-design-theme';

export function readTheme(): ThemeMode {
  const mode = new URLSearchParams(window.location.search).get('mode');
  if (mode === 'dark' || mode === 'light') return mode;
  try { return localStorage.getItem(modeKey) === 'light' ? 'light' : 'dark'; }
  catch { /* Storage can be disabled; the default appearance remains usable. */ return 'dark'; }
}

export function applyTheme(mode: ThemeMode, save = false): void {
  const root = document.documentElement;
  root.dataset.theme = mode;
  root.dataset.designSystem = 'default';
  if (save) {
    try { localStorage.setItem(modeKey, mode); }
    catch { /* Appearance and URL state work when storage is unavailable. */ }
  }
}

export function useAppearance() {
  const [theme, setTheme] = useState(readTheme);
  useEffect(() => {
    const restore = () => {
      const mode = readTheme();
      applyTheme(mode);
      setTheme(mode);
    };
    window.addEventListener('popstate', restore);
    return () => window.removeEventListener('popstate', restore);
  }, []);
  function toggleTheme() {
    const mode = theme === 'dark' ? 'light' : 'dark';
    applyTheme(mode, true);
    const url = new URL(window.location.href);
    url.searchParams.set('mode', mode);
    window.history.replaceState(null, '', url);
    setTheme(mode);
  }
  return { theme, toggleTheme };
}
