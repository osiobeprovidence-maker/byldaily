import React from 'react';
import { HelpCircle, BookOpen, MessageSquare, Shield, Zap, Search } from 'lucide-react';

export function Support() {
  const faqs = [
    {
      q: "How do I become a BYLDaily Creator?",
      a: "You can apply through our Creator Hub. We look for authentic voices with a unique perspective on culture and lifestyle."
    },
    {
      q: "Is my subscription content exclusive?",
      a: "Yes, many of our feature stories and live events are exclusively available to our community members."
    },
    {
      q: "How do I update my profile visibility?",
      a: "You can manage your public profile settings in your Account Dashboard under the 'Privacy' section."
    },
    {
      q: "Can I submit story tips anonymously?",
      a: "Absolutely. We value protection and privacy. You can use our secure contact form to send encrypted tips."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <header className="text-center mb-20">
        <span className="text-[10px] uppercase tracking-[0.3em] font-black text-byl-purple mb-4 block">How can we help?</span>
        <h1 className="font-serif text-5xl md:text-6xl font-black tracking-tighter text-byl-dark mb-10 leading-none">
          Support Center
        </h1>
        <div className="max-w-2xl mx-auto relative">
          <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-byl-dark/30" />
          <input 
            type="text" 
            placeholder="Search help articles, guides, or FAQs..."
            className="w-full bg-byl-dark/5 border border-byl-dark/10 px-16 py-6 text-sm font-bold focus:ring-1 focus:ring-byl-purple transition-all outline-none text-byl-dark shadow-xl"
          />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
        <div className="bg-byl-light border border-byl-dark/10 p-10 hover:shadow-2xl transition-all group">
          <div className="w-12 h-12 rounded-full bg-byl-purple/10 flex items-center justify-center text-byl-purple mb-8 group-hover:bg-byl-purple group-hover:text-white transition-all">
            <BookOpen size={20} />
          </div>
          <h3 className="font-serif font-black text-2xl text-byl-dark mb-4">Knowledge Base</h3>
          <p className="text-sm text-byl-dark/60 font-medium leading-relaxed mb-6">Explore our detailed guides on publishing, community guidelines, and platform features.</p>
          <button className="text-[10px] uppercase tracking-widest font-black text-byl-purple hover:underline">Explore Guides</button>
        </div>

        <div className="bg-byl-light border border-byl-dark/10 p-10 hover:shadow-2xl transition-all group">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-8 group-hover:bg-green-600 group-hover:text-white transition-all">
            <Shield size={20} />
          </div>
          <h3 className="font-serif font-black text-2xl text-byl-dark mb-4">Account & Safety</h3>
          <p className="text-sm text-byl-dark/60 font-medium leading-relaxed mb-6">Manage your security settings, passwords, and two-factor authentication protocols.</p>
          <button className="text-[10px] uppercase tracking-widest font-black text-byl-purple hover:underline">Safety Settings</button>
        </div>

        <div className="bg-byl-light border border-byl-dark/10 p-10 hover:shadow-2xl transition-all group">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all">
            <Zap size={20} />
          </div>
          <h3 className="font-serif font-black text-2xl text-byl-dark mb-4">Billing & Payouts</h3>
          <p className="text-sm text-byl-dark/60 font-medium leading-relaxed mb-6">Information for creators regarding revenue sharing, schedules, and subscription plans.</p>
          <button className="text-[10px] uppercase tracking-widest font-black text-byl-purple hover:underline">Billing Portal</button>
        </div>
      </div>

      <div className="bg-byl-dark text-byl-light p-10 md:p-20 relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-serif text-4xl font-black mb-6">Still need assistance?</h2>
            <p className="text-lg text-byl-light/60 font-medium mb-10 leading-relaxed">Our support specialists are available 24/7 to help you with any technical or account-related issues.</p>
            <div className="flex flex-col sm:flex-row gap-4">
               <button className="bg-byl-purple text-white px-10 py-5 text-[11px] uppercase tracking-widest font-black hover:bg-white hover:text-byl-purple transition-all">Live Chat Now</button>
               <button className="bg-transparent border border-white/20 text-white px-10 py-5 text-[11px] uppercase tracking-widest font-black hover:bg-white/10 transition-all">Email Support</button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             {faqs.map((faq, i) => (
               <div key={i} className="bg-white/5 border border-white/10 p-6">
                 <p className="text-[10px] uppercase tracking-widest font-black text-white/40 mb-3">FAQ</p>
                 <h4 className="font-serif font-bold text-sm mb-2">{faq.q}</h4>
                 <p className="text-xs text-white/50 leading-relaxed">{faq.a}</p>
               </div>
             ))}
          </div>
        </div>
        <HelpCircle size={400} className="absolute -bottom-20 -right-20 text-white/[0.03] rotate-12" />
      </div>
    </div>
  );
}
