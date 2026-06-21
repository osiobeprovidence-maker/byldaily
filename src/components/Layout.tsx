import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Search, Menu, X, User, Bell, CheckCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Footer } from './Footer';
import { BackToTop } from './BackToTop';
import { UserAvatar } from './UserAvatar';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export function Layout() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [isNotifOpen, setIsNotifOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const { user, isAuthenticated, isAdmin, convexUserId, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const notifications = convexUserId ? useQuery(api.notifications.list, { userId: convexUserId as any }) : undefined;
  const unreadCount = convexUserId ? useQuery(api.notifications.getUnreadCount, { userId: convexUserId as any }) : undefined;
  const markRead = useMutation(api.notifications.markRead);
  const markAllRead = useMutation(api.notifications.markAllRead);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  React.useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
    setIsNotifOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-byl-light border-b border-byl-dark/10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex justify-between items-center h-24">
            {/* Left Side: Logo */}
            <div className="flex items-center">
              <Link to="/" className="font-serif text-2xl md:text-3xl font-black tracking-tighter text-byl-dark hover:opacity-80 transition-opacity">
                BYLDaily
              </Link>
            </div>

            {/* Right Side: Actions (Nav, Search, Menu) */}
            <div className="flex items-center justify-end space-x-6 md:space-x-8">
              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-8 border-r border-byl-dark/10 pr-8 mr-2">
                <Link to="/articles" className="text-[10px] uppercase tracking-widest font-black text-byl-dark hover:text-byl-purple transition-colors">Stories</Link>
                <Link to="/live" className="text-[10px] uppercase tracking-widest font-black text-byl-dark hover:text-byl-purple transition-colors">Live</Link>
                <Link to="/creators" className="text-[10px] uppercase tracking-widest font-black text-byl-dark hover:text-byl-purple transition-colors">Creators</Link>
                {isAdmin && (
                  <Link to="/admin" className="text-[10px] uppercase tracking-widest font-black text-byl-purple hover:text-byl-dark transition-colors border-l border-byl-dark/10 pl-8 ml-2">Admin Dashboard</Link>
                )}
              </div>

              {/* Notifications */}
              {isAuthenticated && (
                <div className="relative">
                  <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="text-byl-dark hover:text-byl-purple transition-colors relative" aria-label="Notifications">
                    <Bell size={20} />
                    {unreadCount !== undefined && unreadCount > 0 && (
                      <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-byl-light text-[8px] font-black flex items-center justify-center rounded-full">{unreadCount > 9 ? '9+' : unreadCount}</span>
                    )}
                  </button>

                  {isNotifOpen && (
                    <div className="absolute right-0 mt-4 w-80 max-h-96 overflow-y-auto bg-byl-light border border-byl-dark/10 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="flex items-center justify-between px-5 py-4 border-b border-byl-dark/5 sticky top-0 bg-byl-light z-10">
                        <span className="text-[10px] uppercase font-black tracking-widest text-byl-dark">Notifications</span>
                        {unreadCount !== undefined && unreadCount > 0 && (
                          <button onClick={() => { if (convexUserId) markAllRead({ userId: convexUserId as any }); }} className="text-[9px] uppercase font-bold text-byl-purple hover:underline">
                            <CheckCheck size={14} className="inline mr-1" />Mark All Read
                          </button>
                        )}
                      </div>
                      {!notifications || notifications.length === 0 ? (
                        <p className="text-center text-[10px] uppercase tracking-widest font-bold text-byl-dark/30 py-10">No notifications yet</p>
                      ) : (
                        <div className="divide-y divide-byl-dark/5">
                          {(notifications ?? []).slice(0, 20).map((n: any) => (
                            <Link key={n._id} to={n.link || '#'} onClick={() => { if (!n.read) markRead({ id: n._id }); setIsNotifOpen(false); }} className={`block px-5 py-4 hover:bg-byl-dark/[0.02] transition-colors ${!n.read ? 'bg-byl-purple/[0.03] border-l-2 border-byl-purple' : ''}`}>
                              <p className="text-[11px] font-bold text-byl-dark">{n.title}</p>
                              <p className="text-[10px] text-byl-dark/50 mt-0.5">{n.body}</p>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Search */}
              <div className="relative flex items-center">
                {isSearchOpen ? (
                  <form onSubmit={handleSearch} className="flex items-center">
                    <input 
                      type="text"
                      autoFocus
                      placeholder="Search..."
                      className="bg-byl-light border-b border-byl-dark/30 py-1 px-2 text-[10px] uppercase tracking-widest font-black focus:outline-none focus:border-byl-purple transition-all w-24 md:w-40 text-byl-dark"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onBlur={() => !searchQuery && setIsSearchOpen(false)}
                    />
                  </form>
                ) : (
                  <button 
                    onClick={() => setIsSearchOpen(true)}
                    className="text-byl-dark hover:text-byl-purple transition-colors"
                  >
                    <Search size={20} />
                  </button>
                )}
              </div>

              {/* Menu / Profile Toggle */}
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-byl-dark hover:text-byl-purple focus:outline-none transition-all duration-300"
                  aria-label="Toggle navigation"
                >
                  {isMenuOpen ? (
                    <X size={24} />
                  ) : (
                    <div className="flex items-center">
                      {isAuthenticated ? (
                        <UserAvatar
                          user={user}
                          className="w-8 h-8 rounded-full shadow-sm md:hover:border-byl-purple transition-colors"
                          imageClassName="grayscale md:hover:grayscale-0 transition-all duration-300"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-byl-dark/5 flex items-center justify-center text-byl-dark/40 border border-byl-dark/10">
                          <User size={18} />
                        </div>
                      )}
                    </div>
                  )}
                </button>

                {/* Dropdown Menu (Desktop & Mobile) */}
                {isMenuOpen && (
                  <div className="absolute right-0 mt-4 w-56 bg-byl-light border border-byl-dark/10 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-byl-dark/5 mb-2">
                       <p className="text-[9px] uppercase font-bold tracking-widest text-byl-dark/40">Navigation</p>
                    </div>
                    <Link to="/articles" className="block px-6 py-2 text-[10px] uppercase font-black tracking-widest text-byl-dark hover:text-byl-purple hover:bg-black/5 transition-all">Stories</Link>
                    <Link to="/live" className="block px-6 py-2 text-[10px] uppercase font-black tracking-widest text-byl-dark hover:text-byl-purple hover:bg-black/5 transition-all">Live Events</Link>
                    <Link to="/creators" className="block px-6 py-2 text-[10px] uppercase font-black tracking-widest text-byl-dark hover:text-byl-purple hover:bg-black/5 transition-all">Creators</Link>
                    <Link to="/about" className="block px-6 py-2 text-[10px] uppercase font-black tracking-widest text-byl-dark hover:text-byl-purple hover:bg-black/5 transition-all">About</Link>
                    
                    <div className="px-4 py-3 border-b border-byl-dark/5 my-2">
                       <p className="text-[9px] uppercase font-bold tracking-widest text-byl-dark/40">Account</p>
                    </div>
                    {isAuthenticated ? (
                      <>
                        {isAdmin && (
                          <Link to="/admin" className="block px-6 py-2 text-[10px] uppercase font-black tracking-widest text-byl-purple hover:bg-byl-purple/5 transition-all border-b border-byl-dark/5 pb-3 mb-1">Admin Console</Link>
                        )}
                        <Link to="/profile" className="block px-6 py-2 text-[10px] uppercase font-black tracking-widest text-byl-dark hover:text-byl-purple hover:bg-black/5 transition-all">My Profile</Link>
                        <button 
                          onClick={handleLogout}
                          className="w-full text-left px-6 py-2 text-[10px] uppercase font-black tracking-widest text-red-600 hover:bg-red-50 transition-all border-t border-red-100 mt-2"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link to="/login" className="block px-6 py-2 text-[10px] uppercase font-black tracking-widest text-byl-dark hover:text-byl-purple hover:bg-black/5 transition-all">Sign In</Link>
                        <Link to="/register" className="block px-6 py-2 text-[10px] uppercase font-black tracking-widest text-byl-purple hover:bg-byl-purple/5 transition-all">Join BYLDaily</Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
      <BackToTop />
    </div>
  );
}
