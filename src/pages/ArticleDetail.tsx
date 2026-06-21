import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from '../context/AuthContext';
import { ReadingProgress } from '../components/ReadingProgress';
import { Facebook, Twitter, LinkIcon, ArrowLeft, Heart, Bookmark, Clock, Check } from 'lucide-react';

export function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const { user, convexUserId } = useAuth();
  const article = useQuery(api.articles.getById, { id: id as any });
  const author = useQuery(api.users.getById, { id: article?.authorId as any });
  const likeCount = useQuery(api.articles.getLikeCount, { articleId: id as any });
  const isLiked = convexUserId && id ? useQuery(api.articles.isLiked, { userId: convexUserId as any, articleId: id as any }) : false;
  const isSaved = convexUserId && id ? useQuery(api.articles.isSaved, { userId: convexUserId as any, articleId: id as any }) : false;
  const isFollowing = convexUserId && author?._id ? useQuery(api.users.getIsFollowing, { followerId: convexUserId as any, followingId: author._id }) : false;

  const likeMutation = useMutation(api.articles.like);
  const saveMutation = useMutation(api.articles.save);
  const followMutation = useMutation(api.users.follow);
  const unfollowMutation = useMutation(api.users.unfollow);

  const relatedArticles = useQuery(api.articles.getRelated, {
    category: article?.category ?? "",
    excludeId: id as any,
  });

  const [copied, setCopied] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  const handleLike = async () => {
    if (!convexUserId) return;
    try { await likeMutation({ articleId: id as any }); } catch (e) { console.error(e); }
  };

  const handleSave = async () => {
    if (!convexUserId) return;
    try { await saveMutation({ articleId: id as any }); } catch (e) { console.error(e); }
  };

  const handleFollow = async () => {
    if (!convexUserId || !author?._id) return;
    try {
      if (isFollowing) { await unfollowMutation({ followingId: author._id }); }
      else { await followMutation({ followingId: author._id }); }
    } catch (e) { console.error(e); }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!article && id) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="animate-pulse space-y-8 max-w-2xl mx-auto">
          <div className="h-96 bg-byl-dark/5" /><div className="h-8 bg-byl-dark/5 w-3/4 mx-auto" /><div className="h-4 bg-byl-dark/5 w-1/2 mx-auto" />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="font-serif text-3xl font-bold mb-4">Article Not Found</h1>
        <Link to="/articles" className="text-byl-purple hover:underline inline-flex items-center"><ArrowLeft size={16} className="mr-2" /> Back to Stories</Link>
      </div>
    );
  }

  return (
    <article className="pb-20">
      <ReadingProgress />
      <div className="w-full h-[50vh] md:h-[70vh] relative">
        <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 max-w-7xl mx-auto flex flex-col justify-end h-full">
          <Link to="/articles" className="inline-flex items-center text-white text-[11px] uppercase tracking-widest font-bold mb-6 hover:text-white/80"><ArrowLeft size={16} className="mr-2" /> Back to Stories</Link>
          <div className="mb-4"><span className="px-4 py-2 bg-black text-white text-[11px] font-bold tracking-[0.2em] uppercase">{article.category}</span></div>
          <h1 className="font-serif text-[40px] md:text-[64px] font-black text-white mb-6 leading-none max-w-4xl tracking-tight">{article.title}</h1>
          <div className="flex items-center text-white/70 text-[11px] uppercase tracking-[0.2em] font-bold"><span className="flex items-center"><Clock size={14} className="mr-2" />{article.readTime}</span></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mt-16">
        <div className="flex flex-col md:flex-row gap-16">
          <div className="md:w-3/4">
            <div className="flex items-center border-b border-byl-dark/10 pb-8 mb-12">
              <img src={author?.avatarUrl} alt={author?.name} className="w-16 h-16 object-cover mr-6 grayscale" />
              <div>
                <h3 className="font-bold text-byl-dark font-serif text-xl">{author?.name}</h3>
                <p className="text-[10px] uppercase font-bold tracking-widest text-byl-purple mt-1">{author?.bio}</p>
                <div className="text-[10px] uppercase font-bold tracking-widest text-byl-dark/40 mt-3 flex items-center">
                  <span>{article.date}</span><span className="mx-2">•</span><span>{article.readTime}</span>
                </div>
              </div>
            </div>

            <div className="prose prose-lg text-byl-dark/70 font-serif leading-relaxed mb-12">
              <p className="text-xl md:text-2xl font-light text-byl-dark leading-normal mb-8">{article.excerpt}</p>
              <p>{article.content}</p>
            </div>

            <div className="flex items-center justify-between border-t border-b border-byl-dark/10 py-6 mb-16">
              <div className="flex items-center space-x-6">
                <button onClick={handleLike} className={`flex items-center font-bold text-[11px] uppercase tracking-widest space-x-2 transition-colors ${isLiked ? 'text-byl-purple' : 'text-byl-dark/40 hover:text-byl-purple'}`}>
                  <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} /><span>Like{likeCount !== undefined ? ` (${likeCount})` : ''}</span>
                </button>
                <button onClick={handleSave} className={`flex items-center font-bold text-[11px] uppercase tracking-widest space-x-2 transition-colors ${isSaved ? 'text-byl-purple' : 'text-byl-dark/40 hover:text-byl-purple'}`}>
                  <Bookmark size={20} fill={isSaved ? 'currentColor' : 'none'} /><span>{isSaved ? 'Saved' : 'Save'}</span>
                </button>
              </div>
              <div className="flex items-center space-x-6">
                <span className="text-[11px] uppercase tracking-widest font-bold text-byl-dark hidden sm:inline">Share:</span>
                <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="text-byl-dark/40 hover:text-byl-purple"><Twitter size={20} /></a>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="text-byl-dark/40 hover:text-byl-purple"><Facebook size={20} /></a>
                <button onClick={handleCopyLink} className="text-byl-dark/40 hover:text-byl-purple relative">
                  {copied ? <Check size={20} className="text-green-500" /> : <LinkIcon size={20} />}
                </button>
              </div>
            </div>
          </div>

          <div className="md:w-1/4 hidden md:block">
            <div className="sticky top-28 bg-byl-light border border-byl-dark/10 p-8">
              <h4 className="text-[11px] uppercase tracking-[0.3em] font-bold text-byl-dark/40 border-b border-byl-dark/10 pb-4 mb-6">About the Author</h4>
              <img src={author?.avatarUrl} alt={author?.name} className="w-24 h-24 object-cover mb-6 grayscale" />
              <h5 className="font-bold text-byl-dark font-serif text-xl">{author?.name}</h5>
              <p className="text-sm text-byl-dark/60 mb-8 font-medium leading-relaxed">{author?.bio}</p>
              {convexUserId && convexUserId !== author?._id && (
                <button onClick={handleFollow} className={`w-full py-3 text-[11px] uppercase font-bold tracking-widest transition-colors ${isFollowing ? 'bg-byl-dark text-byl-light' : 'border border-byl-dark text-byl-dark hover:bg-byl-dark hover:text-byl-light'}`}>
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              )}
            </div>
          </div>
        </div>

        {relatedArticles && relatedArticles.length > 0 && (
          <div className="mt-16 pt-16 border-t border-byl-dark/10">
            <h3 className="text-[11px] uppercase tracking-[0.3em] font-bold text-byl-dark/40 mb-10">More in {article.category}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
              {relatedArticles.map(related => (
                <Link key={related._id} to={`/articles/${related._id}`} className="group block">
                  <div className="w-full h-48 overflow-hidden border border-byl-dark/10 mb-6">
                    <img src={related.imageUrl} alt={related.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0" />
                  </div>
                  <h4 className="font-serif font-bold text-xl text-byl-dark group-hover:underline line-clamp-2 mb-3 leading-tight">{related.title}</h4>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}