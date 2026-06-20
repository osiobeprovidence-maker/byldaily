export type Category = 'Culture' | 'Entertainment' | 'Lifestyle' | 'News' | 'Wellness' | 'Fashion' | 'Music';
export type EventCategory = 'Online' | 'Physical' | 'Music' | 'Culture' | 'Community';
export type ForumTopic = 'Culture Talk' | 'Entertainment' | 'Lifestyle' | 'Relationships' | 'Wellness' | 'Creator Corner' | 'Opinions';

export interface Creator {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  bio: string;
  followers: number;
}

export interface User {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
  bio: string;
  interests: string[];
  followers: number;
  following: number;
  isAdmin?: boolean;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: EventCategory;
  imageUrl: string;
  description: string;
  isRsvpd?: boolean;
}

export interface ForumPost {
  id: string;
  authorId: string;
  content: string;
  upvotes: number;
  commentsCount: number;
  topic: ForumTopic;
  timeAgo: string;
}

export interface ForumComment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  timeAgo: string;
  upvotes: number;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  category: Category;
  readTime: string;
  date: string;
  authorId: string;
  trending?: boolean;
  featured?: boolean;
}
