import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Textarea } from './components/ui/textarea';
import { catalogThemes, useAppearance, type ThemeMode } from './theme';

type Theme = { id: string; title: string; description: string; primaryColor?: string; font?: string; componentCount: number; personality?: string[] };
type CatalogState = { state: 'loading' } | { state: 'error'; message: string } | { state: 'ready'; themes: Theme[] };
type Scheme = 'all' | 'light' | 'dark';
const featuredIds = ['minimal-light', 'linear', 'stripe', 'vercel', 'notion', 'airbnb'];
const sourceUrl = import.meta.env.VITE_REPOSITORY_URL || 'https://github.com/pranav256/open-design-website';
const serviceSourceUrl = import.meta.env.VITE_MCP_REPOSITORY_URL || 'https://github.com/pranav256/open-design-mcp';
const endpoint = import.meta.env.VITE_MCP_URL || 'https://open-design-mcp-liard.vercel.app/mcp';
const catalogUrl = import.meta.env.VITE_CATALOG_URL || '/api/catalog';
const registryOrigin = (import.meta.env.VITE_REGISTRY_ORIGIN || 'https://open-design-mcp-liard.vercel.app').replace(/\/$/, '');
const clientOptions = ['Codex', 'JSON', 'Server URL'];
const toolGroups = [
  { number: '01', title: 'Start with a foundation.', description: 'Choose a system. Give your agent its tokens and real React component source.', tools: ['find-design-system', 'get-design-system-kit'] },
  { number: '02', title: 'Make informed choices.', description: 'Load guidance for the screen you are building, from layout to forms and navigation.', tools: ['get-ui-principle', 'get-ux-principle'] },
  { number: '03', title: 'Review what you ship.', description: 'Check the copy and code. Measure the spacing in your rendered interface.', tools: ['check-comprehension', 'inspect-spacing'] },
];

