import OpenAI from "openai";
import {
  action,
  internalAction,
  mutation,
  internalQuery,
} from "./_generated/server";
import { api, internal } from "./_generated/api";
import { v } from "convex/values";

const tools = [
  {
    name: "get_recipe_recommendation_request",
    description: "Gathers information about user's request for a recipe recommendation.",
    parameters: {
      type: "object",
      properties: {
        cuisine: {
          type: "string",
          description: "The cuisine of the requested recipe",
        },
        requested_ingredients: {
          type: "array",
          description: "the requested ingredients for the recommended recipe",
        },
        disliked_ingredients: {
          type: "array",
          description: "the ingredients to avoid for the recommended recipe",
        },
      },
      required: ["requested_ingredients"],
    },
  },
  {
    name: "get_recipe_request",
    description: "Retrieves the wanted recipe from the user.",
    parameters: {
      type: "object",
      properties: {
        recipe_name: {
          type: "string",
          description:
            "The name of the requested recipe. Cannot be a ingredient.",
        },
        requested_ingredients: {
          type: "array",
          description: "the requested ingredients for the recipe",
        },
        disliked_ingredients: {
          type: "array",
          description: "the ingredients to avoid for the recipe",
        },
      },
      required: ["recipe_name"],
    },
  },
];

/*
 * FUNCTIONS
 */

// uses function calling to extract data
export const extractData = internalAction({
  args: { userID: v.id("users") },
  handler: async (ctx, args) => {
    let user: any = await ctx.runQuery(api.users.getUser, { id: args.userID });
    let messageHistory = user.messageHistory;

    const openai = new OpenAI({
      apiKey: process.env.TOGETHER_API_KEY,
      baseURL: "https://api.together.xyz/v1",
    });
    const completion = await openai.chat.completions.create({
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      max_tokens: 1024,
      temperature: 0.7,
      functions: tools,
      function_call: "auto",
      messages: messageHistory,
      response_format: { type: "json_object" },
    });

    // Extract the generated completion from the OpenAI API response
    const completionResponse = completion.choices[0].message;
    return completionResponse;
  },
});

export const respond = action({
  args: { userID: v.id("users"), recipe: v.any() },
  handler: async (ctx, args) => {
    // model system call and add to user's message history
    let message : any = {
      role: "assistant",
      content: `Hmm...I think you would like this recipe: ${args.recipe.name} \n Here is the recipe: " ${args.recipe.description} " \nYou can take a peek at the ingredients, too: ${args.recipe.ingredients} \nURL: ${args.recipe.URL}`
    }

    const openai = new OpenAI({
      apiKey: process.env.TOGETHER_API_KEY,
      baseURL: "https://api.together.xyz/v1",
    });
    const completion = await openai.chat.completions.create({
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      max_tokens: 1024,
      temperature: 0.5,
      messages: [ message ]
    });

    // Extract the generated completion from the OpenAI API response
    const completionResponse = completion.choices[0].message;
    return completionResponse;
  },
});
