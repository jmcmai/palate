import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    tokenIdentifier: v.string(),
    friends: v.array(v.string()),
    liked_ingredients: v.array(v.string()),
    disliked_ingredients: v.array(v.string()),
    restrictions: v.array(v.string()),
    events: v.array(v.string()),
    recipes: v.object({
      liked: v.array(v.string()),
      disliked: v.array(v.string()),
    }),
    pinned: v.array(v.string()),
  }).index("by_token", ["tokenIdentifier"]),
  messages: defineTable({
    body: v.string(),
    userID: v.string(),
  }),
  jenny_users: defineTable({
    dietaryRestrictions: v.array(v.string()),
    dislikedIngredients: v.array(v.string()),
    friends: v.array(v.string()),
    likedIngredients: v.array(v.string()),
    userID: v.string(),
    userName: v.string(),
  }),
  apiResponses: defineTable({
    response: v.string(),
    botID: v.string(),
    function: v.string()
  }),
  dishes: defineTable({
    name: v.string(),
    ingredients: v.string(),
    cuisine: v.string()
  })
  .searchIndex("search_ingredients", {
    searchField: "ingredients",
    filterFields: ["cuisine"], })
});