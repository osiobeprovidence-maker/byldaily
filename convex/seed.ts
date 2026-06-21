import { internalMutation } from "./_generated/server";

export const seed = internalMutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("users").collect();
    if (existing.length > 0) return;

    const adminId = await ctx.db.insert("users", {
      name: "BYLDaily Admin",
      username: "byldaily",
      email: "byldaily@gmail.com",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
      bio: "Beyond Your Labels Daily - Your daily dose of culture, entertainment, lifestyle, and news across Africa.",
      interests: ["Culture", "Entertainment", "News"],
      followers: 5000,
      following: 120,
      isAdmin: true,
    });

    await ctx.db.insert("users", {
      name: "Amara K.",
      username: "amarak",
      email: "amara@example.com",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=amara",
      bio: "Storyteller | Culture enthusiast | Lagos-based writer",
      interests: ["Culture", "Fashion", "Music"],
      followers: 1200,
      following: 340,
    });

    await ctx.db.insert("users", {
      name: "Chidi N.",
      username: "chidin",
      email: "chidi@example.com",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=chidi",
      bio: "Music critic | Afrobeat historian | Podcaster",
      interests: ["Music", "Entertainment"],
      followers: 3400,
      following: 210,
    });

    await ctx.db.insert("users", {
      name: "Zainab B.",
      username: "zainabb",
      email: "zainab@example.com",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=zainab",
      bio: "Wellness advocate | Yoga instructor | Mental health awareness",
      interests: ["Wellness", "Lifestyle"],
      followers: 2800,
      following: 180,
    });

    await ctx.db.insert("users", {
      name: "Kwame A.",
      username: "kwamea",
      email: "kwame@example.com",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=kwame",
      bio: "Journalist | Investigative reporter | News anchor",
      interests: ["News", "Politics"],
      followers: 5600,
      following: 450,
    });

    await ctx.db.insert("articles", {
      title: "The Rise of Afrobeats on the Global Stage",
      excerpt: "How African music is taking over the world, one beat at a time.",
      content: "Lorem ipsum dolor sit amet...",
      imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800",
      category: "Music",
      readTime: "5 min read",
      date: "2025-12-15",
      authorId: adminId,
      trending: true,
      featured: true,
      published: true,
    });

    await ctx.db.insert("articles", {
      title: "Sustainable Fashion: Redefining Style in Africa",
      excerpt: "Exploring the eco-friendly fashion movement across the continent.",
      content: "Lorem ipsum dolor sit amet...",
      imageUrl: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800",
      category: "Fashion",
      readTime: "4 min read",
      date: "2025-12-10",
      authorId: adminId,
      trending: true,
      featured: true,
      published: true,
    });

    await ctx.db.insert("articles", {
      title: "Mental Health Matters: Breaking the Stigma",
      excerpt: "Why open conversations about mental wellness are more important than ever.",
      content: "Lorem ipsum dolor sit amet...",
      imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800",
      category: "Wellness",
      readTime: "6 min read",
      date: "2025-12-08",
      authorId: adminId,
      published: true,
    });

    await ctx.db.insert("articles", {
      title: "Nollywood's Golden Era: Cinema Revolution",
      excerpt: "How Nigeria's film industry is captivating global audiences.",
      content: "Lorem ipsum dolor sit amet...",
      imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800",
      category: "Entertainment",
      readTime: "5 min read",
      date: "2025-12-05",
      authorId: adminId,
      trending: true,
      published: true,
    });

    await ctx.db.insert("articles", {
      title: "Tech Hubs Transforming African Innovation",
      excerpt: "From Lagos to Nairobi, tech ecosystems driving change.",
      content: "Lorem ipsum dolor sit amet...",
      imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800",
      category: "News",
      readTime: "7 min read",
      date: "2025-12-01",
      authorId: adminId,
      published: true,
    });

    await ctx.db.insert("articles", {
      title: "Culinary Renaissance: Modern African Cuisine",
      excerpt: "Chefs across the continent are reimagining traditional dishes.",
      content: "Lorem ipsum dolor sit amet...",
      imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
      category: "Culture",
      readTime: "4 min read",
      date: "2025-11-28",
      authorId: adminId,
      featured: true,
      published: true,
    });

    await ctx.db.insert("events", {
      title: "AfroNation Lagos 2026",
      date: "2026-03-15",
      time: "14:00",
      location: "Lagos, Nigeria",
      category: "Music",
      imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
      description: "The biggest Afrobeat festival returns to Lagos for an unforgettable weekend of music and culture.",
      hostId: adminId,
      slug: "afronation-lagos-2026",
    });

    await ctx.db.insert("events", {
      title: "Lagos Fashion Week",
      date: "2026-04-10",
      time: "10:00",
      location: "Victoria Island, Lagos",
      category: "Culture",
      imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800",
      description: "Showcasing the best of African fashion design and innovation.",
      hostId: adminId,
      slug: "lagos-fashion-week-2026",
    });

    await ctx.db.insert("events", {
      title: "Wellness Retreat: Mind & Body",
      date: "2026-05-20",
      time: "07:00",
      location: "Abuja, Nigeria",
      category: "Community",
      imageUrl: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=800",
      description: "A weekend of yoga, meditation, and wellness workshops.",
      hostId: adminId,
      slug: "wellness-retreat-2026",
    });

    await ctx.db.insert("events", {
      title: "African Tech Summit",
      date: "2026-06-05",
      time: "09:00",
      location: "Nairobi, Kenya",
      category: "Online",
      imageUrl: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800",
      description: "Connecting innovators and investors shaping Africa's tech future.",
      hostId: adminId,
      slug: "african-tech-summit-2026",
    });
  },
});
