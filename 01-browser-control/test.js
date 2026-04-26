const {chromium} = require("playwright");

( async () => {
    const browser = await chromium.launch({headless: true}),
          page = await browser.newPage();

          await page.goto("https://example.com");

          const title = await page.title();

          console.log("Page Title: ", title);

          await browser.close();

    
})();