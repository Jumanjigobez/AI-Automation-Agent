const {chromium} = require("playwright");

(async () => {
    const browser = await chromium.launch({headless: true}),
          page = await browser.newPage();

    await page.goto("https://books.toscrape.com"); //Website used

    console.log("Website opened...");

    //We want to return a JSON structured data of all books at first page, in fields of Img, Title, Price

   
    await browser.close();
})();