import { mutation } from "./_generated/server";
import { action, query } from "./_generated/server";
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
      friends: [],
      liked_ingredients: [],
      disliked_ingredients: [],
      restrictions: [],
      events: [],
      recipes: {
        liked: [],
        disliked: [],
      },
      pinned: [],
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

export const addFriend = mutation({
  args: { id: v.id("users"), friend_id: v.id("users") },
  handler: async (ctx, args) => {
    const id = args.id;
    const user = await ctx.db.get(id);

    if (user === null) {
      return false;
    }

    let updatedFriendsList = user.friends;
    if (!updatedFriendsList.includes(args.friend_id)) {
      updatedFriendsList.push(args.friend_id);
      await ctx.db.patch(id, { friends: updatedFriendsList });
    }

    return true;
  },
});

export const removeFriend = mutation({
  args: { id: v.id("users"), friend_id: v.id("users") },
  handler: async (ctx, args) => {
    const id = args.id;
    const user = await ctx.db.get(id);

    if (user === null) {
      return false;
    }

    let updatedFriendsList = user.friends;

    const index = updatedFriendsList.indexOf(args.friend_id);
    if (index !== -1) {
      updatedFriendsList.splice(index, 1);
      await ctx.db.patch(id, { friends: updatedFriendsList });
    }

    return true;
  },
});

export const addLikedIngredient = mutation({
  args: { id: v.id("users"), ingredient: v.string() },
  handler: async (ctx, args) => {
    const id = args.id;
    const user = await ctx.db.get(id);

    if (user === null) {
      return false;
    }

    let updatedLikedIngredients = user.liked_ingredients;
    if (!updatedLikedIngredients.includes(args.ingredient)) {
      updatedLikedIngredients.push(args.ingredient);
      await ctx.db.patch(id, { liked_ingredients: updatedLikedIngredients });
    }

    return true;
  },
});

export const removeLikedIngredient = mutation({
  args: { id: v.id("users"), ingredient: v.string() },
  handler: async (ctx, args) => {
    const id = args.id;
    const user = await ctx.db.get(id);

    if (user === null) {
      return false;
    }

    let updatedLikedIngredients = user.liked_ingredients;

    const index = updatedLikedIngredients.indexOf(args.ingredient);
    if (index !== -1) {
      updatedLikedIngredients.splice(index, 1);
      await ctx.db.patch(id, { liked_ingredients: updatedLikedIngredients });
    }

    return true;
  },
});

export const addDislikedIngredient = mutation({
  args: { id: v.id("users"), ingredient: v.string() },
  handler: async (ctx, args) => {
    const id = args.id;
    const user = await ctx.db.get(id);

    if (user === null) {
      return false;
    }

    let updatedDislikedIngredients = user.disliked_ingredients;
    if (!updatedDislikedIngredients.includes(args.ingredient)) {
      updatedDislikedIngredients.push(args.ingredient);
      await ctx.db.patch(id, { disliked_ingredients: updatedDislikedIngredients });
    }

    return true;
  },
});

export const removeDislikedIngredient = mutation({
  args: { id: v.id("users"), ingredient: v.string() },
  handler: async (ctx, args) => {
    const id = args.id;
    const user = await ctx.db.get(id);

    if (user === null) {
      return false;
    }

    let updatedDislikedIngredients = user.disliked_ingredients;

    const index = updatedDislikedIngredients.indexOf(args.ingredient);
    if (index !== -1) {
      updatedDislikedIngredients.splice(index, 1);
      await ctx.db.patch(id, { disliked_ingredients: updatedDislikedIngredients });
    }

    return true;
  },
});

export const addRestriction = mutation({
  args: { id: v.id("users"), diet: v.string() },
  handler: async (ctx, args) => {
    const id = args.id;
    const user = await ctx.db.get(id);

    if (user === null) {
      return false;
    }

    let updatedDiet = user.restrictions;
    if (!updatedDiet.includes(args.diet)) {
      updatedDiet.push(args.diet);
      await ctx.db.patch(id, { restrictions: updatedDiet });
    }

    return true;
  },
});

export const removeRestriction = mutation({
  args: { id: v.id("users"), diet: v.string() },
  handler: async (ctx, args) => {
    const id = args.id;
    const user = await ctx.db.get(id);

    if (user === null) {
      return false;
    }

    let updatedDiet = user.restrictions;

    const index = updatedDiet.indexOf(args.diet);
    if (index !== -1) {
      updatedDiet.splice(index, 1);
      await ctx.db.patch(id, { restrictions: updatedDiet });
    }

    return true;
  },
});