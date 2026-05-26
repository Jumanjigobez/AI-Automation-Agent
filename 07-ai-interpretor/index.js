require('dotenv').config();

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.AI_AUTOMATION_GEMINI_KEY,
});

const {chromium} = require("playwright");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

//Function to ask user for input in command line
const ask = (question) => {
  return new Promise((resolve) => {

    rl.question(question, (answer) => {
      resolve(answer);
    });

  });
}

(async () => {
    const browser = await chromium.launch({headless: true}),
          page = await browser.newPage();

    await page.goto("https://books.toscrape.com"); //Website used

    console.log("Website opened...");

    //So we want to have agent that will interpret the user input request dynamically and find the book or suggest books based on the user input
    const userRequest = await ask("What kind of books are you looking for? ");

    console.log('Doing my thing, Please Wait...');
    
    const prompt = `
        You are a helpful assistant.

        A user has made the following request:
        ${userRequest}

        Your task is to interpret the user's request and suggest 5 interesting books from the website. 
        Consider factors like book title, price, and cover image when making your suggestions.

        Here is a list of books scraped from the website:

    `;

    const books = await page.locator(".product_pod"),//array
          count = await books.count();

    const booksData = [];

    for(var i=0;i<count;i++){
        let book = books.nth(i),
            booksFound = {
                BookCover : `https://books.toscrape.com/${await book.locator("img").getAttribute("src")}`,
                Title : await book.locator("h3 a").innerText(),
                Price : await book.locator(".price_color").innerText(),
            }

        booksData.push(booksFound);
    }

    const finalPrompt = prompt + JSON.stringify(booksData, null, 2);

    const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: finalPrompt,
    });

    console.log("AI Suggestions: ", result.text);      

    await page.close();
    await browser.close();
})();