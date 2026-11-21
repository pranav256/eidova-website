import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';

const html = await readFile('dist/index.html', 'utf8');
const library = JSON.parse(await readFile('src/resource-catalog.json', 'utf8'));
const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const resourceLinks = library.entries.map(entry => `<li><a href="${escapeHtml(`/api/resources/${entry.kind}/${entry.id}/file?path=${encodeURIComponent(entry.entrypoint)}`)}" download>${escapeHtml(entry.name)}</a> — ${escapeHtml(entry.license)}</li>`).join('');
for (const [route, title, description] of [
  ['resources', 'Eidova Resources — The complete design library', `Browse all ${library.entries.length} design resources: systems, templates, plugin designs, skills and source notes. Preview designs, read original files and download source.`],
  ['docs', 'Eidova Documentation — Setup, tools and reference', 'Connect your agent to Eidova MCP. Find quick start instructions, the design workflow, all tools and project documentation.'],
  ['showcase', 'Eidova Showcase — Try the design toolkit', 'Try real React components, explore design tokens and review UI copy with Eidova MCP.'],
  ['studio', 'Eidova Team Workspace', 'Connect your team workspace to collaborate on project files with Eidova.'],
]) {
  const url = `https://eidova.vercel.app/${route}`;
  let page = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(/(<meta (?:name="(?:description|twitter:description)"|property="og:description") content=")[^"]*/g, `$1${description}`)
    .replace(/(<meta (?:name="twitter:title"|property="og:title") content=")[^"]*/g, `$1${title}`)
    .replace(/(<link rel="canonical" href=")[^"]*/, `$1${url}`)
    .replace(/(<meta property="og:url" content=")[^"]*/, `$1${url}`)
    .replace(/<script type="application\/ld\+json">.*?<\/script>/, '')
    .replace(/<noscript>.*?<\/noscript>/, `<noscript><h1>${title}</h1><p>${description} Enable JavaScript to use this page.</p><a href="/">Eidova home</a></noscript>`);
  if (route === 'resources') page = page.replace(/<noscript>.*?<\/noscript>/, `<noscript><h1>Resources</h1><p>${escapeHtml(description)}</p><p>Enable JavaScript for search and previews, or download any resource below.</p><ul>${resourceLinks}</ul><a href="/">Eidova home</a></noscript>`);
  if (route === 'studio') page = page.replace('content="index,follow"', 'content="noindex,follow"');
  assert.ok(page.includes(`<title>${title}</title>`) && page.includes(`rel="canonical" href="${url}"`));
  await mkdir(`dist/${route}`, { recursive: true });
  await writeFile(`dist/${route}/index.html`, page);
}
