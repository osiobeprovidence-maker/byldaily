import React from 'react';
import { Shield, Eye, Lock, FileText, Globe } from 'lucide-react';

export function Privacy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <header className="mb-16">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-byl-purple/10 flex items-center justify-center text-byl-purple">
            <Shield size={20} />
          </div>
          <span className="text-[10px] uppercase tracking-[0.3em] font-black text-byl-dark/40">Security & Protection</span>
        </div>
        <h1 className="font-serif text-5xl md:text-6xl font-black tracking-tighter text-byl-dark mb-6 leading-none">
          Privacy Policy
        </h1>
        <p className="text-xl text-byl-dark/60 font-medium max-w-2xl">
          At BYLDaily, we are committed to protecting your personal information and your right to privacy. This policy explains how we handle your data.
        </p>
      </header>

      <div className="space-y-16">
        <section>
          <div className="flex items-center space-x-3 mb-6">
            <Eye className="text-byl-purple" size={18} />
            <h2 className="text-[14px] uppercase tracking-widest font-black text-byl-dark">Data Collection</h2>
          </div>
          <div className="prose prose-sm max-w-none text-byl-dark/70 leading-relaxed font-medium">
            <p className="mb-4 text-base">
              We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, or otherwise when you contact us.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Personal Data:</strong> Name, email address, and profile picture provided during registration.</li>
              <li><strong>Usage Data:</strong> Information about how you interact with our platform, such as your clicks, viewing habits, and time spent on articles.</li>
              <li><strong>Technical Data:</strong> IP address, device type, and browser info used to access the service.</li>
            </ul>
          </div>
        </section>

        <section>
          <div className="flex items-center space-x-3 mb-6">
            <Lock className="text-byl-purple" size={18} />
            <h2 className="text-[14px] uppercase tracking-widest font-black text-byl-dark">Data Usage</h2>
          </div>
          <div className="prose prose-sm max-w-none text-byl-dark/70 leading-relaxed font-medium">
            <p className="mb-4 text-base">
              We use the information we collect or receive to provide, operate, and maintain our Services. This includes:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>To facilitate account creation and logon process.</li>
              <li>To post testimonials with your consent.</li>
              <li>To deliver and facilitate delivery of services to the user.</li>
              <li>To respond to user inquiries/offer support to users.</li>
              <li>To send administrative information to you.</li>
            </ul>
          </div>
        </section>

        <section>
          <div className="flex items-center space-x-3 mb-6">
            <Globe className="text-byl-purple" size={18} />
            <h2 className="text-[14px] uppercase tracking-widest font-black text-byl-dark">Cookies & Tracking</h2>
          </div>
          <div className="prose prose-sm max-w-none text-byl-dark/70 leading-relaxed font-medium">
            <p className="mb-4 text-base">
              We may use cookies and similar tracking technologies to access or store information. Most Web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove cookies and to reject cookies.
            </p>
          </div>
        </section>

        <section>
          <div className="flex items-center space-x-3 mb-6">
            <FileText className="text-byl-purple" size={18} />
            <h2 className="text-[14px] uppercase tracking-widest font-black text-byl-dark">Updates to this Policy</h2>
          </div>
          <div className="prose prose-sm max-w-none text-byl-dark/70 leading-relaxed font-medium">
            <p className="mb-4 text-base">
              We may update this privacy notice from time to time. The updated version will be indicated by an updated "Revised" date and the updated version will be effective as soon as it is accessible.
            </p>
            <p className="text-xs font-bold text-byl-dark/40 uppercase tracking-widest mt-8">
              Last Revised: June 19, 2026
            </p>
          </div>
        </section>
      </div>

      <div className="mt-20 pt-10 border-t border-byl-dark/10">
        <p className="text-sm font-medium text-byl-dark/60 italic">
          If you have questions or comments about this notice, you may email us at privacy@byldaily.com.
        </p>
      </div>
    </div>
  );
}
