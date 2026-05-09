import React from 'react';
import { Rss, Newspaper, Settings, Book, Key, LayoutDashboard, Database, Terminal, ShieldCheck, User, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Sidebar({ user, activeTab, setActiveTab, sources, currentSource, setCurrentSource, setSidebarOpen, sidebarOpen, handleLogout }) {
  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-50 w-72 bg-slate-950 text-slate-400 border-r border-white/5 transition-transform duration-300 lg:relative lg:translate-x-0",
      sidebarOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center px-6 gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
            <Rss className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white uppercase">Yufeed</span>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8 custom-scrollbar">
          <div className="space-y-1">
            <p className="px-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Navigation</p>
            {[
              { id: 'feed', icon: LayoutDashboard, label: 'Feed Explorer' },
              ...(user.role === 'admin' ? [{ id: 'sources', icon: Database, label: 'Manage Sources' }] : []),
              { id: 'docs', icon: Terminal, label: 'API Reference' },
              { id: 'keys', icon: ShieldCheck, label: 'Credentials' },
            ].map(item => (
              <div 
                key={item.id}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-sm font-medium transition-all group",
                  activeTab === item.id ? "bg-white/10 text-white shadow-sm ring-1 ring-white/10" : "hover:bg-white/5 hover:text-slate-200"
                )}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          <div className="space-y-1">
            <p className="px-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Sources</p>
            {Object.entries(sources).map(([id, src]) => (
              <div 
                key={id}
                onClick={() => { setCurrentSource(id); setActiveTab('feed'); setSidebarOpen(false); }}
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-sm transition-all group",
                  currentSource === id && activeTab === 'feed' ? "bg-primary/20 text-primary" : "hover:bg-white/5 hover:text-slate-200"
                )}
              >
                <div className="flex items-center gap-3 truncate">
                  <div className={cn("w-1.5 h-1.5 rounded-full", currentSource === id && activeTab === 'feed' ? "bg-primary" : "bg-slate-700")} />
                  <span className="truncate">{src.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-white/5 bg-slate-900/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-slate-300">
                <User className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate uppercase">{user.username}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">{user.role}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="p-2 hover:bg-white/10 rounded-lg text-slate-500 hover:text-red-400 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
