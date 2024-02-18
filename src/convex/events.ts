import { action, mutation } from "./_generated/server";
import { query } from "./_generated/server";
import { api } from "../convex/_generated/api";
import { v } from "convex/values";

interface Recipe {
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  tags: string[];
  time: {
    prep: string;
    cook: string;
    active: string;
    inactive: string;
    ready: string;
    total: string;
  };
  servings: string;
  image: string;
  URL: string;
}

export const getEvent = query({
  args: { id: v.id("events") },
  handler: async (ctx) => {
    const event = await ctx.db.query("events").collect();
    return event[0];
  },
});

export const addEvent = mutation({
  args: { name: v.string(), date: v.string(), invitees: v.array(v.id("users")) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    if (user === null) {
      return false;
    }

    const eventId = await ctx.db.insert("events", {
      name: args.name,
      date: args.date,
      host: user._id,
      participants: args.invitees,
      recipes: [],
    });
    return eventId;
  },
});

export const deleteEvent = mutation({
  args: { id: v.id("events") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const updateName = mutation({
  args: { id: v.id("events"), name: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { name: args.name });
  },
});

export const updateDate = mutation({
  args: { id: v.id("events"), date: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { date: args.date });
  },
});

export const addParticipant = mutation({
  args: { id: v.id("events"), participantId: v.id("users") },
  handler: async (ctx, args) => {
    const id = args.id;
    const event = await ctx.db.get(id);

    if (event === null) {
      return false;
    }

    let updatedParticipants = event.participants;
    if (!updatedParticipants.includes(args.participantId)) {
      updatedParticipants.push(args.participantId);
      await ctx.db.patch(args.id, { participants: updatedParticipants });
    }

    return true;
  },
});

export const removeParticipant = mutation({
  args: { id: v.id("events"), participantId: v.id("users") },
  handler: async (ctx, args) => {
    const id = args.id;
    const event = await ctx.db.get(id);

    if (event === null) {
      return false;
    }

    let updatedParticipants = event.participants;
    const index = updatedParticipants.indexOf(args.participantId);
    if (index !== -1) {
      updatedParticipants.splice(index, 1);
      await ctx.db.patch(args.id, { participants: updatedParticipants });
    }

    return true;
  },
});

export const getParticipantsData = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.eventId);
    return Promise.all((event?.participants ?? []).map((userId) => ctx.db.get(userId)));
  },
});

export const addRecommendations = mutation({
  args: { id: v.id("events"), recipes: v.array(v.id("recipes")) },
  handler: async (ctx, args) => {
    const id = args.id;
    const event = await ctx.db.get(id);

    if (event === null) {
      return false;
    }

    await ctx.db.patch(args.id, { recipes: args.recipes });

    return true;
  },
});

export const getRecommendation = query({
  args: { id: v.id("events") },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.id);
    return Promise.all((event?.recipes ?? []).map((recipeId) => ctx.db.get(recipeId)));
  },
});

export const syncPalate = action({
  args: { id: v.id("events") },
  handler: async (ctx, args) => {
    const participants = await ctx.runQuery(api.events.getParticipantsData, { eventId: args.id });

    if (!participants) {
      return;
    }

    let user = participants[0];
    if (!user) {
      return;
    }

    let cuisinesIntersec: string[] = user.cuisines;
    let cuisinesUnion: string[] = user.cuisines;
    let ingredients: string[] = user.likedIngredients;
    let dislikedIngredients: string[] = user.dislikedIngredients;

    for (let i = 1; i < participants.length; i++) {
      let user = participants[i];
      if (!user) {
        return;
      }
      const userCuisines = user.cuisines;
      cuisinesIntersec = cuisinesIntersec.filter((c) => userCuisines.includes(c));
      cuisinesUnion = [...new Set([...user.cuisines, ...cuisinesUnion])];
      ingredients = [...new Set([...user.likedIngredients, ...ingredients])];
      dislikedIngredients = [...new Set([...user.dislikedIngredients, ...dislikedIngredients])];
    }

    let cuisines: string[] = cuisinesIntersec;

    if (cuisinesIntersec.length === 0) {
      cuisines = cuisinesUnion;
    }

    let recipes = [];
    for (let i = 0; i < 3; i++) {
      const dishes = await ctx.runAction(api.dishes.searchDishes, {
        ingredients: ingredients,
        dislikedIngredients: dislikedIngredients,
        cuisine: cuisines,
      });

      const searchQuery = dishes[i] + " recipe";
      const urls = await ctx.runAction(api.recipeRetrievers.retrieveSearch, {
        searchParam: searchQuery,
      });
      const scrapedRecipes = await ctx.runAction(api.recipeRetrievers.scrapeRecipes, {
        recipeURLs: urls,
      });

      if (scrapedRecipes.length !== 0) {
        const recipe: Recipe = JSON.parse(scrapedRecipes[0]);
        const recipeId = await ctx.runMutation(api.recipes.addRecipe, {
          name: recipe.name,
          liked: 0,
          image: recipe.image,
          ingredients: recipe.ingredients,
          totalTime: recipe.time.total,
          url: recipe.URL,
        });
        recipes.push(recipeId);
      }
    }
  },
});
