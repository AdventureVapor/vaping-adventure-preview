const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1365, height: 900 } });
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));

  await page.addInitScript(() => {
    if (!localStorage.getItem('__mva_settings_test_seeded')) {
      localStorage.setItem('mva_alpha12', JSON.stringify({
        entries: [{
          id: 'historic-bong-entry',
          date: '2026-11-23',
          time: '18:00',
          category: 'bong',
          device: 'Historic Bong',
          strain: 'Historic mixture',
          puffs: '',
          duration: '',
          temp: '',
          location: '',
          taste: '',
          notes: 'Historical record must remain.'
        }],
        devices: [{ name: 'Historic Bong', category: 'bong' }],
        strains: [{ id: 'historic-material', name: 'Historic mixture', category: 'bong' }],
        photos: [],
        game: { xp: 0, coins: 0, quests: [], courses: {} }
      }));
      localStorage.setItem('__mva_settings_test_seeded', '1');
    }
  });

  try {
    await page.goto('http://127.0.0.1:8080/index.html');
    await page.waitForSelector('#view');
    await page.locator('.settings-switch').click();
    await page.waitForSelector('.settings-layout');

    const categories = await page.locator('[data-vaping-category]').count();
    if (categories !== 6) throw new Error('Expected six vaping categories, got ' + categories);

    await page.locator('[data-vaping-category="bong"]').uncheck();
    await page.locator('#settings-language').selectOption('en');
    await page.locator('#settings-animation').uncheck();
    if (await page.evaluate(() => localStorage.getItem('mva_login_animation')) !== 'false') {
      throw new Error('Animation off preference was not saved.');
    }

    await page.locator('.settings-card [data-theme-picker]').click();
    await page.waitForSelector('#theme-picker');
    await page.locator('[data-theme-choice="midnight"]').click();
    if (await page.locator('body').getAttribute('data-theme') !== 'midnight') {
      throw new Error('Theme selection was not applied.');
    }
    await page.keyboard.press('Escape');

    await page.reload();
    await page.locator('.settings-switch').click();
    await page.waitForSelector('.settings-layout');
    if (await page.locator('[data-vaping-category="bong"]').isChecked()) {
      throw new Error('Category preference did not survive reload.');
    }
    if (await page.locator('#settings-language').inputValue() !== 'en') {
      throw new Error('Language preference did not survive reload.');
    }
    if (await page.locator('#settings-animation').isChecked()) {
      throw new Error('Animation preference did not survive reload.');
    }

    await page.locator('button.nav[data-page="diary"]').click();
    if (!(await page.locator('#view').innerText()).includes('Historic Bong')) {
      throw new Error('Historical entry was hidden or deleted after disabling its category.');
    }
    await page.locator('[data-edit="historic-bong-entry"]').click();
    const editOptions = await page.locator('#f-cat option').evaluateAll(nodes => nodes.map(n => n.value));
    if (!editOptions.includes('bong')) {
      throw new Error('Editing a historical entry must retain its disabled category option.');
    }
    await page.locator('[data-close]').first().click();

    if (pageErrors.length) throw new Error('Browser errors: ' + pageErrors.join(' | '));
    console.log('Settings UI tests: all checks passed.');
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error);
  process.exit(1);
});
