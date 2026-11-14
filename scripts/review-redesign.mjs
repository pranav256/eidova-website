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
    for (const mode of ['light', 'dark']) for (const route of ['/', '/showcase', '/studio', '/studio#share=invalid']) {
      const surface = route === '/' ? 'home' : route.slice(1);
      const context = await browser.newContext({ viewport: { width, height: 1000 }, colorScheme: 'light', reducedMotion: 'reduce' });
      const page = await context.newPage();
      page.on('pageerror', error => errors.push(error.message));
      const routeUrl = new URL(origin + route); routeUrl.searchParams.set('mode', mode);
      await page.goto(routeUrl.href, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.locator('html').getAttribute('data-theme'), mode);
      assert.equal(await page.locator('html').getAttribute('data-design-system'), 'minimal-light');
      assert.equal(await page.locator('html').getAttribute('data-brand'), 'eidova-paper');
      assert.match(await page.locator('h1').evaluate(node => getComputedStyle(node).fontFamily), route.startsWith('/studio') ? /Inter/ : /Newsreader/);
      assert.match(await page.locator('body').evaluate(node => getComputedStyle(node).fontFamily), /Inter/);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      for (const img of await page.locator('img').all()) { if (await img.isVisible()) { await img.scrollIntoViewIfNeeded(); await img.evaluate(node => node.decode()); } }
      assert.ok(await page.locator('img').evaluateAll(images => images.filter(image => image.checkVisibility()).every(image => image.complete && image.naturalWidth > 0)));
      if (route === '/') {
        await page.getByRole('heading', { name: 'Design systems, in real code.', exact: true }).waitFor();
        assert.equal(await page.locator('.theme-card').count(), 31);
        assert.equal(await page.locator('.theme-card-preview img').count(), 31);
        assert.ok(await page.locator('.theme-card-preview img').evaluateAll(images => images.every(image => image.naturalWidth > 0)));
        await page.locator('.hero-actions').getByRole('link', { name: 'Connect your agent' }).click();
        await page.getByRole('heading', { name: 'Install Eidova', exact: true }).waitFor();
        assert.equal(new URL(page.url()).hash, '#connect');
        if (width === 390) {
          const menu = page.locator('.mobile-menu');
          await menu.locator('summary').press('Enter');
          assert.equal(await menu.evaluate(node => node.open), true);
          await menu.getByRole('link', { name: 'Resources', exact: true }).click();
          assert.equal(await menu.evaluate(node => node.open), false);
          assert.equal(new URL(page.url()).hash, '#resources');
          await menu.locator('summary').press('Enter');
          await menu.locator('summary').press('Escape');
          assert.equal(await menu.evaluate(node => node.open), false);
          assert.ok(await menu.locator('summary').evaluate(node => node === document.activeElement));
        }
      }
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      const violations = (await new AxeBuilder({ page }).exclude('iframe').analyze()).violations;
      views.push({ width, route, mode, violations });
      await page.screenshot({ path: `${output}/${width}-${mode}-${surface.replace('#share=invalid','-shared')}-hero.png` });
      for (const id of route === '/' ? ['connect', 'themes', 'resources'] : route === '/showcase' ? ['components', 'interactions'] : []) {
        await page.locator('#' + id).evaluate(node => node.scrollIntoView({ behavior: 'instant', block: 'start' }));
        if (mode === 'light') await page.screenshot({ path: `${output}/${width}-${surface}-${id}.png` });
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
  const systemContext = await browser.newContext({ colorScheme: 'dark' });
  const systemPage = await systemContext.newPage();
  await systemPage.goto(origin, { waitUntil: 'networkidle' });
  assert.equal(await systemPage.locator('html').getAttribute('data-theme'), 'dark');
  await systemPage.emulateMedia({ colorScheme: 'light' });
  await systemPage.waitForFunction(() => document.documentElement.dataset.theme === 'light');
  await systemContext.close();
  await writeFile(`${output}/accessibility.json`, JSON.stringify({ origin, views, errors, defaults: 'pass', reflow: 'pass', textZoom: 'pass', savedAndUrlAppearance: 'pass', excluded: 'Original embedded component specimens; their themes are reviewed separately.' }, null, 2));
  console.log(JSON.stringify({ views: views.length, violations: views.flatMap(view => view.violations.map(rule => ({ route: view.route, width: view.width, id: rule.id, impact: rule.impact, nodes: rule.nodes.map(node => node.target) }))), errors }));
  assert.deepEqual(errors, []);
  assert.ok(views.every(view => view.violations.length === 0));
} finally { await browser.close(); }
