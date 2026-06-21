import React from 'react';
import { Layout, Palette, Users, TrendingUp, Zap, MessageSquare, Plus, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function CreatorHub() {
  const creators = useQuery(api.creators.list);
  const articles = useQuery(api.articles.list, {});
  const forumPosts = useQuery(api.forum.listPosts, {});

  const stats = [
    { label: 'Total Articles', value: String(articles?.length ?? 0), icon: TrendingUp, color: 'text-blue-500' },
    { label: 'Active Creators', value: String(creators?.length ?? 0), icon: Users, color: 'text-green-500' },
    { label: 'Discussions', value: String(forumPosts?.length ?? 0), icon: Zap, color: 'text-byl-purple' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
      <header className="mb-20">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 border-b border-byl-dark/10 pb-12">
          <div className="max-w-3xl">
            <span className="text-[10px] uppercase tracking-[0.3em] font-black text-byl-purple mb-4 block">Powering New Perspectives</span>
            <h1 className="font-serif text-6xl md:text-8xl font-black tracking-tighter text-byl-dark mb-8 leading-none">Creator Hub.</h1>
            <p className="text-xl md:text-2xl text-byl-dark/60 font-medium leading-relaxed italic">Your command center for cultural influence. Discover the writers, artists, and storytellers redefining narratives.</p>
          </div>
          <button className="bg-byl-dark text-byl-light px-10 py-5 text-[11px] uppercase tracking-[0.2em] font-black hover:bg-byl-purple transition-all flex items-center space-x-3 shadow-2xl">
            <Plus size={16} /><span>New Publication</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-24">
        {stats.map((stat, i) => (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={i} className="bg-white border border-byl-dark/10 p-10 shadow-sm hover:shadow-xl transition-all group">
            <div className={`mb-8 ${stat.color} transition-transform group-hover:scale-110 duration-500`}><stat.icon size={24} /></div>
            <p className="text-[10px] uppercase tracking-widest font-black text-byl-dark/30 mb-2">{stat.label}</p>
            <h3 className="font-serif text-5xl font-black text-byl-dark">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-12">
          <div className="flex items-center justify-between border-b border-byl-dark/10 pb-6">
            <h2 className="text-[12px] uppercase tracking-[0.2em] font-black text-byl-dark">Drafts & Publications</h2>
            <button className="text-[10px] uppercase tracking-widest font-black text-byl-purple hover:underline">View All Archives</button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
            {(creators ?? []).slice(0, 4).map(creator => (
              <div key={creator._id} className="p-8 border border-byl-dark/5 bg-byl-dark/[0.02] hover:border-byl-purple transition-all group">
                <img src={creator.avatarUrl} alt={creator.name} className="w-16 h-16 grayscale group-hover:grayscale-0 transition-all mb-4" />
                <h4 className="font-serif font-black text-xl mb-1">{creator.name}</h4>
                <p className="text-[9px] uppercase font-black text-byl-purple mb-4">{creator.role}</p>
                <p className="text-xs text-byl-dark/60 font-medium italic line-clamp-2">"{creator.bio}"</p>
              </div>
            ))}
          </div>

          {(articles ?? []).slice(0, 3).map(article => (
            <div key={article._id} className="flex flex-col md:flex-row md:items-center justify-between p-8 border border-byl-dark/5 hover:border-byl-dark/20 bg-byl-dark/[0.02] group transition-all">
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-[8px] uppercase font-black px-2 py-0.5 border border-green-200 text-green-600 bg-green-50">Published</span>
                  <span className="text-[8px] uppercase tracking-widest font-black text-byl-dark/30">{article.date}</span>
                </div>
                <h3 className="font-serif text-2xl font-black text-byl-dark group-hover:text-byl-purple transition-colors">{article.title}</h3>
              </div>
              <div className="mt-6 md:mt-0 flex items-center space-x-8">
                <div className="text-center">
                  <p className="text-[9px] uppercase tracking-widest font-black text-byl-dark/30 mb-1">Category</p>
                  <p className="font-serif font-black text-lg">{article.category}</p>
                </div>
                <button className="p-3 border border-byl-dark/10 hover:border-byl-dark transition-all rounded-full"><ArrowRight size={16} /></button>
              </div>
            </div>
          ))}

          {(!articles || articles.length === 0) && (
            <p className="text-byl-dark/40 text-center font-medium py-10">No publications yet.</p>
          )}
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-[12px] uppercase tracking-[0.2em] font-black text-byl-dark mb-8 border-b border-byl-dark/10 pb-4">Resources</h2>
            <div className="space-y-4">
              {[
                { icon: Palette, title: 'Brand Kit 2026', desc: 'Logos, fonts, and colors' },
                { icon: Layout, title: 'Editorial Guide', desc: 'Tone and style rules' },
                { icon: MessageSquare, title: 'Community FAQ', desc: 'Engagement protocols' },
              ].map((res, i) => (
                <div key={i} className="flex items-start space-x-4 p-5 hover:bg-black/5 transition-all cursor-pointer">
                  <div className="text-byl-purple shrink-0 mt-1"><res.icon size={18} /></div>
                  <div><h4 className="text-[11px] font-black uppercase tracking-widest text-byl-dark">{res.title}</h4><p className="text-[10px] text-byl-dark/40 font-medium italic">{res.desc}</p></div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-byl-dark text-byl-light p-10 shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-serif text-2xl font-black mb-4 leading-tight">Join the Elite Creator Circle.</h3>
              <p className="text-xs text-white/50 mb-8 leading-relaxed italic">Access exclusive sponsorships, mentorship programs, and live showcase opportunities.</p>
              <button className="w-full bg-white text-byl-dark py-4 text-[9px] font-black uppercase tracking-[0.2em] hover:bg-byl-purple hover:text-white transition-all">Apply for Circle</button>
            </div>
            <TrendingUp size={150} className="absolute -bottom-10 -right-10 text-white/5 rotate-12" />
          </section>
        </div>
      </div>
    </div>
  );
}