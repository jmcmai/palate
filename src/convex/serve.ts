import { action } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { v } from "convex/values";

// returns the chatbot's response to the chat
export const answer = action({
  args: {
    userID: v.id("users")
  },
  handler: async (ctx, args) => {
    // get user message history
    const user = await ctx.runQuery( api.users.getUser, { id: args.userID } );

    // extract json data from the user message
    const data = await ctx.runAction(internal.together.extractData, { userID: args.userID });

    // check function calling vs info gathering: no content means JSON was returned.
    let answer : string = "";
    if ( !data.content ) {
        const response = data.tool_calls![0];
        const functionCalled = response.function.name;
        
        // parse out information + add user preferences
        let recipe = "";
        if ( functionCalled === "get_recipe_request" ) {
          // get recipe name
          console.log("user wants to find a recipe for a dish!");
          recipe = JSON.parse(response.function.arguments).recipe_name;
        } else if ( functionCalled === "get_recipe_recommendation_request" ) {
          console.log("user wants to request a recommendation!");
          // take into account likes and dislikes, def no dietary restrictions
          let likedIngredients : string[] = user.likedIngredients.concat(JSON.parse(response.function.arguments).requested_ingredients);
          let dislikedIngredients : string[] = user.dislikedIngredients.concat(JSON.parse(response.function.arguments).disliked_ingredients);
          let cuisine : string[] = [JSON.parse(response.function.arguments).cuisine];

          const dishes = await ctx.runAction (api.dishes.searchDishes, { 
            ingredients: likedIngredients,
            dislikedIngredients: dislikedIngredients,
            cuisine: cuisine,
          });

          recipe = dishes[0];
        }
        // search up things and get links
        let searchQuery = recipe + " recipe";
        console.log(searchQuery);
        const recipeURLs = await ctx.runAction(api.recipeRetrievers.retrieveSearch, { searchParam: searchQuery });

        // recipe scraper
        const recipes = await ctx.runAction(api.recipeRetrievers.scrapeRecipes, { recipeURLs: recipeURLs });
        const r = recipes[0]
        const recipeJSON = JSON.parse(r);
        console.log(recipeJSON);

        // add recipe to user's recipe book.

        // run action to get response using AI
        const message : any = await ctx.runAction(api.together.respond, { userID: args.userID, recipe: recipeJSON });
        console.log(message);
        answer = message.content;
      } else {
        // add function called to the db
        console.log(data.content);
        answer = data.content;
      }

      // save response to user chat history
      await ctx.runMutation( api.users.addMessage, {
        id: args.userID,
        role: "assistant",
        content: answer,
      });

      return answer;
  }
});