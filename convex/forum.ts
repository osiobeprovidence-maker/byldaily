import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const listPosts = query({
  args: { topic: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.topic) {
      return await ctx.db
        .query("forumPosts")
        .withIndex("by_topic", (q) => q.eq("topic", args.topic!))
        .order("desc")
        .collect();
    }
    return await ctx.db.query("forumPosts").order("desc").collect();
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

export const getMyPosts = query({
  args: { authorId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("forumPosts")
      .withIndex("by_author", (q) => q.eq("authorId", args.authorId))
      .order("desc")
      .collect();
  },
});

export const getMyComments = query({
  args: { authorId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("forumComments")
      .withIndex("by_author", (q) => q.eq("authorId", args.authorId))
      .collect();
  },
});

function getUser(ctx: any, identity: any) {
  return ctx.db
    .query("users")
    .withIndex("by_firebaseUid", (q) => q.eq("firebaseUid", identity.subject))
    .unique();
}

export const createPost = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    topic: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await getUser(ctx, identity);
    if (!user) throw new Error("User not found");

    return await ctx.db.insert("forumPosts", {
      authorId: user._id,
      title: args.title,
      content: args.content,
      upvotes: 0,
      topic: args.topic,
    });
  },
});

export const updatePost = mutation({
  args: {
    id: v.id("forumPosts"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    topic: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await getUser(ctx, identity);
    if (!user) throw new Error("User not found");

    const post = await ctx.db.get(args.id);
    if (!post) throw new Error("Post not found");
    if (post.authorId !== user._id && !user.isAdmin) {
      throw new Error("Not authorized");
    }

    const { id, ...patches } = args;
    const clean = Object.fromEntries(Object.entries(patches).filter(([_, v]) => v !== undefined));
    await ctx.db.patch(id, clean);
    return id;
  },
});

export const deletePost = mutation({
  args: { id: v.id("forumPosts") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await getUser(ctx, identity);
    if (!user) throw new Error("User not found");

    const post = await ctx.db.get(args.id);
    if (!post) throw new Error("Post not found");
    if (post.authorId !== user._id && !user.isAdmin) {
      throw new Error("Not authorized");
    }

    const comments = await ctx.db
      .query("forumComments")
      .withIndex("by_post", (q) => q.eq("postId", args.id))
      .collect();
    await Promise.all(comments.map((c) => ctx.db.delete(c._id)));

    await ctx.db.delete(args.id);
  },
});

export const addComment = mutation({
  args: {
    postId: v.id("forumPosts"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await getUser(ctx, identity);
    if (!user) throw new Error("User not found");

    const commentId = await ctx.db.insert("forumComments", {
      postId: args.postId,
      authorId: user._id,
      content: args.content,
      upvotes: 0,
    });

    const post = await ctx.db.get(args.postId);
    if (post && post.authorId !== user._id) {
      await ctx.db.insert("notifications", {
        userId: post.authorId,
        type: "comment",
        title: "New Reply",
        body: `${user.name} replied to your discussion`,
        link: `/spaces`,
        read: false,
      });
    }

    return commentId;
  },
});

export const deleteComment = mutation({
  args: { id: v.id("forumComments") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await getUser(ctx, identity);
    if (!user) throw new Error("User not found");

    const comment = await ctx.db.get(args.id);
    if (!comment) throw new Error("Comment not found");
    if (comment.authorId !== user._id && !user.isAdmin) {
      throw new Error("Not authorized");
    }

    await ctx.db.delete(args.id);
  },
});

export const toggleUpvote = mutation({
  args: { postId: v.id("forumPosts") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await getUser(ctx, identity);
    if (!user) throw new Error("User not found");

    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");

    const existing = await ctx.db
      .query("saves")
      .withIndex("by_user_post", (q) =>
        q.eq("userId", user._id).eq("postId", args.postId)
      )
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
      await ctx.db.patch(args.postId, { upvotes: Math.max(0, post.upvotes - 1) });
      return false;
    }

    await ctx.db.insert("saves", { userId: user._id, postId: args.postId });
    await ctx.db.patch(args.postId, { upvotes: post.upvotes + 1 });

    if (post.authorId !== user._id) {
      await ctx.db.insert("notifications", {
        userId: post.authorId,
        type: "upvote",
        title: "New Upvote",
        body: `${user.name} upvoted your discussion`,
        link: `/spaces`,
        read: false,
      });
    }

    return true;
  },
});
