import { SiteHeader, SiteFooter } from './App';
import { useAppearance } from './theme';
import { CopyButton } from './components/CopyButton';
import './docs.css';

const source = (import.meta.env.VITE_MCP_REPOSITORY_URL || 'https://github.com/pranav256/eidova-mcp') + '/blob/main/docs/';
const endpoint = (import.meta.env.VITE_MCP_URL || 'https://open-design-mcp-liard.vercel.app/mcp').replace(/\/core\/?$/, '').replace(/\/$/, '') + '/core';
const references = [
  ['CLIENTS.md', 'Client setup', 'Configuration formats for Codex, Claude, Cursor and VS Code.'],
  ['API.md', 'API reference', 'Tool parameters, transports and runtime behavior.'],
  ['DESIGN-FAMILIES.md', 'Design families', 'The 31 themes, their uses and tradeoffs.'],
  ['BUNDLED-RESOURCES.md', 'Resource library', 'Original files, previews, downloads and licenses.'],
  ['CONTENT-LIBRARY.md', 'Guidance library', 'Read, edit and import principles and review rules.'],
  ['DTCG.md', 'Design tokens', 'Export tokens in a portable format.'],
  ['STUDIO.md', 'Team workspace', 'Project ownership, sharing and recovery.'],
  ['DEPLOYMENT.md', 'Run and deploy', 'Self-hosting, storage and configuration.'],
  ['RUNTIME-BOUNDARIES.md', 'Capabilities and limits', 'What runs locally, what is hosted and what is unavailable.'],
];

export function Docs() {
  const { theme, toggleTheme } = useAppearance();
  return <><a className="skip-link" href="#main">Skip to documentation</a><SiteHeader theme={theme} onToggleTheme={toggleTheme} />
    <main id="main" className="docs-main">
      <header className="docs-heading"><h1>Documentation</h1><p>Connect your agent, build with the toolkit, and find the reference you need.</p></header>
      <nav className="docs-navigation" aria-label="Documentation sections"><a href="#quick-start">Quick start</a><a href="#workflow">Build workflow</a><a href="#reference">Reference</a><a href="/showcase#tool-directory">All tools</a></nav>
      <section id="quick-start" className="docs-start" aria-labelledby="quick-start-title"><div><h2 id="quick-start-title">Connect in one step</h2><p>Add the public essentials server URL. It exposes 13 tools for themes, resources, guidance and review.</p><a href="/#connect">Choose another client or the full tool set</a></div><div className="docs-command"><p>Codex</p><pre><code>{'codex mcp add eidova --url ' + endpoint}</code></pre><CopyButton value={'codex mcp add eidova --url ' + endpoint}>Copy Codex command</CopyButton></div></section>
      <section id="workflow" className="docs-workflow" aria-labelledby="workflow-title"><h2 id="workflow-title">Build workflow</h2><ol><li><h3>Choose the foundation</h3><p>Keep your brand. Use <code>find-design-system</code> and <code>get-design-system-kit</code> to retrieve the real components you need.</p></li><li><h3>Read the guidance</h3><p>Load <code>get-ui-principle</code> before styling and <code>get-ux-principle</code> before changing behavior.</p></li><li><h3>Build and review</h3><p>Review source with <code>review-ui-code</code>, copy with <code>check-comprehension</code>, and rendered DOM with <code>inspect-spacing</code>. Fix critical and serious findings.</p></li></ol></section>
      <section id="reference" className="docs-reference" aria-labelledby="reference-title"><h2 id="reference-title">Reference</h2><p>Detailed project documents open in the source repository.</p><ul>{references.map(([file, title, description]) => <li key={file}><h3><a href={source + file}>{title}</a></h3><p>{description}</p></li>)}</ul><a href={source.replace('/blob/main/docs/', '/tree/main/docs')}>Browse every project document</a></section>
    </main><SiteFooter /></>;
}
