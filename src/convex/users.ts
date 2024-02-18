import { action, query, mutation } from "./_generated/server";
import { internal } from "../convex/_generated/api";
import { v } from "convex/values";


/**
 * Insert or update the user in a Convex table then return the document's ID.
 *
 * The `UserIdentity.tokenIdentifier` string is a stable and unique value we use
 * to look up identities.
 *
 * Keep in mind that `UserIdentity` has a number of optional fields, the
 * presence of which depends on the identity provider chosen. It's up to the
 * application developer to determine which ones are available and to decide
 * which of those need to be persisted. For Clerk the fields are determined
 * by the JWT token's Claims config.
 */
export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    // Check if we've already stored this identity before.
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
    if (user !== null) {
      // If we've seen this identity before but the name has changed, patch the value.
      if (user.name !== identity.name) {
        await ctx.db.patch(user._id, { name: identity.name });
      }
      return user._id;
    }
    // If it's a new identity, create a new `User`.
    return await ctx.db.insert("users", {
      name: identity.name!,
      tokenIdentifier: identity.tokenIdentifier,
      cuisines: [],
      friends: [],
      likedIngredients: [],
      dislikedIngredients: [],
      restrictions: [],
      events: [],
      recipes: [],
      pinned: [],
      messageHistory: [{ content: "You are an assistant that loves cooking and can access external functions. " + 
      "The responses from these function calls will be appended to this dialogue. " +
      "Please provide responses based on the information from these function calls. Do not make new information up.", role: "system" }]
    });
  },
});


export const getUser = query({
  args: { id: v.id("users") },
  handler: async (ctx) => {
    const user = await ctx.db.query("users").collect();
    return user[0];
  },
});


export const retrieveUserData = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();
    
    if (user === null) {
      return false;
    }

    return user;
  },
});


export const addFriend = mutation({
  args: { friend_id: v.id("users") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();
    
    if (user === null) {
      return false;
    }

    let updatedFriendsList = user.friends;
    if (!updatedFriendsList.includes(args.friend_id)) {
      updatedFriendsList.push(args.friend_id);
      await ctx.db.patch(user._id, { friends: updatedFriendsList });
    }

    return true;
  },
});


export const removeFriend = mutation({
  args: { friend_id: v.id("users") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();
    
    if (user === null) {
      return false;
    }

    let updatedFriendsList = user.friends;

    const index = updatedFriendsList.indexOf(args.friend_id);
    if (index !== -1) {
      updatedFriendsList.splice(index, 1);
      await ctx.db.patch(user._id, { friends: updatedFriendsList });
    }

    return true;
  },
});


export const addCuisine = mutation({
  args: { cuisine: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();
    
    if (user === null) {
      return false;
    }

    let updatedCuisines = user.cuisines;
    if (!updatedCuisines.includes(args.cuisine)) {
      updatedCuisines.push(args.cuisine);
      await ctx.db.patch(user._id, { cuisines: updatedCuisines });
    }

    return true;
  },
});


export const removeCuisine = mutation({
  args: { cuisine: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();
    
    if (user === null) {
      return false;
    }

    let updatedCuisines = user.cuisines;

    const index = updatedCuisines.indexOf(args.cuisine);
    if (index !== -1) {
      updatedCuisines.splice(index, 1);
      await ctx.db.patch(user._id, { cuisines: updatedCuisines });
    }

    return true;
  },
});


export const addLikedIngredient = mutation({
  args: { ingredient: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();
    
    if (user === null) {
      return false;
    }

    let updatedLikedIngredients = user.likedIngredients;
    if (!updatedLikedIngredients.includes(args.ingredient)) {
      updatedLikedIngredients.push(args.ingredient);
      await ctx.db.patch(user._id, { likedIngredients: updatedLikedIngredients });
    }

    return true;
  },
});


