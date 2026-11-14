import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { measureTextContrast } from '../../eidova-mcp/scripts/browser-contrast.mjs';

const origin = process.env.REVIEW_URL || 'http://127.0.0.1:5512';
const themes = JSON.parse(await readFile('src/catalog-themes.json', 'utf8'));
const browser = await chromium.launch({ channel: process.platform === 'win32' ? 'msedge' : undefined, headless: true });
const errors = [];
try {
  const context = await browser.newContext({ viewport: { width: 390, height: 1000 }, colorScheme: 'light', reducedMotion: 'reduce' });
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(origin + '/?mode=light', { waitUntil: 'networkidle' });
  await page.locator('.theme-card').nth(30).waitFor();
  const initial = await page.locator('html').evaluate(node => ({ background: getComputedStyle(node).getPropertyValue('--background'), styles: node.style.cssText }));
  for (const mode of ['light', 'dark']) {
    if (mode === 'dark') await page.getByRole('button', { name: 'Switch to dark mode', exact: true }).click();
    for (const [id, theme] of Object.entries(themes)) {
      const button = page.getByRole('button', { name: 'Apply to page: ' + theme.title, exact: true });
      await button.focus();
      await button.press('Enter');
      assert.equal(await button.getAttribute('aria-pressed'), 'true');
      assert.equal(await button.textContent(), 'Applied to page');
      await page.waitForURL(url => url.searchParams.get('page-theme') === id);
      assert.equal(new URL(page.url()).searchParams.get('page-theme'), id);
      assert.equal(await page.locator('html').getAttribute('data-design-system'), id);
      assert.equal(await page.locator('html').getAttribute('data-theme'), mode);
      const palette = theme.modes[mode];
      const properties = await page.locator('html').evaluate((node, names) => Object.fromEntries(names.map(name => [name, node.style.getPropertyValue(name)])), Object.keys({ ...palette.tokens, ...palette.siteOverrides }));
      assert.deepEqual(properties, { ...palette.tokens, ...palette.siteOverrides });
      assert.ok(await button.evaluate(node => node === document.activeElement), 'Applying must retain keyboard focus');
      assert.match(await page.locator('.theme-picker-trigger').evaluate(node => getComputedStyle(node).fontFamily), /Inter/, 'The picker keeps readable interface typography');
      assert.match(await page.locator('.site-header .wordmark').evaluate(node => getComputedStyle(node).fontFamily), /Newsreader/, 'Brand typography stays consistent');
      for (const width of [390, 1440, 1728]) {
        await page.setViewportSize({ width, height: 1000 });
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), id + ': page must reflow');
      }
      const contrast = await page.evaluate(measureTextContrast);
      assert.deepEqual(contrast.filter(item => item.ratio < item.minimum), [], id + ' ' + mode + ': text contrast');
    }
  }
  await page.getByRole('button', { name: 'Apply to page: Linear', exact: true }).click();
  await page.reload({ waitUntil: 'networkidle' });
  assert.equal(await page.locator('html').getAttribute('data-page-theme'), 'linear');
  await page.goto(origin, { waitUntil: 'networkidle' });
  assert.equal(await page.locator('html').getAttribute('data-page-theme'), 'linear', 'Saved theme applies without a URL choice');
  await page.getByRole('button', { name: 'Preview theme: Minimal Light', exact: true }).click();
  assert.equal(await page.locator('html').getAttribute('data-page-theme'), 'linear');
  const frame = page.frameLocator('.specimen-frame');
  await frame.getByRole('textbox', { name: 'Workspace name', exact: true }).waitFor();
  await frame.getByRole('textbox', { name: 'Workspace name', exact: true }).press('Escape');
  assert.ok(await page.getByRole('button', { name: 'Preview theme: Minimal Light', exact: true }).evaluate(node => node === document.activeElement));
  await page.getByRole('button', { name: 'Restore default', exact: true }).click();
  assert.equal(await page.locator('html').getAttribute('data-page-theme'), null);
  assert.equal(await page.locator('html').getAttribute('data-brand'), 'eidova-paper');
  assert.equal(await page.evaluate(() => localStorage.getItem('eidova-page-theme')), null);
  await page.getByRole('button', { name: 'Switch to light mode', exact: true }).click();
  await page.setViewportSize({ width: 390, height: 1000 });
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(resolve)));
  assert.deepEqual(await page.locator('html').evaluate(node => ({ background: getComputedStyle(node).getPropertyValue('--background'), styles: node.style.cssText })), initial);
  await page.goBack({ waitUntil: 'networkidle' });
  assert.equal(await page.locator('html').getAttribute('data-page-theme'), 'linear');
  await page.goForward({ waitUntil: 'networkidle' });
  assert.equal(await page.locator('html').getAttribute('data-page-theme'), null);
  for (const id of ['unknown', '__proto__', 'constructor']) {
    await page.goto(origin + '/?page-theme=' + id, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('html').getAttribute('data-brand'), 'eidova-paper');
  }
  await page.goto(origin + '/?page-theme=linear&mode=dark&q=Linear&appearance=dark', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Apply to page: Linear Quality', exact: true }).click();
  const url = new URL(page.url());
  assert.equal(url.searchParams.get('q'), 'Linear');
  assert.equal(url.searchParams.get('appearance'), 'dark');
  assert.equal(url.searchParams.get('mode'), 'dark');
  await page.evaluate(() => document.documentElement.style.fontSize = '200%');
  await page.setViewportSize({ width: 390, height: 1000 });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await page.goto(origin + '/showcase?page-theme=linear', { waitUntil: 'networkidle' });
  assert.equal(await page.locator('html').getAttribute('data-brand'), 'eidova-paper', 'Other routes retain the default brand');
  await context.close();
  const blocked = await browser.newContext({ colorScheme: 'light' });
  await blocked.addInitScript(() => { Object.defineProperty(window, 'localStorage', { get() { throw new Error('Storage disabled'); } }); });
  const blockedPage = await blocked.newPage();
  await blockedPage.goto(origin + '/?mode=light', { waitUntil: 'networkidle' });
  await blockedPage.getByRole('button', { name: 'Apply to page: Linear', exact: true }).click();
  await blockedPage.reload({ waitUntil: 'networkidle' });
  assert.equal(await blockedPage.locator('html').getAttribute('data-page-theme'), 'linear');
  await blocked.close();
  const pickerContext = await browser.newContext({ viewport: { width: 390, height: 1000 }, colorScheme: 'light', reducedMotion: 'reduce' });
  const pickerPage = await pickerContext.newPage();
  pickerPage.on('pageerror', error => errors.push(error.message));
  await pickerPage.route('**/api/catalog', route => route.abort());
  await pickerPage.goto(origin + '/?mode=light&q=Linear', { waitUntil: 'networkidle' });
  const picker = pickerPage.locator('.page-theme-picker');
  const choose = pickerPage.getByRole('button', { name: /Choose page theme:/ });
  await choose.click();
  assert.equal(await pickerPage.locator('.theme-choice:not(.theme-default-choice)').count(), 31, 'Picker works even when the remote catalog is unavailable');
  const pickerSearch = pickerPage.getByRole('searchbox', { name: 'Search page themes', exact: true });
  assert.ok(await pickerSearch.evaluate(node => node === document.activeElement));
  await pickerSearch.fill('nothing-matches');
  await pickerPage.getByText('No matching themes. Try another name.', { exact: true }).waitFor();
  await pickerSearch.fill('Linear');
  assert.equal(await pickerPage.locator('.theme-choice:not(.theme-default-choice)').count(), 2);
  await pickerSearch.press('ArrowDown');
  assert.ok(await pickerPage.getByRole('button', { name: 'Apply page theme: Linear', exact: true }).evaluate(node => node === document.activeElement));
  await pickerPage.keyboard.press('ArrowDown');
  await pickerPage.keyboard.press('Enter');
  assert.equal(await pickerPage.locator('html').getAttribute('data-page-theme'), 'linear-quality');
  assert.ok(await choose.evaluate(node => node === document.activeElement));
  assert.equal(await pickerPage.locator('#page-theme-menu').count(), 0);
  assert.equal(await pickerPage.evaluate(() => scrollY), 0, 'Selecting from the picker keeps the landing page in view');
  assert.equal(new URL(pickerPage.url()).searchParams.get('q'), 'Linear');
  await pickerPage.getByRole('button', { name: 'Previous page theme', exact: true }).click();
  assert.equal(await pickerPage.locator('html').getAttribute('data-page-theme'), 'linear');
  await choose.click();
  await pickerSearch.press('Escape');
  assert.equal(await choose.getAttribute('aria-expanded'), 'false');
  assert.ok(await choose.evaluate(node => node === document.activeElement));
  await choose.click();
  await pickerPage.locator('.site-header .wordmark').click();
  assert.equal(await choose.getAttribute('aria-expanded'), 'false', 'Outside clicks dismiss the nonmodal picker');
  await choose.click();
  await pickerPage.getByRole('button', { name: 'Eidova default', exact: true }).click();
  const visited = new Set();
  for (let index = 0; index < 32; index++) {
    await pickerPage.getByRole('button', { name: 'Next page theme', exact: true }).click();
    visited.add(await pickerPage.locator('html').getAttribute('data-page-theme'));
  }
  assert.equal(visited.size, 32, 'Next cycles through every theme and the default');
  assert.equal(await pickerPage.locator('html').getAttribute('data-page-theme'), null);
  for (const mode of ['light', 'dark']) {
    if (mode === 'dark') await pickerPage.getByRole('button', { name: 'Switch to dark mode', exact: true }).click();
    for (const width of [390, 1440, 1728]) {
      await pickerPage.setViewportSize({ width, height: 1000 });
      await choose.click();
      assert.deepEqual((await new AxeBuilder({ page: pickerPage }).include('.page-theme-picker').analyze()).violations, []);
      assert.ok(await pickerPage.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      await pickerSearch.press('Escape');
      await pickerPage.locator('#connect').evaluate(node => node.scrollIntoView({ behavior: 'instant' }));
      const headerBox = await pickerPage.locator('.site-header').boundingBox();
      const pickerBox = await picker.boundingBox();
      assert.ok(pickerBox.y >= headerBox.y + headerBox.height - 1, 'The header must not cover the sticky picker');
    }
  }
  await pickerPage.evaluate(() => document.documentElement.style.fontSize = '200%');
  for (const width of [390, 768, 1440]) {
    await pickerPage.setViewportSize({ width, height: 1000 });
    await choose.click();
    assert.ok(await pickerPage.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'The open picker reflows at 200% text');
    assert.ok(await pickerPage.locator('#page-theme-menu').evaluate(node => node.getBoundingClientRect().bottom <= innerHeight), 'The open picker fits vertically at 200% text');
    await pickerSearch.press('Escape');
  }
  await pickerContext.close();
  assert.deepEqual(errors, []);
  console.log('All 31 themes pass appearances, widths, contrast, persistence and previews. Live picker passes search, cycling, keyboard, dismissal, catalog outage, Axe and text zoom.');
} finally { await browser.close(); }
