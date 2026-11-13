import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type SyntheticEvent } from 'react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Textarea } from './components/ui/textarea';
import { catalogThemes, useAppearance, type ThemeMode } from './theme';
import families from './design-families.json';
import { ResourceLibrary } from './ResourceLibrary';
import { CopyButton } from './components/CopyButton';
import { version } from '../package.json';
import { ArrowDown, ArrowUpRight, Search } from 'lucide-react';

type Theme = { id: string; title: string; description: string; primaryColor?: string; font?: string; componentCount: number; personality?: string[] };
type CatalogState = { state: 'loading' } | { state: 'error'; message: string } | { state: 'ready'; themes: Theme[] };
type Scheme = 'all' | 'light' | 'dark';
const featuredIds = ['minimal-light', ...families.map(family=>family.representative).filter(id=>id!=='minimal-light')];
const familyFor=(id:string)=>families.find(family=>family.representative===id||family.variants.includes(id));
function readPreview() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('preview') ?? params.get('theme');
  return id && familyFor(id) ? id : null;
}
const sourceUrl = import.meta.env.VITE_REPOSITORY_URL || 'https://github.com/pranav256/eidova-website';
const serviceSourceUrl = import.meta.env.VITE_MCP_REPOSITORY_URL || 'https://github.com/pranav256/eidova-mcp';
const endpoint = import.meta.env.VITE_MCP_URL || 'https://open-design-mcp-liard.vercel.app/mcp';
const catalogUrl = import.meta.env.VITE_CATALOG_URL || '/api/catalog';
const registryOrigin = (import.meta.env.VITE_REGISTRY_ORIGIN || 'https://open-design-mcp-liard.vercel.app').replace(/\/$/, '');
const navigationHome = window.location.pathname.replace(/\/$/, '') === '/showcase' ? '/' : '';
const clientOptions = ['Codex', 'Claude Code', 'Claude Desktop', 'Cursor', 'VS Code', 'Server URL'];
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
export function SiteHeader({ theme, onToggleTheme }: { theme: ThemeMode; onToggleTheme: () => void }) {
  return <header className="site-header">
    <a className="wordmark" href={navigationHome+'#main'} aria-label="Eidova home"><img className="brand-mark" src="/logo.svg" width={40} height={40} alt="" />Eidova</a>
    <nav aria-label="Main navigation"><a href={navigationHome+'#themes'}>Themes</a><a href={navigationHome+'#resources'}>Resources</a><a href={navigationHome+'#tools'}>Tools</a><a href="/showcase" aria-current={navigationHome ? 'page' : undefined}>Showcase</a><a href="/studio">Team workspace</a><a href={navigationHome+'#connect'}>Connect</a></nav>
    <div className="header-actions"><a className="source-link" href={sourceUrl}>Source code <ArrowUpRight aria-hidden="true" /></a><Button className="theme-toggle" variant="outline" size="sm" onClick={onToggleTheme} aria-label={'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' mode'}>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</Button></div>
  </header>;
}
export function SiteFooter() {
  return <footer className="site-footer"><a className="wordmark" href={navigationHome+'#main'}><img className="brand-mark" src="/logo.svg" width={40} height={40} alt="" />Eidova</a><p>Independent. Open source. Built for your agent. v{version}</p><nav aria-label="Footer navigation"><a href={navigationHome+'#connect'}>Connect</a><a href="/showcase">Showcase</a><a href={sourceUrl}>Source</a><a href={serviceSourceUrl + '/blob/main/docs/CLIENTS.md'}>Docs</a><a href={registryOrigin + '/health'}>Status</a><a href={sourceUrl + '/blob/main/LICENSE'}>License</a></nav></footer>;
}
function fontLabel(value?: string) {
  const family = value?.split(',')[0].replace(/["']/g, '').trim();
  if (!family || /^(ui-|system-ui)/.test(family)) return 'System font';
  if (family.includes('--font-geist')) return 'Geist';
  if (family.includes('--font-inter')) return 'Inter';
  return family.replace(/\s+VF$/, ' Variable');
}

function designPrompt(id: string) {
  return `Use Eidova's "${id}" design system for this project. Read design://systems/${id}/design.md and merge its guidance with any existing DESIGN.md. Inspect the project, then call get-design-system-kit with target "react", designSystemId "${id}", and only the components needed. Preserve existing brand decisions. Build with real components and review source, copy and rendered spacing.`;
}

export function App() {
  const { theme, toggleTheme } = useAppearance();
  const [catalog, setCatalog] = useState<CatalogState>({ state: 'loading' });
  const [query, setQuery] = useState(() => readSearch().query);
  const [scheme, setScheme] = useState<Scheme>(() => readSearch().scheme);
  const [showHandoff, setShowHandoff] = useState(false);
  const [retry, setRetry] = useState(0);
  const [client, setClient] = useState(0);
  const [profile,setProfile]=useState<'core'|'full'>('core');
  const [preview,setPreview]=useState<string|null>(readPreview);
  const previewFamily=preview?familyFor(preview):null;
  const previewDialog=useRef<HTMLDialogElement>(null);
  const previewTrigger=useRef<HTMLButtonElement|null>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const fullEndpoint=endpoint.replace(/\/core\/?$/,'').replace(/\/$/,'');
  const selectedEndpoint=profile==='core'?fullEndpoint+'/core':fullEndpoint;
  const setup=client===0?'codex mcp add eidova --url '+selectedEndpoint:client===1?'claude mcp add --transport http eidova '+selectedEndpoint:client===3?JSON.stringify({mcpServers:{'eidova':{url:selectedEndpoint}}},null,2):client===4?JSON.stringify({servers:{'eidova':{type:'http',url:selectedEndpoint}}},null,2):selectedEndpoint;
  const setupDescription=client<2?'Run this command in your terminal.':client===3?'Save this in .cursor/mcp.json.':client===4?'Save this in .vscode/mcp.json.':client===2?'In Settings → Connectors, add a custom connector with this URL.':'Choose Streamable HTTP in your MCP client.';
  const copyLabel=client<2?'Copy '+clientOptions[client]+' command':client===3||client===4?'Copy configuration':'Copy server URL';

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
    const restore = () => { const search = readSearch(); setQuery(search.query); setScheme(search.scheme); setPreview(readPreview()); };
    window.addEventListener('popstate', restore);
    return () => window.removeEventListener('popstate', restore);
  }, []);
  useEffect(() => {
    setShowHandoff(false);
    const url = new URL(window.location.href);
    url.searchParams.delete('theme');
    if (preview) url.searchParams.set('preview', preview); else url.searchParams.delete('preview');
    window.history.replaceState(null, '', url);
    const dialog = previewDialog.current;
    if (!dialog) return;
    if (preview) { if (!dialog.open) dialog.showModal(); document.getElementById('component-preview-title')?.focus(); }
    else if (dialog.open) dialog.close();
  }, [preview]);

  const filtered = useMemo(() => {
    if (catalog.state !== 'ready') return [];
    const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return catalog.themes.filter(item => {
      const family=familyFor(item.id);
      const text = [item.id, item.title, item.description, item.font, family?.title, family?.description, ...(family?.useCases || []), ...(item.personality || [])].join(' ').toLowerCase();
      return words.every(word => text.includes(word)) && (scheme === 'all' || catalogThemes[item.id]?.scheme === scheme);
    }).sort((a, b) => {
      const aIndex = featuredIds.indexOf(a.id), bIndex = featuredIds.indexOf(b.id);
      return (aIndex < 0 ? 99 : aIndex) - (bIndex < 0 ? 99 : bIndex) || a.title.localeCompare(b.title);
    });
  }, [catalog, query, scheme]);
  const visible = filtered;
  function resetSearch() { setQuery(''); setScheme('all'); searchInput.current?.focus(); }
  function tabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? clientOptions.length-1 : (index + (event.key === 'ArrowRight' ? 1 : clientOptions.length-1)) % clientOptions.length;
    setClient(next); document.getElementById('client-tab-' + next)?.focus();
  }
  function previewLoaded(event: SyntheticEvent<HTMLIFrameElement>) {
    const doc = event.currentTarget.contentDocument;
    // Keyboard events inside the iframe cannot reach the outer dialog.
    doc?.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !event.defaultPrevented && !doc.querySelector('[role="dialog"][data-state="open"], dialog[open]')) {
        event.preventDefault(); setPreview(null);
      }
    });
  }

  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <SiteHeader theme={theme} onToggleTheme={toggleTheme} />

    <main id="main" tabIndex={-1}>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="site-eyebrow">Open-source design tools for coding agents</p>
          <h1 id="hero-title">Better UI starts here.</h1>
          <p className="hero-description">Give your agent real components, design resources and practical reviews through Eidova MCP.</p>
          <div className="hero-actions"><a className="text-link" href="#themes">Explore the themes <ArrowDown aria-hidden="true" /></a><a className="text-link" href="/showcase">Try the showcase <ArrowUpRight aria-hidden="true" /></a></div>
          <p className="hero-note">Free public access <span aria-hidden="true">·</span> No account required</p>
        </div>
        <dl className="hero-stats"><div><dt>Installable themes</dt><dd>31</dd></div><div><dt>Design resources</dt><dd>920</dd></div><div><dt>Public MCP tools</dt><dd>42</dd></div></dl>
      </section>
      <section className="connection-section" aria-label="Connect your agent">
        <div className="connection-copy"><p className="site-eyebrow">Connect your coding agent</p><h2>Your toolkit, one connection away.</h2><p>Choose your client and copy the setup. Then ask your agent to find a theme, build with its components and review the result.</p></div>
        <section className="config-panel" id="connect" aria-labelledby="connect-title">
          <div className="installation-heading"><h2 id="connect-title">Install Eidova</h2><p>Choose your client, copy the setup, and connect.</p></div>
          <div className="client-tabs" role="tablist" aria-label="Connection format">{clientOptions.map((label, index) => <Button key={label} id={'client-tab-' + index} role="tab" variant="ghost" aria-selected={client === index} aria-controls={client === index ? 'client-panel-' + index : undefined} tabIndex={client === index ? 0 : -1} onClick={() => setClient(index)} onKeyDown={event => tabKey(event, index)}>{label}</Button>)}</div>
          <div className="client-panel" id={'client-panel-' + client} role="tabpanel" aria-labelledby={'client-tab-' + client} tabIndex={0} key={client}>
            <p className="config-description">{setupDescription}</p>
            {client === 2||client===5 ? <Textarea id="mcp-endpoint" className="endpoint-input" aria-label="MCP server URL" value={selectedEndpoint} rows={2} readOnly spellCheck={false} onFocus={event => event.target.select()} /> : <pre><code>{setup}</code></pre>}
            <CopyButton value={setup}>{copyLabel}</CopyButton>
            <div className="config-footnote"><span aria-hidden="true">↳</span><p>{client<2?'Start a new client session after adding the server.':client===3||client===4?'Save the configuration and reload your client.':'Paste the URL into your client and connect.'}</p></div>
          </div>
          <details className="tool-options"><summary>Tool options</summary><div className="profile-picker" role="group" aria-label="MCP tool profile"><Button variant="ghost" aria-pressed={profile==='core'} onClick={()=>setProfile('core')}>Essentials · 13 tools</Button><Button variant="ghost" aria-pressed={profile==='full'} onClick={()=>setProfile('full')}>All tools</Button></div><p className="profile-note">Essentials uses less agent context. All tools adds private project rules and specialist guides.</p></details>
        </section>

      </section>
      <div className="platform-strip"><span>Built for the tools you already use.</span><div><span>Codex</span><span>Cursor</span><span>Claude Code</span><span className="platform-more">and other MCP clients</span></div></div>

      <section className="themes section" id="themes" aria-labelledby="themes-title">
        <div className="section-heading"><div><h2 id="themes-title">Explore all 31 themes.</h2><p>Browse every theme across eight design families. Open a preview to try the real components.</p></div><a className="text-link" href={serviceSourceUrl + '/tree/main/assets/registry'}>Explore the registry <span aria-hidden="true">↗</span></a></div>
        <div className="catalog-toolbar">
          <div className="search-field"><Search className="search-symbol" aria-hidden="true" /><Input ref={searchInput} id="theme-search" type="search" aria-label="Search themes" placeholder="Search themes, styles, or fonts…" value={query} onChange={event => { setQuery(event.target.value); }} />{query && <Button variant="ghost" className="clear-search" aria-label="Clear search" onClick={() => { setQuery(''); searchInput.current?.focus(); }}>Clear</Button>}</div>
          <div className="scheme-filter" role="group" aria-label="Original theme appearance">{(['all', 'light', 'dark'] as const).map(value => <Button key={value} variant="ghost" aria-pressed={scheme === value} onClick={() => { setScheme(value); }}>{value === 'all' ? 'All themes' : value === 'light' ? 'Light base' : 'Dark base'}</Button>)}</div>
        </div>
        <p className="result-count" role="status">{catalog.state === 'ready' ? 'Showing ' + visible.length + ' of ' + filtered.length + ' themes' : catalog.state === 'loading' ? 'Loading themes…' : 'Catalog unavailable'}</p>
        {catalog.state === 'loading' && <div className="catalog-message" role="status">Loading the theme catalog…</div>}
        {catalog.state === 'error' && <div className="catalog-message" role="alert"><h3>The catalog could not load.</h3><p>{catalog.message}</p><Button variant="outline" onClick={() => { setRetry(value => value + 1); searchInput.current?.focus(); }}>Retry loading themes</Button></div>}
        {catalog.state === 'ready' && filtered.length === 0 && <div className="catalog-message"><h3>{query ? 'No themes match “' + query + '”.' : 'No themes match this filter.'}</h3><p>Try another name, or clear the search and appearance filter.</p><Button variant="outline" onClick={resetSearch}>Clear search and filters</Button></div>}
        {catalog.state === 'ready' && visible.length > 0 && <div className="theme-grid">{visible.map(item => <article key={item.id} className={featuredIds.includes(item.id) ? 'theme-card theme-card-featured' : 'theme-card'}>
          <Button variant="ghost" className="theme-card-preview" aria-label={'Open '+item.title+': '+familyFor(item.id)?.title+' family preview'} aria-haspopup="dialog" onClick={event=>{previewTrigger.current=event.currentTarget;setPreview(item.id);}} style={paletteStyle(item.id, catalogThemes[item.id].scheme)}><img src={'/family-previews/' + (familyFor(item.id)?.representative ?? item.id) + '.png'} alt={familyFor(item.id)?.title + ' family component preview' } width={800} height={560} loading="lazy" decoding="async" /><span className="preview-family-label">{familyFor(item.id)?.title} family preview</span></Button>
          <div className="palette-strip" style={paletteStyle(item.id, catalogThemes[item.id]?.scheme ?? 'dark')} aria-hidden="true"><i /><i /><i /><i /></div>
          <div className="theme-card-info">
            <div className="theme-card-heading"><h3>{item.title}</h3><span className="scheme-label">{catalogThemes[item.id]?.scheme === 'dark' ? 'Dark base' : 'Light base'}</span></div>
            <p>{item.componentCount} components · {fontLabel(item.font)}</p>
            <p className="family-description">{featuredIds.includes(item.id)?familyFor(item.id)?.description:'Part of the '+familyFor(item.id)?.title+' family.'}</p>
            <div className="theme-card-links"><Button className="view-components" variant="outline" aria-label={'Preview theme: '+item.title} aria-haspopup="dialog" aria-expanded={preview===item.id} aria-controls="component-preview" onClick={event=>{previewTrigger.current=event.currentTarget;setPreview(item.id);}}>Preview theme</Button><a className="theme-token-link" href={registryOrigin + '/registry/' + encodeURIComponent(item.id) + '/globals.json'} aria-label={'View tokens: ' + item.title}>View tokens <ArrowUpRight aria-hidden="true" /></a></div>
          </div>
        </article>)}</div>}
        <dialog ref={previewDialog} className="component-preview" id="component-preview" aria-labelledby="component-preview-title" onCancel={()=>setPreview(null)} onClose={()=>{setPreview(null);if(previewTrigger.current?.isConnected)previewTrigger.current.focus();else searchInput.current?.focus();}}><div className="section-heading"><div><h2 id="component-preview-title" tabIndex={-1}>{preview?catalogThemes[preview].title+' preview':'Component preview'}</h2><p>{preview&&previewFamily&&preview!==previewFamily.representative?catalogThemes[preview].title+' is a '+previewFamily.title+' variant. This preview shows the family components.':'Try the real components. Changes here are sample data.'}</p></div><div className="preview-actions"><Button variant="outline" aria-expanded={showHandoff} aria-controls="theme-handoff" onClick={()=>setShowHandoff(value=>!value)}>{showHandoff?'Hide setup':'Use theme'}</Button><a className="text-link" href={'/?specimen='+encodeURIComponent(previewFamily?.representative??'linear')} target="_blank" rel="noreferrer">Open full preview</a><Button variant="outline" onClick={()=>setPreview(null)}>Close preview</Button></div></div>{previewFamily&&preview&&<div className={showHandoff?"preview-workspace with-handoff":"preview-workspace"}>
          <iframe key={preview} title={previewFamily.title+' component preview'} className="specimen-frame" src={'/?specimen='+encodeURIComponent(previewFamily.representative)} onLoad={previewLoaded} />
          <section className="theme-handoff" id="theme-handoff" aria-labelledby="theme-handoff-title" hidden={!showHandoff}>
            <h3 id="theme-handoff-title">Use {catalogThemes[preview].title}</h3>
            <dl className="theme-suitability"><div><dt>Best for</dt><dd>{previewFamily.useCases.join(', ')}.</dd></div><div><dt>Consider</dt><dd>{previewFamily.tradeoff}</dd></div></dl>
            <div className="handoff-prompt"><CopyButton value={designPrompt(preview)}>Copy agent prompt</CopyButton><details><summary>Project instructions</summary><Textarea aria-label="Agent prompt" value={designPrompt(preview)} rows={8} readOnly spellCheck={false} onFocus={event=>event.target.select()} /><div className="handoff-download"><a className="text-link" href={'/api/design-systems/'+encodeURIComponent(preview)+'/design.md'} download="DESIGN.md">Download DESIGN.md <ArrowDown aria-hidden="true" /></a><p>Save colors and rules with your project.</p></div></details></div>
          </section>
        </div>}</dialog>
        <p className="catalog-note">Component previews open in a separate viewer. <a href="/licenses/better-design-MIT.txt">Theme license</a>.</p>
      </section>

      <ResourceLibrary />

      <section className="workflow section" id="tools" aria-labelledby="tools-title">
        <div className="section-heading"><div><h2 id="tools-title">From a blank page to a better UI.</h2><p>A small set of tools for the decisions that matter.</p></div><span className="section-aside">Choose. Build. Review.</span></div>
        <div className="workflow-grid">{toolGroups.map(group => <article className="workflow-item" key={group.number}><span className="step-number">{group.number}<span aria-hidden="true"> /</span></span><h3>{group.title}</h3><p>{group.description}</p><div className="tool-names">{group.tools.map(tool => <code key={tool}>{tool}</code>)}</div></article>)}</div>
      </section>

      <section className="getting-started section" id="first-task" aria-labelledby="first-task-title">
        <div className="connect-copy"><h2 id="first-task-title">One connection.<br />Your next starting point.</h2><p>Add Eidova through MCP. No account required.</p><a className="text-link" href={serviceSourceUrl + '#run-locally'}>Prefer to run locally? <span aria-hidden="true">↗</span></a></div>
        <div><ol className="setup-steps"><li><span>01</span><div><strong>Add the server.</strong><p>Choose your client's setup format.</p></div></li><li><span>02</span><div><strong>Ask your agent to use Eidova.</strong><p>Choose a theme. Build. Review.</p></div></li></ol><details className="first-tasks"><summary>Try a first task</summary><ul><li>Find a distinctive design family for this screen and install only the components it needs.</li><li>Use my existing brand and improve this form.</li><li>Review this screen's copy, code and measured spacing.</li></ul></details></div>
      </section>

      <section className="ownership section" aria-labelledby="ownership-title"><div><h2 id="ownership-title">Open source.<br />On your terms.</h2></div><div><p>Run it on your machine or self-host. Read the source, adapt the registry, and edit the guidance.</p><p>Public access depends on hosting capacity. Hosted AI generation and vendor account services are outside this project.</p><a className="text-link" href={serviceSourceUrl}>Read the setup guide <span aria-hidden="true">↗</span></a></div></section>
    </main>
    <SiteFooter />
  </>;
}
