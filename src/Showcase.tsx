import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import { SiteHeader, SiteFooter } from './App';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Textarea } from './components/ui/textarea';
import { CopyButton } from './components/CopyButton';
import { ResourceLibrary } from './ResourceLibrary';
import { catalogThemes, useAppearance } from './theme';
import families from './design-families.json';
import data from './showcase-data.json';
import resourceCatalog from './resource-catalog.json';
import './showcase.css';

const chapters = [['components','Components'],['foundations','Foundations'],['icons','Icons'],['interactions','Interactions'],['copy-lab','Copy lab'],['guidance','Guides'],['resources','Resources'],['workflows','Workflows'],['tool-directory','Tool directory']];
const tokenNames = ['--background','--foreground','--primary','--primary-foreground','--secondary','--muted-foreground','--border','--radius'];
type Finding = { severity: string; problem: string; fix: string };
type CopyReview = { verdict: 'pass' | 'revise'; words: number; estimatedExplainSeconds: number; findings: Finding[] };

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  return <span aria-hidden="true" className="showcase-icon" style={{ maskImage: `url(/showcase/icons/${name}.svg)`, width: size, height: size }} />;
}

function Chapter({ number, title, description, tool }: { number: string; title: string; description: string; tool: string }) {
  return <div className="showcase-chapter"><div><p className="showcase-eyebrow">{number} / {tool}</p><h2>{title}</h2><p>{description}</p></div></div>;
}

function FormDemo() {
  const [fail, setFail] = useState(false);
  const [status, setStatus] = useState<'idle' | 'error' | 'success'>('idle');
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(fail ? 'error' : 'success');
    setFail(false);
  }
  return <article className="showcase-panel form-demo">
    <div className="showcase-panel-heading"><Icon name="accessibility" /><span>Try the whole task</span></div>
    <h3>Prepare an invitation</h3><p>Demo only. Nothing is sent.</p>
    <form onSubmit={submit}>
      <label htmlFor="demo-name">Teammate’s name<Input id="demo-name" name="name" autoComplete="off" defaultValue="Maya Chen" required maxLength={100} /></label>
      <label htmlFor="demo-email">Email address<Input id="demo-email" name="email" type="email" placeholder="maya@example.com" autoComplete="off" required maxLength={254} /></label>
      <Button type="button" variant="outline" role="switch" aria-checked={fail} onClick={() => { setFail(value => !value); setStatus('idle'); }}><Icon name={fail ? 'check' : 'x'} />Make the next attempt fail</Button>
      <Button type="submit">{status === 'error' ? 'Try again' : 'Prepare invitation'}<Icon name="move-right" /></Button>
      <p className="showcase-feedback" role={status === 'error' ? 'alert' : 'status'}>{status === 'error' ? 'The example could not save. Your details are kept. Try again.' : status === 'success' ? 'Demo invitation prepared. Your details are still available.' : 'Required fields are checked before the demo continues.'}</p>
    </form>
  </article>;
}

function MotionDemo() {
  const [moved, setMoved] = useState(false);
  const [duration, setDuration] = useState('250');
  return <article className="showcase-panel motion-demo">
    <div className="showcase-panel-heading"><Icon name="zap" /><span>Feedback with a purpose</span></div>
    <h3>A transition you can interrupt</h3><p>Change direction before it finishes. The object responds from its current position.</p>
    <div className="showcase-motion-stage" style={{ '--demo-duration': duration + 'ms' } as CSSProperties}><div className={'showcase-motion-object' + (moved ? ' is-moved' : '')}><Icon name="layers" size={28} /></div><div className="showcase-motion-labels"><span>Start</span><span>Finish</span></div></div>
    <div className="showcase-controls"><label htmlFor="motion-duration">Duration<select id="motion-duration" value={duration} onChange={event => setDuration(event.target.value)}><option value="150">150 ms · Quick</option><option value="250">250 ms · Balanced</option><option value="450">450 ms · Deliberate</option></select></label><Button variant="outline" onClick={() => setMoved(value => !value)}>{moved ? 'Move to start' : 'Move to finish'}</Button></div>
    <p className="showcase-feedback" role="status">{moved ? 'Object at finish.' : 'Object at start.'} System reduced-motion preferences are respected.</p>
  </article>;
}

