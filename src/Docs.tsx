import { SiteHeader, SiteFooter } from './App';
import { useAppearance } from './theme';
import { CopyButton } from './components/CopyButton';
import './docs.css';

const source = (import.meta.env.VITE_MCP_REPOSITORY_URL || 'https://github.com/pranav256/eidova-mcp') + '/blob/main/docs/';
const endpoint = (import.meta.env.VITE_MCP_URL || 'https://eidova-mcp.vercel.app/mcp').replace(/\/full\/?$/, '').replace(/\/$/, '');
const localCommands = [
  ['review-browser', 'Capture a local preview at 390, 1440 and 1728px in light and dark mode. Save screenshots, geometry findings, automated accessibility results and a ready-to-submit spacing-input.json.', 'http://127.0.0.1:5173'],
  ['preview-install', 'Use a project file inventory to see which files and dependencies a kit would add and which existing files may need merging.', 'minimal-light project-inventory.json button input'],
  ['diff-tokens', 'Compare two CSS files or two Eidova JSON token exports. See which values and aliases changed by mode.', 'before.css after.css'],
] as const;
const references = [
  ['AGENT-SETUP.md', 'Agent instructions', 'AGENTS.md starter, llms.txt index and downloadable client configurations.'],
  ['CLIENTS.md', 'Client setup', 'Configuration formats for Codex, Claude, Cursor and VS Code.'],
  ['API.md', 'API reference', 'Tool parameters, transports and runtime behavior.'],
  ['DESIGN-FAMILIES.md', 'Design families', 'The 31 themes, their uses and tradeoffs.'],
  ['BUNDLED-RESOURCES.md', 'Resource library', 'Original files, previews, downloads and licenses.'],
  ['CONTENT-LIBRARY.md', 'Guidance library', 'Read, edit and import principles and review rules.'],
  ['DTCG.md', 'Design tokens', 'Export tokens in a portable format.'],
  ['DEPLOYMENT.md', 'Run and deploy', 'Self-hosting, storage and configuration.'],
  ['RUNTIME-BOUNDARIES.md', 'Capabilities and limits', 'What runs locally, what is hosted and what is unavailable.'],
  ['REVIEW-QUALITY.md', 'Review quality gate', 'Negative and clean fixtures, profile coverage, incomplete evidence and known limits.'],
];

