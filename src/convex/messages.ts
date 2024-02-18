import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from "convex/values";

// function to send user message to the chatbot.
export const send = action({
  args: { userID: v.id("users"), role: v.string(), content: v.string() },
  handler: async (ctx, args) => {
    // Save a new message to the chat history
    await ctx.runMutation( api.users.addMessage, {
      id: args.userID,
      role: args.role,
      content: args.content,
    });
    
    // schedule chatbot to respond after insert
    // const ans = await ctx.scheduler.runAfter(0, api.serve.answer, {
    //   userID: args.userID
    // })
    // console.log(ans);
  }
});
