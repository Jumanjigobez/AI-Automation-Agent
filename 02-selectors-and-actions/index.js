const {chromium} = require("playwright");

(async () => {

    const browser = await chromium.launch({headless: true}),
          page = await browser.newPage();

    await page.goto("http://www.google.com");

    await page.waitForSelector('textarea[name="q"]');

    await page.fill("textarea[name='q']", "Juma Chaje");

    await page.keyboard.press("Enter");

    await browser.close();

})();