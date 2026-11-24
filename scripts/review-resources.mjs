import assert from 'node:assert/strict';
import { readFile, mkdir } from 'node:fs/promises';
import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const origin = process.env.REVIEW_URL || 'http://127.0.0.1:5512';
const { entries } = JSON.parse(await readFile('src/resource-catalog.json', 'utf8'));
const upstream = JSON.parse(await readFile('../eidova-mcp/content/eidova/index.json', 'utf8'));
const ids = list => list.map(entry => entry.kind + '/' + entry.id).sort();
assert.deepEqual(ids(entries), ids(upstream.entries));
assert.equal(new Set(ids(entries)).size, 784);
const metadata = await readFile('dist/resources/index.html', 'utf8');
assert.ok(metadata.includes('rel="canonical" href="https://eidova.vercel.app/resources"'));
assert.equal((metadata.match(/<li><a href="\/api\/resources\//g) || []).length, entries.length);
const output = '.work/resources';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: process.platform === 'win32' ? 'msedge' : undefined, headless: true });
const errors = [];
try {
  for (const width of [390, 1440, 1728]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(origin + '/resources?mode=light', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    assert.deepEqual(await page.locator('.resource-list h2').allTextContents(), entries.map(entry => entry.name));
    assert.equal(await page.locator('.result-count').textContent(), 'Showing 784 of 784 resources');
    assert.equal(await page.getByRole('button', { name: 'Show more resources', exact: true }).count(), 0);
    assert.equal(await page.locator('.site-header a[href="/resources"]').first().getAttribute('aria-current'), 'page');
    const snapshot = async name => {
      await page.screenshot({ path: `${output}/${width}-${name}.png` });
    };
    await snapshot('directory');
    const search = page.getByRole('searchbox', { name: 'Search resources' });
    for (const kind of ['design-systems', 'templates', 'plugins', 'skills', 'catalogs']) {
      await page.getByLabel('Resource type', { exact: true }).selectOption(kind);
      const expected = entries.filter(entry => kind === 'templates' ? ['design-templates', 'templates'].includes(entry.kind) : entry.kind === kind);
      assert.deepEqual(await page.locator('.resource-list h2').allTextContents(), expected.map(entry => entry.name));
    }
    await page.getByLabel('Resource type', { exact: true }).selectOption('all');
    await search.fill('agentic');
    const matching = entries.filter(entry => `${entry.id} ${entry.name} ${entry.category} ${entry.description}`.toLowerCase().includes('agentic'));
    assert.equal(await page.locator('.resource-list > li').count(), matching.length);
    await search.fill('no-such-resource-zzzzzzzz');
    await page.getByRole('heading', { name: 'No matching resources.' }).waitFor();
    assert.deepEqual((await new AxeBuilder({ page }).analyze()).violations, []);
    await page.getByRole('button', { name: 'Clear resource filters' }).click();
    assert.ok(await search.evaluate(node => node === document.activeElement));
    assert.equal(await page.locator('.resource-list > li').count(), entries.length);
    await search.fill('agentic');
    const first = page.locator('.resource-list > li').first();
    const endpoint = `/api/resources/${entries[0].kind}/${entries[0].id}`;
    let failManifest = true;
    await page.route('**' + endpoint, route => failManifest ? route.fulfill({ status: 503, body: 'Unavailable' }) : route.continue());
    const read = first.getByRole('button', { name: 'Read files', exact: true });
    await read.click();
    await page.getByText('Resource files could not load.', { exact: true }).waitFor();
    failManifest = false;
    await page.getByRole('button', { name: 'Retry loading files' }).click();
    await page.locator('.resource-file-content').waitFor();
    assert.match(await page.locator('.resource-file-content').textContent(), /Agentic/i);
    const download = await page.request.get(origin + endpoint + '/file?path=DESIGN.md');
    assert.equal(download.status(), 200);
    assert.ok(download.headers()['content-type'].startsWith('application/octet-stream'));
    await snapshot('reader');
    await page.getByRole('button', { name: 'Preview design', exact: true }).last().click();
    const frame = page.locator('.resource-file-preview');
    await frame.waitFor();
    await page.frameLocator('.resource-file-preview').locator('body').waitFor();
    assert.equal(await frame.getAttribute('sandbox'), 'allow-scripts');
    await snapshot('preview');
    assert.deepEqual((await new AxeBuilder({ page }).exclude('iframe').analyze()).violations, []);
    await page.getByRole('button', { name: 'Close reader' }).press('Escape');
    assert.equal(await page.locator('dialog[open]').count(), 0);
    assert.ok(await read.evaluate(node => node === document.activeElement));
    assert.equal(await search.inputValue(), 'agentic');
    await context.close();
  }
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ resources: entries.length, widths: [390, 1440, 1728], sourceEquality: 'pass', metadataAndNoScript: 'pass', allFilters: 'pass', searchReset: 'pass', readerRetryAndDownload: 'pass', isolatedPreview: 'pass', focusReturn: 'pass', errors }));
} finally { await browser.close(); }
