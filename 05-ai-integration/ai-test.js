require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.AI_AUTOMATION_GEMINI_KEY,
});

async function runAI() {
  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Explain AI automation in simple words",
  });

  console.log(result.text);
}

runAI();