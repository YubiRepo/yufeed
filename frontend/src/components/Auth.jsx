import React from 'react';
import { Rss } from 'lucide-react';

export default function Auth({ authView, onLogin }) {
  return (
    <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
      <div className="rounded-lg border border-border bg-card text-card-foreground shadow-sm w-full max-w-md p-8 shadow-2xl animate-fade-up">
          <div className="flex flex-col items-center gap-2 mb-8">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <Rss className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black tracking-tighter">YUFEED PLATFORM</h1>
            <p className="text-muted-foreground text-sm">Intelligence Aggregator System</p>
          </div>

          {authView === 'login' ? (
            <form onSubmit={onLogin} className="space-y-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-muted-foreground">Username</label>
                    <input name="username" type="text" required className="w-full h-11 bg-muted/50 border border-border rounded-lg px-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-muted-foreground">Password</label>
                    <input name="password" type="password" required className="w-full h-11 bg-muted/50 border border-border rounded-lg px-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                </div>
                <button type="submit" className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors bg-primary text-primary-foreground hover:opacity-90 w-full h-11">Sign In</button>
            </form>
          ) : (
            <div className="text-center py-10 text-muted-foreground italic">Registration is handled by system admin.</div>
          )}
      </div>
    </div>
  );
}
