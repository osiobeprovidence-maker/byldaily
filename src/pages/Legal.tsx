import React from 'react';
import { Scale, FileCheck, Landmark, ShieldCheck } from 'lucide-react';

export function Legal() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <header className="mb-16 border-b border-byl-dark/10 pb-12">
        <span className="text-[10px] uppercase tracking-[0.3em] font-black text-byl-dark/40 mb-4 block">Regulatory Information</span>
        <h1 className="font-serif text-5xl md:text-6xl font-black tracking-tighter text-byl-dark mb-6 leading-none">
          Legal Notice
        </h1>
        <p className="text-xl text-byl-dark/60 font-medium">
          Comprehensive information regarding our corporate governance and regulatory compliance.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        <div className="bg-byl-light border border-byl-dark/10 p-10">
          <Scale className="text-byl-purple mb-6" size={32} />
          <h3 className="font-serif font-black text-2xl text-byl-dark mb-4">Corporate Info</h3>
          <p className="text-sm text-byl-dark/60 font-medium leading-relaxed">
            BYL DAILY MEDIA GROUP LTD.<br />
            Registration No: RC-1293848<br />
            Incorporated in the Federal Republic of Nigeria.
          </p>
        </div>
        <div className="bg-byl-light border border-byl-dark/10 p-10">
          <Landmark className="text-byl-purple mb-6" size={32} />
          <h3 className="font-serif font-black text-2xl text-byl-dark mb-4">Tax & VAT</h3>
          <p className="text-sm text-byl-dark/60 font-medium leading-relaxed">
            TIN: 2390498-0001<br />
            VAT Registered: Yes<br />
            Compliance Status: Fully Compliant
          </p>
        </div>
      </div>

      <div className="space-y-12">
        <section>
          <div className="flex items-center space-x-3 mb-6">
            <FileCheck className="text-byl-purple" size={18} />
            <h2 className="text-[14px] uppercase tracking-widest font-black text-byl-dark">Intellectual Property</h2>
          </div>
          <div className="prose prose-sm max-w-none text-byl-dark/70 leading-relaxed font-medium">
            <p className="mb-4">
              All content published on BYLDaily, including text, graphics, logos, images, and software, is the property of BYL DAILY MEDIA GROUP or its content creators and is protected by international copyright and intellectual property laws.
            </p>
            <p>
              Unauthorized use, reproduction, or distribution of any materials from our platform without express written permission is strictly prohibited and will result in legal action.
            </p>
          </div>
        </section>

        <section>
          <div className="flex items-center space-x-3 mb-6">
            <ShieldCheck className="text-byl-purple" size={18} />
            <h2 className="text-[14px] uppercase tracking-widest font-black text-byl-dark">Compliance Disclosure</h2>
          </div>
          <div className="prose prose-sm max-w-none text-byl-dark/70 leading-relaxed font-medium">
            <p className="mb-4">
              We adhere to the highest standards of digital media ethics. Our operations are governed by the Nigerian Broadcasting Commission (NBC) guidelines and relevant digital content regulations of the regions where we operate.
            </p>
          </div>
        </section>
      </div>

      <div className="mt-20 pt-10 border-t border-byl-dark/10">
        <p className="text-xs font-bold text-byl-dark/40 uppercase tracking-widest">
          Last Updated: January 2026
        </p>
      </div>
    </div>
  );
}
