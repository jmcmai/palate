import OpenAI from "openai";
import { internalAction, mutation, internalQuery } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { v } from "convex/values";

const tools = [
  {
    name: "get_recipe_recommendation_request",
    description: "Get the information in a given recipe request.",
    parameters: {
      type: "object",
      properties: {
        cuisine: {
          type: "string",
          description: "The cuisine of the requested dish",
        },
        requested_ingredients: {
          type: "array",
          description: "the requested ingredients for the recommended recipe",
        },
        "disliked_ingredients": {
          "type": "array",
          "description": "the ingredients to avoid for the recommended recipe"
        }
      },
      "required": ["requested_ingredients"]
    }
  },
  {
    "name": "get_recipe_request",
    "description": "Extract the recipe the user wants from the request.",
    "parameters": {
      "type": "object",
      "properties": {
        "recipe_name": {
          "type": "string",
          "description": "The name of the requested recipe. Cannot be a ingredient."
        },
        requested_ingredients: {
          type: "array",
          description: "the requested ingredients for the recipe",
        },
        "disliked_ingredients": {
          "type": "array",
          "description": "the ingredients to avoid for the recipe"
        }
      },
      "required": ["recipe_name"]
    }
  }
];
// 
/*
 * FUNCTIONS
 */

export const answer = internalAction({
  args: {
    userID: v.string(),
    message: v.string()
  },
  handler: async (ctx, args) => {
    // extract json data from the user message
    const data = await extractData( ctx, args );

    if ( !data.content ) {
        const response = data.tool_calls[0];
        const functionCalled = response.function.name;
    
        // add message + function called to the db
        const responseID = await ctx.runMutation(api.together.saveData, {
          botID: "Ramsey",
          response: JSON.stringify(response) || "Error: did not receive response.",
          function: functionCalled
        });
        
        if ( functionCalled === "get_recipe_request" ) {
          console.log("specific recipe requested!");
        } else if ( functionCalled === "get_recipe_recommendation_request") {
          console.log("user wants to request a recommendation!");
        }
      
      } else {
        // add message + function called to the db
        await ctx.runMutation(api.together.saveData, {
          botID: "Ramsey",
          response: data.content,
          function: "None"
        });

        console.log("here is the output: " + data.content);
      }
  }
});

// uses function calling to extract data
async function extractData ( ctx, args ) {
  const openai = new OpenAI({ apiKey: process.env.TOGETHER_API_KEY, baseURL: 'https://api.together.xyz/v1' });
  const completion = await openai.chat.completions.create({
    model: 'togethercomputer/CodeLlama-34b-Instruct',
    max_tokens: 1024,
    functions: tools,
    function_call: 'auto',
    messages: [
      {
        role: 'system',
        content: "You are an assistant that loves cooking and can access external functions. " + 
          "The responses from these function calls will be appended to this dialogue. " +
          "Please provide responses based on the information from these function calls.",
      },
      {
        role: 'user',
        content: args.message
      }
    ],
    response_format: { type: "json_object" }
  });

  // Extract the generated completion from the OpenAI API response
  const completionResponse = completion.choices[0].message;
  return completionResponse;
}

// Saves the chatbot's response from function calling into the database.
export const saveData = mutation ({
  args: { botID: v.string(), function: v.string(), response: v.string() },
  handler: async (ctx, args) => {
    // Save Chatbot Function Calling JSON Data
    return await ctx.db.insert("apiResponses", {
      botID: args.botID,
      function: args.function,
      response: args.response,
    });
  },
});

// grab apiResponse from DB
export const getResponse = internalQuery({
  args: {
    _id: v.id("apiResponses")
  },
  handler: async (ctx, args) => {
    const response = await ctx.db
      .query("apiResponses")
      .filter((q) => q.eq(q.field("_id") === args._id))
      .collect();
    
    return response;
  }
});
