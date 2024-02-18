import { query, mutation, internalMutation } from "./_generated/server";
import { internal } from "../convex/_generated/api";
import { v } from "convex/values";

export const list = query({
  args: { userID: v.string() },
  handler: async (ctx, args) => {
    // Grab the most recent messages.
    const messages = await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("userID"), args.userID))
      .order("desc")
      .take(100);
    // Reverse the list so that it's in a chronological order.
    return messages.reverse();
  },
});

export const send = mutation({
  args: { userID: v.string(), message: v.string() },
  handler: async (ctx, args) => {
    // Save a new message.
    await ctx.db.insert("messages", {
      userID: args.userID,
      message: args.message,
    });
    
    // schedule chatbot to respond after insert
    await ctx.scheduler.runAfter(0, internal.together.answer, {
      userID: args.userID,
      body: args.body
    })
  },
});