export function Docs() {
  const { theme, toggleTheme } = useAppearance();
  return <><a className="skip-link" href="#main">Skip to documentation</a><SiteHeader theme={theme} onToggleTheme={toggleTheme} />
    <main id="main" className="docs-main">
      <header className="docs-heading"><h1>Documentation</h1><p>Connect your agent, build with the toolkit, and find the reference you need.</p></header>
      <nav className="docs-navigation" aria-label="Documentation sections"><a href="#quick-start">Quick start</a><a href="#workflow">Build workflow</a><a href="#review-evidence">Review evidence</a><a href="#local-commands">Browser capture</a><a href="#reference">Reference</a><a href="/showcase#tool-directory">All tools</a></nav>
      <section id="quick-start" className="docs-start" aria-labelledby="quick-start-title"><div><h2 id="quick-start-title">Connect in one step</h2><p>Use /mcp for 13 essential tools. For all 41 public tools, connect to /mcp/full.</p><a href="/#connect">Choose a client or tool profile</a></div><div className="docs-command"><p>Codex</p><pre><code>{'codex mcp add eidova --url ' + endpoint}</code></pre><CopyButton value={'codex mcp add eidova --url ' + endpoint}>Copy Codex command</CopyButton></div></section>
      <section id="workflow" className="docs-workflow" aria-labelledby="workflow-title"><h2 id="workflow-title">Build workflow</h2><ol><li><h3>Choose the foundation</h3><p>Keep your brand. Use <code>find-design-system</code> and <code>get-design-system-kit</code> to retrieve the real components you need.</p></li><li><h3>Read the guidance</h3><p>Load <code>get-ui-principle</code> before styling and <code>get-ux-principle</code> before changing behavior.</p></li><li><h3>Build and review</h3><p>Review source with <code>review-ui-code</code>, copy with <code>check-comprehension</code>, and rendered DOM with <code>inspect-spacing</code>. Fix critical and serious findings.</p></li></ol></section>
      <section id="review-evidence" className="docs-workflow" aria-labelledby="review-evidence-title">
        <h2 id="review-evidence-title">Know what was checked</h2>
        <ol>
          <li><h3>Source findings</h3><p><code>review-ui-code</code> checks supplied source for missing names and labels, click targets without keyboard support, and explicit low-contrast color pairs. Findings include a location and fix.</p><p>A clean result means “No deterministic issues found in the supplied source.” Dynamic labels, inherited colors and actual behavior remain unverified.</p></li>
          <li><h3>Measured geometry</h3><p><code>inspect-spacing</code> measures captured DOM geometry. Capture 390, 1440 and 1728px and declare the states needed for the task. Missing widths, states or empty captures produce a partial report.</p><p>A geometry score counts finding penalties. It is withheld for incomplete evidence and never rates overall visual quality.</p></li>
          <li><h3>Human review</h3><p>Inspect screenshots for hierarchy and appearance. Use a keyboard and complete the task, including failure and recovery. Check dynamic labels, computed contrast and interactive states.</p><p>Keep source findings, geometry measurements and these human checks separate in your handoff.</p></li>
        </ol>
        <p><a href={source + 'REVIEW-QUALITY.md'}>Read the fixture results and review limits</a></p>
        <details><summary>Kit handoff and icon tools</summary><p>HTML kits lead with required setup. CSS, examples and policies remain in machine-readable fields; use <code>detail: "full"</code> for complete guidance.</p><p><code>find-icons</code> and <code>get-icon-files</code> belong to Full at <code>/mcp/full</code>. Reconnect after switching. In Core, keep embedded kit icons, use text labels and omit extra decorative icons. Call only tools returned by your connection.</p></details>
      </section>
      <section id="local-commands" className="docs-local" aria-labelledby="local-commands-title">
        <h2 id="local-commands-title">Local commands</h2>
        <p>Build the Eidova MCP checkout and run these examples from its root. Each command gives your agent or CI a JSON result.</p>
        <p><a href={source + 'AGENT-SETUP.md#local-review-commands'}>Read browser setup and input examples</a></p>
        <div className="docs-local-examples">
          {localCommands.map(([name, description, args]) => {
            const command = `node dist/stdio.js ${name} ${args}`;
            return <div className="docs-command" key={name}>
              <h3>{name}</h3>
              <p>{description}</p>
              <pre><code>{command}</code></pre>
              <CopyButton value={command}>{`Copy ${name} command`}</CopyButton>
            </div>;
          })}
        </div>
      </section>
      <section className="docs-local" aria-labelledby="capture-states-title"><h2 id="capture-states-title">Capture the states your task needs</h2>
        <p>The local command captures the default page and keyboard focus. For task-specific states, save a state plan such as <code>review-states.json</code>. Each state starts from a fresh page; the browser captures the data for you.</p>
        <details className="docs-local-examples"><summary>Example: default, menu open and keyboard focus</summary>
          <div className="docs-command"><pre><code>{JSON.stringify([{name:'default',steps:[]},{name:'menu-open',steps:[{action:'click',selector:'#menu-trigger'}]},{name:'keyboard-focus',steps:[{action:'focus',selector:'#email'}]}],null,2)}</code></pre><pre><code>node dist/stdio.js review-browser http://127.0.0.1:5173 --states review-states.json</code></pre></div>
          <p>Replace the example selectors with controls on your page. Actions support click, hover, focus and key presses. Read the report’s coverage and remaining human checks. Submit the generated <code>spacing-input.json</code> as the arguments to <code>inspect-spacing</code>; no capture-data editing is needed.</p>
        </details>
        <p>Use a local page with test data. The hosted MCP cannot open a browser. With another browser tool, request <code>inspect-spacing</code> without states, evaluate its capture script at the recommended widths, and submit the resulting snapshots.</p>
      </section>
      <section id="reference" className="docs-reference" aria-labelledby="reference-title"><h2 id="reference-title">Reference</h2><p>Detailed project documents open in the source repository.</p><ul>{references.map(([file, title, description]) => <li key={file}><h3><a href={source + file}>{title}</a></h3><p>{description}</p></li>)}</ul><a href={source.replace('/blob/main/docs/', '/tree/main/docs')}>Browse every project document</a></section>
    </main><SiteFooter /></>;
}
