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

    //We want to return a JSON structured data of all books at first page, in fields of Img, Title, Price and give AI the Json to suggest a book.
    const booksData = [];
    
    const books = await page.locator(".product_pod"),//array
          count = await books.count();
          
    for(var i=0;i<count;i++){
        let book = books.nth(i),
            booksFound = {
                BookCover : `https://books.toscrape.com/${await book.locator("img").getAttribute("src")}`,
                Title : await book.locator("h3 a").innerText(),
                Price : await book.locator(".price_color").innerText(),
            }

        // console.log(booksFound.Img, booksFound.Title, booksFound.Price)
        booksData.push(booksFound);
    }

    console.log(booksData);

    //AI Time
    const prompt = `
        You are a helpful assistant.

        Here is a list of books scraped from a website:

        ${JSON.stringify(booksData, null, 2)}

        Task:
        1. Pick the 3 best books quickly for me that are the cheapest and have good covers based on the data provided.
        2. Explain why each is good
       
    `;

    const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    console.log(result.text);

    await browser.close();

})();