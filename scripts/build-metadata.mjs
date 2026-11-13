import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';

const html = await readFile('dist/index.html', 'utf8');
for (const [route, title, description] of [
  ['showcase', 'Eidova Showcase — Try the design toolkit', 'Try real React components, explore design tokens and review UI copy with Eidova MCP.'],
  ['studio', 'Eidova Team Workspace', 'Connect your team workspace to collaborate on project files with Eidova.'],
]) {
  const url = `https://open-design-website.vercel.app/${route}`;
  let page = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(/(<meta (?:name="(?:description|twitter:description)"|property="og:description") content=")[^"]*/g, `$1${description}`)
    .replace(/(<meta (?:name="twitter:title"|property="og:title") content=")[^"]*/g, `$1${title}`)
    .replace(/(<link rel="canonical" href=")[^"]*/, `$1${url}`)
    .replace(/(<meta property="og:url" content=")[^"]*/, `$1${url}`)
    .replace(/<script type="application\/ld\+json">.*?<\/script>/, '')
    .replace(/<noscript>.*?<\/noscript>/, `<noscript><h1>${title}</h1><p>${description} Enable JavaScript to use this page.</p><a href="/">Eidova home</a></noscript>`);
  if (route === 'studio') page = page.replace('content="index,follow"', 'content="noindex,follow"');
  assert.ok(page.includes(`<title>${title}</title>`) && page.includes(`rel="canonical" href="${url}"`));
  await mkdir(`dist/${route}`, { recursive: true });
  await writeFile(`dist/${route}/index.html`, page);
}
