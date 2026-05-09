import React from 'react';
import { Clock, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

export default function ArticleCard({ article, sourceName, onClick, idx }) {
  return (
    <div 
      className="group rounded-lg border border-border bg-card text-card-foreground shadow-sm overflow-hidden cursor-pointer hover:shadow-2xl transition-all border-none bg-white shadow-xl shadow-slate-200/50 flex flex-col h-full animate-fade-up" 
      style={{ animationDelay: `${idx * 0.05}s` }} 
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden shrink-0">
        <img src={article.thumbnail || 'https://images.unsplash.com/photo-1585829365234-781fdec3d4e3?w=800'} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
        <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur rounded text-[9px] font-bold uppercase text-primary shadow-sm">{sourceName}</div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-sm font-bold leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors">{article.title}</h3>
        <p className="text-xs text-slate-500 line-clamp-3 mb-4 leading-relaxed">{article.description}</p>
        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-bold">
          <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {new Date(article.pubDate).toLocaleDateString()}</span>
          <span className="px-2 py-0.5 bg-slate-100 rounded">Explore <ChevronRight className="inline w-2 h-2" /></span>
        </div>
      </div>
    </div>
  );
}
