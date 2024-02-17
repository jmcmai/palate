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
  args: { userID: v.string(), body: v.string() },
  handler: async (ctx, args) => {
    // Save a new message.
    const userMessageID = await ctx.db.insert("messages", { userID: args.userID, body: args.body });
    console.log(userMessageID);
    return userMessageID;
  },
});
