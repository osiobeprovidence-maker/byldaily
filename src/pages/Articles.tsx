import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ARTICLES, CREATORS } from '../data';
import { Search } from 'lucide-react';
import { Category } from '../types';

const CATEGORIES: Category[] = ['Culture', 'Entertainment', 'Lifestyle', 'News', 'Wellness', 'Fashion', 'Music'];

export function Articles() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  React.useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value) {
      setSearchParams({ q: value });
    } else {
      searchParams.delete('q');
      setSearchParams(searchParams);
    }
  };

  const filteredArticles = ARTICLES.filter(article => {
    const matchesCategory = activeCategory === 'All' || article.category === activeCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-byl-dark/10 pb-8 gap-6">
        <div>
          <h1 className="font-serif text-[40px] md:text-[64px] font-black tracking-tight leading-none mb-4 text-byl-dark">Stories</h1>
          <p className="text-xl text-byl-dark/70 max-w-2xl font-medium">
            Dive into the narratives shaping our culture, entertainment, and everyday lives.
          </p>
        </div>
        
        <div className="w-full md:w-auto flex-shrink-0 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-byl-dark/40" />
          </div>
          <input
            type="text"
            className="block w-full md:w-72 pl-12 pr-4 py-3 border border-byl-dark/20 bg-byl-light placeholder-byl-dark/40 focus:outline-none focus:border-byl-purple text-[11px] uppercase font-bold tracking-widest transition-colors duration-300 text-byl-dark"
            placeholder="Search stories..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex overflow-x-auto pb-4 mb-8 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar space-x-4 border-b border-byl-dark/10">
        <button
          onClick={() => setActiveCategory('All')}
          className={`whitespace-nowrap px-2 pb-3 mb-[-1px] text-[11px] uppercase tracking-widest font-bold transition-colors ${
            activeCategory === 'All' 
              ? 'text-byl-purple border-b border-byl-purple' 
              : 'text-byl-dark/40 hover:text-byl-dark'
          }`}
        >
          All
        </button>
        {CATEGORIES.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`whitespace-nowrap px-2 pb-3 mb-[-1px] text-[11px] uppercase tracking-widest font-bold transition-colors ${
              activeCategory === category 
                ? 'text-byl-purple border-b border-byl-purple' 
                : 'text-byl-dark/40 hover:text-byl-dark'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Article Grid */}
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredArticles.map(article => {
            const author = CREATORS.find(c => c.id === article.authorId);
            return (
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
                    <img src={author?.avatarUrl} alt={author?.name} className="w-10 h-10 object-cover mr-4 grayscale" />
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-byl-dark transition-colors">{author?.name}</span>
                      <span className="text-[10px] uppercase font-bold text-byl-dark/40 transition-colors">{article.date}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <h3 className="font-serif text-3xl font-bold text-byl-dark mb-4">No stories found</h3>
          <p className="text-byl-dark/60 font-medium">Try adjusting your category or search query.</p>
        </div>
      )}
    </div>
  );
}