function CopyLab() {
  const [draft, setDraft] = useState({ headline: 'Bring your next idea to life.', body: 'Choose a design family, try its components, and make the interface your own.', action: 'Explore components' });
  const [review, setReview] = useState<CopyReview | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const controller = useRef<AbortController | null>(null);
  useEffect(() => {
    controller.current?.abort(); setPending(false); setReview(null); setError('');
    return () => controller.current?.abort();
  }, [draft]);
  async function submit(event: FormEvent) {
    event.preventDefault(); controller.current?.abort();
    const request = new AbortController(); controller.current = request;
    let timedOut = false;
    const timer = window.setTimeout(() => { timedOut = true; request.abort(); }, 15000);
    setPending(true); setError(''); setReview(null);
    try {
      const response = await fetch('/api/showcase/mcp', { method: 'POST', signal: request.signal, headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream', 'MCP-Protocol-Version': '2025-03-26' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'check-comprehension', arguments: { screen: 'Showcase copy lab', headline: draft.headline, body: draft.body ? [draft.body] : [], actions: [draft.action] } } }) });
      if (!response.ok) throw new Error();
      const value = await response.json();
      const result = value?.result?.structuredContent;
      if (value.error || value.result?.isError || !result || !['pass','revise'].includes(result.verdict) || !Number.isFinite(result.words) || result.words < 0 || !Number.isFinite(result.estimatedExplainSeconds) || result.estimatedExplainSeconds < 0 || !Array.isArray(result.findings) || result.findings.length > 50 || !result.findings.every((finding: Finding) => finding && ['critical','serious','moderate'].includes(finding.severity) && typeof finding.problem === 'string' && typeof finding.fix === 'string' && finding.problem.length <= 4000 && finding.fix.length <= 4000)) throw new Error();
      if (!request.signal.aborted) setReview(result);
    } catch {
      if (!request.signal.aborted || timedOut) setError(timedOut ? 'The review took too long. Your draft is kept. Try again.' : 'Eidova could not review this draft. Your text is kept. Try again.');
    } finally {
      window.clearTimeout(timer);
      if (controller.current === request) setPending(false);
    }
  }
  return <section className="showcase-section" id="copy-lab">
    <Chapter number="05" title="Make the next step unmistakable." description="Write a small screen. Ask Eidova to review the words, then refine your draft." tool="Copy & comprehension" />
    <div className="showcase-two-column">
      <form className="showcase-panel showcase-copy-form" onSubmit={submit}>
        <h3>Your draft</h3><label htmlFor="copy-headline">Headline<Input id="copy-headline" value={draft.headline} onChange={event => setDraft({ ...draft, headline: event.target.value })} required maxLength={300} /></label>
        <label htmlFor="copy-body">Supporting copy<Textarea id="copy-body" value={draft.body} onChange={event => setDraft({ ...draft, body: event.target.value })} rows={4} maxLength={1600} /></label>
        <label htmlFor="copy-action">Primary action<Input id="copy-action" value={draft.action} onChange={event => setDraft({ ...draft, action: event.target.value })} required maxLength={120} /></label>
        <p className="showcase-small">Only these fields are sent to the connected Eidova server. Keep private information out of your example.</p>
        <Button type="submit" disabled={pending} aria-busy={pending}>Review copy<Icon name="sparkles" /></Button>
        {error && <p role="alert">{error}</p>}
      </form>
      <div className="showcase-copy-result">
        <div className="showcase-copy-preview"><span className="showcase-eyebrow">Screen preview</span><h3>{draft.headline || 'Your headline'}</h3><p>{draft.body}</p><span className="showcase-preview-action">{draft.action || 'Your action'}<Icon name="move-right" /></span></div>
        <div className="showcase-review-result" aria-live="polite" aria-busy={pending}>{review ? <><div className="showcase-panel-heading"><Icon name={review.verdict === 'pass' ? 'check' : 'circle-help'} /><h3>{review.verdict === 'pass' ? 'Copy check passed' : 'Refine this draft'}</h3></div><p>{review.words} words · About {review.estimatedExplainSeconds} seconds to explain</p>{review.findings.length ? <ul>{review.findings.map((finding, index) => <li key={index}><strong>{finding.problem}</strong><p>{finding.fix}</p></li>)}</ul> : <p>No blocking copy findings. Read it aloud once before using it.</p>}</> : <><h3>{pending ? 'Eidova is reading your draft.' : 'A review, grounded in your words.'}</h3><p>{pending ? 'Your draft stays here while the check runs.' : 'The result will explain unclear language, competing actions, and the reading budget.'}</p></>}</div>
        <p className="showcase-small">This is a text heuristic. It does not assess the rendered design or replace feedback from people.</p>
        <details className="showcase-request"><summary>Use this draft with your agent</summary><pre>{JSON.stringify({ name: 'check-comprehension', arguments: { screen: 'My screen', headline: draft.headline, body: [draft.body], actions: [draft.action] } }, null, 2)}</pre><CopyButton value={JSON.stringify({ name: 'check-comprehension', arguments: { screen: 'My screen', headline: draft.headline, body: [draft.body], actions: [draft.action] } }, null, 2)} variant="outline">Copy tool request</CopyButton></details>
      </div>
    </div>
  </section>;
}

function IconExplorer() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState('layers');
  const [size, setSize] = useState('24');
  const icons = data.icons.filter(icon => icon.name.includes(query.toLowerCase().trim()));
  const icon = data.icons.find(icon => icon.name === selected)!;
  return <section className="showcase-section" id="icons">
    <Chapter number="03" title="Small details. A shared language." description="Find a familiar symbol, inspect its source, and keep a consistent icon vocabulary." tool="Icon discovery & source" />
    <div className="showcase-icon-workbench">
      <div><label className="showcase-field" htmlFor="icon-search">Find an icon<Input id="icon-search" type="search" placeholder="Try search, palette, or layers" value={query} onChange={event => setQuery(event.target.value)} /></label><p className="showcase-small" role="status">{icons.length} of {data.icons.length} example icons</p><div className="showcase-icon-grid">{icons.map(icon => <Button key={icon.name} variant="outline" aria-label={'Select ' + icon.name + ' icon'} aria-pressed={selected === icon.name} onClick={() => setSelected(icon.name)}><Icon name={icon.name} size={24} /><span>{icon.name}</span></Button>)}</div>{!icons.length && <div className="showcase-empty"><h3>No matching icons</h3><p>Try a shorter name or browse the examples again.</p><Button variant="outline" onClick={() => setQuery('')}>Clear icon search</Button></div>}</div>
      <aside className="showcase-panel showcase-icon-detail"><span className="showcase-eyebrow">Selected icon</span><div className="showcase-icon-specimen"><Icon name={selected} size={Number(size)} /></div><h3>{selected}</h3><label htmlFor="icon-size">Preview size<select id="icon-size" value={size} onChange={event => setSize(event.target.value)}>{[16,24,32,48].map(value => <option key={value} value={value}>{value} px</option>)}</select></label><dl className="showcase-definition"><div><dt>Library</dt><dd>Lucide</dd></div><div><dt>Source</dt><dd>SVG · 24 × 24 viewBox</dd></div><div><dt>Use</dt><dd>Pair action icons with a clear label.</dd></div></dl><CopyButton value={icon.svg} variant="outline">Copy SVG source</CopyButton><details><summary>Inspect the original SVG</summary><pre>{icon.svg}</pre><a className="text-link" href="/showcase/icons/LICENSE.txt">Read icon licenses</a></details></aside>
    </div>
  </section>;
}

function GuidanceDesk() {
  const [selected, setSelected] = useState(0);
  const guide = data.guides[selected];
  return <section className="showcase-section" id="guidance">
    <Chapter number="06" title="Good judgment travels across platforms." description="Explore guidance for web, mobile, storefronts, media, and interactive experiences." tool="Guidance library" />
    <div className="showcase-two-column"><div className="showcase-prose"><h3>The right advice for the next decision</h3><p>A design system sets the foundation. Guidance helps decide what belongs on the screen, how people move through it, and what to do when a task fails.</p><p>Eidova separates visual principles from interaction principles. Platform guides add the constraints that matter in their environment: mobile safe areas, dynamic text, storefront sections, canvas performance, and readable media.</p><ul className="showcase-check-list"><li><Icon name="check" />Start with the product’s existing conventions.</li><li><Icon name="check" />Ask for guidance tied to the actual task.</li><li><Icon name="check" />Verify it in the environment where it will run.</li></ul><a className="text-link" href="/#connect">Connect your agent<Icon name="arrow-up-right" /></a></div><article className="showcase-panel showcase-guide"><label htmlFor="guide-topic">Explore a guide<select id="guide-topic" value={selected} onChange={event => setSelected(Number(event.target.value))}>{data.guides.map((item, index) => <option key={item.name} value={index}>{item.title}</option>)}</select></label><h3>{guide.title}</h3><p className="showcase-small">An excerpt from Eidova’s current guidance.</p><pre tabIndex={0} aria-label={guide.title + ' guidance'}>{guide.text}</pre><CopyButton value={guide.text} variant="outline">Copy guidance</CopyButton></article></div>
  </section>;
}

function ToolDirectory() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All tools');
  const [limit, setLimit] = useState(8);
  const search = useRef<HTMLInputElement>(null);
  const tools = data.tools.filter(tool => (category === 'All tools' || tool.category === category) && (tool.name + ' ' + tool.description).toLowerCase().includes(query.toLowerCase().trim()));
  return <section className="showcase-section" id="tool-directory">
    <Chapter number="08" title="The complete toolbox, open for inspection." description="Browse the tools this public MCP exposes. Read their purpose and the inputs they accept." tool="Tool reference" />
    <div className="showcase-controls showcase-directory-controls"><label htmlFor="tool-search">Search the tools<Input ref={search} id="tool-search" type="search" placeholder="Try review, tokens, or motion" value={query} onChange={event => { setQuery(event.target.value); setLimit(8); }} /></label><label htmlFor="tool-category">Category<select id="tool-category" value={category} onChange={event => { setCategory(event.target.value); setLimit(8); }}>{['All tools',...new Set(data.tools.map(tool => tool.category))].map(value => <option key={value}>{value}</option>)}</select></label></div>
    <p className="showcase-small" role="status">Showing {Math.min(limit, tools.length)} of {tools.length} tools · Public profile v{data.version}</p>
    <div className="showcase-tool-grid">{tools.slice(0, limit).map(tool => <details className="showcase-tool" key={tool.name}><summary><code>{tool.name}</code><span>{tool.category}</span></summary><p>{tool.description}</p><h3>Inputs</h3>{tool.parameters.length ? <dl className="showcase-parameters">{tool.parameters.map(parameter => <div key={parameter.name}><dt><code>{parameter.name}</code></dt><dd>{parameter.type} · {parameter.required ? 'Required' : 'Optional'}{parameter.choices.length > 0 && <span>{parameter.choices.join(', ')}</span>}</dd></div>)}</dl> : <p>This tool needs no inputs.</p>}<CopyButton value={tool.name} variant="outline">Copy tool name</CopyButton></details>)}</div>
    {!tools.length && <div className="showcase-empty"><h3>No matching tools</h3><p>Try another name or remove the category filter.</p><Button variant="outline" onClick={() => { setQuery(''); setCategory('All tools'); search.current?.focus(); }}>Clear tool filters</Button></div>}
    {tools.length > limit && <div className="showcase-more"><Button variant="outline" onClick={() => setLimit(value => value + 12)}>Show more tools</Button></div>}
  </section>;
}

