import { useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Mail } from 'lucide-react';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const categoryGroups = [
  { label: 'Culture', keys: ['Culture'] },
  { label: 'Entertainment', keys: ['Entertainment'] },
  { label: 'Music', keys: ['Music'] },
  { label: 'Lifestyle', keys: ['Lifestyle', 'Fashion'] },
  { label: 'Wellness', keys: ['Wellness'] },
  { label: 'Community', keys: ['Community'] },
  { label: 'Events', keys: [] },
];

type Article = {
  _id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  readTime: string;
  date: string;
  authorId: string;
  trending?: boolean;
  featured?: boolean;
};

type Author = {
  _id: string;
  name: string;
  username: string;
  avatarUrl: string;
  bio?: string;
};

function Meta({ category, readTime, className = '' }: { category: string; readTime: string; className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] uppercase tracking-[0.24em] font-black text-byl-dark/45 ${className}`}>
      <span className="text-byl-purple">{category}</span>
      <span className="inline-flex items-center gap-1.5"><Clock size={12} />{readTime}</span>
    </div>
  );
}

function SectionHeading({ label, title, aside }: { label: string; title: string; aside?: ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-14">
      <div>
        <p className="text-[10px] uppercase tracking-[0.34em] font-black text-byl-purple mb-3">{label}</p>
        <h2 className="font-serif text-3xl md:text-5xl font-black leading-tight text-byl-dark">{title}</h2>
      </div>
      {aside}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="h-[500px] bg-byl-dark/5" />
        <div className="space-y-5">
          <div className="h-4 w-1/3 bg-byl-dark/10" />
          <div className="h-12 w-full bg-byl-dark/10" />
          <div className="h-12 w-5/6 bg-byl-dark/10" />
          <div className="h-6 w-3/4 bg-byl-dark/10 mt-6" />
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => <div key={i} className="space-y-3"><div className="aspect-[4/3] bg-byl-dark/5" /><div className="h-3 w-1/2 bg-byl-dark/10" /><div className="h-5 w-4/5 bg-byl-dark/10" /></div>)}
      </div>
    </div>
  );
}

export function Home() {
  const [latestCount, setLatestCount] = useState(6);
  const articles = useQuery(api.articles.list, {}) as Article[] | undefined;
  const users = useQuery(api.users.getAll, {}) as Author[] | undefined;
  const creators = useQuery(api.creators.list);
  const events = useQuery(api.events.list, {});

  const authorMap = useMemo(() => new Map((users ?? []).map(u => [u._id, u])), [users]);

  const hero = articles?.find(a => a.featured) ?? articles?.[0] ?? null;
  const rest = articles?.filter(a => a._id !== hero?._id) ?? [];

  const trending = (articles?.filter(a => a.trending && a._id !== hero?._id) ?? rest).slice(0, 6);
  const editorPicks = (articles?.filter(a => a.featured && a._id !== hero?._id) ?? rest).slice(0, 4);
  const latest = rest.slice(0, latestCount);
  const hasMore = latestCount < rest.length;

  const creatorsSection = useMemo(() => {
    const counts = new Map<string, number>();
    (articles ?? []).forEach(a => counts.set(a.authorId, (counts.get(a.authorId) ?? 0) + 1));
    const fromUsers = (users ?? []).map(u => ({ ...u, role: u.bio || 'Contributor', stories: counts.get(u._id) ?? 0 })).filter(c => c.stories > 0).sort((a, b) => b.stories - a.stories);
    if (fromUsers.length >= 4) return fromUsers.slice(0, 4);
    return [...fromUsers, ...(creators ?? []).slice(0, 4 - fromUsers.length).map((c: any) => ({ ...c, _id: c._id, stories: 0, role: c.role || 'Creator' }))].slice(0, 4);
  }, [articles, creators, users]);

  const categoryRows = useMemo(() =>
    categoryGroups.map(g => {
      if (g.label === 'Events') return { label: g.label, items: (events ?? []).slice(0, 3).map((e: any) => ({ _id: e._id, title: e.title, excerpt: e.description, imageUrl: e.imageUrl, category: e.category, readTime: e.date, date: e.date, authorId: '', isEvent: true })) };
      return { label: g.label, items: (articles ?? []).filter(a => g.keys.includes(a.category)).slice(0, 3) };
    }).filter(g => g.items.length > 0),
    [articles, events]
  );

  if (!articles) return <div className="px-4 sm:px-6 lg:px-10 py-16 max-w-7xl mx-auto"><LoadingSkeleton /></div>;

  if (!hero) return (
    <div className="px-4 sm:px-6 lg:px-10 py-20 max-w-3xl mx-auto text-center">
      <h1 className="font-serif text-4xl md:text-6xl font-black mb-5">Stories are coming soon.</h1>
      <p className="text-byl-dark/60 font-medium">Publish your first story in Convex to activate the BYLDaily homepage.</p>
    </div>
  );

  const heroAuthor = authorMap.get(hero.authorId);

  return (
    <div className="bg-byl-light text-byl-dark pb-20 md:pb-28">

      {/* ─── HERO ─── */}
      <section className="border-b border-byl-dark/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 md:py-12 lg:py-16">
          <Link to={`/articles/${hero._id}`} className="group grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            <div className="lg:col-span-7 order-2 lg:order-1">
              <Meta category={hero.category} readTime={hero.readTime} />
              <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.88] tracking-tight mt-5 mb-7 max-w-5xl group-hover:text-byl-purple transition-colors">
                {hero.title}
              </h1>
              <p className="text-lg md:text-xl leading-relaxed text-byl-dark/68 font-medium max-w-2xl mb-7">
                {hero.excerpt}
              </p>
              <div className="flex flex-wrap items-center gap-5">
                <span className="text-[10px] uppercase tracking-[0.24em] font-black text-byl-dark/45">By {heroAuthor?.name ?? 'BYLDaily'}</span>
                <span className="inline-flex items-center justify-center bg-byl-dark text-byl-light px-7 py-4 text-[10px] uppercase tracking-[0.22em] font-black group-hover:bg-byl-purple transition-colors">Read Story</span>
              </div>
            </div>
            <div className="lg:col-span-5 order-1 lg:order-2">
              <div className="aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5] overflow-hidden bg-byl-dark/5">
                <img src={hero.imageUrl} alt={hero.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.025] transition-all duration-700" />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ─── TRENDING ─── */}
      {trending.length > 0 && (
        <section className="border-b border-byl-dark/10 px-4 sm:px-6 lg:px-10 py-14 md:py-20">
          <div className="max-w-7xl mx-auto">
            <SectionHeading label="Trending Now" title="What readers are following." aside={<Link to="/articles?filter=trending" className="group inline-flex items-center text-[10px] uppercase tracking-[0.26em] font-black text-byl-dark hover:text-byl-purple transition-colors">View All<ArrowRight size={15} className="ml-2 group-hover:translate-x-1 transition-transform" /></Link>} />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
              {trending.map(a => (
                <Link key={a._id} to={`/articles/${a._id}`} className="group">
                  <div className="aspect-[4/3] overflow-hidden bg-byl-dark/5 mb-4">
                    <img src={a.imageUrl} alt={a.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-700" />
                  </div>
                  <Meta category={a.category} readTime={a.readTime} />
                  <h3 className="font-serif text-lg font-black leading-[1.05] text-byl-dark mt-3 group-hover:text-byl-purple transition-colors line-clamp-2">{a.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── EDITOR'S PICKS ─── */}
      {editorPicks.length > 0 && (
        <section className="border-b border-byl-dark/10 px-4 sm:px-6 lg:px-10 py-16 md:py-24">
          <div className="max-w-7xl mx-auto">
            <SectionHeading label="Editor's Picks" title="A sharper read on culture." />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
              {editorPicks.map(a => {
                const author = authorMap.get(a.authorId);
                return (
                  <Link key={a._id} to={`/articles/${a._id}`} className="group border-b border-byl-dark/10 pb-8">
                    <div className="aspect-[16/10] overflow-hidden bg-byl-dark/5 mb-5 md:mb-6">
                      <img src={a.imageUrl} alt={a.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-700" />
                    </div>
                    <Meta category={a.category} readTime={a.readTime} />
                    <h3 className="text-2xl md:text-3xl font-serif font-black leading-[1.05] text-byl-dark mt-3 group-hover:text-byl-purple transition-colors">{a.title}</h3>
                    <p className="text-sm md:text-base leading-relaxed text-byl-dark/60 font-medium mt-4 line-clamp-2">{a.excerpt}</p>
                    {author && <p className="text-[10px] uppercase tracking-[0.22em] font-black text-byl-dark/40 mt-5">By {author.name}</p>}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ─── LATEST STORIES ─── */}
      {latest.length > 0 && (
        <section className="bg-byl-dark text-byl-light px-4 sm:px-6 lg:px-10 py-16 md:py-24 border-b border-byl-dark/10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10 md:mb-14">
              <div>
                <p className="text-[10px] uppercase tracking-[0.34em] font-black text-byl-purple mb-3">Latest Stories</p>
                <h2 className="font-serif text-4xl md:text-6xl font-black leading-tight">Fresh from the desk.</h2>
              </div>
              <p className="text-sm md:text-base text-byl-light/55 max-w-md font-medium leading-relaxed">Recent culture, entertainment, lifestyle, wellness, and community dispatches.</p>
            </div>
            <div className="divide-y divide-white/10">
              {latest.map(a => (
                <Link key={a._id} to={`/articles/${a._id}`} className="group grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-8 py-7 md:py-9">
                  <div className="md:col-span-2">
                    <p className="text-[10px] uppercase tracking-[0.26em] font-black text-byl-purple">{a.category}</p>
                    <p className="text-[10px] uppercase tracking-[0.2em] font-black text-byl-light/35 mt-2">{a.readTime}</p>
                  </div>
                  <div className="md:col-span-7">
                    <h3 className="font-serif text-2xl md:text-4xl font-black leading-tight group-hover:text-byl-purple transition-colors">{a.title}</h3>
                    <p className="text-byl-light/60 text-sm md:text-base leading-relaxed mt-3 max-w-2xl">{a.excerpt}</p>
                  </div>
                  <div className="md:col-span-3 md:text-right">
                    <p className="text-[10px] uppercase tracking-[0.22em] font-black text-byl-light/35">By {authorMap.get(a.authorId)?.name ?? 'BYLDaily'}</p>
                  </div>
                </Link>
              ))}
            </div>
            {hasMore && (
              <button onClick={() => setLatestCount(c => c + 4)} className="mt-10 border border-byl-light/30 px-8 py-4 text-[10px] uppercase tracking-[0.24em] font-black hover:bg-byl-light hover:text-byl-dark transition-colors">
                Load More Stories
              </button>
            )}
          </div>
        </section>
      )}

      {/* ─── CULTURE CATEGORIES ─── */}
      {categoryRows.length > 0 && (
        <section className="border-b border-byl-dark/10 px-4 sm:px-6 lg:px-10 py-16 md:py-24">
          <div className="max-w-7xl mx-auto">
            <SectionHeading label="Culture Categories" title="Discover by rhythm, scene, and subject." />
            <div className="space-y-12 md:space-y-16">
              {categoryRows.map(g => (
                <div key={g.label} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 border-t border-byl-dark/10 pt-8">
                  <div className="lg:col-span-3">
                    <h3 className="font-serif text-3xl md:text-4xl font-black text-byl-dark">{g.label}</h3>
                  </div>
                  <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-7">
                    {g.items.map((item: any) => (
                      <Link key={item._id} to={item.isEvent ? '/live' : `/articles/${item._id}`} className="group">
                        <div className="aspect-[4/3] overflow-hidden bg-byl-dark/5 mb-4">
                          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-700" />
                        </div>
                        <p className="text-[10px] uppercase tracking-[0.24em] font-black text-byl-purple mb-2">{item.category}</p>
                        <h4 className="font-serif text-xl font-black leading-tight group-hover:text-byl-purple transition-colors">{item.title}</h4>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── FEATURED CREATORS ─── */}
      {creatorsSection.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-10 py-10 md:py-14 border-b border-byl-dark/10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="md:w-1/4 shrink-0">
              <p className="text-[10px] uppercase tracking-[0.34em] font-black text-byl-purple mb-2">Featured Creators</p>
              <h2 className="font-serif text-2xl md:text-3xl font-black leading-tight text-byl-dark">The voices behind the stories.</h2>
            </div>
            <div className="flex flex-wrap gap-6 md:gap-10">
              {creatorsSection.map((c: any) => (
                <Link key={c._id} to="/creators" className="group flex items-center gap-4">
                  <img src={c.avatarUrl} alt={c.name} className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                  <div>
                    <h3 className="font-serif font-black text-base md:text-lg leading-tight text-byl-dark group-hover:text-byl-purple transition-colors">{c.name}</h3>
                    <p className="text-[9px] uppercase tracking-[0.16em] font-black text-byl-dark/40">{c.role}</p>
                    <p className="text-[9px] uppercase tracking-[0.16em] font-black text-byl-purple">{c.stories} stories</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── NEWSLETTER ─── */}
      <section className="px-4 sm:px-6 lg:px-10 pt-16 md:pt-24">
        <div className="max-w-7xl mx-auto border border-byl-dark/10 px-6 py-10 md:px-12 md:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7">
              <p className="text-[10px] uppercase tracking-[0.34em] font-black text-byl-purple mb-4">Newsletter</p>
              <h2 className="font-serif text-4xl md:text-6xl font-black leading-[0.95] mb-5">Stay close to the stories shaping culture.</h2>
              <p className="text-byl-dark/60 font-medium leading-relaxed max-w-2xl">A refined weekly edit of essays, interviews, trends, events, and cultural dispatches from BYLDaily.</p>
            </div>
            <form className="lg:col-span-5 flex flex-col sm:flex-row gap-3">
              <label className="sr-only" htmlFor="nl-email">Email address</label>
              <input id="nl-email" type="email" placeholder="Email address" className="min-w-0 flex-1 bg-transparent border border-byl-dark/20 px-5 py-4 text-sm font-semibold text-byl-dark placeholder:text-byl-dark/35 focus:outline-none focus:border-byl-purple" />
              <button className="inline-flex items-center justify-center gap-2 bg-byl-dark text-byl-light px-7 py-4 text-[10px] uppercase tracking-[0.22em] font-black hover:bg-byl-purple transition-colors"><Mail size={15} />Subscribe</button>
            </form>
          </div>
        </div>
      </section>

    </div>
  );
}