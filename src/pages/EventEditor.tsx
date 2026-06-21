import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Save, AlertCircle, Check } from 'lucide-react';

const CATEGORIES = ['Online', 'Physical', 'Music', 'Culture', 'Community'];

export function EventEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const existingEvent = useQuery(api.events.getById, id ? { id: id as any } : "skip");

  const createEvent = useMutation(api.events.create);
  const updateEvent = useMutation(api.events.update);

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [slug, setSlug] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (existingEvent) {
      setTitle(existingEvent.title);
      setDate(existingEvent.date);
      setTime(existingEvent.time);
      setLocation(existingEvent.location);
      setCategory(existingEvent.category);
      setImageUrl(existingEvent.imageUrl);
      setDescription(existingEvent.description);
      setSlug(existingEvent.slug);
    }
  }, [existingEvent]);

  if (!isAuthenticated) { navigate('/login'); return null; }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      if (id) {
        await updateEvent({ id: id as any, title, date, time, location, category, imageUrl, description, slug });
      } else {
        await createEvent({ title, date, time, location, category, imageUrl, description, slug });
      }
      setSaved(true);
      setTimeout(() => { setSaved(false); navigate('/profile'); }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to save');
    } finally { setSaving(false); }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
      <button onClick={() => navigate(-1)} className="flex items-center text-[11px] uppercase tracking-widest font-bold text-byl-dark/40 hover:text-byl-dark mb-10">
        <ArrowLeft size={14} className="mr-2" />Back
      </button>

      <h1 className="font-serif text-4xl md:text-5xl font-black mb-10">{id ? 'Edit Event' : 'Create Event'}</h1>

      <form className="space-y-8" onSubmit={handleSave}>
        <div>
          <label className="block text-[10px] uppercase tracking-widest font-bold text-byl-dark/40 mb-2">Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} required className="w-full bg-byl-dark/5 border border-byl-dark/10 px-5 py-4 text-lg font-bold focus:outline-none focus:border-byl-purple" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-byl-dark/40 mb-2">Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full bg-byl-dark/5 border border-byl-dark/10 px-5 py-4 text-sm font-medium focus:outline-none focus:border-byl-purple" />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-byl-dark/40 mb-2">Time</label>
            <input type="time" value={time} onChange={e => setTime(e.target.value)} required className="w-full bg-byl-dark/5 border border-byl-dark/10 px-5 py-4 text-sm font-medium focus:outline-none focus:border-byl-purple" />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-byl-dark/40 mb-2">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-byl-dark/5 border border-byl-dark/10 px-5 py-4 text-sm font-medium focus:outline-none focus:border-byl-purple">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-widest font-bold text-byl-dark/40 mb-2">Location</label>
          <input value={location} onChange={e => setLocation(e.target.value)} required className="w-full bg-byl-dark/5 border border-byl-dark/10 px-5 py-4 text-sm font-medium focus:outline-none focus:border-byl-purple" />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-widest font-bold text-byl-dark/40 mb-2">Image URL</label>
          <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} required className="w-full bg-byl-dark/5 border border-byl-dark/10 px-5 py-4 text-sm font-medium focus:outline-none focus:border-byl-purple" />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-widest font-bold text-byl-dark/40 mb-2">Slug (URL identifier)</label>
          <input value={slug} onChange={e => setSlug(e.target.value)} required placeholder="my-event-name" className="w-full bg-byl-dark/5 border border-byl-dark/10 px-5 py-4 text-sm font-medium focus:outline-none focus:border-byl-purple" />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-widest font-bold text-byl-dark/40 mb-2">Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} required rows={6} className="w-full bg-byl-dark/5 border border-byl-dark/10 px-5 py-4 text-sm font-medium focus:outline-none focus:border-byl-purple resize-y" />
        </div>

        {error && <div className="flex items-center gap-2 text-red-600 text-sm"><AlertCircle size={14} />{error}</div>}

        <div className="flex items-center gap-4">
          <button type="submit" disabled={saving} className="bg-byl-dark text-byl-light px-8 py-4 text-[10px] uppercase tracking-widest font-bold hover:bg-byl-purple disabled:opacity-50 flex items-center gap-2">
            <Save size={14} />{saving ? 'Saving…' : id ? 'Update Event' : 'Create Event'}
          </button>
          {saved && <span className="flex items-center gap-1 text-green-600 text-sm"><Check size={14} />Saved</span>}
        </div>
      </form>
    </div>
  );
}