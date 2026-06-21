import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {
    category: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let results;
    if (args.category) {
      results = await ctx.db
        .query("articles")
        .withIndex("by_published_category", (q) =>
          q.eq("published", true).eq("category", args.category!)
        )
        .order("desc")
        .collect();
    } else {
      results = await ctx.db
        .query("articles")
        .withIndex("by_published", (q) => q.eq("published", true))
        .order("desc")
        .collect();
    }

    if (args.limit) results = results.slice(0, args.limit);
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
    return await ctx.db
      .query("articles")
      .withIndex("by_published_featured", (q) => q.eq("published", true).eq("featured", true))
      .collect();
  },
});

export const getTrending = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("articles")
      .withIndex("by_published_trending", (q) => q.eq("published", true).eq("trending", true))
      .collect();
  },
});

export const getRelated = query({
  args: { category: v.string(), excludeId: v.id("articles") },
  handler: async (ctx, args) => {
    const articles = await ctx.db
      .query("articles")
      .withIndex("by_published_category", (q) =>
        q.eq("published", true).eq("category", args.category)
      )
      .collect();
    return articles.filter((a) => a._id !== args.excludeId).slice(0, 3);
  },
});

export const getMyArticles = query({
  args: { authorId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("articles")
      .withIndex("by_author", (q) => q.eq("authorId", args.authorId))
      .order("desc")
      .collect();
  },
});

export const getSavedArticles = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const saves = await ctx.db
      .query("saves")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    const articleIds = saves.filter((s) => s.articleId).map((s) => s.articleId!);
    return Promise.all(articleIds.map((id) => ctx.db.get(id)));
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    excerpt: v.string(),
    content: v.string(),
    imageUrl: v.string(),
    category: v.string(),
    readTime: v.string(),
    published: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_firebaseUid", (q) => q.eq("firebaseUid", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    return await ctx.db.insert("articles", {
      ...args,
      authorId: user._id,
      date: new Date().toISOString().split("T")[0],
      trending: false,
      featured: false,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("articles"),
    title: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    content: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    category: v.optional(v.string()),
    readTime: v.optional(v.string()),
    published: v.optional(v.boolean()),
    trending: v.optional(v.boolean()),
    featured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_firebaseUid", (q) => q.eq("firebaseUid", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    const article = await ctx.db.get(args.id);
    if (!article) throw new Error("Article not found");
    if (article.authorId !== user._id && !user.isAdmin) {
      throw new Error("Not authorized to edit this article");
    }

    const { id, ...patches } = args;
    const cleanPatches = Object.fromEntries(
      Object.entries(patches).filter(([_, v]) => v !== undefined)
    );
    await ctx.db.patch(id, cleanPatches);
    return id;
  },
});

export const remove = mutation({
  args: { id: v.id("articles") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_firebaseUid", (q) => q.eq("firebaseUid", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    const article = await ctx.db.get(args.id);
    if (!article) throw new Error("Article not found");
    if (article.authorId !== user._id && !user.isAdmin) {
      throw new Error("Not authorized to delete this article");
    }

    await ctx.db.delete(args.id);

    const likes = await ctx.db
      .query("articleLikes")
      .withIndex("by_article", (q) => q.eq("articleId", args.id))
      .collect();
    await Promise.all(likes.map((l) => ctx.db.delete(l._id)));

    const saves = await ctx.db
      .query("saves")
      .filter((q) => q.eq(q.field("articleId"), args.id))
      .collect();
    await Promise.all(saves.map((s) => ctx.db.delete(s._id)));
  },
});

export const like = mutation({
  args: { articleId: v.id("articles") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_firebaseUid", (q) => q.eq("firebaseUid", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    const existing = await ctx.db
      .query("articleLikes")
      .withIndex("by_user_article", (q) =>
        q.eq("userId", user._id).eq("articleId", args.articleId)
      )
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
      return false;
    }

    await ctx.db.insert("articleLikes", { userId: user._id, articleId: args.articleId });

    const article = await ctx.db.get(args.articleId);
    if (article && article.authorId !== user._id) {
      await ctx.db.insert("notifications", {
        userId: article.authorId,
        type: "like",
        title: "New Like",
        body: `${user.name} liked your article "${article.title}"`,
        link: `/articles/${args.articleId}`,
        read: false,
      });
    }

    return true;
  },
});

export const isLiked = query({
  args: { userId: v.id("users"), articleId: v.id("articles") },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("articleLikes")
      .withIndex("by_user_article", (q) =>
        q.eq("userId", args.userId).eq("articleId", args.articleId)
      )
      .unique();
    return !!result;
  },
});

export const getLikeCount = query({
  args: { articleId: v.id("articles") },
  handler: async (ctx, args) => {
    const likes = await ctx.db
      .query("articleLikes")
      .withIndex("by_article", (q) => q.eq("articleId", args.articleId))
      .collect();
    return likes.length;
  },
});

export const save = mutation({
  args: { articleId: v.id("articles") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_firebaseUid", (q) => q.eq("firebaseUid", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    const existing = await ctx.db
      .query("saves")
      .withIndex("by_user_article", (q) =>
        q.eq("userId", user._id).eq("articleId", args.articleId)
      )
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
      return false;
    }

    await ctx.db.insert("saves", { userId: user._id, articleId: args.articleId });
    return true;
  },
});

export const isSaved = query({
  args: { userId: v.id("users"), articleId: v.id("articles") },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("saves")
      .withIndex("by_user_article", (q) =>
        q.eq("userId", args.userId).eq("articleId", args.articleId)
      )
      .unique();
    return !!result;
  },
});
