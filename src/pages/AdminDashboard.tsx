import React, { useState } from 'react';
import { ARTICLES, CREATORS, FORUM_POSTS, CURRENT_USER } from '../data';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  FileText, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  TrendingUp, 
  Plus, 
  MoreHorizontal,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'Overview' | 'Content' | 'Users' | 'Community' | 'Settings'>('Overview');
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <XCircle size={64} className="text-red-500 mb-6" />
        <h1 className="font-serif text-4xl font-bold mb-4">Access Denied</h1>
        <p className="text-byl-dark/60 max-w-md mx-auto">
          You do not have administrative privileges to access this section. Please contact the system administrator if you believe this is an error.
        </p>
        <Link to="/" className="mt-8 bg-byl-dark text-byl-light px-8 py-4 text-[11px] uppercase tracking-widest font-bold hover:bg-byl-purple transition-all">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-byl-dark/10 pb-8 gap-6">
        <div>
          <h1 className="font-serif text-4xl md:text-5xl font-black tracking-tight leading-none mb-4 text-byl-dark">Admin Console</h1>
          <p className="text-lg text-byl-dark/60 font-medium">
            Platform management, insights, and moderation tools.
          </p>
        </div>
        <div className="flex items-center space-x-4">
           <div className="flex items-center text-[10px] uppercase font-bold tracking-widest text-green-600 bg-green-50 px-3 py-1 border border-green-200">
             <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
             System Status: Live
           </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Admin Navigation */}
        <aside className="lg:w-1/4 shrink-0">
          <div className="flex flex-col space-y-2 sticky top-32">
            {[
              { id: 'Overview', icon: BarChart3, label: 'Performance' },
              { id: 'Content', icon: FileText, label: 'Content Management' },
              { id: 'Users', icon: Users, label: 'Creators & Users' },
              { id: 'Community', icon: MessageSquare, label: 'Moderation' },
              { id: 'Settings', icon: Settings, label: 'Global Settings' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex items-center space-x-3 px-6 py-4 text-[11px] uppercase tracking-widest font-bold transition-all border ${
                  activeTab === item.id
                    ? 'bg-byl-dark text-byl-light border-byl-dark shadow-xl'
                    : 'text-byl-dark/60 border-transparent hover:border-byl-dark/20 hover:bg-byl-dark/5'
                }`}
              >
                <item.icon size={16} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Dashboard Content */}
        <main className="lg:w-3/4">
          {activeTab === 'Overview' && <OverviewTab />}
          {activeTab === 'Content' && <ContentTab />}
          {activeTab === 'Users' && <UsersTab />}
          {activeTab === 'Community' && <CommunityTab />}
          {activeTab === 'Settings' && <SettingsTab />}
        </main>
      </div>
    </div>
  );
}

function OverviewTab() {
  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          { label: 'Total Views', value: '482.5k', trend: '+12%', color: 'text-byl-purple' },
          { label: 'Subscribers', value: '14.2k', trend: '+5%', color: 'text-byl-dark' },
          { label: 'Creators', value: '24', trend: '+2', color: 'text-byl-dark' },
          { label: 'Engagement Rate', value: '18.4%', trend: '+3.2%', color: 'text-green-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-byl-light border border-byl-dark/10 p-8 transition-all hover:shadow-lg">
            <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] text-byl-dark/40 mb-2">{stat.label}</h4>
            <div className="flex items-end justify-between">
               <span className={`text-4xl font-black font-serif ${stat.color}`}>{stat.value}</span>
               <span className="text-[10px] font-bold text-green-600 flex items-center">
                 <TrendingUp size={12} className="mr-1" />
                 {stat.trend}
               </span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-byl-light border border-byl-dark/10 p-8">
        <div className="flex justify-between items-center mb-10 pb-4 border-b border-byl-dark/5">
          <h3 className="text-[11px] uppercase tracking-widest font-bold">Recent Activity</h3>
          <button className="text-[10px] font-black uppercase tracking-widest text-byl-purple hover:underline">View Log</button>
        </div>
        <div className="space-y-6">
          {[
            { user: 'Chidi N.', action: 'published a new story', time: '14 mins ago', type: 'publish' },
            { user: 'System', action: 'completed backup successfully', time: '1 hr ago', type: 'system' },
            { user: 'Zainab B.', action: 'requested payout for OCT-24', time: '3 hrs ago', type: 'finance' },
            { user: 'Moderator', action: 'flagged a forum post for review', time: '5 hrs ago', type: 'alert' },
          ].map((log, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-byl-dark/5 last:border-0">
               <div className="flex items-center space-x-4">
                 <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
                    log.type === 'publish' ? 'bg-green-100 text-green-600' :
                    log.type === 'system' ? 'bg-blue-100 text-blue-600' :
                    log.type === 'finance' ? 'bg-purple-100 text-byl-purple' : 'bg-red-100 text-red-600'
                 }`}>
                   <CheckCircle size={14} />
                 </div>
                 <div>
                   <p className="text-sm font-bold text-byl-dark">
                     <span className="mr-1">{log.user}</span>
                     <span className="text-byl-dark/60 font-medium">{log.action}</span>
                   </p>
                   <p className="text-[10px] text-byl-dark/30 uppercase tracking-widest font-bold">{log.time}</p>
                 </div>
               </div>
               <button className="text-byl-dark/30 hover:text-byl-dark">
                 <MoreHorizontal size={16} />
               </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContentTab() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-byl-light border border-byl-dark/10 p-6">
        <div className="relative w-72">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-byl-dark/30" />
          <input 
            type="text" 
            placeholder="Search stories..." 
            className="w-full bg-byl-dark/5 border-none pl-12 pr-4 py-3 text-[11px] uppercase tracking-widest font-bold focus:ring-1 focus:ring-byl-purple transition-all outline-none"
          />
        </div>
        <button className="bg-byl-dark text-byl-light px-6 py-3 text-[11px] uppercase tracking-widest font-bold flex items-center space-x-2 hover:bg-byl-purple transition-all shadow-lg">
          <Plus size={16} />
          <span>New Article</span>
        </button>
      </div>

      <div className="bg-byl-light border border-byl-dark/10 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-byl-dark/10 bg-byl-dark/[0.02]">
              <th className="px-6 py-5 text-[10px] uppercase font-bold tracking-widest text-byl-dark/40">Story</th>
              <th className="px-6 py-5 text-[10px] uppercase font-bold tracking-widest text-byl-dark/40">Author</th>
              <th className="px-6 py-5 text-[10px] uppercase font-bold tracking-widest text-byl-dark/40">Category</th>
              <th className="px-6 py-5 text-[10px] uppercase font-bold tracking-widest text-byl-dark/40">Status</th>
              <th className="px-6 py-5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-byl-dark/5">
            {ARTICLES.slice(0, 6).map(article => (
              <tr key={article.id} className="hover:bg-byl-dark/[0.01] transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center space-x-4">
                    <img src={article.imageUrl} className="w-10 h-10 object-cover grayscale group-hover:grayscale-0 transition-all" />
                    <span className="font-serif font-bold text-byl-dark line-clamp-1">{article.title}</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-sm font-bold text-byl-dark/60">
                   {CREATORS.find(c => c.id === article.authorId)?.name}
                </td>
                <td className="px-6 py-5">
                  <span className="text-[10px] uppercase font-bold tracking-widest border border-byl-dark/10 px-2 py-1">
                    {article.category}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <span className="flex items-center text-[10px] uppercase font-bold tracking-widest text-green-600">
                    <CheckCircle size={12} className="mr-1.5" /> Published
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                   <button className="text-byl-dark/30 hover:text-byl-dark transition-colors">
                     <MoreHorizontal size={18} />
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UsersTab() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
         <div className="bg-byl-light border border-byl-dark/10 p-10 flex flex-col items-center">
            <span className="text-3xl font-black font-serif text-byl-dark mb-1">{CREATORS.length}</span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-byl-dark/40">Active Creators</span>
         </div>
         <div className="bg-byl-light border border-byl-dark/10 p-10 flex flex-col items-center">
            <span className="text-3xl font-black font-serif text-byl-dark mb-1">12</span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-byl-dark/40">Pending Approval</span>
         </div>
         <div className="bg-byl-light border border-byl-dark/10 p-10 flex flex-col items-center">
            <span className="text-3xl font-black font-serif text-byl-dark mb-1">+140</span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-byl-dark/40">New This Week</span>
         </div>
      </div>

      <div className="bg-byl-light border border-byl-dark/10">
        <div className="p-8 border-b border-byl-dark/5 flex justify-between items-center">
           <h3 className="text-[11px] uppercase tracking-widest font-bold">Directory</h3>
           <div className="flex space-x-2">
              <button className="text-[10px] px-4 py-2 border border-byl-dark/10 font-bold uppercase tracking-widest bg-byl-dark text-byl-light">All</button>
              <button className="text-[10px] px-4 py-2 border border-byl-dark/10 font-bold uppercase tracking-widest hover:bg-byl-dark/5">Creators</button>
              <button className="text-[10px] px-4 py-2 border border-byl-dark/10 font-bold uppercase tracking-widest hover:bg-byl-dark/5">Members</button>
           </div>
        </div>
        <div className="divide-y divide-byl-dark/5">
           {CREATORS.map(creator => (
              <div key={creator.id} className="p-6 flex items-center justify-between group hover:bg-byl-dark/[0.01] transition-colors">
                 <div className="flex items-center space-x-6">
                    <img src={creator.avatarUrl} className="w-12 h-12 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all border border-byl-dark/10" />
                    <div>
                       <h4 className="font-serif font-bold text-lg text-byl-dark">{creator.name}</h4>
                       <p className="text-[10px] uppercase tracking-widest font-bold text-byl-purple">{creator.role}</p>
                    </div>
                 </div>
                 <div className="flex items-center space-x-10 text-[10px] uppercase font-bold tracking-widest text-byl-dark/40">
                    <div className="text-center">
                       <p className="text-byl-dark">{(creator.followers/1000).toFixed(1)}k</p>
                       <p>Followers</p>
                    </div>
                    <button className="bg-transparent border border-byl-dark text-byl-dark px-4 py-2 hover:bg-byl-dark hover:text-byl-light transition-all">Profile</button>
                    <button className="text-byl-dark/30 hover:text-red-500 transition-colors">
                       <XCircle size={18} />
                    </button>
                 </div>
              </div>
           ))}
        </div>
      </div>
    </div>
  );
}

function CommunityTab() {
  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-4 bg-orange-50 border border-orange-200 p-6">
         <AlertCircle className="text-orange-600" size={24} />
         <div>
            <p className="text-sm font-bold text-orange-900">4 Discussions require review</p>
            <p className="text-[11px] text-orange-700/70 font-medium italic">Flags triggered by automated safety filters.</p>
         </div>
      </div>

      <div className="bg-byl-light border border-byl-dark/10 overflow-hidden">
        <div className="p-8 border-b border-byl-dark/5">
          <h3 className="text-[11px] uppercase tracking-widest font-bold">Recent Discussions</h3>
        </div>
        <div className="divide-y divide-byl-dark/5">
          {FORUM_POSTS.slice(0, 5).map(post => {
            const author = CREATORS.find(c => c.id === post.authorId) || CURRENT_USER;
            return (
              <div key={post.id} className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-byl-dark/[0.01]">
                <div className="flex-grow max-w-2xl">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 bg-byl-purple text-white">
                      {post.topic}
                    </span>
                    <span className="text-[10px] font-bold text-byl-dark/30 uppercase tracking-widest">by {author.name} • {post.timeAgo}</span>
                  </div>
                  <p className="text-byl-dark font-medium line-clamp-2 leading-relaxed">
                    {post.content}
                  </p>
                </div>
                <div className="flex items-center space-x-4 shrink-0">
                  <button className="flex items-center space-x-1.5 text-green-600 border border-green-200 px-4 py-2 text-[10px] uppercase tracking-widest font-bold hover:bg-green-600 hover:text-white transition-all">
                    <CheckCircle size={14} /> <span>Keep</span>
                  </button>
                  <button className="flex items-center space-x-1.5 text-red-600 border border-red-200 px-4 py-2 text-[10px] uppercase tracking-widest font-bold hover:bg-red-600 hover:text-white transition-all">
                    <XCircle size={14} /> <span>Remove</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SettingsTab() {
  const [socialLinks, setSocialLinks] = useState({
    instagram: 'https://instagram.com/byldaily',
    twitter: 'https://twitter.com/byldaily',
    facebook: 'https://facebook.com/byldaily',
    linkedin: 'https://linkedin.com/company/byldaily',
    youtube: 'https://youtube.com/byldaily'
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Social links updated successfully!');
  };

  return (
    <div className="space-y-12">
      <section>
        <div className="mb-8 border-b border-byl-dark/10 pb-4">
          <h3 className="text-[11px] uppercase tracking-widest font-black text-byl-dark">Social Media Configuration</h3>
          <p className="text-[11px] text-byl-dark/40 font-medium italic mt-1">Manage the platform's external social presence.</p>
        </div>
        
        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-byl-light border border-byl-dark/10 p-10 shadow-xl">
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-byl-dark/40 mb-2">Instagram URL</label>
              <input 
                type="url" 
                value={socialLinks.instagram}
                onChange={(e) => setSocialLinks({...socialLinks, instagram: e.target.value})}
                className="w-full bg-byl-dark/5 border-none px-4 py-3 text-sm font-medium focus:ring-1 focus:ring-byl-purple transition-all outline-none text-byl-dark"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-byl-dark/40 mb-2">Twitter (X) URL</label>
              <input 
                type="url" 
                value={socialLinks.twitter}
                onChange={(e) => setSocialLinks({...socialLinks, twitter: e.target.value})}
                className="w-full bg-byl-dark/5 border-none px-4 py-3 text-sm font-medium focus:ring-1 focus:ring-byl-purple transition-all outline-none text-byl-dark"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-byl-dark/40 mb-2">Facebook URL</label>
              <input 
                type="url" 
                value={socialLinks.facebook}
                onChange={(e) => setSocialLinks({...socialLinks, facebook: e.target.value})}
                className="w-full bg-byl-dark/5 border-none px-4 py-3 text-sm font-medium focus:ring-1 focus:ring-byl-purple transition-all outline-none text-byl-dark"
              />
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-byl-dark/40 mb-2">LinkedIn URL</label>
              <input 
                type="url" 
                value={socialLinks.linkedin}
                onChange={(e) => setSocialLinks({...socialLinks, linkedin: e.target.value})}
                className="w-full bg-byl-dark/5 border-none px-4 py-3 text-sm font-medium focus:ring-1 focus:ring-byl-purple transition-all outline-none text-byl-dark"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-byl-dark/40 mb-2">YouTube URL</label>
              <input 
                type="url" 
                value={socialLinks.youtube}
                onChange={(e) => setSocialLinks({...socialLinks, youtube: e.target.value})}
                className="w-full bg-byl-dark/5 border-none px-4 py-3 text-sm font-medium focus:ring-1 focus:ring-byl-purple transition-all outline-none text-byl-dark"
              />
            </div>
            <div className="pt-6">
              <button 
                type="submit"
                className="w-full bg-byl-dark text-byl-light py-4 text-[11px] uppercase tracking-widest font-bold hover:bg-byl-purple transition-all shadow-lg"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </section>

      <section>
        <div className="mb-8 border-b border-byl-dark/10 pb-4">
          <h3 className="text-[11px] uppercase tracking-widest font-black text-byl-dark">Platform Maintenance</h3>
        </div>
        <div className="bg-byl-light border border-byl-dark/10 p-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h4 className="font-serif font-black text-lg mb-2">Maintenance Mode</h4>
            <p className="text-sm text-byl-dark/60 font-medium">Temporarily disable dynamic updates and user registrations.</p>
          </div>
          <button className="bg-byl-dark/5 border border-byl-dark/10 text-byl-dark px-8 py-3 text-[10px] uppercase tracking-widest font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all">
            Activate
          </button>
        </div>
      </section>
    </div>
  );
}
