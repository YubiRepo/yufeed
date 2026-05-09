import React from 'react';
import { Plus, Edit3, Trash2 } from 'lucide-react';

export default function SourcesInventory({ sourcesList, onAdd, onEdit }) {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-950">Sources Inventory</h2>
            <p className="text-sm text-slate-500">Global aggregator target management system</p>
          </div>
          <button 
            onClick={onAdd} 
            className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 gap-2 h-11 px-6"
          >
            <Plus className="w-5 h-5" /> Add Logic
          </button>
        </div>

        <div className="rounded-lg border border-border bg-card text-card-foreground shadow-sm overflow-hidden border-none shadow-xl shadow-slate-200/50">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-500">
              <tr>
                <th className="px-6 py-4">Target Name</th>
                <th className="px-6 py-4">Internal ID</th>
                <th className="px-6 py-4">Endpoint</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {sourcesList.map(src => (
                <tr key={src.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 font-bold text-slate-900">{src.name}</td>
                  <td className="px-6 py-4"><code className="text-[10px] bg-slate-100 px-2 py-1 rounded font-bold text-slate-600">{src.id}</code></td>
                  <td className="px-6 py-4 text-xs text-slate-400 font-mono truncate max-w-[200px]">{src.baseUrl}</td>
                  <td className="px-6 py-4 text-right space-x-1">
                    <button className="hover:bg-accent p-2 rounded-md transition-colors" onClick={() => onEdit(src)}><Edit3 className="w-4 h-4" /></button>
                    <button className="hover:bg-red-50 p-2 rounded-md text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
