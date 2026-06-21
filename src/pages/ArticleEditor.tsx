import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Save, AlertCircle, Check } from 'lucide-react';

const CATEGORIES = ['Culture', 'Entertainment', 'Lifestyle', 'News', 'Wellness', 'Fashion', 'Music'];

export function ArticleEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const existingArticle = useQuery(api.articles.getById, id ? { id: id as any } : "skip");

  const createArticle = useMutation(api.articles.create);
  const updateArticle = useMutation(api.articles.update);

  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [readTime, setReadTime] = useState('5 min read');
  const [published, setPublished] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (existingArticle) {
      setTitle(existingArticle.title);
      setExcerpt(existingArticle.excerpt);
      setContent(existingArticle.content);
      setImageUrl(existingArticle.imageUrl);
      setCategory(existingArticle.category);
      setReadTime(existingArticle.readTime);
      setPublished(existingArticle.published);
    }
  }, [existingArticle]);

  if (!isAuthenticated) { navigate('/login'); return null; }

  const handleSave = async (publish: boolean) => {
    setSaving(true); setError('');
    try {
      if (id) {
        await updateArticle({ id: id as any, title, excerpt, content, imageUrl, category, readTime, published: publish });
      } else {
        await createArticle({ title, excerpt, content, imageUrl, category, readTime, published: publish });
      }
      setSaved(true);
      setTimeout(() => { setSaved(false); if (!id) navigate('/profile'); }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to save');
    } finally { setSaving(false); }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
      <button onClick={() => navigate(-1)} className="flex items-center text-[11px] uppercase tracking-widest font-bold text-byl-dark/40 hover:text-byl-dark mb-10">
        <ArrowLeft size={14} className="mr-2" />Back
      </button>

      <h1 className="font-serif text-4xl md:text-5xl font-black mb-10">{id ? 'Edit Article' : 'New Article'}</h1>

      <form className="space-y-8" onSubmit={e => { e.preventDefault(); handleSave(published); }}>
        <div>
          <label className="block text-[10px] uppercase tracking-widest font-bold text-byl-dark/40 mb-2">Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} required className="w-full bg-byl-dark/5 border border-byl-dark/10 px-5 py-4 text-lg font-bold focus:outline-none focus:border-byl-purple" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-byl-dark/40 mb-2">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-byl-dark/5 border border-byl-dark/10 px-5 py-4 text-sm font-medium focus:outline-none focus:border-byl-purple">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-byl-dark/40 mb-2">Read Time</label>
            <input value={readTime} onChange={e => setReadTime(e.target.value)} className="w-full bg-byl-dark/5 border border-byl-dark/10 px-5 py-4 text-sm font-medium focus:outline-none focus:border-byl-purple" />
          </div>
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-widest font-bold text-byl-dark/40 mb-2">Image URL</label>
          <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} required className="w-full bg-byl-dark/5 border border-byl-dark/10 px-5 py-4 text-sm font-medium focus:outline-none focus:border-byl-purple" />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-widest font-bold text-byl-dark/40 mb-2">Excerpt</label>
          <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} required rows={2} className="w-full bg-byl-dark/5 border border-byl-dark/10 px-5 py-4 text-sm font-medium focus:outline-none focus:border-byl-purple resize-none" />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-widest font-bold text-byl-dark/40 mb-2">Content</label>
          <textarea value={content} onChange={e => setContent(e.target.value)} required rows={12} className="w-full bg-byl-dark/5 border border-byl-dark/10 px-5 py-4 text-sm font-medium focus:outline-none focus:border-byl-purple resize-y font-mono" />
        </div>

        {error && <div className="flex items-center gap-2 text-red-600 text-sm"><AlertCircle size={14} />{error}</div>}

        <div className="flex items-center gap-4">
          <button type="submit" disabled={saving} className="bg-byl-dark text-byl-light px-8 py-4 text-[10px] uppercase tracking-widest font-bold hover:bg-byl-purple disabled:opacity-50 flex items-center gap-2">
            <Save size={14} />{saving ? 'Saving…' : 'Publish'}
          </button>
          <button type="button" onClick={() => handleSave(false)} disabled={saving} className="border border-byl-dark/20 px-8 py-4 text-[10px] uppercase tracking-widest font-bold hover:bg-byl-dark/5 disabled:opacity-50">
            Save as Draft
          </button>
          {saved && <span className="flex items-center gap-1 text-green-600 text-sm"><Check size={14} />Saved</span>}
        </div>
      </form>
    </div>
  );
}