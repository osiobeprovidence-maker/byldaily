import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    username: v.string(),
    email: v.string(),
    avatarUrl: v.string(),
    coverUrl: v.optional(v.string()),
    bio: v.optional(v.string()),
    website: v.optional(v.string()),
    socialLinks: v.optional(v.array(v.string())),
    interests: v.array(v.string()),
    followers: v.number(),
    following: v.number(),
    isAdmin: v.optional(v.boolean()),
    firebaseUid: v.optional(v.string()),
  })
    .index("by_email", ["email"])
    .index("by_username", ["username"])
    .index("by_firebaseUid", ["firebaseUid"]),

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
    .index("by_published", ["published"])
    .index("by_published_category", ["published", "category"])
    .index("by_published_date", ["published", "date"])
    .index("by_published_trending", ["published", "trending"])
    .index("by_published_featured", ["published", "featured"]),

  creators: defineTable({
    name: v.string(),
    role: v.string(),
    avatarUrl: v.string(),
    bio: v.string(),
    followers: v.number(),
  })
    .index("by_name", ["name"])
    .index("by_role", ["role"]),

  events: defineTable({
    title: v.string(),
    date: v.string(),
    time: v.string(),
    location: v.string(),
    category: v.string(),
    imageUrl: v.string(),
    description: v.string(),
    price: v.optional(v.number()),
    capacity: v.optional(v.number()),
    hostId: v.id("users"),
    slug: v.string(),
  })
    .index("by_category", ["category"])
    .index("by_date", ["date"])
    .index("by_host", ["hostId"])
    .index("by_slug", ["slug"]),

  forumPosts: defineTable({
    authorId: v.id("users"),
    title: v.string(),
    content: v.string(),
    upvotes: v.number(),
    topic: v.string(),
  })
    .index("by_topic", ["topic"])
    .index("by_author", ["authorId"])
    .index("by_upvotes", ["upvotes"]),

  forumComments: defineTable({
    postId: v.id("forumPosts"),
    authorId: v.id("users"),
    content: v.string(),
    upvotes: v.number(),
  })
    .index("by_post", ["postId"])
    .index("by_author", ["authorId"]),

  follows: defineTable({
    followerId: v.id("users"),
    followingId: v.id("users"),
  })
    .index("by_follower", ["followerId"])
    .index("by_following", ["followingId"])
    .index("by_both", ["followerId", "followingId"]),

  saves: defineTable({
    userId: v.id("users"),
    articleId: v.optional(v.id("articles")),
    eventId: v.optional(v.id("events")),
    postId: v.optional(v.id("forumPosts")),
  })
    .index("by_user", ["userId"])
    .index("by_user_article", ["userId", "articleId"])
    .index("by_user_event", ["userId", "eventId"])
    .index("by_user_post", ["userId", "postId"]),

  articleLikes: defineTable({
    userId: v.id("users"),
    articleId: v.id("articles"),
  })
    .index("by_user_article", ["userId", "articleId"])
    .index("by_article", ["articleId"]),

  eventRegistrations: defineTable({
    eventId: v.id("events"),
    userId: v.id("users"),
    status: v.string(),
    ticketRef: v.string(),
  })
    .index("by_event", ["eventId"])
    .index("by_user", ["userId"])
    .index("by_user_event", ["userId", "eventId"]),

  notifications: defineTable({
    userId: v.id("users"),
    type: v.string(),
    title: v.string(),
    body: v.string(),
    link: v.string(),
    read: v.boolean(),
  })
    .index("by_user", ["userId"])
    .index("by_user_read", ["userId", "read"]),
});
