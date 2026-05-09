import React from 'react';
import { Plus, Edit3, Trash2, Database, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';

export default function SourcesInventory({ sourcesList, onAdd, onEdit, onDelete }) {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 custom-scrollbar bg-background text-foreground transition-all duration-500">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-black tracking-tight text-foreground uppercase flex items-center gap-3">
              <Database className="w-6 h-6 text-primary" />
              Source Management
            </h2>
            <p className="text-xs font-medium text-muted-foreground">Manage your global news aggregation endpoints and extraction logic.</p>
          </div>
          <button 
            onClick={onAdd} 
            className="flex items-center justify-center gap-2 rounded-xl px-6 py-3 bg-primary text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:opacity-95 hover:-translate-y-0.5 active:scale-[0.98] transition-all"
          >
            <Plus className="w-4 h-4" /> Add Source
          </button>
        </div>

        <div className="rounded-3xl border border-border bg-card text-card-foreground shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b border-border text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                  <th className="px-6 py-4">Target Source</th>
                  <th className="px-6 py-4">Identifier</th>
                  <th className="px-6 py-4">Endpoint URL</th>
                  <th className="px-6 py-4 text-right">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sourcesList.map(src => (
                  <tr key={src.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="font-black text-foreground text-sm tracking-tight">{src.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-[10px] bg-muted px-3 py-1.5 rounded-lg font-black text-primary tracking-widest uppercase border border-border">{src.id}</code>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-muted-foreground font-mono truncate block max-w-[200px]">{src.baseUrl}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          className="p-2 rounded-lg bg-muted text-muted-foreground hover:text-foreground hover:bg-accent transition-all border border-transparent hover:border-border" 
                          onClick={() => onEdit(src)}
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          className="p-2 rounded-lg bg-muted text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all border border-transparent hover:border-border"
                          onClick={() => onDelete(src.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}


