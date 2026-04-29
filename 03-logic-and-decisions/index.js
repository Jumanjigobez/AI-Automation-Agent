const {chromium} = require("playwright");

(async () => {
    const browser = await chromium.launch({headless: true}),
        page = await browser.newPage();

    await page.goto("https://books.toscrape.com");

    //We want to check for a book "When we collided" and get it's price, else click button next until book found

    let bookFound = false;

    while(!bookFound){
        const bookName = await page.locator("h3").allInnerTexts(); //comes in an array form

        if(bookName.includes("When We Collided")){
            console.log("Book Found 😁");
            bookFound = true;
            break;
        }

        //finding the next page button
        const NextBtn = await page.locator(".next a").count();

        // console.log(NextBtn)
        if(NextBtn > 0){
            console.log("Going to Next Page...");
            await page.click(".next a");
            await page.waitForLoadState("domcontentloaded");
        }else{
            console.log("Book Not Found in all Pages 😔");
            break;
        }
    }
    
    await browser.close();
})();