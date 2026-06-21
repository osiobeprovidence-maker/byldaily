import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
  },
});

export const getById = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getByFirebaseUid = query({
  args: { firebaseUid: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_firebaseUid", (q) => q.eq("firebaseUid", args.firebaseUid))
      .unique();
  },
});

export const upsertUser = mutation({
  args: {
    firebaseUid: v.string(),
    email: v.string(),
    name: v.string(),
    avatarUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_firebaseUid", (q) => q.eq("firebaseUid", args.firebaseUid))
      .unique();

    if (existing) return existing._id;

    const byEmail = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (byEmail) {
      await ctx.db.patch(byEmail._id, {
        firebaseUid: args.firebaseUid,
        name: args.name || byEmail.name,
        avatarUrl: args.avatarUrl || byEmail.avatarUrl,
      });
      return byEmail._id;
    }

    return await ctx.db.insert("users", {
      email: args.email,
      firebaseUid: args.firebaseUid,
      name: args.name || args.email.split("@")[0],
      username: args.email.split("@")[0],
      avatarUrl: args.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${args.email}`,
      bio: "",
      interests: [],
      followers: 0,
      following: 0,
    });
  },
});
