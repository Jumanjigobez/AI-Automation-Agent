require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");
const tools = require("./tools");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

//Schema of the function tools for AI to understand
const functionDeclarations = [
    {
        name: "getCurrentTime",
        description: "Gets the current time",
        parameters: "no parameters",

    },

    {
        name: "getCurrentDate",
        description: "Gets the current date",
        parameters: "no parameters",
    },

    {
        name: "greetUser",
        description: "Greets the user by their name",
        parameters: {
            type: "OBJECT",
            properties: {
                name: {
                    type: "STRING",
                    description: "The name of the person to greet"
                }
            },
            required: ["name"],

        }
    }
    
]