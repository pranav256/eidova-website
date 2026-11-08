export type ThemeMode = 'dark' | 'light';
const preferenceKey = 'open-design-theme';

export function readTheme(): ThemeMode {
  try { return localStorage.getItem(preferenceKey) === 'light' ? 'light' : 'dark'; }
  catch { return 'dark'; }
}

export function applyTheme(mode: ThemeMode, save = false): void {
  document.documentElement.dataset.theme = mode;
  if (save) {
    try { localStorage.setItem(preferenceKey, mode); }
    catch { /* Theme switching works even when browser storage is unavailable. */ }
  }
}
