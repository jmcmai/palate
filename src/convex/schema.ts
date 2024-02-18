import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  dishes: defineTable({
    cuisine: v.string(),
    ingredients: v.string(),
    name: v.string(),
  }),
  users: defineTable({
    disliked_ingredients: v.array(v.any()),
    events: v.array(v.any()),
    friends: v.array(v.any()),
    liked_ingredients: v.array(v.any()),
    name: v.string(),
    pinned: v.array(v.any()),
    recipes: v.object({
      disliked: v.array(v.any()),
      liked: v.array(v.any()),
    }),
    restrictions: v.array(v.any()),
    tokenIdentifier: v.string(),
  }),
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
