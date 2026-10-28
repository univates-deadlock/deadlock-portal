/* Optional browser regression checks. See README.md for the runner setup. */
'use strict';

const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const baseURL = process.argv[2] || 'http://127.0.0.1:8081';

async function checkGallery(browser, width, reducedMotion, touch = false) {
  const page = await browser.newPage({
    viewport: { width, height: 900 },
    reducedMotion,
    hasTouch: touch,
    isMobile: touch,
  });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  try {
    await page.goto(baseURL, { waitUntil: 'networkidle' });
    assert.match(await page.locator('.member-card').first().innerText(), /DEVOPS.*BACKEND/i);
    const trigger = page.locator('.project-art').first();
    await trigger.scrollIntoViewIfNeeded();
    await trigger.focus();
    await page.keyboard.press('Enter');
    const dialog = page.locator('#project-gallery');
    await dialog.waitFor({ state: 'visible' });
    assert.equal(await dialog.evaluate(el => el.open), true);
    assert.equal(await page.locator('#gallery-title').innerText(), 'TechPro App');
    assert.equal(await page.locator('.gallery-close').evaluate(el => el === document.activeElement), true);
    await page.keyboard.press('Shift+Tab');
    assert.equal(await page.locator('.gallery-next').evaluate(el => el === document.activeElement), true);
    await page.keyboard.press('Tab');
    assert.equal(await page.locator('.gallery-close').evaluate(el => el === document.activeElement), true);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    const before = await page.evaluate(() => scrollY);
    await page.mouse.wheel(0, 250);
    await page.waitForTimeout(100);
    assert.equal(await page.evaluate(() => scrollY), before);

    await page.keyboard.press('ArrowRight');
    assert.equal(await page.locator('#gallery-title').innerText(), 'TechPro Website');
    await page.keyboard.press('ArrowLeft');
    assert.equal(await page.locator('#gallery-title').innerText(), 'TechPro App');
    await page.locator('.gallery-next').click();
    assert.equal(await page.locator('#gallery-count').innerText(), '2 de 2');
    await page.locator('.gallery-previous').click();
    assert.equal(await page.locator('#gallery-count').innerText(), '1 de 2');
    const loaded = await page.locator('.gallery-image').evaluate(async img => { await img.decode(); return img.naturalWidth; });
    assert.equal(loaded, 1440);

    for (let i = 0; i < 6; i++) {
      await page.keyboard.press('Tab');
      assert.equal(await dialog.evaluate(el => el.contains(document.activeElement)), true,
        await page.evaluate(() => `Focus left the gallery: ${document.activeElement.tagName}.${document.activeElement.className}`));
    }
    await page.keyboard.press('Escape');
    assert.equal(await dialog.evaluate(el => el.open), false);
    assert.equal(await trigger.evaluate(el => el === document.activeElement), true);
    if (touch) await trigger.tap();
    else await trigger.click();
    if (touch) await page.locator('.gallery-close').tap();
    else await page.locator('.gallery-close').click();
    assert.equal(await dialog.evaluate(el => el.open), false);
    await trigger.click();
    await page.mouse.click(2, 2);
    assert.equal(await dialog.evaluate(el => el.open), false);
    assert.equal(await page.evaluate(() => document.documentElement.classList.contains('gallery-open')), false);

    await page.locator('.member-card').first().scrollIntoViewIfNeeded();
    if (!touch && reducedMotion === 'no-preference') {
      await page.locator('.member-card').first().hover();
      await page.waitForTimeout(350);
      const scale = await page.locator('.member-avatar img').first().evaluate(el => getComputedStyle(el).scale);
      assert.notEqual(scale, 'none');
      assert.notEqual(scale, '1');
      await page.locator('.team').screenshot({ path: '/tmp/deadlock-team-hover.png', animations: 'disabled' });
    }
    if (reducedMotion === 'reduce') {
      await trigger.hover();
      assert.equal(await trigger.locator('img').evaluate(el => getComputedStyle(el).scale), 'none');
    }
    await page.locator('.team-grid').scrollIntoViewIfNeeded();
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await trigger.click();
    await dialog.screenshot({ path: `/tmp/deadlock-gallery-${width}-${reducedMotion}.png`, animations: 'disabled' });
    await page.keyboard.press('Escape');
    assert.deepEqual(errors, []);
    console.log(`PASS: gallery, keyboard, focus, scroll lock and motion at ${width}px (${reducedMotion})`);
  } finally {
    await page.close();
  }
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    await checkGallery(browser, 1440, 'no-preference');
    await checkGallery(browser, 390, 'reduce', true);
    await checkGallery(browser, 320, 'reduce', true);
    const enhanced = await browser.newPage();
    await enhanced.goto(baseURL);
    const [modifiedPopup] = await Promise.all([
      enhanced.context().waitForEvent('page'),
      enhanced.locator('.project-art').first().click({ modifiers: ['Control'] }),
    ]);
    await modifiedPopup.waitForLoadState();
    assert(modifiedPopup.url().endsWith('/assets/projects/techpro-app.webp'));
    assert.equal(await enhanced.locator('#project-gallery').evaluate(el => el.open), false);
    await enhanced.close();
    console.log('PASS: modified click preserves direct image navigation');
    const page = await browser.newPage({ javaScriptEnabled: false });
    await page.goto(baseURL);
    const [popup] = await Promise.all([page.waitForEvent('popup'), page.locator('.project-art').first().click()]);
    await popup.waitForLoadState();
    assert(popup.url().endsWith('/assets/projects/techpro-app.webp'));
    console.log('PASS: direct screenshot link without JavaScript');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
