import React from 'react';
import { ArrowLeft, Globe, Calendar, ExternalLink, User } from 'lucide-react';
import { cn } from '../lib/utils';

export default function ArticleDetail({ article, sourceName, onBack, loading }) {
  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-12 custom-scrollbar bg-background text-foreground transition-all duration-500">
      <div className="max-w-4xl mx-auto space-y-12">
        <button 
          className="inline-flex items-center justify-center rounded-2xl px-6 py-3 text-xs font-black uppercase tracking-widest transition-all border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 gap-3 h-11 text-slate-600 dark:text-slate-400 shadow-sm" 
          onClick={onBack}
        >
          <ArrowLeft className="w-4 h-4 text-primary" /> Back to Dashboard
        </button>

        <div className="space-y-8">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.05] text-foreground drop-shadow-sm">{article.title}</h1>
          <div className="flex flex-wrap items-center gap-4 md:gap-10 py-8 border-y border-border text-[12px] font-black text-muted-foreground uppercase tracking-[0.2em]">
            <span className="flex items-center gap-3 text-primary bg-primary/10 px-4 py-2 rounded-xl ring-1 ring-primary/20"><Globe className="w-4 h-4" /> {sourceName}</span>
            <span className="flex items-center gap-3"><Calendar className="w-4 h-4" /> {new Date(article.pubDate).toLocaleString()}</span>
            {article.author && <span className="flex items-center gap-3 text-foreground font-black"><User className="w-4 h-4" /> {article.author}</span>}
          </div>
        </div>

        {loading && !article.content && !article.contentHtml ? (
          <div className="space-y-8 animate-pulse">
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded-lg w-full" />
              <div className="h-4 bg-muted rounded-lg w-full" />
              <div className="h-4 bg-muted rounded-lg w-5/6" />
            </div>
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded-lg w-full" />
              <div className="h-4 bg-muted rounded-lg w-11/12" />
              <div className="h-4 bg-muted rounded-lg w-full" />
            </div>
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded-lg w-3/4" />
              <div className="h-4 bg-muted rounded-lg w-full" />
            </div>
          </div>
        ) : (
          <div 
            className="prose prose-slate dark:prose-invert lg:prose-2xl max-w-none text-foreground leading-relaxed font-serif" 
            dangerouslySetInnerHTML={{ __html: article.contentHtml || article.content || article.description }} 
          />
        )}

        <div className="flex flex-col sm:flex-row gap-6 pt-16 border-t border-border">
          <a href={article.link} target="_blank" className="flex-1">
            <button className="flex items-center justify-center gap-3 rounded-2xl px-8 py-5 bg-primary text-primary-foreground hover:opacity-95 w-full font-black text-xl shadow-2xl shadow-primary/30 transition-all hover:-translate-y-1 active:scale-[0.98] uppercase tracking-widest">
              Read Original <ExternalLink className="w-6 h-6" />
            </button>
          </a>
          <button 
            className="flex items-center justify-center rounded-2xl px-12 py-5 text-xl font-black transition-all border border-border bg-card hover:bg-muted text-foreground shadow-xl uppercase tracking-widest" 
            onClick={onBack}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}


