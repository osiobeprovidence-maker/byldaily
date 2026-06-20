import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const listPosts = query({
  args: {
    topic: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.topic) {
      return await ctx.db
        .query("forumPosts")
        .withIndex("by_topic", (q) => q.eq("topic", args.topic!))
        .collect();
    }
    return await ctx.db.query("forumPosts").collect();
  },
});

export const getPost = query({
  args: { id: v.id("forumPosts") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getComments = query({
  args: { postId: v.id("forumPosts") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("forumComments")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();
  },
});

export const createPost = mutation({
  args: {
    authorId: v.id("users"),
    title: v.string(),
    content: v.string(),
    topic: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("forumPosts", {
      authorId: args.authorId,
      title: args.title,
      content: args.content,
      upvotes: 0,
      topic: args.topic,
    });
  },
});
