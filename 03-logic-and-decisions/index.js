const {chromium} = require("playwright");

(async () => {
    const browser = await chromium.launch({headless: true}),
        page = await browser.newPage();

    await browser.close();
})();