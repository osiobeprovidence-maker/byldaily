import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: { category: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.category) {
      return await ctx.db
        .query("events")
        .withIndex("by_category", (q) => q.eq("category", args.category!))
        .collect();
    }
    return await ctx.db.query("events").collect();
  },
});

export const getById = query({
  args: { id: v.id("events") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("events")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});

export const getMyEvents = query({
  args: { hostId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("events")
      .withIndex("by_host", (q) => q.eq("hostId", args.hostId))
      .collect();
  },
});

export const getRegisteredEvents = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const registrations = await ctx.db
      .query("eventRegistrations")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    return Promise.all(registrations.map((r) => ctx.db.get(r.eventId)));
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    date: v.string(),
    time: v.string(),
    location: v.string(),
    category: v.string(),
    imageUrl: v.string(),
    description: v.string(),
    price: v.optional(v.number()),
    capacity: v.optional(v.number()),
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_firebaseUid", (q) => q.eq("firebaseUid", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    return await ctx.db.insert("events", { ...args, hostId: user._id });
  },
});

export const update = mutation({
  args: {
    id: v.id("events"),
    title: v.optional(v.string()),
    date: v.optional(v.string()),
    time: v.optional(v.string()),
    location: v.optional(v.string()),
    category: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    capacity: v.optional(v.number()),
    slug: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_firebaseUid", (q) => q.eq("firebaseUid", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    const event = await ctx.db.get(args.id);
    if (!event) throw new Error("Event not found");
    if (event.hostId !== user._id && !user.isAdmin) {
      throw new Error("Not authorized to edit this event");
    }

    const { id, ...patches } = args;
    const clean = Object.fromEntries(Object.entries(patches).filter(([_, v]) => v !== undefined));
    await ctx.db.patch(id, clean);
    return id;
  },
});

export const remove = mutation({
  args: { id: v.id("events") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_firebaseUid", (q) => q.eq("firebaseUid", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    const event = await ctx.db.get(args.id);
    if (!event) throw new Error("Event not found");
    if (event.hostId !== user._id && !user.isAdmin) {
      throw new Error("Not authorized to delete this event");
    }

    const registrations = await ctx.db
      .query("eventRegistrations")
      .withIndex("by_event", (q) => q.eq("eventId", args.id))
      .collect();
    await Promise.all(registrations.map((r) => ctx.db.delete(r._id)));

    await ctx.db.delete(args.id);
  },
});

export const register = mutation({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_firebaseUid", (q) => q.eq("firebaseUid", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    const existing = await ctx.db
      .query("eventRegistrations")
      .withIndex("by_user_event", (q) =>
        q.eq("userId", user._id).eq("eventId", args.eventId)
      )
      .unique();

    if (existing) throw new Error("Already registered");

    const ticketRef = `TKT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    const regId = await ctx.db.insert("eventRegistrations", {
      eventId: args.eventId,
      userId: user._id,
      status: "confirmed",
      ticketRef,
    });

    const event = await ctx.db.get(args.eventId);
    if (event) {
      await ctx.db.insert("notifications", {
        userId: event.hostId,
        type: "registration",
        title: "New Registration",
        body: `${user.name} registered for "${event.title}"`,
        link: `/events/${event.slug}`,
        read: false,
      });
    }

    return regId;
  },
});

export const cancelRegistration = mutation({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_firebaseUid", (q) => q.eq("firebaseUid", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    const existing = await ctx.db
      .query("eventRegistrations")
      .withIndex("by_user_event", (q) =>
        q.eq("userId", user._id).eq("eventId", args.eventId)
      )
      .unique();

    if (!existing) throw new Error("Not registered");
    await ctx.db.delete(existing._id);
  },
});

export const getAttendees = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const registrations = await ctx.db
      .query("eventRegistrations")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();
    return Promise.all(registrations.map((r) => ctx.db.get(r.userId)));
  },
});

export const getRegistration = query({
  args: { eventId: v.id("events"), userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("eventRegistrations")
      .withIndex("by_user_event", (q) =>
        q.eq("userId", args.userId).eq("eventId", args.eventId)
      )
      .unique();
  },
});

export const getEventStats = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const registrations = await ctx.db
      .query("eventRegistrations")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();
    return {
      ticketsSold: registrations.length,
      revenue: 0,
      attendeeCount: registrations.length,
    };
  },
});
