import React, { useState } from 'react';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { MessageSquare, Heart, Share2, Plus, Send } from 'lucide-react';
import { ForumTopic } from '../types';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TOPICS: ForumTopic[] = [
  'Culture Talk', 'Entertainment', 'Lifestyle', 'Relationships',
  'Wellness', 'Creator Corner', 'Opinions'
];

interface PostItemProps {
  key?: any;
  post: any;
  allComments: any[];
  users: any[];
  currentUserId: string;
  addComment: any;
}

function PostItem({ post, allComments, users, currentUserId, addComment }: PostItemProps) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const upvotePost = useMutation(api.forum.upvotePost);

  const postComments = allComments.filter(c => c.postId === post._id);
  const author = users.find((u: any) => u.firebaseUid === post.authorId);

  const handleLike = () => { upvotePost({ postId: post._id }); };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUserId) return;
    setSubmitting(true);
    try {
      await addComment({ postId: post._id, authorId: currentUserId, content: newComment });
      setNewComment('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <article className="bg-byl-light border border-byl-dark/10 p-6 md:p-8 hover:border-byl-dark transition-colors duration-300">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <img src={author?.avatarUrl} alt={author?.name} className="w-12 h-12 rounded-full object-cover grayscale" />
          <div>
            <h4 className="font-bold text-byl-dark font-serif text-lg transition-colors">{author?.name}</h4>
            <div className="flex items-center text-[10px] uppercase font-bold tracking-widest text-byl-dark/40 space-x-2 mt-1 transition-colors">
              <span className="text-byl-purple">{post.topic}</span>
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-byl-dark/80 font-medium leading-relaxed mb-6 text-sm md:text-base transition-colors">{post.content}</p>

      <div className="flex items-center space-x-6 border-t border-byl-dark/10 pt-6 transition-colors">
        <button onClick={handleLike} className="flex items-center space-x-2 text-byl-dark/40 hover:text-byl-dark transition-colors">
          <Heart size={18} fill="none" />
          <span className="text-[11px] font-bold">{post.upvotes}</span>
        </button>
        <button onClick={() => setShowComments(!showComments)} className={`flex items-center space-x-2 transition-colors ${showComments ? 'text-byl-dark' : 'text-byl-dark/40 hover:text-byl-dark'}`}>
          <MessageSquare size={18} />
          <span className="text-[11px] font-bold">{postComments.length}</span>
        </button>
        <button className="flex items-center space-x-2 text-byl-dark/40 hover:text-byl-dark transition-colors ml-auto"><Share2 size={18} /></button>
      </div>

      {showComments && (
        <div className="mt-8 space-y-6 pt-6 border-t border-byl-dark/5">
          {currentUserId && (
            <form onSubmit={handleAddComment} className="flex space-x-4">
              <div className="flex-grow flex">
                <input type="text" placeholder="Add a reply..." className="flex-grow bg-transparent border-b border-byl-dark/10 focus:border-byl-purple py-1 text-sm font-medium text-byl-dark focus:outline-none transition-colors" value={newComment} onChange={(e) => setNewComment(e.target.value)} disabled={submitting} />
                <button type="submit" disabled={submitting || !newComment.trim()} className="ml-2 text-byl-dark/40 hover:text-byl-purple transition-colors disabled:opacity-30"><Send size={16} /></button>
              </div>
            </form>
          )}

          <div className="space-y-6 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
            {postComments.map((comment: any) => {
              const commentAuthor = users.find((u: any) => u.firebaseUid === comment.authorId);
              return (
                <div key={comment._id} className="flex space-x-4">
                  <img src={commentAuthor?.avatarUrl} alt={commentAuthor?.name} className="w-8 h-8 rounded-full object-cover grayscale" />
                  <div className="flex-grow">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-[11px] font-bold text-byl-dark">{commentAuthor?.name}</span>
                    </div>
                    <p className="text-sm text-byl-dark/70 font-medium leading-relaxed">{comment.content}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </article>
  );
}

export function Forum() {
  const [activeTopic, setActiveTopic] = useState<ForumTopic | 'All'>('All');
  const { user } = useAuth();

  const posts = useQuery(api.forum.listPosts, {});
  const allComments = useQuery(api.forum.listAllComments, {});
  const users = useQuery(api.users.getAll, {});
  const addComment = useMutation(api.forum.addComment);

  const filteredPosts = posts ? (activeTopic === 'All' ? posts : posts.filter(post => post.topic === activeTopic)) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 md:py-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-byl-dark/10 pb-8 gap-6">
        <div>
          <h1 className="font-serif text-[40px] md:text-[64px] font-black tracking-tight leading-none mb-4 text-byl-dark transition-colors">BYL Spaces</h1>
          <p className="text-xl text-byl-dark/70 max-w-2xl font-medium transition-colors">Join the conversation. Share your thoughts, ask questions, and connect with the community.</p>
        </div>
        <Link to="/spaces/new" className="flex items-center space-x-2 bg-byl-dark text-byl-light px-6 py-4 text-[11px] uppercase tracking-widest font-bold hover:bg-byl-purple transition-all duration-300 shrink-0">
          <Plus size={16} /><span>New Discussion</span>
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        <aside className="lg:w-1/4 shrink-0">
          <div className="sticky top-32">
            <h3 className="text-[11px] uppercase tracking-[0.3em] font-bold text-byl-dark/40 mb-6 border-b border-byl-dark/10 pb-4">Topics</h3>
            <div className="flex flex-col space-y-2">
              <button onClick={() => setActiveTopic('All')} className={`text-left px-4 py-3 text-[11px] uppercase tracking-widest font-bold transition-all ${activeTopic === 'All' ? 'bg-byl-dark text-byl-light' : 'text-byl-dark hover:bg-byl-dark/5 border border-transparent'}`}>All Discussions</button>
              {TOPICS.map(topic => (
                <button key={topic} onClick={() => setActiveTopic(topic)} className={`text-left px-4 py-3 text-[11px] uppercase tracking-widest font-bold transition-all ${activeTopic === topic ? 'bg-byl-dark text-byl-light' : 'text-byl-dark hover:bg-byl-dark/5 border border-transparent'}`}>{topic}</button>
              ))}
            </div>
          </div>
        </aside>

        <main className="lg:w-1/2 flex flex-col space-y-8">
          {!posts ? (
            <div className="animate-pulse space-y-6">
              {[1,2,3].map(i => <div key={i} className="h-48 bg-byl-dark/5" />)}
            </div>
          ) : (
            filteredPosts.map(post => (
              <PostItem key={post._id} post={post} allComments={allComments ?? []} users={users ?? []} currentUserId={user?.id ?? ""} addComment={addComment} />
            ))
          )}
          {posts && filteredPosts.length === 0 && (
            <p className="text-center text-byl-dark/40 font-medium py-20">No discussions in this topic yet. Start one!</p>
          )}
        </main>

        <aside className="lg:w-1/4 shrink-0 hidden xl:block">
          <div className="sticky top-32 bg-byl-dark/[0.02] p-8 border border-byl-dark/5 transition-colors duration-300">
            <h3 className="text-[11px] uppercase tracking-[0.3em] font-bold text-byl-dark/40 mb-6 border-b border-byl-dark/10 pb-4 transition-colors">Trending Now</h3>
            <div className="flex flex-col space-y-6">
              {(posts ?? []).sort((a: any, b: any) => b.upvotes - a.upvotes).slice(0, 3).map((post: any) => (
                <div key={post._id} className="group cursor-pointer">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-byl-purple block mb-1 transition-colors">{post.topic}</span>
                  <p className="font-serif font-bold text-byl-dark line-clamp-2 leading-tight group-hover:underline text-sm transition-colors">{post.content}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}