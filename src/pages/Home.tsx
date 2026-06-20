import React from 'react';
import { Link } from 'react-router-dom';
import { ARTICLES, CREATORS } from '../data';
import { ArrowRight } from 'lucide-react';

export function Home() {
  const featuredArticle = ARTICLES.find(a => a.featured) || ARTICLES[0];
  const trendingArticles = ARTICLES.filter(a => a.trending).slice(0, 3);
  const recentArticles = ARTICLES.slice(0, 4);

  return (
    <div className="flex flex-col pb-20">
      <main className="grid grid-cols-1 lg:grid-cols-12 border-b border-byl-dark/10">
        {/* Left Column: Hero */}
        <section className="lg:col-span-8 lg:border-r border-byl-dark/10 flex flex-col">
          {/* Hero Content */}
          <div className="p-6 sm:p-10 lg:p-16 flex flex-col justify-center flex-grow">
            <span className="text-[11px] uppercase tracking-[0.3em] font-bold text-byl-purple mb-4 block">Our Manifesto</span>
            <h1 className="text-[50px] md:text-[84px] leading-[0.85] font-serif font-black tracking-tight mb-8">
              Beyond Labels. <br />
              Beyond Stories. <br />
              <span className="text-byl-purple">Beyond Limits.</span>
            </h1>
            <p className="text-xl text-byl-dark/70 mb-10 leading-relaxed font-medium max-w-2xl">
              Culture, entertainment, lifestyle, and news shaping Africa's new voice.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <Link 
                to="/articles" 
                className="bg-byl-dark text-byl-light px-8 py-4 text-[11px] uppercase tracking-widest font-bold hover:bg-byl-purple transition-colors text-center"
              >
                Explore Stories
              </Link>
            </div>
          </div>
        </section>

        {/* Right Column: Trending Sidebar */}
        <aside className="lg:col-span-4 bg-byl-dark/[0.02] p-6 sm:p-10 lg:p-16 flex flex-col transition-colors duration-300">
          <div className="flex justify-between items-end mb-10">
            <h2 className="text-[11px] uppercase tracking-[0.3em] font-bold text-byl-dark/40">Trending Now</h2>
            <Link to="/articles?filter=trending" className="text-byl-purple font-bold text-[11px] uppercase tracking-widest flex items-center hover:underline group">
              View All <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="flex flex-col gap-10">
            {trendingArticles.map((article, idx) => {
              const author = CREATORS.find(c => c.id === article.authorId);
              return (
                <Link key={article.id} to={`/articles/${article.id}`} className="group flex gap-6 cursor-pointer items-start">
                  <span className="text-3xl font-serif text-byl-dark/20 group-hover:text-byl-purple transition-colors">
                    0{idx + 1}
                  </span>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-byl-dark/40 block mb-2">{article.category}</span>
                    <h3 className="font-serif text-lg font-bold text-byl-dark leading-tight group-hover:underline mb-2 transition-colors">
                      {article.title}
                    </h3>
                    <div className="text-[10px] uppercase font-bold tracking-widest text-byl-dark/40">
                      <span>{author?.name}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </aside>
      </main>

      {/* Featured Article Image/Card (now full width) */}
      <section className="px-4 sm:px-6 lg:px-10 mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 pb-4">
            <h2 className="text-[11px] uppercase tracking-[0.3em] font-bold text-byl-dark/40">Featured Story</h2>
          </div>
          <Link to={`/articles/${featuredArticle.id}`} className="group block relative overflow-hidden cursor-pointer border border-byl-dark/10 hover:border-byl-purple transition-colors">
            <div className="aspect-video md:aspect-[21/9] w-full overflow-hidden border-b border-byl-dark/10">
              <img 
                src={featuredArticle.imageUrl} 
                alt={featuredArticle.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out grayscale group-hover:grayscale-0"
              />
            </div>
            <div className="p-8 sm:p-12 bg-byl-light flex flex-col md:flex-row md:items-center justify-between gap-8 transition-colors duration-300">
              <div className="max-w-3xl">
                <div className="mb-6">
                  <span className="inline-block px-4 py-2 bg-byl-dark text-byl-light text-[10px] font-bold tracking-[0.2em] uppercase transition-colors">
                    {featuredArticle.category}
                  </span>
                </div>
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-byl-dark mb-4 leading-tight group-hover:underline transition-colors">
                  {featuredArticle.title}
                </h2>
              </div>
              <div className="flex flex-col space-y-4 text-[10px] uppercase tracking-widest font-bold text-byl-dark/40 pl-0 md:pl-8 md:border-l md:border-byl-dark/10 shrink-0 transition-colors">
                <span className="text-byl-dark transition-colors">By {CREATORS.find(c => c.id === featuredArticle.authorId)?.name}</span>
                <span>{featuredArticle.readTime}</span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Featured Creators */}
      <section className="px-4 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16 pb-4 border-b border-byl-dark/10">
            <h2 className="text-[11px] uppercase tracking-[0.3em] font-bold text-byl-dark/40">Featured Creators</h2>
            <Link to="/creators" className="text-byl-purple font-bold text-[11px] uppercase tracking-widest flex items-center hover:underline group">
              Discover All <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {CREATORS.slice(0, 4).map(creator => (
              <div key={creator.id} className="flex flex-col items-start p-8 bg-byl-light border border-byl-dark/10 hover:border-byl-purple transition-colors group">
                <img src={creator.avatarUrl} alt={creator.name} className="w-20 h-20 object-cover mb-6 grayscale group-hover:grayscale-0 transition-all" />
                <h3 className="font-serif font-bold text-2xl text-byl-dark mb-1 transition-colors">{creator.name}</h3>
                <p className="text-[10px] uppercase font-bold tracking-widest text-byl-purple mb-4">{creator.role}</p>
                <p className="text-sm font-medium text-byl-dark/60 line-clamp-3 mb-6 flex-grow transition-colors">{creator.bio}</p>
                <button className="w-full py-3 border border-byl-dark text-[11px] uppercase font-bold tracking-widest text-byl-dark hover:bg-byl-dark hover:text-byl-light transition-colors">
                  Follow
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-10 mt-20">
        <div className="max-w-7xl mx-auto bg-byl-purple text-white p-12 md:p-20 text-center flex flex-col items-center border border-byl-dark/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-byl-light opacity-5 rounded-full -translate-y-1/2 translate-x-1/4 filter blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-byl-dark opacity-10 rounded-full translate-y-1/3 -translate-x-1/4 filter blur-3xl"></div>
          
          <div className="relative z-10">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 tracking-tight">Join BYLDaily Spaces</h2>
            <p className="text-lg md:text-xl font-medium mb-10 max-w-2xl mx-auto opacity-90 leading-relaxed">
              Connect with fellow readers, creators, and cultural commentators. Share ideas, debate trends, and find your community.
            </p>
            <Link 
              to="/forums" 
              className="inline-block bg-byl-light text-byl-purple px-10 py-5 text-[11px] uppercase tracking-widest font-black hover:bg-byl-dark hover:text-byl-light transition-all shadow-xl"
            >
              Enter the Forum
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
