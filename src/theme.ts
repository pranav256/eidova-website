import { useEffect, useState } from 'react';
import catalog from './catalog-themes.json';

export type ThemeMode = 'dark' | 'light';
type Palette = { adapted: boolean; tokens: Record<string, string>; siteOverrides: Record<string, string> };
export type CatalogTheme = { title: string; scheme: ThemeMode; modes: Record<ThemeMode, Palette> };
export const catalogThemes = catalog as Record<string, CatalogTheme>;
const modeKey = 'eidova-theme';
const pageThemeKey = 'eidova-page-theme';
const landingPage = (window.location.pathname.replace(/\/$/, '') || '/') === '/' && !new URLSearchParams(window.location.search).has('specimen');
const paletteProperties = [...new Set(Object.values(catalogThemes).flatMap(item => Object.values(item.modes).flatMap(palette => Object.keys({ ...palette.tokens, ...palette.siteOverrides }))))];

export function readPageTheme(): string | null {
  if (!landingPage) return null;
  let id = new URLSearchParams(window.location.search).get('page-theme');
  if (id === null) {
    try { id = localStorage.getItem(pageThemeKey); }
    catch { /* Shared links still work without storage. */ }
  }
  return id && Object.hasOwn(catalogThemes, id) ? id : null;
}

export function readTheme(): ThemeMode {
  const mode = new URLSearchParams(window.location.search).get('mode');
  if (mode === 'dark' || mode === 'light') return mode;
  try {
    for (const key of [modeKey, 'open-design-theme']) {
      const saved = localStorage.getItem(key);
      if (saved === 'dark' || saved === 'light') return saved;
    }
  } catch { /* URL appearance and system preferences work when storage is disabled. */ }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function applyTheme(mode: ThemeMode, save = false): void {
  const root = document.documentElement;
  root.dataset.theme = mode;
  root.dataset.designSystem = 'minimal-light';
  root.dataset.brand = 'eidova-paper';
  for (const property of paletteProperties) root.style.removeProperty(property);
  const id = readPageTheme();
  if (id) {
    const palette = catalogThemes[id].modes[mode];
    for (const [property, value] of Object.entries({ ...palette.tokens, ...palette.siteOverrides })) root.style.setProperty(property, value);
    root.dataset.pageTheme = id;
    root.dataset.designSystem = id;
    root.dataset.brand = 'eidova-catalog';
  } else delete root.dataset.pageTheme;
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
  const [pageTheme, setPageTheme] = useState(readPageTheme);
  useEffect(() => {
    const restore = () => {
      const mode = readTheme();
      applyTheme(mode);
      setTheme(mode);
      setPageTheme(readPageTheme());
    };
    window.addEventListener('popstate', restore);
    const preference = window.matchMedia('(prefers-color-scheme: dark)');
    preference.addEventListener('change', restore);
    const syncStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === modeKey || event.key === 'open-design-theme' || event.key === pageThemeKey) restore();
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
  function selectPageTheme(id: string | null) {
    if (!landingPage || (id !== null && !Object.hasOwn(catalogThemes, id))) return;
    if (id === readPageTheme()) return;
    const url = new URL(window.location.href);
    if (!url.searchParams.has('page-theme')) {
      url.searchParams.set('page-theme', readPageTheme() ?? 'default');
      window.history.replaceState(null, '', url);
    }
    // An explicit default survives shared links and Back even with a saved theme.
    url.searchParams.set('page-theme', id ?? 'default');
    window.history.pushState(null, '', url);
    try { if (id) localStorage.setItem(pageThemeKey, id); else localStorage.removeItem(pageThemeKey); }
    catch { /* The current page and its URL still retain the selection. */ }
    applyTheme(readTheme());
    setPageTheme(id);
  }
  return { theme, toggleTheme, pageTheme, selectPageTheme };
}
