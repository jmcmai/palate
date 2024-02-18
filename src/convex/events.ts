import { action, mutation } from "./_generated/server";
import { query } from "./_generated/server";
import { api, internal } from "../convex/_generated/api";
import { v } from "convex/values";


export const getEvent = query({
    args: { id: v.id("events") },
    handler: async (ctx) => {
      const event = await ctx.db.query("events").collect();
      return event[0];
    },
  });


export const addEvent = mutation({
    args: { name: v.string(), date: v.string(), invitees: v.array(v.id("users")) },
    handler: async (ctx, args) => {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) {
        throw new Error("Called storeUser without authentication present");
      }
  
      const user = await ctx.db
        .query("users")
        .withIndex("by_token", (q) =>
          q.eq("tokenIdentifier", identity.tokenIdentifier)
        )
        .unique();
      
      if (user === null) {
        return false;
      }

      const eventId = await ctx.db.insert("events", { name: args.name,
                                                      date: args.date,
                                                      host: user._id,
                                                      participants:
                                                      args.invitees,
                                                      userRecipe: [] });
      return eventId;
    },
});


export const deleteEvent = mutation({
  args: { id: v.id("events") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});


export const updateName = mutation({
    args: { id: v.id("events"), name: v.string() },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { name: args.name });
    },
});


export const updateDate = mutation({
    args: { id: v.id("events"), date: v.string() },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { date: args.date });
    },
});


export const addParticipant = mutation({
    args: { id: v.id("events"), participantId: v.id("users") },
    handler: async (ctx, args) => {
      const id = args.id;
      const event = await ctx.db.get(id);
  
      if (event === null) {
        return false;
      }

      let updatedParticipants = event.participants;
      if (!updatedParticipants.includes(args.participantId)) {
        updatedParticipants.push(args.participantId);
        await ctx.db.patch(args.id, { participants: updatedParticipants });
      }

      return true;
    },
});


export const removeParticipant = mutation({
    args: { id: v.id("events"), participantId: v.id("users") },
    handler: async (ctx, args) => {
      const id = args.id;
      const event = await ctx.db.get(id);
  
      if (event === null) {
        return false;
      }

      let updatedParticipants = event.participants;
      const index = updatedParticipants.indexOf(args.participantId);
      if (index !== -1) {
        updatedParticipants.splice(index, 1);
        await ctx.db.patch(args.id, { participants: updatedParticipants });
      }

      return true;
    },
});


export const syncPalate = action({
    args: { id: v.id("events") },
    handler: async (ctx, args) => {
        const event = await ctx.runQuery(api.events.getEvent, {id: args.id});
        const participants = event.participants;

        let user = await ctx.runQuery(api.users.getUser, {id: participants[0]});
        let cuisine = user.cuisines;
        let ingredients = user.likedIngredients;

        for (let i = 1; i < participants.length; i++) {
            user = await ctx.runQuery(api.users.getUser, {id: participants[i]});
            cuisine = [...new Set([...user.cuisines, ...cuisine])];
            ingredients = [...new Set([...user.likedIngredients, ...ingredients])];
        }

        if (cuisine && ingredients) {
        }
    },
});