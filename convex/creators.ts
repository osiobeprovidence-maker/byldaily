import { v } from "convex/values";
import { query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("creators").collect();
  },
});

export const getById = query({
  args: { id: v.id("creators") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
