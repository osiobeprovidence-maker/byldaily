import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Instagram, Twitter, Globe } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-byl-light border-t border-byl-dark/10 pt-20 pb-10 mt-auto">
      <div className="max-w-7xl mx-auto px-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="font-serif text-2xl font-black tracking-tighter text-byl-dark mb-6 block">
              BYLDaily
            </Link>
            <p className="text-xs leading-relaxed text-byl-dark/60 max-w-[240px]">
              The premier destination for modern storytelling, culture, and creative exploration. Curating the pulse of the daily grind.
            </p>
          </div>

          {/* Navigation */}
          <div className="col-span-1">
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-byl-dark mb-6">Directory</h4>
            <ul className="space-y-4">
              <li><Link to="/articles" className="text-[11px] font-bold text-byl-dark/60 hover:text-byl-purple transition-colors">Stories</Link></li>
              <li><Link to="/live" className="text-[11px] font-bold text-byl-dark/60 hover:text-byl-purple transition-colors">Live Events</Link></li>
              <li><Link to="/creators" className="text-[11px] font-bold text-byl-dark/60 hover:text-byl-purple transition-colors">Creators</Link></li>
              <li><Link to="/about" className="text-[11px] font-bold text-byl-dark/60 hover:text-byl-purple transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="col-span-1">
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-byl-dark mb-6">Connect</h4>
            <ul className="space-y-4">
              <li><Link to="/contact" className="text-[11px] font-bold text-byl-dark/60 hover:text-byl-purple transition-colors">Contact Us</Link></li>
              <li><Link to="/support" className="text-[11px] font-bold text-byl-dark/60 hover:text-byl-purple transition-colors">Support Center</Link></li>
              <li><a href="mailto:hello@byldaily.com" className="text-[11px] font-bold text-byl-dark/60 hover:text-byl-purple transition-colors flex items-center space-x-2">
                <Mail size={12} />
                <span>hello@byldaily.com</span>
              </a></li>
            </ul>
          </div>

          {/* Socials */}
          <div className="col-span-1">
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-byl-dark mb-6">Social</h4>
            <div className="flex space-x-4">
              <a href="#" className="w-8 h-8 rounded-full border border-byl-dark/10 flex items-center justify-center text-byl-dark/40 hover:border-byl-purple hover:text-byl-purple transition-all"><Instagram size={14} /></a>
              <a href="#" className="w-8 h-8 rounded-full border border-byl-dark/10 flex items-center justify-center text-byl-dark/40 hover:border-byl-purple hover:text-byl-purple transition-all"><Twitter size={14} /></a>
              <a href="#" className="w-8 h-8 rounded-full border border-byl-dark/10 flex items-center justify-center text-byl-dark/40 hover:border-byl-purple hover:text-byl-purple transition-all"><Globe size={14} /></a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 border-t border-byl-dark/5 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex space-x-6">
            <Link to="/legal" className="text-[9px] uppercase tracking-widest font-bold text-byl-dark/40 hover:text-byl-dark transition-colors">Legal</Link>
            <Link to="/privacy" className="text-[9px] uppercase tracking-widest font-bold text-byl-dark/40 hover:text-byl-dark transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-[9px] uppercase tracking-widest font-bold text-byl-dark/40 hover:text-byl-dark transition-colors">Terms of Service</Link>
          </div>
          <p className="text-[9px] uppercase tracking-widest font-black text-byl-dark/20 text-center md:text-right">
            &copy; {new Date().getFullYear()} BYL DAILY MEDIA GROUP. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
}
