const {chromium} = require("playwright");

(async () => {
    const browser = await chromium.launch({headless: true}),
          page = await browser.newPage();

    await page.goto("https://books.toscrape.com"); //Website used

    console.log("Website opened...");

    //We want to return a JSON structured data of all books at first page, in fields of Img, Title, Price

    const booksData = [];

    const books = await page.locator(".product_pod"),//array
          count = await books.count();

    // console.log(count)

    for(var i=0;i<count;i++){
        let book = books.nth(i),
            booksFound = {
                Img : `https://books.toscrape.com/${await book.locator("img").getAttribute("src")}`,
                Title : await book.locator("h3 a").innerText(),
                Price : await book.locator(".price_color").innerText(),
            }

        // console.log(booksFound.Img, booksFound.Title, booksFound.Price)
        booksData.push(booksFound);
    }

    console.log(booksData);
    await browser.close();
})();