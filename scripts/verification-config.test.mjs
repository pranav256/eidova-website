import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import test from 'node:test';
import { browserLaunchOptions, mcpFile, normalizeLineEndings } from './verification-config.mjs';

const fixtureRoot = fileURLToPath(new URL('./fixtures/verification root/', import.meta.url));
const probe = new URL('./fixtures/verification root/probe.mjs', import.meta.url);

test('browser defaults preserve Windows Edge and platform Chromium behavior', () => {
  assert.deepEqual(browserLaunchOptions({}, 'win32'), { channel: 'msedge', headless: true });
  assert.deepEqual(browserLaunchOptions({}, 'linux'), { channel: undefined, headless: true });
});

test('browser executable accepts native paths with spaces and replaces the channel', () => {
  const executable = resolve('scripts/fixtures/verification root/browser.exe');
  for (const platform of ['win32', 'linux']) {
    assert.deepEqual(browserLaunchOptions({ BROWSER_EXECUTABLE: executable }, platform), { executablePath: executable, headless: true });
  }
  assert.equal(browserLaunchOptions({ BROWSER_EXECUTABLE: relative(process.cwd(), executable) }).executablePath, executable);
});

test('browser executable rejects empty, malformed and URL overrides', () => {
  for (const value of ['', '  ', '\0', 7, 'https://example.invalid/browser', 'file:///browser']) {
    assert.throws(() => browserLaunchOptions({ BROWSER_EXECUTABLE: value }), /BROWSER_EXECUTABLE/);
  }
});

test('MCP default is the repository sibling, independent of cwd', () => {
  assert.equal(mcpFile('content/eidova/index.json', {}).href, new URL('../../eidova-mcp/content/eidova/index.json', import.meta.url).href);
  const cwd = process.cwd();
  try {
    process.chdir(fixtureRoot);
    assert.equal(mcpFile('scripts/browser-contrast.mjs', {}).href, new URL('../../eidova-mcp/scripts/browser-contrast.mjs', import.meta.url).href);
  } finally { process.chdir(cwd); }
});

test('MCP native absolute and relative roots with spaces support reads and imports', async () => {
  for (const root of [fixtureRoot, relative(process.cwd(), fixtureRoot)]) {
    const file = mcpFile('probe.mjs', { MCP_ROOT: root });
    assert.equal(file.href, probe.href);
    assert.match(await readFile(file, 'utf8'), /local verification fixture/);
    assert.equal((await import(file.href)).fixture, 'local verification fixture');
  }
});

test('MCP file URLs with or without a trailing slash support reads and imports', async () => {
  for (const root of [pathToFileURL(fixtureRoot).href.replace(/\/$/, ''), pathToFileURL(fixtureRoot).href + '/']) {
    const file = mcpFile('probe.mjs', { MCP_ROOT: root });
    assert.equal(file.href, probe.href);
    assert.equal((await import(file.href)).fixture, 'local verification fixture');
    assert.equal(await readFile(file, 'utf8'), await readFile(probe, 'utf8'));
  }
});

test('MCP root rejects empty, malformed and non-file URL input', () => {
  for (const root of ['', '  ', '\0', 7, 'https://example.invalid/mcp', 'file:///%ZZ', 'file:///tmp/mcp?query=1', 'file:///tmp/mcp#fragment']) {
    assert.throws(() => mcpFile('probe.mjs', { MCP_ROOT: root }), /MCP_ROOT/);
  }
});

const expected = '[mcp_servers.eidova]\nurl = "https://eidova-mcp.vercel.app/mcp"\n';
test('exact config comparison accepts LF and CRLF', () => {
  assert.equal(normalizeLineEndings(expected), expected);
  assert.equal(normalizeLineEndings(expected.replaceAll('\n', '\r\n')), expected);
});

test('line ending normalization still rejects changed or malformed config', () => {
  for (const malformed of [expected.trimEnd(), expected + '\n', expected.replace('eidova-mcp', 'other'), expected.replace('url =', 'url='), expected.replaceAll('\n', '\r'), '\ufeff' + expected, 'arbitrary content']) {
    assert.notEqual(normalizeLineEndings(malformed), expected);
  }
});
