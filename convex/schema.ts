import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    username: v.string(),
    email: v.string(),
    avatarUrl: v.string(),
    bio: v.optional(v.string()),
    interests: v.array(v.string()),
    followers: v.number(),
    following: v.number(),
    isAdmin: v.optional(v.boolean()),
    passwordHash: v.optional(v.string()),
  })
    .index("by_email", ["email"])
    .index("by_username", ["username"]),

  articles: defineTable({
    title: v.string(),
    excerpt: v.string(),
    content: v.string(),
    imageUrl: v.string(),
    category: v.string(),
    readTime: v.string(),
    date: v.string(),
    authorId: v.id("users"),
    trending: v.optional(v.boolean()),
    featured: v.optional(v.boolean()),
    published: v.boolean(),
  })
    .index("by_category", ["category"])
    .index("by_author", ["authorId"])
    .index("by_published", ["published"]),

  creators: defineTable({
    name: v.string(),
    role: v.string(),
    avatarUrl: v.string(),
    bio: v.string(),
    followers: v.number(),
  }),

  events: defineTable({
    title: v.string(),
    date: v.string(),
    time: v.string(),
    location: v.string(),
    category: v.string(),
    imageUrl: v.string(),
    description: v.string(),
  })
    .index("by_category", ["category"])
    .index("by_date", ["date"]),

  forumPosts: defineTable({
    authorId: v.id("users"),
    title: v.string(),
    content: v.string(),
    upvotes: v.number(),
    topic: v.string(),
  })
    .index("by_topic", ["topic"])
    .index("by_author", ["authorId"]),

  forumComments: defineTable({
    postId: v.id("forumPosts"),
    authorId: v.id("users"),
    content: v.string(),
    upvotes: v.number(),
  })
    .index("by_post", ["postId"])
    .index("by_author", ["authorId"]),
});
