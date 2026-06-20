import React from 'react';
import { motion } from 'motion/react';
import { Target, Heart, Globe, Quote, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function About() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
      {/* Editorial Header */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-32"
      >
        <span className="text-[10px] uppercase tracking-[0.4em] font-black text-byl-purple mb-6 block">Our Manifesto</span>
        <h1 className="font-serif text-6xl md:text-9xl font-black tracking-tighter text-byl-dark mb-10 leading-none">
          Culture.<br className="hidden md:block" /> Defined by Us.
        </h1>
        <p className="text-2xl md:text-3xl text-byl-dark/60 max-w-4xl mx-auto font-medium leading-relaxed italic">
          "BYLDaily (Beyond Your Labels) is a digital hearth where stories of heritage, innovation, and modern identity converge."
        </p>
      </motion.section>

      {/* Narrative Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-40 items-center">
        <div className="relative">
          <div className="aspect-[4/5] bg-byl-dark/5 border border-byl-dark/10 overflow-hidden shadow-2xl relative">
            <img 
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2000&auto=format&fit=crop" 
              alt="Community" 
              className="w-full h-full object-cover grayscale opacity-80"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-byl-purple/10 mix-blend-multiply" />
          </div>
          <div className="absolute -bottom-10 -right-10 bg-byl-dark text-white p-12 hidden lg:block shadow-2xl">
            <Quote size={40} className="text-byl-purple mb-6" />
            <p className="font-serif text-2xl font-black italic leading-tight">We build for those who create, not just consume.</p>
          </div>
        </div>
        
        <div className="space-y-10">
          <h2 className="font-serif text-5xl font-black tracking-tight text-byl-dark leading-none">The BYL Philosophy</h2>
          <div className="space-y-6 text-lg text-byl-dark/70 font-medium leading-relaxed">
            <p>
              Founded in 2026, BYLDaily emerged from a simple observation: the digital landscape was missing a space that resonated with the nuance of modern African and global culture.
            </p>
            <p>
              We believe in the power of the first-person perspective. Our platform is designed to give creators the tools they need to share their truth, whether it's through journalism, visual essays, or live events.
            </p>
            <p>
              BYL stands for <strong>Build Your Legacy</strong>. We are a repository of moments that matter and a home for the rebels who refuse to be defined by anyone but themselves.
            </p>
          </div>
          <div className="pt-8 border-t border-byl-dark/10 flex flex-wrap gap-8">
            <div className="flex items-center space-x-3">
               <Target size={20} className="text-byl-purple" />
               <span className="text-[11px] uppercase tracking-widest font-black">Purpose-Driven</span>
            </div>
            <div className="flex items-center space-x-3">
               <Heart size={20} className="text-byl-purple" />
               <span className="text-[11px] uppercase tracking-widest font-black">Creator-First</span>
            </div>
            <div className="flex items-center space-x-3">
               <Globe size={20} className="text-byl-purple" />
               <span className="text-[11px] uppercase tracking-widest font-black">Global-Scale</span>
            </div>
          </div>
        </div>
      </div>

      {/* Values Grid */}
      <section className="mb-40">
        <div className="text-center mb-20">
          <h2 className="text-[14px] uppercase tracking-[0.3em] font-black text-byl-dark mb-6">Our Core Pillars</h2>
          <div className="w-20 h-1 bg-byl-purple mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-1px bg-byl-dark/10 border border-byl-dark/10">
          {[
            { 
              title: "Authenticity", 
              desc: "We prioritize raw, unfiltered storytelling over manufactured trends. Truth is our primary currency." 
            },
            { 
              title: "Innovation", 
              desc: "From the way we publish to how we interact, we are pushing the boundaries of media." 
            },
            { 
              title: "Community", 
              desc: "BYLDaily isn't ours; it belongs to the people who use it. We facilitate a collective voice." 
            }
          ].map((pillar, i) => (
            <div key={i} className="bg-white p-16 hover:bg-byl-purple hover:text-white transition-all duration-500 group">
              <h3 className="font-serif text-3xl font-black mb-6">{pillar.title}</h3>
              <p className="text-sm font-medium leading-relaxed opacity-60 group-hover:opacity-100 italic">"{pillar.desc}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-byl-dark text-byl-light p-16 lg:p-32 text-center relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative z-10"
        >
          <h2 className="font-serif text-5xl md:text-7xl font-black tracking-tighter mb-10 leading-top">Ready to join the movement?</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link 
              to="/register" 
              className="bg-byl-light text-byl-dark px-12 py-5 text-[11px] uppercase tracking-[0.2em] font-black hover:bg-byl-purple hover:text-white transition-all shadow-2xl flex items-center justify-center space-x-3"
            >
              <span>Build Your Account</span>
              <ArrowRight size={16} />
            </Link>
            <Link 
              to="/creators" 
              className="bg-transparent border border-white/20 text-white px-12 py-5 text-[11px] uppercase tracking-[0.2em] font-black hover:bg-white hover:text-byl-dark transition-all"
            >
              Apply as Creator
            </Link>
          </div>
        </motion.div>
        
        {/* Subtle decorative elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/[0.03] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/[0.05] rounded-full" />
      </section>
    </div>
  );
}
