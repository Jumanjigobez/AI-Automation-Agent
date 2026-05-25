require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.AI_AUTOMATION_GEMINI_KEY,
});

const {chromium} = require("playwright");

(async () => {
    const browser = await chromium.launch({headless: true}),
          page = await browser.newPage();

    await page.goto("https://books.toscrape.com"); //Website used

    console.log("Website opened...");

    //So we want to have a mini agent that can suggest a book but also can go to next page to find more books and suggest interesting ones
    const memory = {
        visitedPages: 0,
        interestingBooks: [],
    };

    const booksData = [];

    while(memory.visitedPages < 10){ //limit to 10 pages to avoid infinite loop
        const books = await page.locator(".product_pod"),//array
              count = await books.count();
          
        for(var i=0;i<count;i++){
            let book = books.nth(i),
                booksFound = {
                    BookCover : `https://books.toscrape.com/${await book.locator("img").getAttribute("src")}`,
                    Title : await book.locator("h3 a").innerText(),
                    Price : await book.locator(".price_color").innerText(),
                }

            booksData.push(booksFound);
        }

        //AI Time
        const prompt = `
            You are a helpful assistant.

            Here is a list of books scraped from a website:

            ${JSON.stringify(booksData, null, 2)}

            Task:
            1. Pick the 3 best interesting books.
            2. Explain why each is good
           
        `;

        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        console.log(result.text);

        //store the interesting books in memory
        memory.interestingBooks.push(result.text);

        //Check if user is satisfied with the suggestions, if not go to next page and repeat
        const userSatisfied = await new Promise((resolve) => {
            console.log("Are you satisfied with the suggestions? (yes/no)");
            process.stdin.once("data", (data) => {
                resolve(data.toString().trim().toLowerCase() === "yes");
            });
        });

        if(userSatisfied){
            console.log("Great! Enjoy your book!");
            break;
        }else{
            const NextBtn = await page.locator(".next a").count();

            if(NextBtn > 0){
                console.log("Going to Next Page...");
                await page.click(".next a");
                await page.waitForLoadState("domcontentloaded");
                memory.visitedPages++;
            }else{
                console.log("No more pages to visit. Ending search.");
                break;
            }
        }
    
    }

    console.log("Pages Visited: ", memory.visitedPages);
    console.log("Interesting Books Found: ", memory.interestingBooks.length);

    await page.close();
    await browser.close();
})();