function readCatalog(value: unknown): Theme[] {
  const items = Array.isArray(value) ? value : (value as { systems?: unknown })?.systems;
  if (!Array.isArray(items)) throw new Error('The catalog response could not be read.');
  return items.filter((item): item is Theme => item && typeof item.id === 'string' && typeof item.title === 'string' && typeof item.componentCount === 'number');
}
function readSearch() {
  const params = new URLSearchParams(window.location.search);
  const appearance = params.get('appearance');
  return { query: params.get('q') || '', scheme: (appearance === 'light' || appearance === 'dark' ? appearance : 'all') as Scheme };
}
function paletteStyle(id: string, mode: ThemeMode): CSSProperties {
  return catalogThemes[id]?.modes[mode].tokens as CSSProperties;
}
function SiteHeader() {
  return <header className="site-header">
    <a className="wordmark" href="#main" aria-label="Open Design home"><span className="brand-mark" aria-hidden="true"><i /><i /></span>Open Design</a>
    <nav aria-label="Main navigation"><a href="#themes">Themes</a><a href="#tools">Tools</a><a href="#connect">Connect</a></nav>
    <div className="header-actions"><a className="source-link" href={sourceUrl}>Source code <span aria-hidden="true">↗</span></a></div>
  </header>;
}
function SiteFooter() {
  return <footer className="site-footer"><a className="wordmark" href="#main"><span className="brand-mark" aria-hidden="true"><i /><i /></span>Open Design</a><p>Independent. Open source. Built for your agent.</p><nav aria-label="Footer navigation"><a href="#connect">Connect</a><a href={sourceUrl}>Source</a><a href={sourceUrl + '/blob/main/LICENSE'}>License</a></nav></footer>;
}
function fontLabel(value?: string) {
  const family = value?.split(',')[0].replace(/["']/g, '').trim();
  if (!family || /^(ui-|system-ui)/.test(family)) return 'System font';
  if (family.includes('--font-geist')) return 'Geist';
  return family.replace(/\s+VF$/, ' Variable');
}

function CopyButton({ value, children }: { value: string; children: string }) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  useEffect(() => {
    setStatus('idle');
  }, [value]);
  useEffect(() => {
    if (status === 'idle') return;
    const timer = window.setTimeout(() => setStatus('idle'), 3500);
    return () => window.clearTimeout(timer);
  }, [status]);
  async function copy() {
    try { await navigator.clipboard.writeText(value); setStatus('copied'); }
    catch { setStatus('error'); }
  }
  return <div className="copy-action">
    <Button type="button" onClick={copy}>{status === 'copied' ? 'Copied' : children}<span aria-hidden="true">{status === 'copied' ? '✓' : '↗'}</span></Button>
    <span role="status" className="copy-feedback">{status === 'error' ? 'Select the text and copy it manually.' : status === 'copied' ? 'Copied to clipboard.' : ''}</span>
  </div>;
}

export function App() {
  const { theme, themeId, toggleTheme, selectTheme } = useAppearance();
  const [catalog, setCatalog] = useState<CatalogState>({ state: 'loading' });
  const [query, setQuery] = useState(() => readSearch().query);
  const [scheme, setScheme] = useState<Scheme>(() => readSearch().scheme);
  const [showAll, setShowAll] = useState(false);
  const [retry, setRetry] = useState(0);
  const [client, setClient] = useState(0);
  const searchInput = useRef<HTMLInputElement>(null);
  const config = JSON.stringify({ mcpServers: { 'open-design': { type: 'streamable-http', url: endpoint } } }, null, 2);
  const codexCommand = 'codex mcp add open-design --url ' + endpoint;

  useEffect(() => {
    const controller = new AbortController();
    let disposed = false;
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    setCatalog({ state: 'loading' });
    fetch(catalogUrl, { signal: controller.signal })
      .then(response => { if (!response.ok) throw new Error('The catalog is temporarily unavailable.'); return response.json(); })
      .then(value => { if (!disposed) setCatalog({ state: 'ready', themes: readCatalog(value) }); })
      .catch(error => { if (!disposed) setCatalog({ state: 'error', message: controller.signal.aborted ? 'The catalog took too long to load. Try again.' : error instanceof Error ? error.message : 'The catalog could not load.' }); })
      .finally(() => window.clearTimeout(timeout));
    return () => { disposed = true; window.clearTimeout(timeout); controller.abort(); };
  }, [retry]);
  useEffect(() => {
    const url = new URL(window.location.href);
    if (query) url.searchParams.set('q', query); else url.searchParams.delete('q');
    if (scheme !== 'all') url.searchParams.set('appearance', scheme); else url.searchParams.delete('appearance');
    window.history.replaceState(null, '', url);
  }, [query, scheme]);
  useEffect(() => {
    const restore = () => { const search = readSearch(); setQuery(search.query); setScheme(search.scheme); };
    window.addEventListener('popstate', restore);
    return () => window.removeEventListener('popstate', restore);
  }, []);

  const filtered = useMemo(() => {
    if (catalog.state !== 'ready') return [];
    const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return catalog.themes.filter(item => {
      const text = [item.id, item.title, item.description, item.font, ...(item.personality || [])].join(' ').toLowerCase();
      return words.every(word => text.includes(word)) && (scheme === 'all' || catalogThemes[item.id]?.scheme === scheme);
    }).sort((a, b) => {
      const aIndex = featuredIds.indexOf(a.id), bIndex = featuredIds.indexOf(b.id);
      return (aIndex < 0 ? 99 : aIndex) - (bIndex < 0 ? 99 : bIndex) || a.title.localeCompare(b.title);
    });
  }, [catalog, query, scheme]);
  const visible = query.trim() || scheme !== 'all' || showAll ? filtered : filtered.slice(0, 6);
  function resetSearch() { setQuery(''); setScheme('all'); setShowAll(false); searchInput.current?.focus(); }
  function tabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? 2 : (index + (event.key === 'ArrowRight' ? 1 : 2)) % 3;
    setClient(next); document.getElementById('client-tab-' + next)?.focus();
  }

  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <SiteHeader />

    <main id="main">
      <div className="theme-session" aria-label="Site theme controls">
        <p role="status">Current theme: <strong>{themeId ? catalogThemes[themeId].title : 'Open Design'}</strong></p>
        <div className="theme-session-controls">
          <Button className="theme-toggle" variant="outline" size="sm" onClick={toggleTheme} aria-label={'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' mode'}>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</Button>
          <Button variant="ghost" size="sm" disabled={!themeId} onClick={() => selectTheme(null)}>Reset theme</Button>
        </div>
      </div>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <h1 id="hero-title">Give your agent<br /><span>a design system.</span></h1>
          <p className="hero-description">Try 31 design systems on this page. Bring their tokens and React components to your coding agent.</p>
          <div className="hero-actions"><Button asChild size="lg"><a href="#connect">Connect your agent <span aria-hidden="true">↗</span></a></Button><a className="text-link" href="#themes">Try the themes <span aria-hidden="true">↓</span></a></div>
          <p className="hero-note">Free public access <span aria-hidden="true">·</span> No account required</p>
        </div>
      </section>

      <div className="platform-strip"><span>Built for the tools you already use.</span><div><span>Codex</span><span>Cursor</span><span>Claude Code</span><span className="platform-more">and other MCP clients</span></div></div>

      <section className="themes section" id="themes" aria-labelledby="themes-title">
        <div className="section-heading"><div><h2 id="themes-title">Find your starting point.</h2><p>Choose a theme to apply it to this site.</p></div><a className="text-link" href={serviceSourceUrl + '/tree/main/assets/registry'}>Explore the registry <span aria-hidden="true">↗</span></a></div>
        <div className="catalog-toolbar">
          <div className="search-field"><span className="search-symbol" aria-hidden="true">⌕</span><Input ref={searchInput} id="theme-search" type="search" aria-label="Search themes" placeholder="Search themes, styles, or fonts…" value={query} onChange={event => { setQuery(event.target.value); setShowAll(false); }} />{query && <Button variant="ghost" className="clear-search" aria-label="Clear search" onClick={() => { setQuery(''); searchInput.current?.focus(); }}>Clear</Button>}</div>
          <div className="scheme-filter" role="group" aria-label="Original theme appearance">{(['all', 'light', 'dark'] as const).map(value => <Button key={value} variant="ghost" aria-pressed={scheme === value} onClick={() => { setScheme(value); setShowAll(false); }}>{value === 'all' ? 'All themes' : value === 'light' ? 'Light base' : 'Dark base'}</Button>)}</div>
        </div>
        <p className="result-count" role="status">{catalog.state === 'ready' ? 'Showing ' + visible.length + ' of ' + filtered.length + ' themes' : catalog.state === 'loading' ? 'Loading themes…' : 'Catalog unavailable'}</p>
        {catalog.state === 'loading' && <div className="catalog-message" role="status">Loading the theme catalog…</div>}
        {catalog.state === 'error' && <div className="catalog-message" role="alert"><h3>The catalog could not load.</h3><p>{catalog.message}</p><Button variant="outline" onClick={() => { setRetry(value => value + 1); searchInput.current?.focus(); }}>Retry loading themes</Button></div>}
        {catalog.state === 'ready' && filtered.length === 0 && <div className="catalog-message"><h3>{query ? 'No themes match “' + query + '”.' : 'No themes match this filter.'}</h3><p>Try another name, or clear the search and appearance filter.</p><Button variant="outline" onClick={resetSearch}>Clear search and filters</Button></div>}
        {catalog.state === 'ready' && visible.length > 0 && <div className="theme-grid">{visible.map(item => <article key={item.id} className="theme-card">
          <div className="palette-strip" style={paletteStyle(item.id, theme)} aria-hidden="true"><i /><i /><i /><i /></div>
          <div className="theme-card-info"><div className="theme-card-heading"><h3>{item.title}</h3><span className="scheme-label">{catalogThemes[item.id]?.scheme === 'dark' ? 'Dark base' : 'Light base'}</span></div><p>{item.componentCount} components <span aria-hidden="true">·</span> {fontLabel(item.font)}</p><div className="theme-card-links"><Button className="apply-theme" variant={themeId === item.id ? 'secondary' : 'outline'} aria-label={'Apply ' + item.title + ' theme'} aria-pressed={themeId === item.id} onClick={() => selectTheme(item.id)}>{themeId === item.id ? 'Applied' : 'Apply theme'}<span aria-hidden="true">{themeId === item.id ? '✓' : '→'}</span></Button><a className="theme-token-link" href={registryOrigin + '/registry/' + encodeURIComponent(item.id) + '/globals.json'} aria-label={'View ' + item.title + ' theme tokens'}>View tokens <span aria-hidden="true">↗</span></a></div></div>
        </article>)}</div>}
        {catalog.state === 'ready' && !query.trim() && scheme === 'all' && filtered.length > 6 && <div className="catalog-more"><Button variant="outline" onClick={() => { setShowAll(value => !value); if (showAll) document.getElementById('themes')?.scrollIntoView(); }}>{showAll ? 'Show fewer themes' : 'Show all ' + filtered.length + ' themes'}<span aria-hidden="true">{showAll ? '↑' : '↓'}</span></Button></div>}
        <p className="catalog-note">Themes from the MIT-licensed Better Design registry. Alternate appearances are adapted for this site.</p>
      </section>

      <section className="workflow section" id="tools" aria-labelledby="tools-title">
        <div className="section-heading"><div><h2 id="tools-title">From a blank page to a better UI.</h2><p>A small set of tools for the decisions that matter.</p></div><span className="section-aside">Choose. Build. Review.</span></div>
        <div className="workflow-grid">{toolGroups.map(group => <article className="workflow-item" key={group.number}><span className="step-number">{group.number}<span aria-hidden="true"> /</span></span><h3>{group.title}</h3><p>{group.description}</p><div className="tool-names">{group.tools.map(tool => <code key={tool}>{tool}</code>)}</div></article>)}</div>
      </section>

      <section className="connect section" id="connect" aria-labelledby="connect-title">
        <div className="connect-copy"><h2 id="connect-title">One connection.<br />Your next starting point.</h2><p>Add Open Design through MCP. No account required.</p><ol className="setup-steps"><li><span>01</span><div><strong>Add the server.</strong><p>Choose your client's setup format.</p></div></li><li><span>02</span><div><strong>Ask your agent to use Open Design.</strong><p>Choose a theme. Build. Review.</p></div></li></ol><a className="text-link" href={serviceSourceUrl + '#run-locally'}>Prefer to run locally? <span aria-hidden="true">↗</span></a></div>
        <div className="config-panel">
          <div className="client-tabs" role="tablist" aria-label="Connection format">{clientOptions.map((label, index) => <Button key={label} id={'client-tab-' + index} role="tab" variant="ghost" aria-selected={client === index} aria-controls={'client-panel-' + index} tabIndex={client === index ? 0 : -1} onClick={() => setClient(index)} onKeyDown={event => tabKey(event, index)}>{label}</Button>)}</div>
          <div className="client-panel" id={'client-panel-' + client} role="tabpanel" aria-labelledby={'client-tab-' + client} tabIndex={0} key={client}>
            <p className="config-description">{client === 0 ? 'Run this command in your terminal.' : client === 1 ? 'For clients using an mcpServers configuration.' : 'Choose Streamable HTTP in your MCP client.'}</p>
            {client === 2 ? <Textarea id="mcp-endpoint" className="endpoint-input" aria-label="MCP server URL" value={endpoint} rows={2} readOnly spellCheck={false} onFocus={event => event.target.select()} /> : <pre><code>{client === 0 ? codexCommand : config}</code></pre>}
            <CopyButton value={client === 0 ? codexCommand : client === 1 ? config : endpoint}>{client === 0 ? 'Copy Codex command' : client === 1 ? 'Copy configuration' : 'Copy server URL'}</CopyButton>
            <div className="config-footnote"><span aria-hidden="true">↳</span><p>{client === 0 ? 'Restart your Codex session after adding the server.' : client === 1 ? 'Save the configuration and reload your client. Formats vary.' : 'Paste the URL into your client and connect.'}</p></div>
          </div>
        </div>
      </section>

      <section className="ownership section" aria-labelledby="ownership-title"><div><h2 id="ownership-title">Open source.<br />On your terms.</h2></div><div><p>Run it on your machine or self-host. Read the source, adapt the registry, and edit the guidance.</p><p>Public access depends on hosting capacity. Hosted AI generation and vendor account services are outside this project.</p><a className="text-link" href={serviceSourceUrl}>Read the setup guide <span aria-hidden="true">↗</span></a></div></section>
    </main>
    <SiteFooter />
  </>;
}
