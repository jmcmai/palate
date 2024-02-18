import { mutation } from "./_generated/server";
import { query } from "./_generated/server";
import { v } from "convex/values";


export const getRecipe = query({
    args: { id: v.id("recipes") },
    handler: async (ctx) => {
      const recipe = await ctx.db.query("recipes").collect();
      return recipe[0];
    },
  });


export const addRecipe = mutation({
    args: { name: v.string(), liked: v.number(), image: v.string(),
         ingredients: v.array(v.string()), totalTime: v.string(), url: v.string()},
    handler: async (ctx, args) => {
    const recipeId = await ctx.db.insert("recipes", { name: args.name,
        liked: args.liked,
        image: args.image,
        ingredients: args.ingredients,
        totalTime: args.totalTime,
        url: args.url
        });
    return recipeId;
    },
});


export const deleteRecipe = mutation({
    args: { id: v.id("recipes") },
    handler: async (ctx, args) => {
      await ctx.db.delete(args.id);
    },
  });


export const updateName = mutation({
    args: { id: v.id("recipes"), name: v.string() },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { name: args.name });
    },
});


export const updateLiked = mutation({
    args: { id: v.id("recipes"), liked: v.number() },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { liked: args.liked });
    },
});