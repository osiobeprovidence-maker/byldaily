import React from 'react';
import { CURRENT_USER, ARTICLES, EVENTS, FORUM_POSTS } from '../data';
import { Settings, MapPin, Link as LinkIcon, Calendar, LogOut, ShieldAlert, Sun, Moon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export function Profile() {
  const [activeTab, setActiveTab] = React.useState<'Posts' | 'Saved' | 'Events' | 'Forum' | 'Settings'>('Posts');
  const navigate = useNavigate();
  const { logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const myArticles = ARTICLES.filter(a => a.authorId === CURRENT_USER.id);
  const myEvents = EVENTS.filter(e => e.isRsvpd);
  const myForumPosts = FORUM_POSTS.filter(p => p.authorId === CURRENT_USER.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 md:py-16">
      
      {/* Profile Header */}
      <div className="bg-byl-light border border-byl-dark/10 p-8 md:p-12 mb-12 flex flex-col md:flex-row items-center md:items-start gap-8 transition-colors duration-300">
        <div className="shrink-0">
          <img src={CURRENT_USER.avatarUrl} alt={CURRENT_USER.name} className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover grayscale" />
        </div>
        <div className="flex-grow text-center md:text-left flex flex-col justify-center h-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-byl-dark transition-colors">{CURRENT_USER.name}</h1>
              <p className="text-[11px] uppercase tracking-widest font-bold text-byl-dark/40 mt-1 transition-colors">{CURRENT_USER.username}</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => setActiveTab('Settings')}
                className="border border-byl-dark px-6 py-3 text-[11px] uppercase tracking-widest font-bold text-byl-dark hover:bg-black/5 transition-colors flex items-center justify-center space-x-2"
              >
                <Settings size={14} />
                <span>Settings</span>
              </button>
            </div>
          </div>
          
          <p className="text-byl-dark/70 mb-6 font-medium leading-relaxed max-w-2xl text-sm md:text-base transition-colors">
            {CURRENT_USER.bio}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 text-[11px] uppercase tracking-widest font-bold text-byl-dark transition-colors">
            <div>
              <span className="text-byl-purple mr-2">{CURRENT_USER.following}</span> Following
            </div>
            <div>
              <span className="text-byl-purple mr-2">{CURRENT_USER.followers}</span> Followers
            </div>
          </div>
        </div>
      </div>

      {/* Profile Tabs */}
      <div className="flex overflow-x-auto pb-4 mb-10 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar space-x-8 border-b border-byl-dark/10">
        {(['Posts', 'Saved', 'Events', 'Forum', 'Settings'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap px-2 pb-3 mb-[-1px] text-[11px] uppercase tracking-widest font-bold transition-colors ${
              activeTab === tab
                ? 'text-byl-purple border-b border-byl-purple'
                : 'text-byl-dark/40 hover:text-byl-dark'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'Posts' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {myArticles.length === 0 ? (
              <p className="col-span-full text-byl-dark/50 text-center font-medium transition-colors">No posts written yet.</p>
            ) : (
              myArticles.map(article => (
                <Link key={article.id} to={`/articles/${article.id}`} className="group flex flex-col items-start bg-byl-light border border-byl-dark/10 hover:border-byl-dark transition-colors duration-300">
                  <div className="w-full h-56 overflow-hidden relative border-b border-byl-dark/10">
                    <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0" />
                    <div className="absolute top-0 left-0">
                      <span className="px-4 py-2 bg-byl-dark text-byl-light text-[10px] font-bold uppercase tracking-widest transition-colors">
                        {article.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-8 flex flex-col flex-grow w-full">
                    <h3 className="font-serif text-2xl font-bold text-byl-dark mb-4 group-hover:underline leading-tight transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-byl-dark/60 text-sm line-clamp-3 mb-6 flex-grow font-medium transition-colors">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center w-full mt-auto pt-6 border-t border-byl-dark/10 transition-colors">
                      <img src={CURRENT_USER.avatarUrl} alt={CURRENT_USER.name} className="w-10 h-10 object-cover mr-4 grayscale" />
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-widest font-bold text-byl-dark transition-colors">{CURRENT_USER.name}</span>
                        <span className="text-[10px] uppercase font-bold text-byl-dark/40 transition-colors">{article.date}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}

        {activeTab === 'Saved' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <p className="col-span-full text-byl-dark/50 text-center font-medium mt-10">No saved articles yet. Explore the stories and bookmark some.</p>
          </div>
        )}

        {activeTab === 'Events' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {myEvents.map(event => (
              <div key={event.id} className="flex flex-col sm:flex-row bg-byl-light border border-byl-dark/10 overflow-hidden hover:border-byl-dark transition-colors group">
                 <div className="w-full sm:w-48 h-48 sm:h-auto shrink-0 relative border-b sm:border-b-0 sm:border-r border-byl-dark/10">
                   <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                 </div>
                 <div className="p-6 flex flex-col justify-center">
                   <span className="text-[10px] uppercase font-bold tracking-widest text-byl-purple mb-2">{event.category}</span>
                   <h3 className="font-serif text-xl font-bold text-byl-dark mb-3 leading-tight transition-colors">{event.title}</h3>
                   <div className="flex items-center text-[10px] uppercase tracking-widest font-bold text-byl-dark/60 mb-2 transition-colors">
                     <Calendar size={12} className="mr-2" /> {event.date}
                   </div>
                 </div>
              </div>
            ))}
            {myEvents.length === 0 && (
              <p className="col-span-full text-byl-dark/50 text-center font-medium mt-10 transition-colors">You haven't RSVP'd to any events.</p>
           )}
          </div>
        )}

        {activeTab === 'Forum' && (
          <div className="flex flex-col space-y-6 max-w-3xl">
            {myForumPosts.map(post => (
              <div key={post.id} className="bg-byl-light border border-byl-dark/10 p-6 hover:border-byl-dark transition-colors duration-300">
                <span className="text-[10px] uppercase font-bold tracking-widest text-byl-purple mb-2 block">{post.topic}</span>
                <p className="text-byl-dark font-medium leading-relaxed mb-4 transition-colors">
                  {post.content}
                </p>
                <div className="flex items-center text-[10px] uppercase font-bold tracking-widest text-byl-dark/40 space-x-6 transition-colors">
                   <span>{post.upvotes} Likes</span>
                   <span>{post.commentsCount} Replies</span>
                   <span>{post.timeAgo}</span>
                </div>
              </div>
            ))}
            {myForumPosts.length === 0 && (
               <p className="text-byl-dark/50 text-center font-medium mt-10 transition-colors">No forum activity yet.</p>
            )}
          </div>
        )}

        {activeTab === 'Settings' && (
          <div className="max-w-xl space-y-10">
            <section>
              <h3 className="text-[11px] uppercase tracking-widest font-bold text-byl-dark/40 mb-6 border-b border-byl-dark/10 pb-2">Appearance</h3>
              <div className="flex items-center justify-between p-6 bg-byl-light border border-byl-dark/10">
                <div>
                  <p className="font-bold text-byl-dark">Theme Preference</p>
                  <p className="text-xs text-byl-dark/60">Switch between light and dark visual modes.</p>
                </div>
                <button 
                  onClick={toggleTheme}
                  className="px-6 py-3 bg-byl-dark text-byl-light text-[10px] uppercase font-bold tracking-widest hover:bg-byl-purple transition-all flex items-center space-x-2"
                >
                  {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
                  <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
                </button>
              </div>
            </section>

            {isAdmin && (
              <section>
                <h3 className="text-[11px] uppercase tracking-widest font-bold text-byl-dark/40 mb-6 border-b border-byl-dark/10 pb-2">Administration</h3>
                <div className="flex items-center justify-between p-6 bg-byl-dark text-byl-light">
                  <div>
                    <p className="font-bold">Admin Console</p>
                    <p className="text-xs opacity-60">Manage content, users, and platform metrics.</p>
                  </div>
                  <Link 
                    to="/admin"
                    className="px-6 py-3 bg-byl-purple text-white text-[10px] uppercase font-bold tracking-widest hover:bg-white hover:text-byl-purple transition-all flex items-center space-x-2"
                  >
                    <ShieldAlert size={14} />
                    <span>Open Dashboard</span>
                  </Link>
                </div>
              </section>
            )}

            <section>
              <h3 className="text-[11px] uppercase tracking-widest font-bold text-byl-dark/40 mb-6 border-b border-byl-dark/10 pb-2">Account Control</h3>
              <div className="space-y-4">
                <button className="w-full text-left p-6 bg-byl-light border border-byl-dark/10 flex items-center justify-between hover:border-byl-dark transition-colors group">
                  <div>
                    <p className="font-bold text-byl-dark">Edit Profile Information</p>
                    <p className="text-xs text-byl-dark/60">Update your name, bio, and interests.</p>
                  </div>
                  <Settings size={18} className="text-byl-dark/20 group-hover:text-byl-dark" />
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left p-6 bg-red-500/5 border border-red-500/10 flex items-center justify-between hover:bg-red-500/10 transition-colors group"
                >
                  <div>
                    <p className="font-bold text-red-600">Logout Session</p>
                    <p className="text-xs text-red-600/60">Sign out of your current account.</p>
                  </div>
                  <LogOut size={18} className="text-red-500/40" />
                </button>
              </div>
            </section>
          </div>
        )}
      </div>

    </div>
  );
}
