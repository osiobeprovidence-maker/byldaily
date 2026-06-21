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

export const listAllComments = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("forumComments").collect();
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
    authorId: v.string(),
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

export const upvotePost = mutation({
  args: { postId: v.id("forumPosts") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");
    await ctx.db.patch(args.postId, { upvotes: post.upvotes + 1 });
  },
});

export const addComment = mutation({
  args: {
    postId: v.id("forumPosts"),
    authorId: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("forumComments", {
      postId: args.postId,
      authorId: args.authorId,
      content: args.content,
      upvotes: 0,
    });
  },
});
