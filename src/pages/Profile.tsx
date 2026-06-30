import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Settings, LogOut, ShieldAlert, Sun, Moon, User as UserIcon, Edit3, Trash2, Bookmark, Calendar, MessageSquare, Save, X, Check, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

type Tab = 'Posts' | 'Saved' | 'Events' | 'Forum' | 'Settings';

export function Profile() {
  const [activeTab, setActiveTab] = useState<Tab>('Posts');
  const navigate = useNavigate();
  const { user, convexUserId, logout, isAuthenticated, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const allUsers = useQuery(api.users.getAll, {});
  const articles = useQuery(api.articles.list, {});
  const forumPosts = useQuery(api.forum.listPosts, {});
  const allComments = useQuery(api.forum.listAllComments, {});
  const events = useQuery(api.events.list, {});
  const savedArticles = convexUserId ? useQuery(api.articles.getSavedArticles, { userId: convexUserId as any }) : undefined;
  const myArticles = convexUserId ? useQuery(api.articles.getMyArticles, { authorId: convexUserId as any }) : undefined;
  const myForumPosts = convexUserId ? useQuery(api.forum.getMyPosts, { authorId: convexUserId as any }) : undefined;
  const myForumComments = convexUserId ? useQuery(api.forum.getMyComments, { authorId: convexUserId as any }) : undefined;
  const myEvents = convexUserId ? useQuery(api.events.getMyEvents, { hostId: convexUserId as any }) : undefined;
  const registeredEvents = convexUserId ? useQuery(api.events.getRegisteredEvents, { userId: convexUserId as any }) : undefined;

  const deleteArticle = useMutation(api.articles.remove);
  const deletePost = useMutation(api.forum.deletePost);
  const unsaveArticle = useMutation(api.articles.save);

  const handleLogout = async () => { await logout(); navigate('/'); };

  if (!isAuthenticated || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <UserIcon size={64} className="text-byl-dark/20 mb-6" />
        <h1 className="font-serif text-4xl font-bold mb-4">Sign in to view your profile</h1>
        <p className="text-byl-dark/60 max-w-md mx-auto mb-8">Join the community to create, share, and connect.</p>
        <Link to="/login" className="bg-byl-dark text-byl-light px-8 py-4 text-[11px] uppercase tracking-widest font-bold hover:bg-byl-purple transition-all">Sign In</Link>
      </div>
    );
  }

  const handleDeleteArticle = async (id: any) => {
    try { await deleteArticle({ id }); } catch (e) { console.error(e); }
  };

  const handleDeletePost = async (id: any) => {
    try { await deletePost({ id }); } catch (e) { console.error(e); }
  };

  const handleUnsave = async (articleId: any) => {
    try { await unsaveArticle({ articleId }); } catch (e) { console.error(e); }
  };

  const tabs: Tab[] = ['Posts', 'Saved', 'Events', 'Forum', 'Settings'];
  const savedList = savedArticles?.filter(Boolean) ?? [];
  const userArticles = myArticles ?? [];
  const userPosts = myForumPosts ?? [];
  const userComments = myForumComments ?? [];
  const hostedEvents = myEvents ?? [];
  const regEvents = (registeredEvents ?? []).filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 md:py-16">
      <div className="bg-byl-light border border-byl-dark/10 p-8 md:p-12 mb-12 flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="shrink-0">
          <img src={user.avatarUrl} alt={user.name} className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover grayscale" />
        </div>
        <div className="flex-grow text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-byl-dark">{user.name || "BYLDaily Member"}</h1>
              <p className="text-[11px] uppercase tracking-widest font-bold text-byl-dark/40 mt-1">@{user.username}</p>
            </div>
            <button onClick={() => setActiveTab('Settings')} className="border border-byl-dark px-6 py-3 text-[11px] uppercase tracking-widest font-bold text-byl-dark hover:bg-black/5 flex items-center justify-center space-x-2">
              <Settings size={14} /><span>Settings</span>
            </button>
          </div>
          <p className="text-byl-dark/70 mb-6 font-medium leading-relaxed max-w-2xl text-sm md:text-base">{user.bio || "A member of the BYLDaily community."}</p>
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 text-[11px] uppercase tracking-widest font-bold text-byl-dark">
            <div><span className="text-byl-purple mr-2">{user.following}</span> Following</div>
            <div><span className="text-byl-purple mr-2">{user.followers}</span> Followers</div>
          </div>
        </div>
      </div>

      <div className="flex overflow-x-auto pb-4 mb-10 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar space-x-8 border-b border-byl-dark/10">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`whitespace-nowrap px-2 pb-3 mb-[-1px] text-[11px] uppercase tracking-widest font-bold transition-colors ${activeTab === tab ? 'text-byl-purple border-b border-byl-purple' : 'text-byl-dark/40 hover:text-byl-dark'}`}>{tab}</button>
        ))}
      </div>

      <div className="min-h-[400px]">
        {activeTab === 'Posts' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-serif text-2xl font-bold">Your Articles</h2>
              <Link to="/articles/create" className="bg-byl-dark text-byl-light px-6 py-3 text-[10px] uppercase tracking-widest font-bold hover:bg-byl-purple flex items-center gap-2"><Edit3 size={14} />New Article</Link>
            </div>
            {!myArticles ? (
              <div className="animate-pulse space-y-6">{[1, 2].map(i => <div key={i} className="h-24 bg-byl-dark/5" />)}</div>
            ) : userArticles.length === 0 ? (
              <p className="text-byl-dark/50 text-center font-medium py-16">No posts written yet. <Link to="/articles/create" className="text-byl-purple underline">Write your first article.</Link></p>
            ) : (
              <div className="space-y-4">
                {userArticles.map((a: any) => (
                  <div key={a._id} className="flex items-center justify-between p-6 bg-byl-light border border-byl-dark/10">
                    <div className="flex-grow min-w-0 mr-4">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-[10px] uppercase font-bold text-byl-purple">{a.category}</span>
                        <span className={`text-[10px] px-2 py-0.5 font-bold ${a.published ? 'text-green-600 bg-green-50' : 'text-orange-600 bg-orange-50'}`}>{a.published ? 'Published' : 'Draft'}</span>
                      </div>
                      <h3 className="font-serif font-bold text-lg truncate">{a.title}</h3>
                      <p className="text-sm text-byl-dark/50">{a.readTime} · {a.date}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <Link to={`/articles/${a._id}`} className="text-[10px] uppercase font-bold text-byl-purple hover:underline">View</Link>
                      <Link to={`/articles/edit/${a._id}`} className="text-[10px] uppercase font-bold text-byl-dark/50 hover:text-byl-dark"><Edit3 size={14} /></Link>
                      <button onClick={() => handleDeleteArticle(a._id)} className="text-[10px] uppercase font-bold text-red-500 hover:text-red-700"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'Saved' && (
          <div>
            <h2 className="font-serif text-2xl font-bold mb-8">Saved Articles</h2>
            {!savedArticles ? (
              <div className="animate-pulse space-y-6">{[1, 2, 3].map(i => <div key={i} className="h-20 bg-byl-dark/5" />)}</div>
            ) : savedList.length === 0 ? (
              <p className="text-byl-dark/50 text-center font-medium py-16">No saved articles yet. <Link to="/articles" className="text-byl-purple underline">Browse stories.</Link></p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {savedList.map((a: any) => (
                  <div key={a._id} className="flex bg-byl-light border border-byl-dark/10 overflow-hidden group">
                    <div className="w-32 h-32 shrink-0 overflow-hidden">
                      <img src={a.imageUrl} alt={a.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                    </div>
                    <div className="p-4 flex flex-col justify-between flex-grow min-w-0">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-byl-purple">{a.category}</span>
                        <Link to={`/articles/${a._id}`}><h3 className="font-serif font-bold leading-tight mt-1 group-hover:text-byl-purple">{a.title}</h3></Link>
                      </div>
                      <button onClick={() => handleUnsave(a._id)} className="self-end text-[10px] uppercase font-bold text-byl-dark/40 hover:text-red-500 flex items-center gap-1"><X size={12} />Unsave</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'Events' && (
          <div>
            <h2 className="font-serif text-2xl font-bold mb-8">Your Events</h2>
            {!myEvents ? (
              <div className="animate-pulse space-y-6">{[1, 2].map(i => <div key={i} className="h-24 bg-byl-dark/5" />)}</div>
            ) : hostedEvents.length === 0 && regEvents.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-byl-dark/50 font-medium mb-4">You haven't hosted any events or purchased any tickets yet.</p>
                <Link to="/live" className="text-byl-purple underline text-sm">Browse events</Link>
              </div>
            ) : (
              <div className="space-y-8">
                {hostedEvents.length > 0 && (
                  <div>
                    <h3 className="text-[11px] uppercase tracking-widest font-bold text-byl-dark/40 mb-4">Hosted Events</h3>
                    <div className="space-y-4">
                      {hostedEvents.map((e: any) => (
                        <div key={e._id} className="flex items-center justify-between p-6 bg-byl-light border border-byl-dark/10">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-byl-purple">{e.category}</span>
                            <h3 className="font-serif font-bold text-lg">{e.title}</h3>
                            <p className="text-sm text-byl-dark/50">{e.date} · {e.location}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Link to={`/events/edit/${e._id}`} className="text-[10px] uppercase font-bold text-byl-dark/50 hover:text-byl-dark"><Edit3 size={14} /></Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {regEvents.length > 0 && (
                  <div>
                    <h3 className="text-[11px] uppercase tracking-widest font-bold text-byl-dark/40 mb-4">Events with Tickets</h3>
                    <div className="space-y-4">
                      {regEvents.map((e: any) => (
                        <div key={e._id} className="flex items-center justify-between p-6 bg-byl-light border border-byl-dark/10">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-byl-purple">{e.category}</span>
                            <h3 className="font-serif font-bold text-lg">{e.title}</h3>
                            <p className="text-sm text-byl-dark/50">{e.date} · {e.location}</p>
                          </div>
                          <span className="text-[10px] uppercase font-bold text-green-600 bg-green-50 px-3 py-1">Registered</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'Forum' && (
          <div>
            <h2 className="font-serif text-2xl font-bold mb-8">Your Forum Activity</h2>
            {!myForumPosts ? (
              <div className="animate-pulse space-y-6">{[1, 2].map(i => <div key={i} className="h-20 bg-byl-dark/5" />)}</div>
            ) : (
              <div className="space-y-10">
                <div>
                  <h3 className="text-[11px] uppercase tracking-widest font-bold text-byl-dark/40 mb-4">Threads ({userPosts.length})</h3>
                  {userPosts.length === 0 ? (
                    <p className="text-byl-dark/50 font-medium">No threads created yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {userPosts.map((p: any) => (
                        <div key={p._id} className="flex items-center justify-between p-4 bg-byl-light border border-byl-dark/10">
                          <div className="min-w-0 flex-grow mr-4">
                            <span className="text-[10px] uppercase font-bold text-byl-purple">{p.topic}</span>
                            <p className="font-medium truncate">{p.content}</p>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-[10px] text-byl-dark/40">{p.upvotes} likes</span>
                            <button onClick={() => handleDeletePost(p._id)} className="text-red-500"><Trash2 size={14} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-[11px] uppercase tracking-widest font-bold text-byl-dark/40 mb-4">Replies ({userComments.length})</h3>
                  {userComments.length === 0 ? (
                    <p className="text-byl-dark/50 font-medium">No replies yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {userComments.map((c: any) => (
                        <div key={c._id} className="p-4 bg-byl-light border border-byl-dark/10">
                          <p className="font-medium">{c.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'Settings' && <SettingsEditor convexUserId={convexUserId} />}
      </div>
    </div>
  );
}

function SettingsEditor({ convexUserId }: { convexUserId: string | null }) {
  const { user } = useAuth();
  const updateProfile = useMutation(api.users.updateProfile);
  const convexUser = useQuery(api.users.getByFirebaseUid, user?.id ? { firebaseUid: user.id } : "skip");

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [website, setWebsite] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (convexUser) {
      setName(convexUser.name || '');
      setUsername(convexUser.username || '');
      setBio(convexUser.bio || '');
      setAvatarUrl(convexUser.avatarUrl || '');
      setCoverUrl(convexUser.coverUrl || '');
      setWebsite(convexUser.website || '');
    }
  }, [convexUser]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await updateProfile({
        name,
        username,
        bio,
        avatarUrl,
        coverUrl,
        website,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl space-y-10">
      <section>
        <h3 className="text-[11px] uppercase tracking-widest font-bold text-byl-dark/40 mb-6 border-b border-byl-dark/10 pb-2">Profile Information</h3>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-byl-dark/40 mb-2">Name</label>
              <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-byl-dark/5 border border-byl-dark/10 px-4 py-3 text-sm font-medium focus:outline-none focus:border-byl-purple" />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-byl-dark/40 mb-2">Username</label>
              <input value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-byl-dark/5 border border-byl-dark/10 px-4 py-3 text-sm font-medium focus:outline-none focus:border-byl-purple" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-byl-dark/40 mb-2">Bio</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} className="w-full bg-byl-dark/5 border border-byl-dark/10 px-4 py-3 text-sm font-medium focus:outline-none focus:border-byl-purple resize-none" />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-byl-dark/40 mb-2">Avatar URL</label>
            <input value={avatarUrl} onChange={e => setAvatarUrl(e.target.value)} className="w-full bg-byl-dark/5 border border-byl-dark/10 px-4 py-3 text-sm font-medium focus:outline-none focus:border-byl-purple" />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-byl-dark/40 mb-2">Cover Image URL</label>
            <input value={coverUrl} onChange={e => setCoverUrl(e.target.value)} className="w-full bg-byl-dark/5 border border-byl-dark/10 px-4 py-3 text-sm font-medium focus:outline-none focus:border-byl-purple" />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-byl-dark/40 mb-2">Website</label>
            <input value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://" className="w-full bg-byl-dark/5 border border-byl-dark/10 px-4 py-3 text-sm font-medium focus:outline-none focus:border-byl-purple" />
          </div>
          {error && <div className="flex items-center gap-2 text-red-600 text-sm"><AlertCircle size={14} />{error}</div>}
          <div className="flex items-center gap-4">
            <button type="submit" disabled={saving} className="bg-byl-dark text-byl-light px-8 py-4 text-[10px] uppercase tracking-widest font-bold hover:bg-byl-purple disabled:opacity-50 flex items-center gap-2">
              <Save size={14} />{saving ? 'Saving…' : 'Save Changes'}
            </button>
            {saved && <span className="flex items-center gap-1 text-green-600 text-sm"><Check size={14} />Saved</span>}
          </div>
        </form>
      </section>
    </div>
  );
}