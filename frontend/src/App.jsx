import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Menu, X, ChevronRight, Activity, Terminal, Key, ShieldCheck, 
  Plus, Edit3, Trash2, Globe, Calendar, ArrowLeft, ExternalLink,
  Code, LogOut, CheckCircle, AlertCircle, Clock, Database,
  LayoutDashboard, User, Rss
} from 'lucide-react';

// Components
import Sidebar from './components/Sidebar';
import ArticleCard from './components/ArticleCard';
import ArticleDetail from './components/ArticleDetail';
import SourcesInventory from './components/SourcesInventory';
import Auth from './components/Auth';
import { cn } from './lib/utils';

// --- API Configuration ---
const api = axios.create({ baseURL: '' });

export default function App() {
  const [activeTab, setActiveTab] = useState('feed');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sources, setSources] = useState({});
  const [currentSource, setCurrentSource] = useState('');
  const [currentCategory, setCurrentCategory] = useState('');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authView, setAuthView] = useState('login');
  
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [sourcesList, setSourcesList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSource, setEditingSource] = useState(null);
  const [formData, setFormData] = useState({ id: '', name: '', baseUrl: '', categories: {}, selectors: {} });

  // --- Effects ---
  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
        loadConfig();
        if (activeTab === 'sources' && user.role === 'admin') fetchSourcesTable();
        if (activeTab === 'keys') fetchApiKey();
    }
  }, [user, activeTab]);

  useEffect(() => {
    if (user && activeTab === 'feed' && currentSource) {
        fetchNews(currentSource, currentCategory);
    }
  }, [currentSource, currentCategory, activeTab]);

  // --- Auth Logic ---
  const checkAuth = async () => {
    try {
      const res = await api.get('/api/auth/me');
      if (res.data.loggedIn) {
          // Normalize user object structure
          setUser({ username: res.data.username, role: res.data.role });
      }
    } catch (e) {
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    try {
      const res = await api.post('/api/auth/login', { username, password });
      if (res.data.success) {
        setUser(res.data.user);
        addToast(`Welcome back, ${res.data.user.username}`);
      }
    } catch (e) {
      addToast(e.response?.data?.message || 'Login failed', 'error');
    }
  };

  const handleLogout = async () => {
    if (!confirm('Sign out of Yufeed?')) return;
    await api.post('/api/auth/logout');
    setUser(null);
    setActiveTab('feed');
  };

  // --- Data Fetching ---
  const loadConfig = async () => {
    try {
      const res = await api.get('/api/config');
      setSources(res.data);
      if (!currentSource && Object.keys(res.data).length > 0) {
          setCurrentSource(Object.keys(res.data)[0]);
      }
    } catch (e) {
      addToast('Failed to load system config', 'error');
    }
  };

  const fetchNews = async (source, category = '') => {
    setLoading(true);
    try {
      const res = await api.get(`/api/news/${source}${category ? '/' + category : ''}?fetchDetail=true`);
      if (res.data.success) {
        setArticles(res.data.data.posts);
      }
    } catch (e) {
      addToast('Error fetching news stream', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchSourcesTable = async () => {
    try {
      const res = await api.get('/api/sources');
      setSourcesList(res.data);
    } catch (e) {
      addToast('Failed to fetch sources', 'error');
    }
  };

  const handleSaveSource = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/sources', formData);
      addToast('Source sync successful');
      setModalOpen(false);
      fetchSourcesTable();
      loadConfig();
    } catch (e) {
      addToast('Sync failed', 'error');
    }
  };

  const fetchApiKey = async () => {
    try {
      const res = await api.get('/api/user/key');
      setApiKey(res.data.apiKey);
    } catch (e) {
      addToast('Failed to fetch credentials', 'error');
    }
  };

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  if (authLoading) return <div className="h-screen flex items-center justify-center bg-background"><Activity className="w-8 h-8 text-primary animate-spin" /></div>;

  if (!user) return <Auth authView={authView} onLogin={handleLogin} />;

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans antialiased">
      <Sidebar 
        user={user} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        sources={sources} 
        currentSource={currentSource} 
        setCurrentSource={setCurrentSource}
        setSidebarOpen={setSidebarOpen}
        sidebarOpen={sidebarOpen}
        handleLogout={handleLogout}
      />

      <main className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-background">
        <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-white dark:bg-background/80 backdrop-blur-md z-30 shrink-0">
            <div className="flex items-center gap-4">
                <button className="lg:hidden p-2 -ml-2 text-slate-500" onClick={() => setSidebarOpen(true)}>
                    <Menu className="w-5 h-5" />
                </button>
                <h2 className="text-sm font-bold uppercase tracking-tight text-slate-900 flex items-center gap-2">
                    {activeTab === 'feed' ? <><Activity className="w-4 h-4 text-primary" /> {sources[currentSource]?.name || 'Explorer'}</> : activeTab}
                </h2>
            </div>
            
            <div className="flex items-center gap-3">
                {activeTab === 'feed' && sources[currentSource]?.categories && (
                    <div className="flex gap-1 overflow-x-auto max-w-[200px] sm:max-w-none p-1 bg-muted rounded-lg border border-border">
                        {Object.keys(sources[currentSource].categories).map(cat => (
                            <button 
                                key={cat}
                                onClick={() => setCurrentCategory(cat)}
                                className={cn(
                                    "px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-all whitespace-nowrap",
                                    currentCategory === cat ? "bg-white text-primary shadow-sm ring-1 ring-black/5" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </header>

        <div className="flex-1 overflow-hidden flex flex-col">
            {activeTab === 'feed' && (
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-80 rounded-xl bg-slate-200 animate-pulse border border-slate-300" />)}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-[1800px] mx-auto">
                            {articles.map((article, idx) => (
                                <ArticleCard 
                                    key={idx} 
                                    idx={idx}
                                    article={article} 
                                    sourceName={sources[currentSource]?.name} 
                                    onClick={() => { setSelectedArticle(article); setActiveTab('detail'); }} 
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'detail' && selectedArticle && (
                <ArticleDetail 
                    article={selectedArticle} 
                    sourceName={sources[currentSource]?.name} 
                    onBack={() => setActiveTab('feed')} 
                />
            )}

            {activeTab === 'sources' && (
                <SourcesInventory 
                    sourcesList={sourcesList} 
                    onAdd={() => { setEditingSource(null); setFormData({ id: '', name: '', baseUrl: '', categories: {}, selectors: {} }); setModalOpen(true); }}
                    onEdit={(src) => { setEditingSource(src); setFormData(src); setModalOpen(true); }}
                />
            )}

            {activeTab === 'docs' && (
                <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                    <div className="max-w-3xl mx-auto space-y-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                <Terminal className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black tracking-tight">API Reference</h2>
                                <p className="text-slate-500">Programmatic integration documentation.</p>
                            </div>
                        </div>
                        <div className="rounded-lg border border-border bg-card text-card-foreground shadow-sm p-6">
                            <h3 className="font-bold mb-4">Fetch Articles</h3>
                            <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-xs overflow-x-auto">
                                GET /api/news/:source/:category?fetchDetail=true
                            </div>
                        </div>
                        <div className="bg-slate-950 text-white p-8 rounded-3xl relative overflow-hidden group shadow-2xl">
                             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -mr-32 -mt-32"></div>
                             <div className="relative z-10 space-y-6">
                                <h3 className="text-2xl font-bold">Interactive Swagger UI</h3>
                                <p className="text-slate-400 text-sm max-w-md">Access full schema definitions and test endpoints in real-time using our interactive sandbox environment.</p>
                                <a href="/api-docs" target="_blank" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all shadow-xl shadow-primary/20">
                                    Launch Sandbox <ExternalLink className="w-4 h-4" />
                                </a>
                             </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'keys' && (
                <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                    <div className="max-w-3xl mx-auto space-y-10">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black tracking-tighter text-slate-950">Security & Access</h2>
                            <p className="text-slate-500">Manage your programmatic credentials for external integration.</p>
                        </div>
                        <div className="rounded-lg border border-border bg-card text-card-foreground shadow-sm p-8 shadow-2xl border-none">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="font-bold text-lg">X-API-KEY</h3>
                                    <p className="text-xs text-slate-500">Required for all public endpoint requests.</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <div className="flex-1 bg-slate-100 rounded-lg px-4 flex items-center font-mono text-xs overflow-hidden border border-slate-200">
                                    <span className="truncate">{showKey ? apiKey : "••••••••••••••••••••••••••••••••"}</span>
                                </div>
                                <button className="p-3 bg-secondary rounded-lg" onClick={() => setShowKey(!showKey)}>{showKey ? <X className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </main>

      {/* Logic Modal (Simplified for refactor) */}
      {modalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-300">
              <div className="rounded-lg border border-border bg-card text-card-foreground shadow-sm w-full max-w-2xl shadow-3xl animate-in zoom-in-95 duration-300 border-none overflow-hidden flex flex-col max-h-[90vh]">
                  <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
                      <div>
                        <h2 className="text-xl font-black text-slate-950">Engine Config</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Logic & Target Parameters</p>
                      </div>
                      <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full"><X className="w-5 h-5" /></button>
                  </div>
                  <form onSubmit={handleSaveSource} className="p-8 space-y-6 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase text-slate-500">Internal Key</label>
                            <input value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} disabled={!!editingSource} className="w-full h-11 bg-slate-50 border border-slate-200 rounded-lg px-4 text-sm font-mono outline-none focus:ring-2 focus:ring-primary/20" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase text-slate-500">Display Name</label>
                            <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full h-11 bg-slate-50 border border-slate-200 rounded-lg px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20" />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase text-slate-500">Base Feed URL</label>
                        <input value={formData.baseUrl} onChange={e => setFormData({...formData, baseUrl: e.target.value})} className="w-full h-11 bg-slate-50 border border-slate-200 rounded-lg px-4 text-sm font-mono outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div className="pt-6 flex justify-end gap-3">
                        <button type="button" onClick={() => setModalOpen(false)} className="px-6 py-2 border border-border rounded-md">Cancel</button>
                        <button type="submit" className="bg-primary text-white px-8 h-11 rounded-md font-bold">Sync Configuration</button>
                    </div>
                  </form>
              </div>
          </div>
      )}

      {/* Toasts */}
      <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2">
        {toasts.map(t => (
            <div key={t.id} className="bg-slate-900 text-white border-none p-4 rounded-xl shadow-2xl flex items-center gap-4 animate-fade-up min-w-[300px]">
                {t.type === 'success' ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <AlertCircle className="w-5 h-5 text-red-500" />}
                <span className="text-sm font-medium">{t.message}</span>
            </div>
        ))}
      </div>
    </div>
  );
}
