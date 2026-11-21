import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { resolveConfig } from 'vite';

const text = file => readFile(file, 'utf8');
const endpoint = 'https://eidova-mcp.vercel.app/mcp';
const config = await resolveConfig({}, 'serve');
const proxyFor = pathname => Object.keys(config.server.proxy).find(key => key.startsWith('^') ? new RegExp(key).test(pathname) : pathname.startsWith(key));
assert.ok(proxyFor('/mcp'));
assert.equal(proxyFor('/mcp/core'), proxyFor('/mcp'));
assert.equal(proxyFor('/mcp-config/codex.toml'), undefined, 'Client examples must be served as files, not proxied to MCP.');
const { rewrites } = JSON.parse(await text('vercel.json'));
assert.ok(!rewrites.some(rule => rule.source.startsWith('/studio')));
await assert.rejects(access('dist/studio'), { code: 'ENOENT' });
for (const route of ['/mcp', '/mcp/core', '/server.json']) {
  assert.equal(rewrites.find(rule => rule.source === route)?.destination,
    'https://eidova-mcp.vercel.app' + route);
}
for (const [file, key, type] of [
  ['claude-code.json', 'mcpServers', 'http'],
  ['cursor.json', 'mcpServers', undefined],
  ['vscode.json', 'servers', 'http'],
]) {
  const config = JSON.parse(await text('dist/mcp-config/' + file));
  assert.deepEqual(config[key].eidova, type ? { type, url: endpoint } : { url: endpoint });
}
assert.equal(await text('dist/mcp-config/codex.toml'), `[mcp_servers.eidova]\nurl = "${endpoint}"\n`);
const instructions = await text('dist/AGENTS.md');
assert.match(instructions, /Merge these instructions/);
assert.match(instructions, /does not configure an MCP connection/);
const index = await text('dist/llms.txt');
for (const match of index.matchAll(/\]\(https:\/\/eidova\.vercel\.app([^)]*)\)/g)) {
  const { pathname: route } = new URL('https://eidova.vercel.app' + match[1]);
  if (rewrites.some(rule => rule.source === route)) continue;
  await text('dist' + route);
}
for (const route of ['', '/docs', '/resources', '/showcase']) {
  const page = await text('dist' + route + '/index.html');
  assert.ok(page.includes(`rel="canonical" href="https://eidova.vercel.app${route || '/'}"`));
  assert.ok(!page.includes('https://open-design-website.vercel.app'));
}
assert.ok(!(await text('dist/sitemap.xml')).includes('open-design-website'));
console.log('Agent instructions, client configs, discovery routing and canonical metadata passed.');
