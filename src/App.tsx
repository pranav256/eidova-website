import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';

type Theme = { id: string; title: string; description: string; primaryColor?: string; font?: string; componentCount: number };
type CatalogState = { state: 'loading' } | { state: 'error'; message: string } | { state: 'ready'; themes: Theme[] };

const sourceUrl = import.meta.env.VITE_REPOSITORY_URL || 'https://github.com/pranav256/open-design-website';
const serviceSourceUrl = import.meta.env.VITE_MCP_REPOSITORY_URL || 'https://github.com/pranav256/open-design-mcp';
const serviceEndpoint = import.meta.env.VITE_MCP_URL || 'https://open-design-mcp-liard.vercel.app/mcp';
const catalogUrl = import.meta.env.VITE_CATALOG_URL || '/api/catalog';
const registryOrigin = (import.meta.env.VITE_REGISTRY_ORIGIN || 'https://open-design-mcp-liard.vercel.app').replace(/\/$/, '');
const toolGroups = [
  { number: '01', title: 'Start with a system', description: 'Find a theme, get its tokens, and install component source from the local registry.', tools: ['find-design-system', 'get-design-system-kit'] },
  { number: '02', title: 'Make informed choices', description: 'Load practical guidance for layout, forms, navigation, and the platform you use.', tools: ['get-ui-principle', 'get-ux-principle'] },
  { number: '03', title: 'Check the result', description: 'Review the copy, inspect rendered spacing, and check UI code before shipping.', tools: ['check-comprehension', 'inspect-spacing'] },
];

function readCatalog(value: unknown): Theme[] {
  const items = Array.isArray(value) ? value : (value as { systems?: unknown })?.systems;
  if (!Array.isArray(items)) throw new Error('The catalog response could not be read.');
  return items.filter((item): item is Theme => item && typeof item.id === 'string' && typeof item.title === 'string' && typeof item.componentCount === 'number');
}

function CopyButton({ value, children }: { value: string; children: string }) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle');
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
    <Button type="button" onClick={copy} className="copy-button">{status === 'copied' ? 'Copied' : children}</Button>
    <span role="status" className={status === 'error' ? 'copy-feedback is-error' : 'copy-feedback'}>{status === 'error' ? 'Select the text and copy it manually.' : status === 'copied' ? 'Copied to clipboard.' : ''}</span>
  </div>;
}

