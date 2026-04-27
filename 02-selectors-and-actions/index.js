const {chromium} = require("playwright");

(async () => {

    const browser = await chromium.launch({headless: true}),
          page = await browser.newPage();

    await page.goto("https://books.toscrape.com");

    
    console.log("website Opened...")

    // await page.keyboard.press("Enter");

    await page.waitForLoadState("networkidle");

    await page.waitForSelector("h3");

    await page.locator("h3").first().click(); //click the first h3 title book element

    const firstBookTitle = await page.locator("h1").first().innerText(); //get the h1 book title

    console.log("Book Title:", firstBookTitle);

     
    await browser.close();

})();