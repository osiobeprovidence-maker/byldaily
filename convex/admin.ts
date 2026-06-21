import { query } from "./_generated/server";

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const articles = await ctx.db.query("articles").collect();
    const users = await ctx.db.query("users").collect();
    const forumPosts = await ctx.db.query("forumPosts").collect();
    const events = await ctx.db.query("events").collect();
    const registrations = await ctx.db.query("eventRegistrations").collect();

    const publishedArticles = articles.filter((a) => a.published);
    const draftArticles = articles.filter((a) => !a.published);

    return {
      totalArticles: articles.length,
      publishedArticles: publishedArticles.length,
      draftArticles: draftArticles.length,
      totalUsers: users.length,
      totalForumPosts: forumPosts.length,
      totalEvents: events.length,
      totalRegistrations: registrations.length,
    };
  },
});

export const getDashboardData = query({
  args: {},
  handler: async (ctx) => {
    const articles = await ctx.db.query("articles").order("desc").collect();
    const users = await ctx.db.query("users").collect();
    const forumPosts = await ctx.db.query("forumPosts").order("desc").collect();
    const creators = await ctx.db.query("creators").collect();
    const events = await ctx.db.query("events").collect();

    return { articles, users, forumPosts, creators, events };
  },
});
