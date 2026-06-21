import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Search, FileText, Users, MessageSquare } from 'lucide-react';

export function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const lower = query.toLowerCase();

  const articles = useQuery(api.articles.list, {});
  const users = useQuery(api.users.getAll, {});
  const forumPosts = useQuery(api.forum.listPosts, {});

  const matchedArticles = (articles ?? []).filter((a: any) =>
    a.title?.toLowerCase().includes(lower) || a.excerpt?.toLowerCase().includes(lower) || a.content?.toLowerCase().includes(lower)
  );
  const matchedUsers = (users ?? []).filter((u: any) =>
    u.name?.toLowerCase().includes(lower) || u.username?.toLowerCase().includes(lower) || u.bio?.toLowerCase().includes(lower)
  );
  const matchedPosts = (forumPosts ?? []).filter((p: any) =>
    p.content?.toLowerCase().includes(lower) || p.title?.toLowerCase().includes(lower)
  );

  const total = matchedArticles.length + matchedUsers.length + matchedPosts.length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-12 md:py-20">
      <div className="mb-12">
        <span className="text-[10px] uppercase tracking-widest font-black text-byl-purple mb-4 block">Search Results</span>
        <h1 className="font-serif text-4xl md:text-5xl font-black tracking-tight text-byl-dark mb-4">
          {query ? `"${query}"` : 'Search'}
        </h1>
        {query && <p className="text-byl-dark/50 font-medium">{total} result{total !== 1 ? 's' : ''}</p>}
      </div>

      {!query && (
        <div className="text-center py-20">
          <Search size={48} className="mx-auto text-byl-dark/20 mb-6" />
          <p className="text-byl-dark/40 font-medium">Enter a search term above to find stories, creators, and discussions.</p>
        </div>
      )}

      {query && total === 0 && (
        <div className="text-center py-20 border border-byl-dark/10">
          <Search size={48} className="mx-auto text-byl-dark/20 mb-6" />
          <p className="text-byl-dark/50 font-medium mb-2">No results found for "{query}"</p>
          <p className="text-sm text-byl-dark/40">Try adjusting your search term.</p>
        </div>
      )}

      <div className="space-y-16">
        {matchedArticles.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6 border-b border-byl-dark/10 pb-4">
              <FileText size={18} className="text-byl-purple" />
              <h2 className="text-[11px] uppercase tracking-widest font-black text-byl-dark">Stories ({matchedArticles.length})</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {matchedArticles.slice(0, 10).map((a: any) => (
                <Link key={a._id} to={`/articles/${a._id}`} className="group flex bg-byl-light border border-byl-dark/10 overflow-hidden hover:border-byl-dark transition-all">
                  <div className="w-24 h-24 shrink-0 overflow-hidden">
                    <img src={a.imageUrl} alt={a.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                  </div>
                  <div className="p-4 flex flex-col justify-center min-w-0">
                    <span className="text-[10px] uppercase font-bold text-byl-purple">{a.category}</span>
                    <h3 className="font-serif font-bold leading-tight mt-0.5 group-hover:text-byl-purple line-clamp-2">{a.title}</h3>
                    <span className="text-[10px] text-byl-dark/40 mt-1">{a.readTime}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {matchedUsers.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6 border-b border-byl-dark/10 pb-4">
              <Users size={18} className="text-byl-purple" />
              <h2 className="text-[11px] uppercase tracking-widest font-black text-byl-dark">Creators ({matchedUsers.length})</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {matchedUsers.slice(0, 10).map((u: any) => (
                <Link key={u._id} to={`/creators/${u._id}`} className="flex items-center gap-4 p-4 bg-byl-light border border-byl-dark/10 hover:border-byl-dark transition-all group">
                  <img src={u.avatarUrl || "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=100&q=80"} alt={u.name} className="w-12 h-12 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                  <div className="min-w-0">
                    <p className="font-bold text-sm truncate">{u.name}</p>
                    <p className="text-[10px] text-byl-dark/40 truncate">@{u.username}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {matchedPosts.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6 border-b border-byl-dark/10 pb-4">
              <MessageSquare size={18} className="text-byl-purple" />
              <h2 className="text-[11px] uppercase tracking-widest font-black text-byl-dark">Discussions ({matchedPosts.length})</h2>
            </div>
            <div className="space-y-3">
              {matchedPosts.slice(0, 10).map((p: any) => (
                <Link key={p._id} to="/spaces" className="block p-5 bg-byl-light border border-byl-dark/10 hover:border-byl-dark transition-all group">
                  <span className="text-[10px] uppercase font-bold text-byl-purple">{p.topic}</span>
                  <p className="font-medium mt-1 group-hover:text-byl-purple">{p.content}</p>
                  <span className="text-[10px] text-byl-dark/40 mt-1 block">{p.upvotes} upvotes</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}