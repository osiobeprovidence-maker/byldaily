import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Users, ExternalLink, UserPlus, UserMinus } from 'lucide-react';

export function CreatorDetail() {
  const { id } = useParams<{ id: string }>();
  const { convexUserId } = useAuth();
  const creator = useQuery(api.creators.getById, id ? { id: id as any } : "skip");
  const userDoc = useQuery(api.users.getById, id ? { id: id as any } : "skip");
  const articles = useQuery(api.articles.list, {});
  const isFollowing = (creator && convexUserId) ? useQuery(api.users.getIsFollowing, { followerId: convexUserId as any, followingId: creator._id as any }) : undefined;

  const follow = useMutation(api.users.follow);
  const unfollow = useMutation(api.users.unfollow);
  const [following, setFollowing] = useState<boolean | null>(null);

  const profile = creator || userDoc;
  const creatorArticles = articles?.filter((a: any) => a.authorId === id) ?? [];
  const isFollowed = following ?? isFollowing ?? false;

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="animate-pulse space-y-10">
          <div className="h-8 w-20 bg-byl-dark/5" />
          <div className="flex items-center space-x-8">
            <div className="w-32 h-32 rounded-full bg-byl-dark/5" />
            <div className="space-y-4 flex-1"><div className="h-8 w-1/2 bg-byl-dark/5" /><div className="h-4 w-1/3 bg-byl-dark/5" /></div>
          </div>
          {[1, 2].map(i => <div key={i} className="h-24 bg-byl-dark/5" />)}
        </div>
      </div>
    );
  }

  const handleFollow = async () => {
    if (!convexUserId || !profile._id) return;
    try {
      if (isFollowed) {
        await unfollow({ followingId: profile._id as any });
        setFollowing(false);
      } else {
        await follow({ followingId: profile._id as any });
        setFollowing(true);
      }
    } catch (e) { console.error(e); }
  };

  const avatarUrl = profile.avatarUrl || "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=200&q=80";
  const displayName = profile.name || "BYLDaily Creator";
  const followersCount = profile.followers ?? 0;
  const bio = profile.bio || "A creator on BYLDaily.";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-12 md:py-20">
      <Link to="/creators" className="flex items-center text-[11px] uppercase tracking-widest font-bold text-byl-dark/40 hover:text-byl-dark mb-10">
        <ArrowLeft size={14} className="mr-2" />All Creators
      </Link>

      <div className="bg-byl-light border border-byl-dark/10 p-8 md:p-12 mb-12 flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="shrink-0">
          <img src={avatarUrl} alt={displayName} className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover grayscale" />
        </div>
        <div className="flex-grow text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-byl-dark">{displayName}</h1>
              {userDoc?.username && <p className="text-[11px] uppercase tracking-widest font-bold text-byl-dark/40 mt-1">@{userDoc.username}</p>}
            </div>
            {convexUserId && profile._id !== convexUserId && (
              <button onClick={handleFollow} className={`border px-6 py-3 text-[11px] uppercase tracking-widest font-bold flex items-center justify-center space-x-2 transition-all ${isFollowed ? 'border-red-200 text-red-600 hover:bg-red-50' : 'bg-byl-dark text-byl-light hover:bg-byl-purple'}`}>
                {isFollowed ? <><UserMinus size={14} /><span>Unfollow</span></> : <><UserPlus size={14} /><span>Follow</span></>}
              </button>
            )}
          </div>
          <p className="text-byl-dark/70 mb-6 font-medium leading-relaxed max-w-2xl text-sm md:text-base">{bio}</p>
          <div className="flex items-center gap-6 text-[11px] uppercase tracking-widest font-bold text-byl-dark">
            <div><span className="text-byl-purple mr-2">{followersCount}</span> Followers</div>
            <div><span className="text-byl-purple mr-2">{creatorArticles.length}</span> Articles</div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-serif text-2xl font-bold mb-8 border-b border-byl-dark/10 pb-4">Articles by {displayName}</h2>
        {creatorArticles.length === 0 ? (
          <p className="text-byl-dark/50 text-center font-medium py-16">No articles published yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {creatorArticles.map((a: any) => (
              <Link key={a._id} to={`/articles/${a._id}`} className="group flex bg-byl-light border border-byl-dark/10 overflow-hidden hover:border-byl-dark transition-all">
                <div className="w-32 h-32 shrink-0 overflow-hidden">
                  <img src={a.imageUrl} alt={a.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                </div>
                <div className="p-4 flex flex-col justify-between flex-grow min-w-0">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-byl-purple">{a.category}</span>
                    <h3 className="font-serif font-bold leading-tight mt-1 group-hover:text-byl-purple">{a.title}</h3>
                    <p className="text-xs text-byl-dark/50 mt-1 line-clamp-1">{a.excerpt}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] text-byl-dark/40">{a.readTime}</span>
                    <ExternalLink size={12} className="text-byl-dark/20 group-hover:text-byl-purple" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}