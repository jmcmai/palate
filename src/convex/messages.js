import { query, mutation, internalMutation } from "./_generated/server";
import { internal } from "../convex/_generated/api";
import { v } from "convex/values";

export const listUsersChatHistory = query({
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

export const saveAndSendUserMessage = mutation({
  args: { userID: v.string(), body: v.string() },
  handler: async (ctx, args) => {
    // Save a new message.
    await ctx.db.insert("messages", { userID: args.userID, body: args.body });

    // send user message to cb
    await ctx.scheduler.runAfter(0, internal.together.requestRecipeFC, { messageBody: args.body });
  },
});
