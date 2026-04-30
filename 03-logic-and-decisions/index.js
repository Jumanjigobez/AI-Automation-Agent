const {chromium} = require("playwright");

const bookToSearch = process.argv[2];

if (!bookToSearch) {
  console.log("❌ Please provide a book name");
  process.exit(1);
}

(async () => {
    const browser = await chromium.launch({headless: true}),
        page = await browser.newPage();

    await page.goto("https://books.toscrape.com"); //Website used

    //We want to check for a book name and get it's price and link, else click button next until book found

    let bookFound = false;
        

    while(!bookFound){
        const books = await page.locator(".product_pod"), //comes in an array form
              count  = await books.count();

        for(var i=0; i<count; i++){
            let book = books.nth(i);

            const title = await book.locator("h3 a").getAttribute("title");

             if(title.toLowerCase().includes(bookToSearch.toLowerCase())){//Dynamic user input
                
                const price = await book.locator(".price_color").innerText(),
                      buyLink = await book.locator("h3 a").getAttribute("href"),//get the relative href link
                      fullLink = new URL(buyLink, page.url()).href; //concat with full website url to have a working url

                console.log("Book Found 😁");
                console.log("Price: ", price);
                console.log("Buy Now: ", fullLink);

                bookFound = true;

                break;
            }
        }

        if(bookFound) break;
        
       
        
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