import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from '../context/AuthContext';
import { ForumTopic } from '../types';

const TOPICS: ForumTopic[] = [
  'Culture Talk', 'Entertainment', 'Lifestyle', 'Relationships',
  'Wellness', 'Creator Corner', 'Opinions'
];

export function NewDiscussion() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const createPost = useMutation(api.forum.createPost);
  const [topic, setTopic] = useState<ForumTopic>('Culture Talk');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isAuthenticated || !user) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;
    setSubmitting(true);
    try {
      await createPost({ authorId: user.id, title: topic, content, topic });
      navigate('/spaces');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 md:py-20">
      <button onClick={() => navigate('/spaces')} className="flex items-center text-[11px] uppercase tracking-widest font-bold text-byl-dark/40 hover:text-byl-dark mb-10 transition-colors">
        <ArrowLeft size={14} className="mr-2" />Back to Spaces
      </button>

      <div className="mb-12">
        <h1 className="font-serif text-[40px] md:text-[56px] font-black tracking-tight leading-none mb-6 text-byl-dark">Start a Discussion</h1>
        <p className="text-xl text-byl-dark/70 font-medium">What's on your mind today? Choose a topic and share your thoughts with the BYL community.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-byl-light border border-byl-dark/10 p-8 md:p-12 transition-colors">
        <div>
          <label className="block text-[11px] uppercase tracking-[0.2em] font-bold text-byl-dark/40 mb-4">Select Topic</label>
          <div className="flex flex-wrap gap-3">
            {TOPICS.map(t => (
              <button key={t} type="button" onClick={() => setTopic(t)} className={`px-4 py-2 text-[10px] uppercase font-bold tracking-widest border transition-all ${topic === t ? 'bg-byl-dark text-byl-light border-byl-dark' : 'border-byl-dark/10 text-byl-dark/60 hover:border-byl-dark'}`}>{t}</button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="content" className="block text-[11px] uppercase tracking-[0.2em] font-bold text-byl-dark/40 mb-4">Your Discussion</label>
          <textarea id="content" rows={6} className="w-full bg-transparent border-b border-byl-dark/20 focus:border-byl-purple py-4 text-lg font-medium text-byl-dark focus:outline-none resize-none transition-colors" placeholder="Type your message here..." value={content} onChange={(e) => setContent(e.target.value)} required />
        </div>

        <button type="submit" disabled={submitting || !content.trim()} className="w-full md:w-auto bg-byl-dark text-byl-light px-10 py-5 text-[11px] uppercase tracking-widest font-bold hover:bg-byl-purple transition-all flex items-center justify-center space-x-3 disabled:opacity-50">
          <Send size={16} /><span>{submitting ? 'Posting…' : 'Post Discussion'}</span>
        </button>
      </form>
    </div>
  );
}