export const removeLikedIngredient = mutation({
  args: { ingredient: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();
    
    if (user === null) {
      return false;
    }

    let updatedLikedIngredients = user.likedIngredients;

    const index = updatedLikedIngredients.indexOf(args.ingredient);
    if (index !== -1) {
      updatedLikedIngredients.splice(index, 1);
      await ctx.db.patch(user._id, { likedIngredients: updatedLikedIngredients });
    }

    return true;
  },
});


export const addDislikedIngredient = mutation({
  args: { ingredient: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();
    
    if (user === null) {
      return false;
    }

    let updatedDislikedIngredients = user.dislikedIngredients;
    if (!updatedDislikedIngredients.includes(args.ingredient)) {
      updatedDislikedIngredients.push(args.ingredient);
      await ctx.db.patch(user._id, { dislikedIngredients: updatedDislikedIngredients });
    }

    return true;
  },
});


export const removeDislikedIngredient = mutation({
  args: { ingredient: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();
    
    if (user === null) {
      return false;
    }

    let updatedDislikedIngredients = user.dislikedIngredients;

    const index = updatedDislikedIngredients.indexOf(args.ingredient);
    if (index !== -1) {
      updatedDislikedIngredients.splice(index, 1);
      await ctx.db.patch(user._id, { dislikedIngredients: updatedDislikedIngredients });
    }

    return true;
  },
});


export const addRestriction = mutation({
  args: { diet: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();
    
    if (user === null) {
      return false;
    }

    let updatedDiet = user.restrictions;
    if (!updatedDiet.includes(args.diet)) {
      updatedDiet.push(args.diet);
      await ctx.db.patch(user._id, { restrictions: updatedDiet });
    }

    return true;
  },
});


export const removeRestriction = mutation({
  args: { diet: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();
    
    if (user === null) {
      return false;
    }

    let updatedDiet = user.restrictions;

    const index = updatedDiet.indexOf(args.diet);
    if (index !== -1) {
      updatedDiet.splice(index, 1);
      await ctx.db.patch(user._id, { restrictions: updatedDiet });
    }

    return true;
  },
});


export const addEvent = mutation({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();
    
    if (user === null) {
      return false;
    }

    let updatedEvents = user.events;
    if (!updatedEvents.includes(args.eventId)) {
      updatedEvents.push(args.eventId);
      await ctx.db.patch(user._id, { events: updatedEvents });
    }

    return true;
  },
});


export const removeEvents = mutation({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();
    
    if (user === null) {
      return false;
    }

    let updatedEvents = user.events;

    const index = updatedEvents.indexOf(args.eventId);
    if (index !== -1) {
      updatedEvents.splice(index, 1);
      await ctx.db.patch(user._id, { events: updatedEvents });
    }

    return true;
  },
});

export const addRecipe = mutation({
  args: { recipeId: v.id("recipes") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();
    
    if (user === null) {
      return false;
    }

    let updatedRecipes = user.recipes;
    if (!updatedRecipes.includes(args.recipeId)) {
      updatedRecipes.push(args.recipeId);
      await ctx.db.patch(user._id, { recipes: updatedRecipes });
    }

    return true;
  },
});


export const removeRecipe = mutation({
  args: { recipeId: v.id("recipes") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();
    
    if (user === null) {
      return false;
    }

    let updatedRecipes = user.recipes;

    const index = updatedRecipes.indexOf(args.recipeId);
    if (index !== -1) {
      updatedRecipes.splice(index, 1);
      await ctx.db.patch(user._id, { recipes: updatedRecipes });
    }

    return true;
  },
});


export const addMessage = mutation({
  args: { id: v.id("users"), role: v.string(), content: v.string() },
  handler: async (ctx, args) => {
    /*
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();
    
    if (user === null) {
      return false;
    }
    */

    const id = args.id;
    const user = await ctx.db.get(id);

    if (user === null) {
      return false;
    }

    const msg: { role: string; content: string; } = {
      role: args.role,
      content: args.content
    }

    let updatedMsgs = user.messageHistory;
    updatedMsgs.push(msg);
    await ctx.db.patch(user._id, { messageHistory: updatedMsgs });

    return true;
  },
});

