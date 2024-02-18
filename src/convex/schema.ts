import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";


export default defineSchema({
  users: defineTable({
    name: v.string(),
    tokenIdentifier: v.string(),
    cuisines: v.array(v.string()),
    friends: v.array(v.string()),
    likedIngredients: v.array(v.string()),
    dislikedIngredients: v.array(v.string()),
    restrictions: v.array(v.string()),
    events: v.array(v.id("events")),
    recipes: v.array(v.id("recipes")),
    pinned: v.array(v.id("recipes")),
    pantry: v.array(v.string()),
    messageHistory: v.array(v.object({ role: v.string(), content: v.string() }))
  }).index("by_token", ["tokenIdentifier"]),
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
  .searchIndex("search_dishes", {
    searchField: "name",
  }),
  events: defineTable ({
    name: v.string(),
    date: v.string(),
    host: v.id("users"),
    participants: v.array(v.id("users")),
    recipes: v.array(v.id("recipes")),
  }),
  recipes: defineTable ({
    name: v.string(),
    liked: v.number(),
    image: v.optional(v.string()),
    ingredients: v.optional(v.array(v.string())),
    totalTime: v.optional(v.string()),
    url: v.optional(v.string())
  })
  .index("byLiked", ["liked"])
});
