import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ARTICLES, CREATORS } from '../data';
import { ReadingProgress } from '../components/ReadingProgress';
import { Facebook, Twitter, LinkIcon, ArrowLeft, Heart, Bookmark, Clock } from 'lucide-react';

export function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const article = ARTICLES.find(a => a.id === id);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!article) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="font-serif text-3xl font-bold text-gray-900 mb-4">Article Not Found</h1>
        <Link to="/articles" className="text-byl-purple hover:underline inline-flex items-center">
          <ArrowLeft size={16} className="mr-2" /> Back to Stories
        </Link>
      </div>
    );
  }

  const author = CREATORS.find(c => c.id === article.authorId);
  const relatedArticles = ARTICLES.filter(a => a.category === article.category && a.id !== article.id).slice(0, 3);

  return (
    <article className="pb-20">
      <ReadingProgress />
      {/* Hero Image */}
      <div className="w-full h-[50vh] md:h-[70vh] relative">
        <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 max-w-7xl mx-auto flex flex-col justify-end h-full">
          <Link to="/articles" className="inline-flex items-center text-white text-[11px] uppercase tracking-widest font-bold mb-6 hover:text-white/80 transition-colors">
            <ArrowLeft size={16} className="mr-2" /> Back to Stories
          </Link>
          <div className="mb-4">
            <span className="px-4 py-2 bg-black text-white text-[11px] font-bold tracking-[0.2em] uppercase">
              {article.category}
            </span>
          </div>
          <h1 className="font-serif text-[40px] md:text-[64px] font-black text-white mb-6 leading-none max-w-4xl tracking-tight">
            {article.title}
          </h1>
          <div className="flex items-center text-white/70 text-[11px] uppercase tracking-[0.2em] font-bold">
            <span className="flex items-center">
               <Clock size={14} className="mr-2" />
               {Math.ceil((article.content.length + article.excerpt.length) / 1000)} min read
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mt-16">
        <div className="flex flex-col md:flex-row gap-16">
          {/* Main Content */}
          <div className="md:w-3/4">
            <div className="flex items-center border-b border-byl-dark/10 pb-8 mb-12 transition-colors">
              <img src={author?.avatarUrl} alt={author?.name} className="w-16 h-16 object-cover mr-6 grayscale" />
              <div>
                <h3 className="font-bold text-byl-dark font-serif text-xl transition-colors">{author?.name}</h3>
                <p className="text-[10px] uppercase font-bold tracking-widest text-byl-purple mt-1">{author?.role}</p>
                <div className="text-[10px] uppercase font-bold tracking-widest text-byl-dark/40 mt-3 flex items-center transition-colors">
                  <span>{article.date}</span>
                  <span className="mx-2">•</span>
                  <span>{Math.ceil((article.content.length + article.excerpt.length) / 1000)} min read</span>
                </div>
              </div>
            </div>

            <div className="prose prose-lg text-byl-dark/70 font-serif leading-relaxed mb-12 transition-colors">
              <p className="text-xl md:text-2xl font-light text-byl-dark leading-normal mb-8 transition-colors">
                {article.excerpt}
              </p>
              <p>{article.content}</p>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
              <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
            </div>

            {/* Actions (Like, Save, Share) */}
            <div className="flex items-center justify-between border-t border-b border-byl-dark/10 py-6 mb-16 transition-colors">
              <div className="flex items-center space-x-6">
                <button className="flex items-center text-byl-dark/40 hover:text-byl-purple transition-colors font-bold text-[11px] uppercase tracking-widest space-x-2">
                  <Heart size={20} />
                  <span>Like</span>
                </button>
                <button className="flex items-center text-byl-dark/40 hover:text-byl-purple transition-colors font-bold text-[11px] uppercase tracking-widest space-x-2">
                  <Bookmark size={20} />
                  <span>Save</span>
                </button>
              </div>
              <div className="flex items-center space-x-6">
                <span className="text-[11px] uppercase tracking-widest font-bold text-byl-dark hidden sm:inline transition-colors">Share:</span>
                <button className="text-byl-dark/40 hover:text-byl-purple transition-colors">
                  <Twitter size={20} />
                </button>
                <button className="text-byl-dark/40 hover:text-byl-purple transition-colors">
                  <Facebook size={20} />
                </button>
                <button className="text-byl-dark/40 hover:text-byl-purple transition-colors">
                  <LinkIcon size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="md:w-1/4 hidden md:block">
            <div className="sticky top-28 bg-byl-light border border-byl-dark/10 p-8 transition-colors duration-300">
              <h4 className="text-[11px] uppercase tracking-[0.3em] font-bold text-byl-dark/40 border-b border-byl-dark/10 pb-4 mb-6 transition-colors">About the Author</h4>
              <img src={author?.avatarUrl} alt={author?.name} className="w-24 h-24 object-cover mb-6 grayscale" />
              <h5 className="font-bold text-byl-dark font-serif text-xl transition-colors">{author?.name}</h5>
              <p className="text-[10px] uppercase font-bold tracking-widest text-byl-purple mt-2 mb-4">{author?.role}</p>
              <p className="text-sm text-byl-dark/60 mb-8 font-medium leading-relaxed transition-colors">{author?.bio}</p>
              <button className="w-full py-3 border border-byl-dark text-[11px] uppercase font-bold tracking-widest text-byl-dark hover:bg-byl-dark hover:text-byl-light transition-colors">
                Follow
              </button>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-16 pt-16 border-t border-byl-dark/10 transition-colors">
            <h3 className="text-[11px] uppercase tracking-[0.3em] font-bold text-byl-dark/40 mb-10 transition-colors">More in {article.category}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
              {relatedArticles.map(related => {
                const author = CREATORS.find(c => c.id === related.authorId);
                return (
                  <Link key={related.id} to={`/articles/${related.id}`} className="group block">
                    <div className="w-full h-48 overflow-hidden border border-byl-dark/10 mb-6">
                      <img src={related.imageUrl} alt={related.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0" />
                    </div>
                    <h4 className="font-serif font-bold text-xl text-byl-dark group-hover:underline transition-colors line-clamp-2 mb-3 leading-tight">
                      {related.title}
                    </h4>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-byl-dark/40 transition-colors">By {author?.name}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
