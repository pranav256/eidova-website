import { useEffect, useState } from 'react';
import catalog from './catalog-themes.json';

export type ThemeMode = 'dark' | 'light';
type Palette = { adapted: boolean; tokens: Record<string, string>; siteOverrides: Record<string, string> };
export type CatalogTheme = { title: string; scheme: ThemeMode; modes: Record<ThemeMode, Palette> };
export const catalogThemes = catalog as Record<string, CatalogTheme>;
const modeKey = 'open-design-theme';
const systemKey = 'open-design-system';
const appliedProperties = new Set<string>();
const validId = (id: string | null): id is string => !!id && Object.hasOwn(catalogThemes, id);

export function readTheme(): ThemeMode {
  const mode = new URLSearchParams(window.location.search).get('mode');
  if (mode === 'dark' || mode === 'light') return mode;
  try { return localStorage.getItem(modeKey) === 'light' ? 'light' : 'dark'; }
  catch { /* Storage can be disabled; the default appearance remains usable. */ return 'dark'; }
}

export function readThemeId(): string | null {
  const params = new URLSearchParams(window.location.search);
  if (params.has('theme') || params.has('preview')) {
    const id = params.get('theme') ?? params.get('preview');
    return validId(id) ? id : null;
  }
  try { const id = localStorage.getItem(systemKey); return validId(id) ? id : null; }
  catch { /* Theme selection works without browser storage. */ return null; }
}

export function applyTheme(mode: ThemeMode, save = false, themeId: string | null = readThemeId()): void {
  const root = document.documentElement;
  for (const name of appliedProperties) root.style.removeProperty(name);
  appliedProperties.clear();
  const id = validId(themeId) ? themeId : null;
  if (id) {
    const palette = catalogThemes[id].modes[mode];
    for (const [name, value] of Object.entries({ ...palette.tokens, ...palette.siteOverrides })) {
      root.style.setProperty(name, value);
      appliedProperties.add(name);
    }
  }
  root.dataset.theme = mode;
  root.dataset.designSystem = id || 'default';
  if (save) {
    try {
      localStorage.setItem(modeKey, mode);
      if (id) localStorage.setItem(systemKey, id); else localStorage.removeItem(systemKey);
    } catch { /* Colors and URL state still work when storage is unavailable. */ }
  }
}

function updateUrl(mode: ThemeMode, id: string | null) {
  const url = new URL(window.location.href);
  url.searchParams.delete('preview');
  if (id) url.searchParams.set('theme', id); else url.searchParams.delete('theme');
  url.searchParams.set('mode', mode);
  window.history.replaceState(null, '', url);
}

export function useAppearance() {
  const [selection, setSelection] = useState(() => ({ mode: readTheme(), id: readThemeId() }));
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('preview') || params.has('theme')) updateUrl(selection.mode, selection.id);
    const restore = () => {
      const next = { mode: readTheme(), id: readThemeId() };
      applyTheme(next.mode, false, next.id);
      setSelection(next);
    };
    window.addEventListener('popstate', restore);
    return () => window.removeEventListener('popstate', restore);
  }, []);
  function change(mode: ThemeMode, id: string | null) {
    const nextId = validId(id) ? id : null;
    applyTheme(mode, true, nextId);
    updateUrl(mode, nextId);
    setSelection({ mode, id: nextId });
  }
  return {
    theme: selection.mode,
    themeId: selection.id,
    toggleTheme: () => change(selection.mode === 'dark' ? 'light' : 'dark', selection.id),
    selectTheme: (id: string | null) => change(selection.mode, id),
  };
}
