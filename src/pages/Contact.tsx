import React, { useState } from 'react';
import { Mail, MapPin, ArrowRight, MessageCircle, Check, AlertCircle } from 'lucide-react';

export function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) { setError(true); return; }
    setSent(true); setError(false);
    setName(''); setEmail(''); setSubject('General Inquiry'); setMessage('');
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="flex flex-col lg:flex-row gap-20">
        <div className="lg:w-1/3">
          <div className="mb-12">
            <span className="text-[10px] uppercase tracking-[0.3em] font-black text-byl-purple mb-4 block">Get in Touch</span>
            <h1 className="font-serif text-5xl md:text-6xl font-black tracking-tighter text-byl-dark mb-8 leading-none">
              Let's Connect.
            </h1>
            <p className="text-lg text-byl-dark/60 font-medium">
              Have a story to tell, a creator to recommend, or just want to say hello? Our doors are always open.
            </p>
          </div>

          <div className="space-y-10">
            <div className="flex items-start space-x-6">
              <div className="w-12 h-12 rounded-full border border-byl-dark/10 flex items-center justify-center text-byl-purple shrink-0">
                <Mail size={20} />
              </div>
              <div>
                <h4 className="text-[10px] uppercase font-black tracking-widest text-byl-dark mb-1">Email Us</h4>
                <p className="text-byl-dark font-serif font-bold text-lg">hello@byldaily.com</p>
                <p className="text-sm text-byl-dark/40 font-bold uppercase tracking-widest mt-1">Response within 24hrs</p>
              </div>
            </div>

            <div className="flex items-start space-x-6">
              <div className="w-12 h-12 rounded-full border border-byl-dark/10 flex items-center justify-center text-byl-purple shrink-0">
                <MessageCircle size={20} />
              </div>
              <div>
                <h4 className="text-[10px] uppercase font-black tracking-widest text-byl-dark mb-1">Creator Inquiries</h4>
                <p className="text-byl-dark font-serif font-bold text-lg">creators@byldaily.com</p>
                <p className="text-sm text-byl-dark/40 font-bold uppercase tracking-widest mt-1">Join our hub</p>
              </div>
            </div>

            <div className="flex items-start space-x-6">
              <div className="w-12 h-12 rounded-full border border-byl-dark/10 flex items-center justify-center text-byl-purple shrink-0">
                <MapPin size={20} />
              </div>
              <div>
                <h4 className="text-[10px] uppercase font-black tracking-widest text-byl-dark mb-1">Studio Address</h4>
                <p className="text-byl-dark font-serif font-bold text-lg">12 Innovation Square</p>
                <p className="text-sm text-byl-dark/40 font-medium italic">Lagos, Nigeria</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-2/3 bg-byl-light border border-byl-dark/10 p-8 md:p-16 shadow-2xl">
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-black text-byl-dark/40 mb-3">Full Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="John Doe"
                  className="w-full bg-byl-dark/5 border-none px-6 py-5 text-sm font-bold focus:ring-1 focus:ring-byl-purple transition-all outline-none text-byl-dark" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-black text-byl-dark/40 mb-3">Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="name@example.com"
                  className="w-full bg-byl-dark/5 border-none px-6 py-5 text-sm font-bold focus:ring-1 focus:ring-byl-purple transition-all outline-none text-byl-dark" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest font-black text-byl-dark/40 mb-3">Subject</label>
              <select value={subject} onChange={e => setSubject(e.target.value)}
                className="w-full bg-byl-dark/5 border-none px-6 py-5 text-sm font-bold focus:ring-1 focus:ring-byl-purple transition-all outline-none text-byl-dark appearance-none">
                <option>General Inquiry</option>
                <option>Story Submission</option>
                <option>Partnership Engagement</option>
                <option>Support Request</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest font-black text-byl-dark/40 mb-3">Your Message</label>
              <textarea value={message} onChange={e => setMessage(e.target.value)} required rows={6} placeholder="Tell us what's on your mind..."
                className="w-full bg-byl-dark/5 border-none px-6 py-5 text-sm font-bold focus:ring-1 focus:ring-byl-purple transition-all outline-none text-byl-dark resize-none" />
            </div>

            {error && <div className="flex items-center gap-2 text-red-600 text-sm"><AlertCircle size={14} />Please fill in all required fields.</div>}
            {sent && <div className="flex items-center gap-2 text-green-600 text-sm"><Check size={14} />Message sent! We'll get back to you within 24 hours.</div>}

            <button type="submit" className="bg-byl-dark text-byl-light px-12 py-5 text-[11px] uppercase tracking-[0.2em] font-black hover:bg-byl-purple transition-all flex items-center space-x-3 shadow-xl">
              <span>Send Message</span>
              <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
