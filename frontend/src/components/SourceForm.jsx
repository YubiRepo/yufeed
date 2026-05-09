import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Save, Globe, Database, Code, 
  HelpCircle, Plus, Trash2, Info, ChevronRight,
  Activity, Zap, Shield
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { cn } from '../lib/utils';

function KeyValueInput({ title, data, onChange, placeholder, description }) {
  const entries = Object.entries(data || {});
  
  const updateKey = (oldKey, newKey) => {
    const newData = { ...data };
    const value = newData[oldKey];
    delete newData[oldKey];
    newData[newKey] = value;
    onChange(newData);
  };

  const updateValue = (key, value) => {
    onChange({ ...data, [key]: value });
  };

  const removeEntry = (key) => {
    const newData = { ...data };
    delete newData[key];
    onChange(newData);
  };

  const addEntry = () => {
    onChange({ ...data, '': '' });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <label className="text-[11px] font-black uppercase tracking-widest text-foreground flex items-center gap-2">
            {title}
            <HelpCircle className="w-3 h-3 text-muted-foreground cursor-help" />
          </label>
          <p className="text-[10px] text-muted-foreground font-medium">{description}</p>
        </div>
        <button 
          type="button"
          onClick={addEntry}
          className="h-8 px-3 rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center gap-1.5"
        >
          <Plus className="w-3 h-3" /> New Rule
        </button>
      </div>
      
      <div className="space-y-2">
        {entries.length === 0 && (
          <div className="py-8 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-2 bg-muted/30">
            <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center border border-border">
              <Plus className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">No mapping defined</p>
          </div>
        )}
        {entries.map(([key, value], idx) => (
          <div key={idx} className="flex gap-2 group animate-in slide-in-from-left-2 duration-200">
            <div className="flex-1">
              <input 
                placeholder={placeholder.key}
                value={key}
                onChange={(e) => updateKey(key, e.target.value)}
                className="w-full h-11 bg-background border border-border rounded-xl px-4 text-[11px] font-black outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/40 transition-all text-foreground"
              />
            </div>
            <div className="flex-[2]">
              <input 
                placeholder={placeholder.value}
                value={value}
                onChange={(e) => updateValue(key, e.target.value)}
                className="w-full h-11 bg-background border border-border rounded-xl px-4 text-[11px] font-medium outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/40 transition-all text-foreground"
              />
            </div>
            <button 
              type="button" 
              onClick={() => removeEntry(key)}
              className="w-11 h-11 shrink-0 bg-muted rounded-xl flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all opacity-40 group-hover:opacity-100"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SourceEditorForm({ onSave, sourcesList }) {
  const navigate = useNavigate();
  const { id: editId } = useParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    baseUrl: '',
    categories: {},
    selectors: {}
  });

  useEffect(() => {
    if (editId) {
      const existing = sourcesList.find(s => s.id === editId);
      if (existing) {
        setFormData(existing);
      }
    }
  }, [editId, sourcesList]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
      navigate('/sources');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-background custom-scrollbar animate-in fade-in duration-500">
      <div className="max-w-[1400px] mx-auto p-6 md:p-12">
        <div className="flex items-center justify-between mb-12">
          <button 
            onClick={() => navigate('/sources')}
            className="group flex items-center gap-3 text-muted-foreground hover:text-foreground transition-all"
          >
            <div className="w-10 h-10 rounded-2xl bg-muted flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-all">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Return</p>
              <p className="text-xs font-black uppercase tracking-tighter leading-none">Management</p>
            </div>
          </button>

          <div className="flex items-center gap-3">
            <div className={cn(
              "px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest flex items-center gap-2",
              editId ? "bg-primary/5 border-primary/20 text-primary" : "bg-emerald-500/5 border-emerald-500/20 text-emerald-500"
            )}>
              <Activity className="w-3 h-3" />
              {editId ? `Editing Source: ${editId}` : 'New Source Provisioning'}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-12 gap-12">
          <div className="xl:col-span-8 space-y-12">
            <section className="space-y-8">
              <div className="flex items-center gap-4 pb-4 border-b border-border">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-lg shadow-primary/5">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-foreground uppercase tracking-tight">Identity & Origin</h3>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Base identifier and connectivity parameters</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-[11px] font-black uppercase tracking-widest text-foreground">System ID</label>
                    <span className="text-[9px] text-muted-foreground font-medium uppercase">Required • Unique</span>
                  </div>
                  <input 
                    required
                    disabled={!!editId}
                    value={formData.id} 
                    onChange={e => setFormData({...formData, id: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                    placeholder="e.g. bloomberg-asia"
                    className="w-full h-12 bg-background border border-border rounded-2xl px-5 text-xs font-mono outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/40 transition-all text-foreground disabled:opacity-50"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-[11px] font-black uppercase tracking-widest text-foreground">Display Name</label>
                    <span className="text-[9px] text-muted-foreground font-medium uppercase">Visual UI Label</span>
                  </div>
                  <input 
                    required
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Bloomberg Asia Intelligence"
                    className="w-full h-12 bg-background border border-border rounded-2xl px-5 text-xs font-black outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/40 transition-all text-foreground"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[11px] font-black uppercase tracking-widest text-foreground">Base URL</label>
                  <span className="text-[9px] text-muted-foreground font-medium uppercase flex items-center gap-1">
                    <Globe className="w-2.5 h-2.5" /> Domain root
                  </span>
                </div>
                <input 
                  required
                  value={formData.baseUrl} 
                  onChange={e => setFormData({...formData, baseUrl: e.target.value})}
                  placeholder="https://www.bloomberg.com"
                  className="w-full h-12 bg-background border border-border rounded-2xl px-5 text-xs font-mono outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/40 transition-all text-foreground"
                />
              </div>
            </section>

            <section className="space-y-12 pt-8 border-t border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-lg shadow-primary/5">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-foreground uppercase tracking-tight">Intelligence Routing</h3>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Mapping sub-directories to intelligence categories</p>
                </div>
              </div>

              <KeyValueInput 
                title="Category Mapping"
                description="Slug (Identifier) maps to Path (URL Endpoint)"
                data={formData.categories}
                onChange={(val) => setFormData({...formData, categories: val})}
                placeholder={{ key: 'Slug: politik', value: 'Path: /indonesia/politik' }}
              />

              <div className="pt-8 border-t border-border">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-lg shadow-primary/5">
                    <Code className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-foreground uppercase tracking-tight">Extraction Engine</h3>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">CSS Selectors for DOM data extraction</p>
                  </div>
                </div>

                <KeyValueInput 
                  title="Field Selectors"
                  description="Property Name maps to CSS Selector (class/id/tag)"
                  data={formData.selectors}
                  onChange={(val) => setFormData({...formData, selectors: val})}
                  placeholder={{ key: 'Field: content', value: 'CSS: .article-body p' }}
                />
              </div>
            </section>
          </div>

          <div className="xl:col-span-4 space-y-8">
            <div className="sticky top-8 space-y-8">
              <div className="rounded-[2.5rem] bg-foreground text-background p-8 md:p-10 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl -mr-16 -mt-16 group-hover:bg-primary/40 transition-colors" />
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-3">
                    <Info className="w-5 h-5 text-primary" />
                    <h4 className="text-sm font-black uppercase tracking-widest text-white">Guidance</h4>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary">CSS Extraction</p>
                      <p className="text-[11px] font-medium leading-relaxed opacity-80">Use standard CSS selectors.</p>
                      <code className="block mt-2 p-2 rounded-lg bg-white/5 border border-white/10 text-[9px] font-mono">Example: .post-content &gt; p</code>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-2 bg-muted rounded-[2rem] border border-border shadow-inner">
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full h-16 rounded-[1.75rem] bg-primary text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:opacity-95 hover:-translate-y-1 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
                >
                  {loading ? (
                    <Activity className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      Commit Intelligence Sync
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
