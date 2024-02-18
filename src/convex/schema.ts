import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    tokenIdentifier: v.string(),
    friends: v.array(v.string()),
    likedIngredients: v.array(v.string()),
    dislikedIngredients: v.array(v.string()),
    restrictions: v.array(v.string()),
    events: v.array(v.id("events")),
    recipes: v.array(v.id("recipes")),
    pinned: v.array(v.id("recipes")),
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
    userRecipe: v.array(v.object({user_id: v.id("user"), recipe_id: v.id("recipe")}))
  }),
  recipes: defineTable ({
    name: v.string(),
    liked: v.number(),
    image: v.string(),
    ingredients: v.array(v.string()),
    totalTime: v.number()
  })
});
