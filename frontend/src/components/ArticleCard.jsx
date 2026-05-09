import React from 'react';
import { Clock, ChevronRight, Activity } from 'lucide-react';
import { cn } from '../lib/utils';

export default function ArticleCard({ article, sourceName, onClick, idx }) {
  return (
    <div 
      className="group rounded-3xl border border-border bg-card text-card-foreground overflow-hidden cursor-pointer hover:shadow-2xl dark:hover:shadow-primary/10 transition-all duration-500 flex flex-col h-full animate-fade-up shadow-sm hover:-translate-y-1.5" 
      style={{ animationDelay: `${idx * 0.05}s` }} 
      onClick={onClick}
    >
      <div className="relative h-56 overflow-hidden shrink-0">
        <img 
          src={article.thumbnail || 'https://images.unsplash.com/photo-1585829365234-781fdec3d4e3?w=800'} 
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" 
          alt="" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
        <div className="absolute top-4 left-4 px-3 py-1.5 bg-background/90 backdrop-blur-md rounded-xl text-[10px] font-black uppercase text-primary shadow-2xl border border-border tracking-[0.1em]">{sourceName}</div>
      </div>
      <div className="p-7 flex flex-col flex-1 space-y-4">
        <h3 className="text-lg font-black leading-[1.3] group-hover:text-primary transition-colors text-foreground line-clamp-2 tracking-tight">{article.title}</h3>
        <p className="text-[12px] text-muted-foreground line-clamp-3 leading-relaxed font-medium">{article.description}</p>
        <div className="mt-auto pt-6 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            <Clock className="w-4 h-4" /> 
            <span>{new Date(article.pubDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 group-hover:bg-primary group-hover:text-white shadow-lg shadow-slate-900/10 dark:shadow-white/5">
            <span>Explore</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
}


