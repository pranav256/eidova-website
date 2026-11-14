import { SiteHeader, SiteFooter } from './App';
import { ResourceLibrary } from './ResourceLibrary';
import { useAppearance } from './theme';

export function Resources() {
  const { theme, toggleTheme } = useAppearance();
  return <><a className="skip-link" href="#main">Skip to resources</a><SiteHeader theme={theme} onToggleTheme={toggleTheme} />
    <main id="main" tabIndex={-1}><ResourceLibrary all /></main><SiteFooter /></>;
}
