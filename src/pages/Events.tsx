import React from 'react';
import { EVENTS } from '../data';
import { EventCategory } from '../types';
import { Calendar, MapPin, Clock, ArrowRight, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const CATEGORIES: (EventCategory | 'All')[] = ['All', 'Online', 'Physical', 'Music', 'Culture', 'Community'];

export function Events() {
  const [activeCategory, setActiveCategory] = React.useState<EventCategory | 'All'>('All');

  const filteredEvents = activeCategory === 'All'
    ? EVENTS
    : EVENTS.filter(e => e.category === activeCategory);

  const featuredEvent = EVENTS[0]; // Let's treat the first one as featured

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
      {/* Editorial Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-20 border-b border-byl-dark/10 pb-12"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-byl-purple/10 flex items-center justify-center text-byl-purple animate-pulse">
            <Star size={20} fill="currentColor" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.3em] font-black text-byl-dark/40">Exclusive Programming</span>
        </div>
        <h1 className="font-serif text-6xl md:text-8xl font-black tracking-tighter leading-none mb-8 text-byl-dark">
          BYL Live.
        </h1>
        <p className="text-xl md:text-2xl text-byl-dark/60 max-w-3xl font-medium leading-relaxed italic">
          Experience the culture in real-time. From digital workshops to physical galleries, we're curating the moments that matter.
        </p>
      </motion.div>

      {/* Featured Event Section */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-24 group relative overflow-hidden bg-byl-dark text-byl-light flex flex-col lg:flex-row shadow-2xl items-stretch"
      >
        <div className="lg:w-3/5 min-h-[400px] lg:h-auto overflow-hidden relative bg-black">
          <img 
            src={featuredEvent.imageUrl} 
            alt={featuredEvent.title} 
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover grayscale-[10%] opacity-90 group-hover:grayscale-0 group-hover:scale-105 group-hover:opacity-100 transition-all duration-1000 ease-out" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-byl-dark/40 to-transparent lg:hidden" />
        </div>
        <div className="lg:w-2/5 p-12 lg:p-16 flex flex-col justify-center relative z-10 bg-byl-dark text-byl-light">
          <div className="flex items-center space-x-3 mb-8">
            <span className="px-5 py-1.5 bg-byl-purple text-white text-[9px] font-black uppercase tracking-[0.2em]">Featured Event</span>
            <span className="text-[9px] uppercase tracking-[0.2em] font-black opacity-60">{featuredEvent.category}</span>
          </div>
          <h2 className="font-serif text-4xl lg:text-5xl font-black mb-8 leading-tight tracking-tight">
            {featuredEvent.title}
          </h2>
          <div className="space-y-4 mb-10 border-l border-byl-light/20 pl-6">
            <div className="flex items-center text-[11px] uppercase tracking-widest font-bold opacity-80">
              <Calendar size={14} className="mr-3 text-byl-purple" />
              {featuredEvent.date}
            </div>
            <div className="flex items-center text-[11px] uppercase tracking-widest font-bold opacity-80">
              <MapPin size={14} className="mr-3 text-byl-purple" />
              {featuredEvent.location}
            </div>
          </div>
          <button className="bg-byl-light text-byl-dark px-10 py-5 text-[11px] uppercase tracking-[0.2em] font-black hover:bg-byl-purple hover:text-byl-light transition-all flex items-center justify-between group/btn shadow-xl">
            <span>Discover Full Profile</span>
            <ArrowRight size={16} className="group-hover/btn:translate-x-2 transition-transform" />
          </button>
        </div>
        <div className="absolute top-0 right-0 p-10 opacity-5">
           <Star size={200} />
        </div>
      </motion.div>

      {/* Filters & Grid */}
      <div className="flex flex-col md:flex-row gap-12 items-start">
        <div className="w-full md:w-64 space-y-8 md:sticky md:top-32">
          <div className="border-b border-byl-dark/10 md:border-none pb-6 md:pb-0">
            <h4 className="text-[10px] uppercase tracking-widest font-black text-byl-dark mb-6 hidden md:block border-b border-byl-dark/10 pb-4">Filter by Theme</h4>
            <div className="flex md:flex-col items-center md:items-start overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 gap-8 md:gap-0 md:space-y-4 hide-scrollbar -mx-6 px-6 md:mx-0 md:px-0">
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`whitespace-nowrap text-[11px] uppercase tracking-widest font-bold transition-all shrink-0 ${
                    activeCategory === category
                      ? 'text-byl-purple md:translate-x-2 border-b-2 border-byl-purple md:border-none pb-2 md:pb-0'
                      : 'text-byl-dark/40 hover:text-byl-dark md:hover:translate-x-1'
                  }`}
                >
                  {category === 'All' ? 'Every Occasion' : category}
                </button>
              ))}
            </div>
          </div>

          <div className="p-8 bg-byl-dark/5 border border-byl-dark/5 hidden md:block">
             <p className="text-[9px] uppercase tracking-widest font-black text-byl-dark/30 mb-4 leading-relaxed">Want to host an event under the BYL umbrella?</p>
             <button className="text-[10px] uppercase tracking-widest font-black text-byl-purple hover:underline">Apply as Creator</button>
          </div>
        </div>

        <div className="flex-1 w-full">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-10"
            >
              {filteredEvents.map(event => (
                <motion.div 
                  layout
                  key={event.id} 
                  className="group flex flex-col bg-byl-light border border-byl-dark/10 hover:border-byl-dark transition-all duration-500 shadow-sm hover:shadow-2xl"
                >
                  <div className="w-full h-64 md:h-72 overflow-hidden relative border-b border-byl-dark/10">
                    <img 
                      src={event.imageUrl} 
                      alt={event.title} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 grayscale group-hover:grayscale-0" 
                    />
                    <div className="absolute top-6 left-6">
                      <span className="px-4 py-2 bg-byl-light text-byl-dark text-[9px] font-black uppercase tracking-widest shadow-xl border border-byl-dark/10">
                        {event.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-8 md:p-10 flex flex-col flex-grow">
                    <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-byl-purple mb-4">
                       <Clock size={12} />
                       <span>Upcoming Event</span>
                    </div>
                    <h3 className="font-serif text-2xl md:text-3xl font-black text-byl-dark mb-6 group-hover:text-byl-purple transition-colors leading-tight">
                      {event.title}
                    </h3>
                    
                    <div className="space-y-3 mb-8 md:10 transition-colors">
                      <div className="flex items-center text-[10px] uppercase tracking-widest font-black text-byl-dark/40 italic">
                        <Calendar size={14} className="mr-3" />
                        {event.date} &bull; {event.time}
                      </div>
                      <div className="flex items-center text-[10px] uppercase tracking-widest font-black text-byl-dark/40 italic">
                        <MapPin size={14} className="mr-3" />
                        {event.location}
                      </div>
                    </div>

                    <p className="text-byl-dark/60 text-sm mb-10 flex-grow font-medium leading-relaxed italic">
                      "{event.description}"
                    </p>

                    <button className={`w-full py-5 text-[11px] uppercase tracking-[0.2em] font-black transition-all shadow-lg ${
                      event.isRsvpd
                        ? 'bg-byl-dark/5 text-byl-dark/40 cursor-default border border-byl-dark/10'
                        : 'bg-byl-dark text-byl-light hover:bg-byl-purple'
                    }`}>
                      {event.isRsvpd ? 'Participation Confirmed' : 'Reserve Placement'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