export function Showcase() {
  const { theme, toggleTheme } = useAppearance();
  const [familyId, setFamilyId] = useState(() => { const value = new URLSearchParams(location.search).get('family'); return families.some(family => family.representative === value) ? value! : 'minimal-light'; });
  const [token, setToken] = useState('--primary');
  const [paletteMode, setPaletteMode] = useState<'light' | 'dark'>('light');
  const family = families.find(item => item.representative === familyId)!;
  const palette = catalogThemes[familyId].modes[paletteMode];
  const exportedTokens = ':root {\n' + Object.entries(palette.tokens).map(([name, value]) => `  ${name}: ${value};`).join('\n') + '\n}';
  useEffect(() => { document.title = 'Eidova Showcase — Design tools, in practice'; }, []);
  function selectFamily(value: string) { setFamilyId(value); const url = new URL(location.href); url.searchParams.set('family', value); history.replaceState(null, '', url); }
  return <>
    <a className="skip-link" href="#showcase-main">Skip to showcase</a><SiteHeader theme={theme} onToggleTheme={toggleTheme} />
    <main className="showcase-main" id="showcase-main" tabIndex={-1}>
      <section className="showcase-hero">
        <div><p className="showcase-eyebrow"><Icon name="sparkles" />Eidova / The interactive showcase</p><h1>Your agent’s design toolkit.</h1><p>Build with real components. Carry your brand forward. Review the result. Explore the tools and source behind each step.</p><div className="showcase-hero-actions"><Button asChild size="lg"><a href="#components">Enter the playground<Icon name="move-right" /></a></Button><a className="text-link" href="#tool-directory">Explore the tools<Icon name="arrow-up-right" /></a></div><p className="showcase-small">Free public access. No account required.</p></div>
        <figure className="showcase-hero-preview"><figcaption><span><Icon name="layers" />Neutral / Component specimen</span><a href="/?specimen=minimal-light">Open preview<Icon name="arrow-up-right" /></a></figcaption><img src="/family-previews/minimal-light.png" alt="Actual Neutral workspace form with clean sans-serif typography and light controls" fetchPriority="high" /><div className="showcase-preview-caption"><span>Source, material, and behavior.</span><span>One coherent system.</span></div></figure>
      </section>
      <dl className="showcase-stats"><div><dt>Distinct design families</dt><dd>08</dd></div><div><dt>Installable theme IDs</dt><dd>31</dd></div><div><dt>Bundled resources</dt><dd>{data.library.total}</dd></div><div><dt>Public MCP tools</dt><dd>{data.publicTools}</dd></div></dl>
      <nav className="showcase-chapter-nav" aria-label="Showcase chapters">{chapters.map(([id, name]) => <a key={id} href={'#' + id}>{name}</a>)}</nav>

      <section className="showcase-section showcase-overview" aria-labelledby="capabilities-title">
        <div className="showcase-chapter"><h2 id="capabilities-title">From first idea to reviewed interface.</h2></div>
        <ul className="showcase-capabilities">
          {[
            { id: 'components', icon: 'layout-template', title: 'Build with real components', description: 'Try eight design families. Inspect the controls and take their source into your project.', href: '#components' },
            { id: 'foundations', icon: 'palette', title: 'Carry your brand forward', description: 'Inspect exact tokens, export a palette, and keep design decisions with your project.', href: '#foundations' },
            { id: 'copy-lab', icon: 'eye', title: 'Review the result', description: 'Check a draft live. Explore tools for reviewing code, copy, and rendered spacing.', href: '#copy-lab' },
            { id: 'resources', icon: 'file-code', title: 'Find the design you need', description: `Browse ${resourceCatalog.entries.length} systems, templates, plugins and skills. Preview a design, then use its files.`, href: '#resources' },
            { id: 'guidance', icon: 'book-open', title: 'Design for more platforms', description: 'Read guidance for mobile, Shopify, Three.js, and motion before building in your agent.', href: '#guidance' },
            { id: 'studio', icon: 'layers', title: 'Bring the team into the work', description: 'Open the separate team file workspace. Collaboration needs a configured Studio backend.', href: '/studio' },
          ].map(item => <li key={item.id}><a href={item.href}><Icon name={item.icon} size={24} /><h3 id={'capability-' + item.id}>{item.title}</h3><p>{item.description}</p><span className="showcase-capability-link">{item.id === 'studio' ? 'Open team workspace' : 'Explore this capability'}<Icon name="arrow-up-right" /></span></a></li>)}
        </ul>
      </section>

      <section className="showcase-section" id="components">
        <Chapter number="01" title="A family is more than a palette." description="Switch the foundation. Compare its typography, spacing, surfaces, and working controls." tool="Design systems & components" />
        <div className="showcase-component-layout"><div className="showcase-family-info"><label className="showcase-field" htmlFor="design-family">Design family<select id="design-family" value={familyId} onChange={event => selectFamily(event.target.value)}>{families.map(item => <option key={item.id} value={item.representative}>{item.title}</option>)}</select></label><h3>{family.title}</h3><p>{family.description}</p><dl className="showcase-definition"><div><dt>Best for</dt><dd>{family.useCases.join(', ')}</dd></div><div><dt>Consider</dt><dd>{family.tradeoff}</dd></div><div><dt>Signature</dt><dd>{family.axes.join(', ')}</dd></div></dl><a className="text-link" href={'/?specimen=' + familyId}>Open the complete specimen<Icon name="arrow-up-right" /></a><a className="text-link" href={'/api/design-systems/' + familyId + '/design.md'} download="DESIGN.md">Download its design guide<Icon name="download" /></a><p className="showcase-small">The specimen uses the family’s native appearance. The website’s appearance switch controls this surrounding page.</p></div><div className="showcase-component-preview"><div className="showcase-panel-heading"><Icon name="layout-template" /><span>{family.title} / Workspace settings</span><span className="showcase-live-label">Interactive example</span></div><iframe key={familyId} src={'/?specimen=' + familyId + '&example=details'} title={family.title + ' interactive components'} loading="lazy" /></div></div>
        <div className="showcase-family-gallery">{families.map(item => <a className="showcase-family-card" key={item.id} href={'/?specimen=' + item.representative}><img src={'/family-previews/' + item.representative + '.png'} alt={item.title + ' actual component specimen'} loading="lazy" /><div><h3>{item.title}</h3><Icon name="arrow-up-right" /></div><p>{item.axes.slice(0, 2).join(' · ')}</p></a>)}</div>
      </section>

      <section className="showcase-section" id="foundations">
        <Chapter number="02" title="Inspect the decisions underneath." description="Explore exact values from the installed palettes. Copy one token or take the whole foundation." tool="Tokens & handoff" />
        <div className="showcase-token-workbench"><div className="showcase-token-browser"><div className="showcase-controls"><label htmlFor="token-name">Token<select id="token-name" value={token} onChange={event => setToken(event.target.value)}>{tokenNames.map(name => <option key={name}>{name}</option>)}</select></label><label htmlFor="palette-mode">Palette appearance<select id="palette-mode" value={paletteMode} onChange={event => setPaletteMode(event.target.value as 'light' | 'dark')}><option value="light">Light</option><option value="dark">Dark</option></select></label></div><div className="showcase-token-value"><span>{family.title} / {token}</span><code>{palette.tokens[token]}</code><CopyButton value={`${token}: ${palette.tokens[token]};`} variant="outline">Copy token</CopyButton></div><div className="showcase-swatch-grid">{tokenNames.filter(name => name !== '--radius').map(name => <div key={name}><span style={{ background: palette.tokens[name] }} /><code>{name}</code></div>)}</div><p className="showcase-small">{palette.adapted ? 'This appearance is adapted for the website. The original component specimen is separate.' : 'These values come from the installed palette.'}</p></div><div className="showcase-token-source"><div className="showcase-panel-heading"><Icon name="file-code" /><span>CSS / {family.title}</span></div><pre tabIndex={0} aria-label={family.title + ' palette CSS'}>{exportedTokens}</pre><CopyButton value={exportedTokens} variant="outline">Copy palette CSS</CopyButton></div></div>
        <div className="showcase-explain-grid"><article><Icon name="palette" /><h3>Semantic color</h3><p>Name colors by their role. A primary action, a quiet surface, and a divider should remain understandable when the palette changes.</p></article><article><Icon name="type" /><h3>A deliberate type hierarchy</h3><p>Use a few clear roles for titles, body text, labels, and data. Inspect real text wrapping alongside the chosen font.</p></article><article><Icon name="sliders-horizontal" /><h3>Portable decisions</h3><p>Keep the values and design guide with the project. Your next agent session should inherit the same foundation.</p></article></div>
      </section>

      <IconExplorer />
      <section className="showcase-section" id="interactions"><Chapter number="04" title="The experience lives between the states." description="Try validation, recover from a failed attempt, and interrupt a transition with your keyboard." tool="Interaction design" /><div className="showcase-two-column"><FormDemo /><MotionDemo /></div><div className="showcase-explain-grid"><article><h3>Useful constraints</h3><p>A label describes what to enter. Required fields and email validation catch mistakes before the demo proceeds.</p></article><article><h3>Recovery without starting over</h3><p>A failure explains the next step and keeps your input. The next attempt can finish the same task.</p></article><article><h3>Movement that explains</h3><p>A short transition makes the state change visible. Repeated input and reduced-motion preferences remain part of the experience.</p></article></div></section>
      <CopyLab />
      <GuidanceDesk />
      <div className="showcase-library"><ResourceLibrary /></div>
      <section className="showcase-section" id="workflows"><Chapter number="07" title="Put the tools together." description="Follow a concrete sequence for the kind of interface you want to build." tool="Practical workflows" /><div className="showcase-path-grid">{[
        { title: 'Start a product screen', icon: 'layout-template', steps: [['Keep or choose the system','Read the existing design, then discover a suitable family if the product needs a foundation.'],['Install the needed components','Use the actual kit and source. Start with the controls this screen requires.'],['Review the working result','Check the words and source, then measure the rendered spacing.']], tools: ['find-design-system','get-design-system-kit','get-ui-principle','inspect-spacing'] },
        { title: 'Improve a difficult form', icon: 'accessibility', steps: [['Define the smallest task','Keep labels, input, and feedback together. Explain the formats people need.'],['Try failure and recovery','Submit missing values, retry a failed attempt, and verify that useful input stays intact.'],['Make the next step clear','Review action labels and error copy, then complete the task with a keyboard.']], tools: ['get-ux-principle','check-comprehension','review-ui-code'] },
        { title: 'Build a thoughtful storefront', icon: 'book-open', steps: [['Understand the platform','Read Shopify guidance before changing sections, product forms, or cart behavior.'],['Show the product clearly','Keep useful copy beside the product image. Preserve navigation and purchase context.'],['Verify real shopping states','Check variants, unavailable items, errors, and small-screen reading order.']], tools: ['get-shopify-guide','get-ui-principle','get-review-rules'] },
      ].map(path => <article className="showcase-path" key={path.title}><Icon name={path.icon} size={28} /><h3>{path.title}</h3><ol>{path.steps.map(([title, body]) => <li key={title}><h4>{title}</h4><p>{body}</p></li>)}</ol><details><summary>Tools in this sequence</summary>{path.tools.map(name => <code key={name}>{name}</code>)}</details></article>)}</div></section>
      <ToolDirectory />
      <section className="showcase-section showcase-closing"><div><p className="showcase-eyebrow">A foundation for your next project</p><h2>Take the tools into your own work.</h2><p>Connect Eidova, bring your brief, and ask your agent to build with the design you already have.</p><a className="text-link" href="/#connect">See the installation guide<Icon name="arrow-up-right" /></a></div><div className="showcase-closing-notes"><h3>What this showcase demonstrates</h3><p>Installed component source, exact palette values, bundled icons, original guidance, resource files, and a live text review.</p><h3>What still needs your judgment</h3><p>The tools support design decisions. Their source and text checks do not certify usability, accessibility, or visual quality. Test the interface in the context where people will use it.</p><details><summary>How this showcase was built</summary><p>The current local Eidova MCP supplied the kits, guidance, icon SVGs, tool inventory, and review checks. React and the browser implement the examples. Source notices and resource licenses remain available.</p><a className="text-link" href="/showcase/mcp-usage.json">Read the MCP usage record<Icon name="arrow-up-right" /></a></details></div></section>
    </main><SiteFooter />
  </>;
}
