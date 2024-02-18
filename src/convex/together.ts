import OpenAI from "openai";
import { action, mutation, internalQuery } from "./_generated/server";
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

export const answer = action({
  args: {
    userID: v.id("users")
  },
  handler: async (ctx, args) => {
    // get user message history
    const user = await ctx.runQuery( api.users.getUser, { id: args.userID } );
    const userMessageHistory: any = user.messageHistory;

    // extract json data from the user message
    const data = await extractData( userMessageHistory );

    if ( !data.content ) {
        const response = data.tool_calls![0];
        const functionCalled = response.function.name;
        
        // parse out information + add user preferences
        let recipe = "";
        if ( functionCalled === "get_recipe_request" ) {
          // get recipe name
          recipe = JSON.parse(response.function.arguments).recipe_name;
        } else if ( functionCalled === "get_recipe_recommendation_request" ) {
          console.log("user wants to request a recommendation!");
          // take into account likes and dislikes, def no dietary restrictions
        }
        // search up things and get links
        let searchQuery = recipe + " recipe";
        const recipeURLs = await ctx.runAction(api.tavily.retrieveSearch, { searchParam: searchQuery });
        console.log(recipeURLs);

        // recipe scraper
      
      } else {
        // add function called to the db
        console.log(data.content);
        // await ctx.runMutation(api.together.saveData, {
        //   botID: "Ramsey",
        //   response: data.content,
        //   function: "None"
        // });

        // save to user messages
        await ctx.runMutation( api.users.addMessage, {
          id: args.userID,
          role: "assistant",
          content: data.content,
        });

      // TODO: return a response to the user !!
      }

  }
});

// uses function calling to extract data
async function extractData ( userMessageHistory: [] ) {
  const openai = new OpenAI({ apiKey: process.env.TOGETHER_API_KEY, baseURL: 'https://api.together.xyz/v1' });
  const completion = await openai.chat.completions.create({
    model: 'togethercomputer/CodeLlama-34b-Instruct',
    max_tokens: 1024,
    functions: tools,
    function_call: 'auto',
    messages: userMessageHistory,
    response_format: { type: "json_object" }
  });

  // Extract the generated completion from the OpenAI API response
  const completionResponse = completion.choices[0].message;
  return completionResponse;
}