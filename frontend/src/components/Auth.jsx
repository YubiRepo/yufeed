import React, { useState } from 'react';
import { Rss, Eye, EyeOff, Lock, User, ArrowRight, AlertCircle, ShieldCheck, Sun, Moon } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Auth({ authView, onLogin, error, theme }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    setIsSubmitting(true);
    await onLogin(e);
    setIsSubmitting(false);
  };

  return (
    <div className={cn(
      "h-screen flex items-center justify-center p-6 overflow-hidden relative transition-colors duration-500",
      theme === 'dark' ? "bg-[#0a0a0b]" : "bg-slate-50"
    )}>
      {/* Background Glows */}
      <div className={cn(
        "absolute top-1/4 -left-20 w-96 h-96 blur-[120px] rounded-full animate-pulse transition-opacity duration-1000",
        theme === 'dark' ? "bg-primary/20 opacity-100" : "bg-primary/10 opacity-50"
      )}></div>
      <div className={cn(
        "absolute bottom-1/4 -right-20 w-96 h-96 blur-[120px] rounded-full animate-pulse delay-700 transition-opacity duration-1000",
        theme === 'dark' ? "bg-blue-500/10 opacity-100" : "bg-blue-500/5 opacity-50"
      )}></div>
      
      <div className="w-full max-w-[420px] relative z-10">
        <div className={cn(
          "rounded-3xl border text-card-foreground shadow-2xl p-8 md:p-10 animate-in fade-in zoom-in-95 duration-500",
          theme === 'dark' 
            ? "bg-[#121214]/80 backdrop-blur-xl border-white/5" 
            : "bg-white/80 backdrop-blur-xl border-slate-200"
        )}>
            <div className="flex flex-col items-center gap-3 mb-10 text-center">
              <div className="w-14 h-14 bg-gradient-to-tr from-primary to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-primary/40 rotate-3">
                  <Rss className="w-8 h-8" />
              </div>
              <div className="mt-2">
                <h1 className={cn("text-2xl font-black tracking-tight", theme === 'dark' ? "text-white" : "text-slate-900")}>
                  YUFEED <span className="text-primary">OS</span>
                </h1>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Intelligence Aggregator</p>
              </div>
            </div>

            {authView === 'login' ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl flex items-center gap-3 animate-shake">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <p className="text-xs font-bold tracking-tight">{error}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Identity</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-primary transition-colors">
                          <User className="w-4 h-4" />
                        </div>
                        <input 
                          name="username" 
                          type="text" 
                          placeholder="Username or Email"
                          required 
                          className={cn(
                            "w-full h-12 border rounded-xl pl-11 pr-4 outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm font-medium",
                            theme === 'dark' 
                              ? "bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-primary/50" 
                              : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-primary/30"
                          )}
                        />
                      </div>
                  </div>

                  <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Access Key</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-primary transition-colors">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input 
                          name="password" 
                          type={showPassword ? "text" : "password"} 
                          placeholder="••••••••"
                          required 
                          className={cn(
                            "w-full h-12 border rounded-xl pl-11 pr-12 outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm font-medium",
                            theme === 'dark' 
                              ? "bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-primary/50" 
                              : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-primary/30"
                          )}
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all bg-primary text-white hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/20 w-full h-12 disabled:opacity-50 mt-4 group"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        Authentication
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
              </form>
            ) : (
              <div className="text-center py-8">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 border",
                  theme === 'dark' ? "bg-slate-900 border-white/5" : "bg-slate-100 border-slate-200"
                )}>
                  <ShieldCheck className="w-6 h-6 text-slate-500" />
                </div>
                <p className="text-slate-400 text-sm font-medium">Registration is restricted to system administrators.</p>
              </div>
            )}

            <div className={cn("mt-8 pt-6 border-t flex justify-center", theme === 'dark' ? "border-white/5" : "border-slate-100")}>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">Powered by Yufeed AI</p>
            </div>
        </div>
      </div>
    </div>
  );
}



