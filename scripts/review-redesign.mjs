import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const origin = process.env.REVIEW_URL || 'http://127.0.0.1:5512';
const output = '.work/redesign-1311';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: process.platform === 'win32' ? 'msedge' : undefined, headless: true });
const errors = [], views = [];
try {
  for (const width of [390, 1440, 1728]) {
    for (const route of ['/', '/showcase', '/studio']) {
      const surface = route === '/' ? 'home' : route.slice(1);
      const context = await browser.newContext({ viewport: { width, height: 1000 }, colorScheme: 'light', reducedMotion: 'reduce' });
      const page = await context.newPage();
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(origin + route, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.locator('html').getAttribute('data-theme'), 'light');
      assert.equal(await page.locator('html').getAttribute('data-design-system'), 'minimal-light');
      assert.match(await page.locator('h1').evaluate(node => getComputedStyle(node).fontFamily), /Inter/);
      assert.match(await page.locator('body').evaluate(node => getComputedStyle(node).fontFamily), /Inter/);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      for (const img of await page.locator('img').all()) { await img.scrollIntoViewIfNeeded(); await img.evaluate(node => node.decode()); }
      assert.ok(await page.locator('img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0)));
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      const violations = (await new AxeBuilder({ page }).exclude('iframe').analyze()).violations;
      views.push({ width, route, violations });
      await page.screenshot({ path: `${output}/${width}-${surface}-hero.png` });
      for (const id of route === '/' ? ['connect', 'themes', 'resources'] : route === '/showcase' ? ['components', 'interactions'] : []) {
        await page.locator('#' + id).evaluate(node => node.scrollIntoView({ behavior: 'instant', block: 'start' }));
        await page.screenshot({ path: `${output}/${width}-${surface}-${id}.png` });
      }
      await context.close();
    }
  }
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  for (const route of ['/', '/showcase', '/studio']) {
    await page.goto(origin + route, { waitUntil: 'networkidle' });
    for (const width of [320, 600, 768, 1024]) {
      await page.setViewportSize({ width, height: 1000 });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${route} overflows at ${width}`);
    }
    await page.evaluate(() => document.documentElement.style.fontSize = '200%');
    for (const width of [390, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${route} text zoom overflows at ${width}`);
    }
    await page.evaluate(() => document.documentElement.style.fontSize = '');
  }
  await page.goto(origin, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Switch to dark mode', exact: true }).click();
  await page.reload({ waitUntil: 'networkidle' });
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
  await page.goto(origin + '/showcase?mode=light', { waitUntil: 'networkidle' });
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'light');
  await context.close();
  await writeFile(`${output}/accessibility.json`, JSON.stringify({ origin, views, errors, defaults: 'pass', reflow: 'pass', textZoom: 'pass', savedAndUrlAppearance: 'pass', excluded: 'Original embedded component specimens; their themes are reviewed separately.' }, null, 2));
  console.log(JSON.stringify({ views: views.length, violations: views.flatMap(view => view.violations.map(rule => ({ route: view.route, width: view.width, id: rule.id, impact: rule.impact, nodes: rule.nodes.map(node => node.target) }))), errors }));
  assert.deepEqual(errors, []);
  assert.ok(views.every(view => view.violations.length === 0));
} finally { await browser.close(); }
