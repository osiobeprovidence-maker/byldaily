import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {
    category: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let articles = ctx.db
      .query("articles")
      .withIndex("by_published", (q) => q.eq("published", true))
      .order("desc");

    if (args.limit) {
      articles = articles.take(args.limit);
    }

    const results = await articles.collect();

    if (args.category) {
      return results.filter((a) => a.category === args.category);
    }

    return results;
  },
});

export const getById = query({
  args: { id: v.id("articles") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getFeatured = query({
  args: {},
  handler: async (ctx) => {
    const articles = await ctx.db
      .query("articles")
      .withIndex("by_published", (q) => q.eq("published", true))
      .collect();
    return articles.filter((a) => a.featured);
  },
});

export const getTrending = query({
  args: {},
  handler: async (ctx) => {
    const articles = await ctx.db
      .query("articles")
      .withIndex("by_published", (q) => q.eq("published", true))
      .collect();
    return articles.filter((a) => a.trending);
  },
});
