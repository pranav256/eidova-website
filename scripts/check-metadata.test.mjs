import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const { tools } = JSON.parse(await readFile(new URL('../src/showcase-data.json', import.meta.url), 'utf8'));

for (const [surface, pattern] of [
  ['search description', /<meta name="description" content="([^"]*)"/],
  ['Open Graph description', /<meta property="og:description" content="([^"]*)"/],
  ['Twitter description', /<meta name="twitter:description" content="([^"]*)"/],
  ['no-script fallback', /<noscript>([\s\S]*?)<\/noscript>/],
]) {
  test(`Homepage ${surface} matches the public tool directory`, () => {
    assert.match(html.match(pattern)?.[1] ?? '', new RegExp(`\\b${tools.length} MCP tools\\b`));
  });
}
