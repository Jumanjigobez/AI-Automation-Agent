const {chromium} = require("playwright");

(async () => {
    const browser = await chromium.launch({headless: true}),
        page = await browser.newPage();

    await page.goto("https://books.toscrape.com");

    //We want to check for a book "When we collided" and get it's price, else click button next until book found

    const exists = await page.locator("h3").count()

    console.log(exists)
    
    await browser.close();
})();