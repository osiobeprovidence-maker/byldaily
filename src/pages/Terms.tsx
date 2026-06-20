import React from 'react';
import { ScrollText, CheckCircle2 } from 'lucide-react';

export function Terms() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing or using BYLDaily, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use our platform."
    },
    {
      title: "2. User Conduct",
      content: "You are responsible for all activity that occurs under your account. You agree not to use the platform for any unlawful purpose or to violate any laws in your jurisdiction."
    },
    {
      title: "3. Creator Contributions",
      content: "Creators retain ownership of their content but grant BYLDaily a non-exclusive, worldwide, royalty-free license to use, reproduce, and display the content in connection with the services."
    },
    {
      title: "4. Termination",
      content: "We reserve the right to terminate or suspend access to our platform immediately, without prior notice or liability, for any reason whatsoever, including breach of terms."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <header className="mb-16 border-b border-byl-dark/10 pb-12">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-byl-purple/10 flex items-center justify-center text-byl-purple">
            <ScrollText size={20} />
          </div>
          <span className="text-[10px] uppercase tracking-[0.3em] font-black text-byl-dark/40">User Agreement</span>
        </div>
        <h1 className="font-serif text-5xl md:text-6xl font-black tracking-tighter text-byl-dark mb-6 leading-none">
          Terms of Service
        </h1>
        <p className="text-xl text-byl-dark/60 font-medium">
          The rules and guidelines for using the BYLDaily platform.
        </p>
      </header>

      <div className="space-y-12 mb-20">
        {sections.map((section, i) => (
          <div key={i} className="flex gap-8 group">
            <div className="hidden md:flex flex-col items-center">
              <div className="w-8 h-8 rounded-full border-2 border-byl-purple flex items-center justify-center text-byl-purple font-black text-[10px]">
                0{i + 1}
              </div>
              <div className="w-px h-full bg-byl-dark/10 mt-4"></div>
            </div>
            <div className="flex-1">
              <h2 className="text-[14px] uppercase tracking-widest font-black text-byl-dark mb-4">{section.title}</h2>
              <div className="prose prose-sm text-byl-dark/70 font-medium italic leading-relaxed">
                {section.content}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-byl-dark/[0.02] border border-byl-dark/10 p-10">
        <h3 className="font-serif font-black text-2xl text-byl-dark mb-6 flex items-center">
          <CheckCircle2 size={24} className="text-byl-purple mr-3" />
          Summary Disclosure
        </h3>
        <p className="text-sm text-byl-dark/60 font-medium leading-relaxed mb-6">
          We've tried to make these terms as clear as possible. In essence: respect other users, own your content, and follow the law. BYLDaily is a platform for authentic expression, and we expect our community to uphold these values.
        </p>
        <p className="text-[10px] uppercase font-bold tracking-widest text-byl-dark/40">
          Last Revised: June 2026
        </p>
      </div>
    </div>
  );
}
