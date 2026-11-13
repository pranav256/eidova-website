import { useEffect, useState } from 'react';
import catalog from './catalog-themes.json';

export type ThemeMode = 'dark' | 'light';
type Palette = { adapted: boolean; tokens: Record<string, string>; siteOverrides: Record<string, string> };
export type CatalogTheme = { title: string; scheme: ThemeMode; modes: Record<ThemeMode, Palette> };
export const catalogThemes = catalog as Record<string, CatalogTheme>;
const modeKey = 'eidova-theme';

export function readTheme(): ThemeMode {
  const mode = new URLSearchParams(window.location.search).get('mode');
  if (mode === 'dark' || mode === 'light') return mode;
  try {
    for (const key of [modeKey, 'open-design-theme']) {
      const saved = localStorage.getItem(key);
      if (saved === 'dark' || saved === 'light') return saved;
    }
  } catch { /* URL appearance and the dark default work when storage is disabled. */ }
  return 'dark';
}

export function applyTheme(mode: ThemeMode, save = false): void {
  const root = document.documentElement;
  root.dataset.theme = mode;
  root.dataset.designSystem = 'editorial-dark';
  root.style.colorScheme = mode;
  const background = getComputedStyle(root).getPropertyValue('--background').trim();
  if (background) document.querySelector('meta[name="theme-color"]')?.setAttribute('content', background);
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
    const preference = window.matchMedia('(prefers-color-scheme: dark)');
    preference.addEventListener('change', restore);
    const syncStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === modeKey || event.key === 'open-design-theme') restore();
    };
    window.addEventListener('storage', syncStorage);
    return () => {
      window.removeEventListener('popstate', restore);
      preference.removeEventListener('change', restore);
      window.removeEventListener('storage', syncStorage);
    };
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
