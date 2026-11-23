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

const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askUser = () => {
    return new Promise((resolve) => {
        rl.question("You: ", (answer) => {
            resolve(answer);
        });
    });
};

const main = (async () => {

    let userRequest;//Get the user input prompt
    let response;
    let msgHistory = [];//This will store the conversation history, for agent to remember
    do{
        try{
            userRequest = await askUser();

            msgHistory.push({
                role: "user",
                parts: [{text: userRequest}]
            });

            if (userRequest.trim().toLowerCase() === "exit") {
                console.log("Jumanji: Goodbye! 👋");
                break;
            }

            console.log("Conversation history:", JSON.stringify(msgHistory, null, 2));

            response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: msgHistory,
                config: {
                    tools: [{
                        functionDeclarations
                    }]
                }
            });

            console.log("Gemini response:", JSON.stringify(response.candidates[0].content, null, 2));
console.log("Gemini text:", response.text);
console.log("Function calls:", response.functionCalls);

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


            msgHistory.push(response.candidates[0].content);

            msgHistory.push({
                role: "user",
                parts: functionResponses
            });

            const finalResponse = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: [
                    {
                        role: "user",
                        parts: [
                            { text: userRequest }
                        ]
                    },
                    response.candidates[0].content,
                    {
                        role: "user",
                        parts: functionResponses
                    }
                ],
                config: {
                    
                    tools: [{
                        functionDeclarations
                    }]
                    
                }
            });

            msgHistory.push(finalResponse.candidates[0].content);

            console.log("Jumanji:", finalResponse.text);

            // console.log(msgHistory)
    
        }catch(err){
            if(err.status === 429){
                console.log("Jumanji: I've reached my API usage limit. Please try again later.");
            }else{
                console.log("Jumanji: Something went wrong:", err.message);
            }

            continue;
            
        }
    }while(true);


   rl.close();

    // console.log(response)

    // console.log("Function Calls:", response.functionCalls);
    // console.log("Text Response:", response.text);


})

main();