export function App() {
  const [catalog, setCatalog] = useState<CatalogState>({ state: 'loading' });
  const [query, setQuery] = useState('');
  const [retry, setRetry] = useState(0);
  const searchInput = useRef<HTMLInputElement>(null);
  const endpoint = serviceEndpoint;
  const config = JSON.stringify({ mcpServers: { 'open-design': { type: 'streamable-http', url: endpoint } } }, null, 2);

  useEffect(() => {
    const controller = new AbortController();
    setCatalog({ state: 'loading' });
    fetch(catalogUrl, { signal: controller.signal })
      .then(response => { if (!response.ok) throw new Error('The catalog is temporarily unavailable.'); return response.json(); })
      .then(value => setCatalog({ state: 'ready', themes: readCatalog(value) }))
      .catch(error => { if (!controller.signal.aborted) setCatalog({ state: 'error', message: error instanceof Error ? error.message : 'The catalog could not load.' }); });
    return () => controller.abort();
  }, [retry]);

  const filtered = useMemo(() => {
    if (catalog.state !== 'ready') return [];
    const search = query.trim().toLowerCase();
    return catalog.themes.filter(theme => `${theme.id} ${theme.title} ${theme.description} ${theme.font || ''}`.toLowerCase().includes(search));
  }, [catalog, query]);

  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header">
      <a className="wordmark" href="#main" aria-label="Open Design home"><span className="brand-mark" aria-hidden="true"><i /><i /></span>Open Design</a>
      <nav aria-label="Main navigation"><a href="#themes">Themes</a><a href="#tools">Tools</a><a href="#connect">Connect</a></nav>
      <a className="source-link" href={sourceUrl}>Source code <span aria-hidden="true">↗</span></a>
    </header>

    <main id="main">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">Open-source design tools</p>
          <h1 id="hero-title">Design tools your agent can use.</h1>
          <p className="hero-description">Design systems, practical guidance, and UI checks for coding agents. Connect through MCP or run it yourself.</p>
          <div className="hero-actions"><Button asChild size="lg"><a href="#connect">Connect your agent</a></Button><a className="text-link" href="#themes">Explore the themes <span aria-hidden="true">↓</span></a></div>
          <p className="hero-note">No account required</p>
        </div>
        <div className="hero-preview" aria-label="Example of a design-system response">
          <div className="preview-bar"><span>Design system</span><span className="preview-tag">minimal-light</span></div>
          <div className="preview-content">
            <p className="preview-label">A consistent starting point</p>
            <div className="sample-heading">Built from the same tokens.</div>
            <p className="sample-description">Color, type, and components that work together.</p>
            <div className="preview-token-row"><div><span className="token-color token-background" /><span>Background</span><code>#F5F5F5</code></div><div><span className="token-color token-primary" /><span>Primary</span><code>#000000</code></div><div><span className="token-color token-foreground" /><span>Foreground</span><code>#4A4C52</code></div></div>
            <div className="preview-detail-row"><div><div className="preview-detail-group"><span className="preview-detail-label">Typography</span><strong>Geist Sans</strong></div><span className="type-sample">Aa Bb Cc</span></div><div><div className="preview-detail-group"><span className="preview-detail-label">Corner radius</span><strong>12 px</strong></div><span className="radius-sample" aria-hidden="true" /></div></div>
            <div className="preview-footer"><span>React component source</span><code>button.tsx</code></div>
          </div>
        </div>
      </section>

      <section className="workflow section" id="tools" aria-labelledby="tools-title">
        <div className="section-heading"><div><p className="eyebrow">From foundation to review</p><h2 id="tools-title">A few useful steps. Better UI.</h2></div><p>Use the tools in your editor, alongside your existing development workflow.</p></div>
        <div className="workflow-grid">{toolGroups.map(group => <article className="workflow-item" key={group.number}><span className="step-number">{group.number}</span><h3>{group.title}</h3><p>{group.description}</p><div className="tool-names">{group.tools.map(tool => <code key={tool}>{tool}</code>)}</div></article>)}</div>
      </section>

      <section className="themes section" id="themes" aria-labelledby="themes-title">
        <div className="section-heading"><div><p className="eyebrow">The component collection</p><h2 id="themes-title">Find your starting point.</h2></div><p>Explore 31 checked-in themes. Each includes its own tokens and React component source.</p></div>
        <div className="catalog-toolbar"><div className="search-field"><label htmlFor="theme-search">Search themes</label><Input ref={searchInput} id="theme-search" type="search" placeholder="Try minimal, dark, or Linear" value={query} onChange={event => setQuery(event.target.value)} /></div><p className="result-count" role="status">{catalog.state === 'ready' ? `${filtered.length} of ${catalog.themes.length} themes` : catalog.state === 'loading' ? 'Loading themes…' : 'Catalog unavailable'}</p></div>
        {catalog.state === 'loading' && <div className="catalog-message" role="status">Loading the theme catalog…</div>}
        {catalog.state === 'error' && <div className="catalog-message" role="alert"><p>{catalog.message}</p><Button variant="outline" onClick={() => { setRetry(value => value + 1); searchInput.current?.focus(); }}>Retry loading themes</Button></div>}
        {catalog.state === 'ready' && filtered.length === 0 && <div className="catalog-message"><h3>No themes match “{query}”.</h3><p>Try another name, style, or font.</p><Button variant="outline" onClick={() => { setQuery(''); searchInput.current?.focus(); }}>Clear search</Button></div>}
        {catalog.state === 'ready' && filtered.length > 0 && <div className="theme-grid">{filtered.map(theme => {
          const color = theme.primaryColor && CSS.supports('color', theme.primaryColor) ? theme.primaryColor : '#222222';
          return <article key={theme.id} className="theme-card" style={{ '--theme-primary': color } as CSSProperties}><div className="theme-swatch" aria-hidden="true"><span /><span /><span /></div><div className="theme-card-heading"><h3>{theme.title}</h3><span>{theme.componentCount} components</span></div><p className="theme-font">{theme.font || 'System typography'}</p><div className="theme-card-footer"><code>{theme.id}</code><a href={`${registryOrigin}/registry/${encodeURIComponent(theme.id)}/globals.json`} aria-label={`View ${theme.title} theme tokens`}>View tokens <span aria-hidden="true">↗</span></a></div></article>;
        })}</div>}
        <p className="catalog-note">Components come from the MIT-licensed Better Design repository. This is an independent service.</p>
      </section>

      <section className="connect section" id="connect" aria-labelledby="connect-title">
        <div className="connect-copy"><p className="eyebrow">Get started</p><h2 id="connect-title">One connection. Ready for your next project.</h2><p>Add this URL to your MCP client. Select Streamable HTTP.</p><div className="endpoint"><label htmlFor="mcp-endpoint">MCP server URL</label><Input id="mcp-endpoint" value={endpoint} readOnly onFocus={event => event.target.select()} /><CopyButton value={endpoint}>Copy server URL</CopyButton></div><p className="setup-note">Example for clients using an <code>mcpServers</code> configuration. Formats vary.</p></div>
        <div className="config-panel"><div className="config-heading"><span>Connection example</span><span>JSON</span></div><pre><code>{config}</code></pre><div className="config-footer"><CopyButton value={config}>Copy configuration</CopyButton></div></div>
      </section>

      <section className="ownership section" aria-labelledby="ownership-title"><div><p className="eyebrow">Open source</p><h2 id="ownership-title">Own the tools.</h2></div><div><p>Run locally or self-host. Inspect and adapt the source, component registry, and original guidance.</p><p>Public access depends on hosting capacity. Better Design’s AI generation and private account services are excluded.</p><a className="text-link" href={serviceSourceUrl}>Read the setup guide <span aria-hidden="true">↗</span></a></div></section>
    </main>
    <footer className="site-footer"><a className="wordmark" href="#main">Open Design</a><p>An independent, open-source project.</p><nav aria-label="Footer navigation"><a href="#connect">Connect</a><a href={sourceUrl}>Source</a><a href={`${sourceUrl}/blob/main/LICENSE`}>License</a></nav></footer>
  </>;
}
