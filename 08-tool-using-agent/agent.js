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

    // console.log("Function Calls:", response.functionCalls);
    // console.log("Text Response:", response.text);

    const functionCalls = response.functionCalls;
    const functionResponses = [];

    if (functionCalls) {
        for (const call of functionCalls) {

            const toolFunction = tools[call.name];

            if (!toolFunction) {
                console.log("Unknown tool:", call.name);
                continue;
            }

            const result = toolFunction(call.args?.name);

            // console.log("Tool executed:", call.name);
            // console.log("Tool result:", result);

            functionResponses.push({
                
                        functionResponse: {
                        name: call.name,
                        response: {
                            result: result
                        }
                    }
                }
            )
        }
    }


    const finalResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
            {
                role: "user",
                parts: [
                    { text: "What time is it? Also greet Juma." }
                ]
            },
            response.candidates[0].content,
            {
                role: "user",
                parts: functionResponses
            }
        ],
        config: {
            config: {
                tools: [{
                    functionDeclarations
                }]
            }
        }
    });

    console.log("Jumanji:", finalResponse.text);

})

main();

