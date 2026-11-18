require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");
const tools = require("./tools");

const ai = new GoogleGenAI({
    apiKey: process.env.AI_AUTOMATION_GEMINI_KEY,
    apiVersion: "v1beta"
});

//Schema of the function tools for AI to understand
const functionDeclarations = [
    {
        name: "getCurrentTime",
        description: "Gets the current time",
        parameters: {
            type: "OBJECT",
            properties: {}
        }

    },

    {
        name: "getCurrentDate",
        description: "Gets the current date",
       parameters: {
            type: "OBJECT",
            properties: {}
        }
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


const main = (async () => {

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "What time is it? Also greet Juma.",
        config: {
            tools: [{
                functionDeclarations
            }]
        }
    });

    // console.log(response)

    console.log("Function Calls:", response.functionCalls);
    console.log("Text Response:", response.text);

})

main();

