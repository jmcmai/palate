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
    description: "Extract the recipe the user wants from the request.",
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
      model: "togethercomputer/CodeLlama-34b-Instruct",
      max_tokens: 1024,
      temperature: 0.1,
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
    let recommendInstructions =
      "You are an assistant who is now recommending the user a recipe. Please recommend the following information from the preassigned recipe: \n\n" +
      `You must include the name of the recipe: ${args.recipe.name} \n` +
      `You must include the description of the recipe: ${args.recipe.description} \n` +
      `You must include the ingredients list of the recipe (in a list format): ${args.recipe.ingredients} \n` +
      `You must include the URL of the recipe: ${args.recipe.URL}. \n\n` +
      "You must recommend all of these fields. You cannot leave any of these fields out of your response. Do not change anything related to the recipe.";

    await ctx.runMutation(api.users.addMessage, {
      role: "system",
      content: recommendInstructions,
      id: args.userID,
    });

    // get recommendation message
    const user: any = await ctx.runQuery(api.users.getUser, { id: args.userID });
    const openai = new OpenAI({
      apiKey: process.env.TOGETHER_API_KEY,
      baseURL: "https://api.together.xyz/v1",
    });
    const completion = await openai.chat.completions.create({
      model: "togethercomputer/CodeLlama-34b-Instruct",
      max_tokens: 1024,
      temperature: 0.1,
      messages: user.messageHistory,
    });

    // Extract the generated completion from the OpenAI API response
    const completionResponse = completion.choices[0].message;
    return completionResponse;
  },
});
