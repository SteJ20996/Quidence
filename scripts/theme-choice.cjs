'use strict';
// Phones show the appearance choices behind one menu button; open it first when it is showing.
async function chooseTheme(page, theme) {
  const toggle = page.locator('.q-theme-toggle');
  if (await toggle.isVisible() && await toggle.getAttribute('aria-expanded') !== 'true') await toggle.click();
  await page.locator('[data-theme-choice="' + theme + '"]').click();
}
module.exports = {chooseTheme};
