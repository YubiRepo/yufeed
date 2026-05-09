import React from 'react';
import { Rss, LayoutDashboard, Database, Terminal, ShieldCheck, User, LogOut, Sun, Moon, Search, Menu } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Sidebar({ 
  user, activeTab, setActiveTab, sources, currentSource, setCurrentSource, 
  setSidebarOpen, sidebarOpen, handleLogout, theme, toggleTheme 
}) {
  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-card text-slate-600 dark:text-slate-400 border-r border-slate-200 dark:border-white/5 transition-all duration-300 lg:relative lg:translate-x-0",
      sidebarOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="flex h-full flex-col">
        <div className="flex h-20 items-center justify-between px-6 shrink-0 border-b border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
              <Rss className="w-5 h-5" />
            </div>
            <span className="text-xl font-black tracking-tighter text-foreground uppercase">Yufeed</span>
          </div>
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all text-slate-400 dark:text-slate-500 hover:text-primary dark:hover:text-white border border-transparent hover:border-slate-200 dark:hover:border-white/10"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8 custom-scrollbar">
          <div className="space-y-1">
            <p className="px-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">Core Engine</p>
            {[
              { id: 'feed', icon: LayoutDashboard, label: 'Feed Explorer' },
              ...(user.role === 'admin' ? [{ id: 'sources', icon: Database, label: 'Source Management' }] : []),
              { id: 'docs', icon: Terminal, label: 'API Reference' },
              { id: 'keys', icon: ShieldCheck, label: 'Access Keys' },
            ].map(item => (
              <div 
                key={item.id}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-2xl cursor-pointer text-xs font-black transition-all group uppercase tracking-widest",
                  activeTab === item.id 
                    ? "bg-foreground text-background shadow-xl" 
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className={cn("w-4 h-4 transition-transform group-hover:scale-110", activeTab === item.id ? "text-background" : "text-primary")} />
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between px-2 mb-3">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Active Streams</p>
              <div className="px-1.5 py-0.5 rounded bg-muted text-[9px] font-black text-muted-foreground">{Object.keys(sources).length}</div>
            </div>
            <div className="space-y-1">
              {Object.entries(sources).map(([id, src]) => (
                <div 
                  key={id}
                  onClick={() => { setCurrentSource(id); setActiveTab('feed'); setSidebarOpen(false); }}
                  className={cn(
                    "flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer text-[12px] font-bold transition-all group",
                    currentSource === id && activeTab === 'feed' 
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-3 truncate">
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full transition-all", 
                      currentSource === id && activeTab === 'feed' ? "bg-primary-foreground scale-125" : "bg-muted-foreground"
                    )} />
                    <span className="truncate">{src.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between p-2 rounded-2xl bg-card border border-border shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center text-muted-foreground border border-border">
                <User className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black text-foreground truncate uppercase tracking-tighter">{user.username}</p>
                <p className="text-[9px] text-primary font-black uppercase tracking-widest">{user.role}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="p-2 hover:bg-destructive/10 rounded-lg text-muted-foreground hover:text-destructive transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}


