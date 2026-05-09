import React from 'react';
import { ArrowLeft, Globe, Calendar, ExternalLink } from 'lucide-react';

export default function ArticleDetail({ article, sourceName, onBack }) {
  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-12 custom-scrollbar bg-white">
      <div className="max-w-4xl mx-auto space-y-10">
        <button 
          className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors border border-border bg-transparent hover:bg-accent gap-2 text-xs h-9" 
          onClick={onBack}
        >
          <ArrowLeft className="w-3 h-3" /> Back to Stream
        </button>
        <div className="space-y-4">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.05] text-slate-950">{article.title}</h1>
          <div className="flex items-center gap-6 py-4 border-y border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            <span className="flex items-center gap-2 text-primary bg-primary/5 px-2 py-1 rounded ring-1 ring-primary/10"><Globe className="w-3 h-3" /> {sourceName}</span>
            <span className="flex items-center gap-2"><Calendar className="w-3 h-3" /> {new Date(article.pubDate).toLocaleString()}</span>
          </div>
        </div>
        <div className="prose prose-slate lg:prose-lg max-w-none text-slate-700 leading-relaxed font-serif" dangerouslySetInnerHTML={{ __html: article.contentHtml || article.content }} />
        <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t border-slate-100">
          <a href={article.link} target="_blank" className="flex-1">
            <button className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 w-full h-12 gap-2 text-base">
              Read Full Original <ExternalLink className="w-4 h-4" />
            </button>
          </a>
          <button 
            className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors border border-border bg-transparent hover:bg-accent h-12 text-base px-8" 
            onClick={onBack}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
