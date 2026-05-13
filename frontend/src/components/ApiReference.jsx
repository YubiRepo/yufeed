import React from 'react';
import { Terminal, Lock, Globe, Database, Cpu, Copy, Check } from 'lucide-react';
import { cn } from '../lib/utils';

const endpoints = [
  {
    group: 'Authentication',
    items: [
      { method: 'POST', path: '/api/auth/login', desc: 'Authenticate user and start session', auth: false },
      { method: 'GET', path: '/api/auth/me', desc: 'Get current session profile', auth: true },
    ]
  },
  {
    group: 'Discovery',
    items: [
      { method: 'GET', path: '/api/config', desc: 'List all intelligence sources and categories', auth: true },
      { method: 'GET', path: '/api/news/:source/categories', desc: 'Get specific categories for a source', auth: true },
    ]
  },
  {
    group: 'News Engine',
    items: [
      { method: 'GET', path: '/api/news/:source', desc: 'Fetch latest articles from a source', auth: true },
      { method: 'GET', path: '/api/news/:source/:category', desc: 'Fetch filtered stream by category', auth: true },
      { method: 'GET', path: '/api/news/:source/detail?url=...', desc: 'Scrape full content for a specific URL', auth: true },
    ]
  },
  {
    group: 'System Management',
    items: [
      { method: 'GET', path: '/api/sources', desc: 'List all raw crawlers', auth: 'admin' },
      { method: 'POST', path: '/api/sources', desc: 'Upsert intelligence crawler configuration', auth: 'admin' },
      { method: 'DELETE', path: '/api/sources/:id', desc: 'Decommission a crawler', auth: 'admin' },
    ]
  }
];

export default function ApiReference({ theme }) {
  const [copied, setCopied] = React.useState('');

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-background p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
              <Cpu className="w-3 h-3" /> API Documentation v2.5
            </div>
            <h1 className="text-4xl font-black tracking-tight text-foreground uppercase">API Reference</h1>
            <p className="text-muted-foreground font-medium max-w-xl">
              Integrate Yufeed Intelligence into your own applications via our programmatic REST interface.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-muted px-4 py-2 rounded-xl border border-border">
            Base URL: <code className="text-foreground ml-1">http://localhost:3000</code>
          </div>
        </div>

        {/* Credentials Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 rounded-[2rem] border border-border bg-card relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors"></div>
            <Lock className="w-8 h-8 text-primary mb-6" />
            <h3 className="text-lg font-black text-foreground uppercase tracking-tight mb-2">Authentication</h3>
            <p className="text-xs text-muted-foreground font-medium leading-relaxed uppercase tracking-wider mb-6">
              Requests must include an <code className="text-foreground font-black">x-api-key</code> header with a valid credential generated from the Access Keys panel.
            </p>
            <div className="bg-background border border-border p-4 rounded-xl font-mono text-[11px] text-muted-foreground">
              x-api-key: <span className="text-primary font-bold">YOUR_SECRET_KEY</span>
            </div>
          </div>

          <div className="p-8 rounded-[2rem] border border-border bg-card relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-colors"></div>
            <Globe className="w-8 h-8 text-blue-500 mb-6" />
            <h3 className="text-lg font-black text-foreground uppercase tracking-tight mb-2">Content Types</h3>
            <p className="text-xs text-muted-foreground font-medium leading-relaxed uppercase tracking-wider mb-6">
              The platform consumes and responds exclusively with JSON. Ensure your client provides appropriate headers.
            </p>
            <div className="bg-background border border-border p-4 rounded-xl font-mono text-[11px] text-muted-foreground">
              Content-Type: <span className="text-foreground">application/json</span>
            </div>
          </div>
        </div>

        {/* Endpoints */}
        <div className="space-y-10">
          {endpoints.map((group, gIdx) => (
            <div key={gIdx} className="space-y-6">
              <div className="flex items-center gap-4">
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">{group.group}</h2>
                <div className="flex-1 h-px bg-border/50"></div>
              </div>
              
              <div className="grid gap-4">
                {group.items.map((item, iIdx) => (
                  <div 
                    key={iIdx} 
                    className="group rounded-2xl border border-border bg-card hover:border-primary/30 transition-all duration-300"
                  >
                    <div className="p-5 flex flex-col md:flex-row md:items-center gap-6">
                      <div className="flex items-center gap-4 shrink-0">
                        <span className={cn(
                          "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest min-w-[70px] text-center",
                          item.method === 'GET' ? "bg-emerald-500/10 text-emerald-500" : 
                          item.method === 'POST' ? "bg-blue-500/10 text-blue-500" : 
                          "bg-red-500/10 text-red-500"
                        )}>
                          {item.method}
                        </span>
                        <div className="flex items-center gap-2 group/code">
                          <code className="text-xs font-mono font-bold text-foreground bg-muted px-2 py-1 rounded border border-border">
                            {item.path}
                          </code>
                          <button 
                            onClick={() => handleCopy(item.path)}
                            className="p-1.5 hover:bg-muted rounded-md text-muted-foreground opacity-0 group-hover:opacity-100 transition-all"
                          >
                            {copied === item.path ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <p className="text-xs font-medium text-muted-foreground">{item.desc}</p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {item.auth && (
                          <div className={cn(
                            "flex items-center gap-1.5 px-2 py-1 rounded-md border text-[9px] font-black uppercase tracking-widest",
                            item.auth === 'admin' ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/5 border-primary/10 text-primary"
                          )}>
                            <Lock className="w-3 h-3" /> {item.auth === 'admin' ? 'Admin' : 'Key Required'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-10 border-t border-border text-center">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">End of Reference • Optimized for Yufeed OS</p>
        </div>
      </div>
    </div>
  );
}
