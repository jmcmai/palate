import OpenAI from "openai";
import { action, internalMutation } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { v } from "convex/values";

// Initialize the OpenAI client with the given API key
const apiKey = process.env.TOGETHER_API_KEY;
const baseURL = 'https://api.together.xyz/v1';

const openai = new OpenAI({ apiKey: apiKey, baseURL: baseURL });

const headers = new Headers({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${apiKey}`
})

const tools = [
  {
    "type": "function",
    "function": {
      "name": "get_recipe_recommendation_request",
      "description": "Get the information in a given recipe request.",
      "parameters": {
        "type": "object",
        "properties": {
          "cuisine": {
            "type": "string",
            "description": "The cuisine of the requested dish"
          },
          "requested_ingredients": {
            "type": "array",
            "description": "the requested ingredients for the recommended recipe"
          },
          "disliked_ingredients": {
            "type": "array",
            "description": "the ingredients to avoid for the recommended recipe"
          }
        }
      }
    }
  },
  {
    "type": "function",
    "function": {
      "name": "get_recipe_request",
      "description": "Extract the recipe the user wants from the request.",
      "parameters": {
        "type": "object",
        "properties": {
          "recipe_name": {
            "type": "string",
            "description": "The name of the requested dish."
          },
          "requested_ingredients": {
            "type": "array",
            "description": "the requested ingredients for the recipe"
          },
          "disliked_ingredients": {
            "type": "array",
            "description": "the ingredients to avoid for the recipe"
          }
        }
      }
    }
  }
]

export const requestRecipeFC = action({
  args: {
    messageBody: v.string(),
  },
  handler: async (ctx, args) => {
    const completion = await openai.chat.completions.create({
      model: 'togethercomputer/CodeLlama-34b-Instruct',
      max_tokens: 1024,
      functions: tools,
      function_call: 'auto',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that can access external functions. The responses from these function calls will be appended to this dialogue. Please provide responses based on the information from these function calls.'
        },
        {
          role: 'user',
          content: args.messageBody
        }
      ]
    });

    // Pull the message content out of the response
    const response = completion.choices[0].message;
    console.log(response);

    // add message to the db
    await ctx.runMutation(internal.together.saveChatbotMessage, {
      botID: "Ramsey",
      response: JSON.stringify(response) || "No Answer",
    });

    // check function name 

    // if recommendation --> go to food database

    // if recipe request --> go to tavily
  }
});

export const saveChatbotMessage = internalMutation ({
  args: { botID: v.string(), response: v.string() },
  handler: async (ctx, args) => {
    // Save a new message.
    await ctx.db.insert("apiResponses", { botID: args.botID, response: args.response });

  },
});

