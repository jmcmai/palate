import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    tokenIdentifier: v.string(),
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
});
