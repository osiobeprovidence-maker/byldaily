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

export const search = query({
  args: { q: v.string() },
  handler: async (ctx, args) => {
    const users = await ctx.db.query("users").collect();
    const lower = args.q.toLowerCase();
    return users.filter(
      (u) => u.name.toLowerCase().includes(lower) || u.username.toLowerCase().includes(lower)
    );
  },
});

export const getFollowers = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const follows = await ctx.db
      .query("follows")
      .withIndex("by_following", (q) => q.eq("followingId", args.userId))
      .collect();
    return Promise.all(follows.map((f) => ctx.db.get(f.followerId)));
  },
});

export const getFollowing = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const follows = await ctx.db
      .query("follows")
      .withIndex("by_follower", (q) => q.eq("followerId", args.userId))
      .collect();
    return Promise.all(follows.map((f) => ctx.db.get(f.followingId)));
  },
});

export const getIsFollowing = query({
  args: { followerId: v.id("users"), followingId: v.id("users") },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("follows")
      .withIndex("by_both", (q) =>
        q.eq("followerId", args.followerId).eq("followingId", args.followingId)
      )
      .unique();
    return !!result;
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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.subject !== args.firebaseUid) {
      throw new Error("Unauthorized: cannot upsert another user");
    }

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
      coverUrl: undefined,
      bio: "",
      website: undefined,
      socialLinks: undefined,
      interests: [],
      followers: 0,
      following: 0,
      isAdmin: false,
    });
  },
});

export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    username: v.optional(v.string()),
    bio: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    coverUrl: v.optional(v.string()),
    website: v.optional(v.string()),
    socialLinks: v.optional(v.array(v.string())),
    interests: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_firebaseUid", (q) => q.eq("firebaseUid", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    const patches: Record<string, any> = {};
    if (args.name !== undefined) patches.name = args.name;
    if (args.username !== undefined) patches.username = args.username;
    if (args.bio !== undefined) patches.bio = args.bio;
    if (args.avatarUrl !== undefined) patches.avatarUrl = args.avatarUrl;
    if (args.coverUrl !== undefined) patches.coverUrl = args.coverUrl;
    if (args.website !== undefined) patches.website = args.website;
    if (args.socialLinks !== undefined) patches.socialLinks = args.socialLinks;
    if (args.interests !== undefined) patches.interests = args.interests;

    if (Object.keys(patches).length === 0) return user._id;
    await ctx.db.patch(user._id, patches);
    return user._id;
  },
});

export const follow = mutation({
  args: { followingId: v.id("users") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const follower = await ctx.db
      .query("users")
      .withIndex("by_firebaseUid", (q) => q.eq("firebaseUid", identity.subject))
      .unique();
    if (!follower) throw new Error("User not found");
    if (follower._id === args.followingId) throw new Error("Cannot follow yourself");

    const existing = await ctx.db
      .query("follows")
      .withIndex("by_both", (q) =>
        q.eq("followerId", follower._id).eq("followingId", args.followingId)
      )
      .unique();

    if (existing) return existing._id;

    await ctx.db.insert("follows", { followerId: follower._id, followingId: args.followingId });
    await ctx.db.patch(follower._id, { following: follower.following + 1 });
    const target = await ctx.db.get(args.followingId);
    if (target) {
      await ctx.db.patch(args.followingId, { followers: target.followers + 1 });
    }

    await ctx.db.insert("notifications", {
      userId: args.followingId,
      type: "follow",
      title: "New Follower",
      body: `${follower.name} started following you`,
      link: `/profile`,
      read: false,
    });

    return follower._id;
  },
});

export const setAdmin = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const caller = await ctx.db
      .query("users")
      .withIndex("by_firebaseUid", (q) => q.eq("firebaseUid", identity.subject))
      .unique();
    if (!caller) throw new Error("User not found");

    const admins = await ctx.db.query("users").collect();
    const hasAdmin = admins.some((u) => u.isAdmin);
    if (hasAdmin && !caller.isAdmin) throw new Error("Not authorized");

    const target = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
    if (!target) throw new Error("User not found");
    await ctx.db.patch(target._id, { isAdmin: true });
    return target._id;
  },
});

export const unfollow = mutation({
  args: { followingId: v.id("users") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const follower = await ctx.db
      .query("users")
      .withIndex("by_firebaseUid", (q) => q.eq("firebaseUid", identity.subject))
      .unique();
    if (!follower) throw new Error("User not found");

    const existing = await ctx.db
      .query("follows")
      .withIndex("by_both", (q) =>
        q.eq("followerId", follower._id).eq("followingId", args.followingId)
      )
      .unique();

    if (!existing) return;

    await ctx.db.delete(existing._id);
    await ctx.db.patch(follower._id, { following: Math.max(0, follower.following - 1) });
    const target = await ctx.db.get(args.followingId);
    if (target) {
      await ctx.db.patch(args.followingId, { followers: Math.max(0, target.followers - 1) });
    }
  },
});
