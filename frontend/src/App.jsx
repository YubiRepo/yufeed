import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Menu, X, ChevronRight, Activity, Terminal, Key, ShieldCheck, 
  Plus, Edit3, Trash2, Globe, Calendar, ArrowLeft, ExternalLink,
  Code, LogOut, CheckCircle, AlertCircle, Clock, Database,
  LayoutDashboard, User, Rss, Search, Lock
} from 'lucide-react';

// Components
import Sidebar from './components/Sidebar';
import ArticleCard from './components/ArticleCard';
import ArticleDetail from './components/ArticleDetail';
import SourcesInventory from './components/SourcesInventory';
import Auth from './components/Auth';
import { cn } from './lib/utils';

function Dialog({ isOpen, title, message, onConfirm, onCancel, type = 'danger' }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card text-card-foreground border border-border w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200 rounded-[2rem] overflow-hidden">
        <div className="p-8 text-center space-y-4">
          <div className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6",
            type === 'danger' ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
          )}>
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-black text-foreground uppercase tracking-tight">{title}</h3>
          <p className="text-xs text-muted-foreground font-medium leading-relaxed uppercase tracking-wider">{message}</p>
          <div className="flex gap-3 pt-6">
            <button 
              onClick={onCancel}
              className="flex-1 h-12 rounded-xl border border-border font-black text-[10px] uppercase tracking-widest hover:bg-muted transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm}
              className={cn(
                "flex-1 h-12 rounded-xl font-black text-[10px] uppercase tracking-widest text-white shadow-lg transition-all hover:-translate-y-0.5",
                type === 'danger' ? "bg-destructive shadow-destructive/20" : "bg-primary shadow-primary/20"
              )}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputDialog({ isOpen, title, placeholder, value, onChange, onConfirm, onCancel }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card text-card-foreground border border-border w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 rounded-[2.5rem] overflow-hidden">
        <div className="p-10 space-y-8">
          <div className="space-y-2">
            <h3 className="text-xl font-black text-foreground uppercase tracking-tight">{title}</h3>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Provide the necessary label or identification</p>
          </div>
          <div className="space-y-2">
            <input 
              autoFocus
              value={value}
              onChange={e => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full h-14 bg-muted border border-border rounded-2xl px-6 text-xs font-black outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/40 transition-all text-foreground"
            />
          </div>
          <div className="flex gap-4 pt-4">
            <button 
              onClick={onCancel}
              className="flex-1 h-14 rounded-2xl border border-border font-black text-[11px] uppercase tracking-widest hover:bg-muted transition-all text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm}
              className="flex-[2] h-14 rounded-2xl bg-primary text-white font-black text-[11px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:opacity-95 hover:-translate-y-0.5 transition-all"
            >
              Process Action
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Helper Components ---
function KeyValueList({ title, data, onChange, placeholder = { key: 'Key', value: 'Value' } }) {
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
      <div className="flex items-center justify-between px-1">
        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{title}</label>
        <button 
          type="button"
          onClick={addEntry}
          className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
        >
          <Plus className="w-3 h-3" /> Add Item
        </button>
      </div>
      <div className="space-y-2">
        {entries.length === 0 && (
          <div className="py-4 border border-dashed border-border rounded-xl flex items-center justify-center">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">No entries defined</p>
          </div>
        )}
        {entries.map(([key, value], idx) => (
          <div key={idx} className="flex gap-2 group animate-in slide-in-from-left-1 duration-200">
            <input 
              placeholder={placeholder.key}
              value={key}
              onChange={(e) => updateKey(key, e.target.value)}
              className="flex-1 h-10 bg-background border border-border rounded-xl px-4 text-xs font-black outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/40 transition-all text-foreground"
            />
            <input 
              placeholder={placeholder.value}
              value={value}
              onChange={(e) => updateValue(key, e.target.value)}
              className="flex-[2] h-10 bg-background border border-border rounded-xl px-4 text-xs font-medium outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/40 transition-all text-foreground"
            />
            <button 
              type="button" 
              onClick={() => removeEntry(key)}
              className="w-10 h-10 shrink-0 bg-muted rounded-xl flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

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
  const [apiKeys, setApiKeys] = useState([]);
  const [showKey, setShowKey] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [sourcesList, setSourcesList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSource, setEditingSource] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('yufeed-theme') || 'dark');
  
  // Custom Dialog States
  const [dialog, setDialog] = useState({ isOpen: false, title: '', message: '', onConfirm: null, type: 'danger' });
  const [inputModal, setInputModal] = useState({ isOpen: false, title: '', placeholder: '', onConfirm: null, value: '' });

  // --- Effects ---
  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('yufeed-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  useEffect(() => {
    if (user) {
        loadConfig();
        if (activeTab === 'sources' && user.role === 'admin') fetchSourcesTable();
        if (activeTab === 'keys') fetchApiKeys();
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

  const [loginError, setLoginError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    const username = e.target.username.value;
    const password = e.target.password.value;
    try {
      const res = await api.post('/api/auth/login', { username, password });
      if (res.data.success) {
        setUser(res.data.user);
        addToast(`Welcome back, ${res.data.user.username}`);
      }
    } catch (e) {
      const msg = e.response?.data?.message || 'Authentication failed';
      setLoginError(msg);
      addToast(msg, 'error');
    }
  };

  const handleLogout = async () => {
    setDialog({
      isOpen: true,
      title: 'Sign Out',
      message: 'Are you sure you want to exit the intelligence dashboard?',
      onConfirm: async () => {
        await api.post('/api/auth/logout');
        setUser(null);
        setActiveTab('feed');
        setDialog(prev => ({ ...prev, isOpen: false }));
      },
      onCancel: () => setDialog(prev => ({ ...prev, isOpen: false })),
      type: 'danger'
    });
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

  const [detailLoading, setDetailLoading] = useState(false);

  const fetchNews = async (source, category = '') => {
    setLoading(true);
    try {
      const res = await api.get(`/api/news/${source}${category ? '/' + category : ''}`);
      if (res.data.success) {
        setArticles(res.data.data.posts);
      }
    } catch (e) {
      addToast('Error fetching news stream', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectArticle = async (article) => {
    setSelectedArticle(article);
    if (!article.content && !article.contentHtml) {
      setDetailLoading(true);
      try {
        const res = await api.get(`/api/news/${currentSource}/detail?url=${encodeURIComponent(article.link)}`);
        if (res.data.success) {
          const detailedData = res.data.data;
          setSelectedArticle(prev => ({ ...prev, ...detailedData }));
          setArticles(prev => prev.map(a => a.link === article.link ? { ...a, ...detailedData } : a));
        }
      } catch (e) {
        console.error('Detail fetch error:', e);
      } finally {
        setDetailLoading(false);
      }
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

  const fetchApiKeys = async () => {
    try {
      const res = await api.get('/api/user/keys');
      if (res.data.success) {
        setApiKeys(res.data.keys);
      }
    } catch (e) {
      addToast('Failed to fetch credentials', 'error');
    }
  };

  const handleCreateKey = async (name) => {
    try {
      const res = await api.post('/api/user/keys', { name });
      if (res.data.success) {
        addToast('New access key generated');
        fetchApiKeys();
      }
    } catch (e) {
      addToast('Failed to generate key', 'error');
    }
  };

  const handleDeleteKey = async (id) => {
    setDialog({
      isOpen: true,
      title: 'Revoke Key',
      message: 'Revoke this access key? Any application using this key will stop working immediately.',
      onConfirm: async () => {
        try {
          const res = await api.delete(`/api/user/keys/${id}`);
          if (res.data.success) {
            addToast('Access key revoked');
            fetchApiKeys();
          }
        } catch (e) {
          addToast('Failed to revoke key', 'error');
        } finally {
          setDialog(prev => ({ ...prev, isOpen: false }));
        }
      },
      onCancel: () => setDialog(prev => ({ ...prev, isOpen: false })),
      type: 'danger'
    });
  };

  const handleDeleteSource = async (id) => {
    setDialog({
      isOpen: true,
      title: 'Delete Source',
      message: `Permanently remove "${id}"? This will invalidate all associated categories and logic configurations.`,
      onConfirm: async () => {
        try {
          await api.delete(`/api/sources/${id}`);
          addToast('Source deleted successfully');
          fetchSourcesTable();
          loadConfig();
        } catch (e) {
          addToast('Deletion failed', 'error');
        } finally {
          setDialog(prev => ({ ...prev, isOpen: false }));
        }
      },
      onCancel: () => setDialog(prev => ({ ...prev, isOpen: false })),
      type: 'danger'
    });
  };

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const [selectedKeyLogs, setSelectedKeyLogs] = useState(null);
  const [logLoading, setLogLoading] = useState(false);

  const fetchKeyLogs = async (keyId) => {
    setLogLoading(true);
    try {
      const res = await api.get(`/api/user/keys/${keyId}/logs`);
      if (res.data.success) {
        setSelectedKeyLogs({ id: keyId, data: res.data.logs });
      }
    } catch (e) {
      addToast('Failed to fetch logs', 'error');
    } finally {
      setLogLoading(false);
    }
  };

  const [formData, setFormData] = useState({ id: '', name: '', baseUrl: '', categories: {}, selectors: {} });

  if (authLoading) return <div className="h-screen flex items-center justify-center bg-background"><Activity className="w-8 h-8 text-primary animate-spin" /></div>;

  if (!user) return <Auth authView={authView} onLogin={handleLogin} error={loginError} theme={theme} />;

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
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <main className="flex-1 flex flex-col min-w-0 bg-background text-foreground transition-all duration-500 overflow-hidden">
        {activeTab === 'feed' && !selectedArticle && (
          <header className="h-20 border-b border-border bg-white/80 dark:bg-card/80 backdrop-blur-xl flex items-center justify-between px-8 shrink-0 z-40">
            <div className="flex items-center gap-8 min-w-0">
              <div className="flex items-center gap-3 shrink-0">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-lg shadow-primary/5">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-foreground uppercase tracking-tighter line-clamp-1">
                    {sources[currentSource]?.name || 'Global Stream'}
                  </h2>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Real-time Feed</span>
                  </div>
                </div>
              </div>

              <nav className="hidden xl:flex items-center gap-1.5">
                {sources[currentSource]?.categories && Object.keys(sources[currentSource].categories).map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setCurrentCategory(cat)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all",
                      currentCategory === cat 
                        ? "bg-foreground text-background shadow-xl" 
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative group hidden md:block">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search intelligence..." 
                  className="bg-accent border border-border rounded-2xl pl-12 pr-4 py-2.5 text-xs font-bold w-64 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-3 hover:bg-accent rounded-2xl text-foreground"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </header>
        )}


        <div className="flex-1 flex flex-col overflow-hidden relative">
          {activeTab === 'feed' && !selectedArticle && (
            <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
              <div className="max-w-[1600px] mx-auto">
                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm flex flex-col h-full animate-pulse">
                        <div className="h-56 bg-muted" />
                        <div className="p-7 space-y-4 flex-1">
                          <div className="h-6 bg-muted rounded-lg w-3/4" />
                          <div className="space-y-3">
                            <div className="h-3 bg-muted rounded-lg w-full" />
                            <div className="h-3 bg-muted rounded-lg w-5/6" />
                          </div>
                          <div className="mt-auto pt-6 border-t border-border flex justify-between items-center">
                            <div className="h-4 bg-muted rounded-lg w-20" />
                            <div className="h-8 bg-muted rounded-xl w-24" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-in fade-in duration-700">
                    {articles.map((item, idx) => (
                      <ArticleCard 
                        key={idx} 
                        idx={idx}
                        article={item} 
                        sourceName={sources[currentSource]?.name} 
                        onClick={() => handleSelectArticle(item)} 
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'feed' && selectedArticle && (
            <ArticleDetail 
              article={selectedArticle} 
              sourceName={sources[currentSource]?.name} 
              onBack={() => setSelectedArticle(null)} 
              loading={detailLoading}
            />
          )}

          {activeTab === 'sources' && (
            <SourcesInventory 
              sourcesList={sourcesList} 
              onAdd={() => { setEditingSource(null); setFormData({ id: '', name: '', baseUrl: '', categories: {}, selectors: {} }); setModalOpen(true); }}
              onEdit={(src) => { setEditingSource(src); setFormData(src); setModalOpen(true); }}
              onDelete={handleDeleteSource}
            />
          )}

          {activeTab === 'docs' && (
            <div className="flex-1 overflow-y-auto p-6 md:p-12 custom-scrollbar bg-background">
              <div className="max-w-4xl mx-auto space-y-12">
                {/* Header */}
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary border border-primary/20 shadow-xl shadow-primary/5">
                    <Terminal className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-4xl font-black tracking-tight text-foreground uppercase">Programmatic Access</h2>
                    <p className="text-muted-foreground font-medium text-lg">Integrate Yufeed intelligence into your own applications.</p>
                  </div>
                </div>

                {/* Auth Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="rounded-[2.5rem] border border-border bg-card p-10 space-y-6">
                    <div className="flex items-center gap-3 text-primary">
                      <ShieldCheck className="w-5 h-5" />
                      <h3 className="font-black uppercase text-xs tracking-widest">Authentication</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">Secure your requests by providing your unique Access Key in the request header.</p>
                    <div className="bg-muted p-4 rounded-2xl font-mono text-xs text-foreground border border-border">
                      x-api-key: <span className="text-primary">YOUR_ACCESS_KEY</span>
                    </div>
                  </div>

                  <div className="rounded-[2.5rem] border border-border bg-card p-10 space-y-6">
                    <div className="flex items-center gap-3 text-primary">
                      <Globe className="w-5 h-5" />
                      <h3 className="font-black uppercase text-xs tracking-widest">Base Endpoint</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">All requests should be directed to the primary intelligence gateway.</p>
                    <div className="bg-muted p-4 rounded-2xl font-mono text-xs text-foreground border border-border">
                      {window.location.origin}/api
                    </div>
                  </div>
                </div>

                {/* Endpoints List */}
                <div className="space-y-8">
                  <h3 className="text-xl font-black uppercase tracking-tight ml-2">Source Discovery</h3>
                  
                  <div className="rounded-[3rem] border border-border bg-card overflow-hidden shadow-2xl">
                    <div className="p-10 border-b border-border bg-muted/30">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-primary text-primary-foreground rounded-lg font-black text-[10px] uppercase tracking-widest">GET</span>
                        <code className="text-foreground font-black text-lg">/news/:source/categories</code>
                      </div>
                      <p className="text-muted-foreground text-sm font-medium">List all available categories for a specific intelligence source.</p>
                    </div>
                    
                    <div className="p-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
                      <div className="space-y-6">
                        <h4 className="font-black text-xs uppercase tracking-widest text-primary">Parameters</h4>
                        <div className="space-y-4">
                          <div className="flex items-start gap-4">
                            <div className="p-2 bg-muted rounded-lg font-mono text-[10px] text-foreground">source</div>
                            <p className="text-xs text-muted-foreground pt-1">The unique ID of the source (e.g., <code className="text-foreground">antara</code>)</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <h4 className="font-black text-xs uppercase tracking-widest text-primary">Example Request</h4>
                        <div className="bg-foreground text-background p-6 rounded-3xl font-mono text-[10px] overflow-x-auto leading-relaxed shadow-inner">
                          {`curl -X GET "${window.location.origin}/api/news/antara/categories" \\\n  -H "x-api-key: your_key_here"`}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[3rem] border border-border bg-card overflow-hidden shadow-2xl">
                    <div className="p-10 border-b border-border bg-muted/30">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-primary text-primary-foreground rounded-lg font-black text-[10px] uppercase tracking-widest">GET</span>
                        <code className="text-foreground font-black text-lg">/news/:source/detail</code>
                      </div>
                      <p className="text-muted-foreground text-sm font-medium">Extract full content and metadata for a specific article URL.</p>
                    </div>
                    
                    <div className="p-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
                      <div className="space-y-6">
                        <h4 className="font-black text-xs uppercase tracking-widest text-primary">Parameters</h4>
                        <div className="space-y-4">
                          <div className="flex items-start gap-4">
                            <div className="p-2 bg-muted rounded-lg font-mono text-[10px] text-foreground">source</div>
                            <p className="text-xs text-muted-foreground pt-1">The unique ID of the source (e.g., <code className="text-foreground">antara</code>)</p>
                          </div>
                          <div className="flex items-start gap-4">
                            <div className="p-2 bg-muted rounded-lg font-mono text-[10px] text-foreground">url</div>
                            <p className="text-xs text-muted-foreground pt-1">The full URL of the target article.</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <h4 className="font-black text-xs uppercase tracking-widest text-primary">Example Request</h4>
                        <div className="bg-foreground text-background p-6 rounded-3xl font-mono text-[10px] overflow-x-auto leading-relaxed shadow-inner">
                          {`curl -X GET "${window.location.origin}/api/news/antara/detail?url=https://www.antaranews.com/..." \\\n  -H "x-api-key: your_key_here"`}
                        </div>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-black uppercase tracking-tight ml-2 mt-12">Intelligence Stream</h3>
                  
                  <div className="rounded-[3rem] border border-border bg-card overflow-hidden shadow-2xl">
                    <div className="p-10 border-b border-border bg-muted/30">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-primary text-primary-foreground rounded-lg font-black text-[10px] uppercase tracking-widest">GET</span>
                        <code className="text-foreground font-black text-lg">/news/:source/:category</code>
                      </div>
                      <p className="text-muted-foreground text-sm font-medium">Fetch real-time articles from any connected intelligence source.</p>
                    </div>
                    
                    <div className="p-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
                      <div className="space-y-6">
                        <h4 className="font-black text-xs uppercase tracking-widest text-primary">Parameters</h4>
                        <div className="space-y-4">
                          <div className="flex items-start gap-4">
                            <div className="p-2 bg-muted rounded-lg font-mono text-[10px] text-foreground">source</div>
                            <p className="text-xs text-muted-foreground pt-1">The unique ID of the source (e.g., <code className="text-foreground">antara</code>)</p>
                          </div>
                          <div className="flex items-start gap-4">
                            <div className="p-2 bg-muted rounded-lg font-mono text-[10px] text-foreground">category</div>
                            <p className="text-xs text-muted-foreground pt-1">Target category (e.g., <code className="text-foreground">politik</code>). Defaults to latest.</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <h4 className="font-black text-xs uppercase tracking-widest text-primary">Example Request</h4>
                        <div className="bg-foreground text-background p-6 rounded-3xl font-mono text-[10px] overflow-x-auto leading-relaxed shadow-inner">
                          {`curl -X GET "${window.location.origin}/api/news/antara/terbaru" \\\n  -H "x-api-key: your_key_here"`}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interactive Sandbox Callout */}
                <div className="bg-slate-950 text-white p-12 rounded-[3.5rem] relative overflow-hidden group shadow-3xl">
                  <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/30 blur-[140px] -mr-40 -mt-40 animate-pulse"></div>
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="space-y-6 max-w-lg">
                      <h3 className="text-4xl font-black tracking-tighter uppercase leading-none">Interactive<br/>API Sandbox</h3>
                      <p className="text-slate-400 text-lg font-medium leading-relaxed">Access full schema definitions, response models, and test every endpoint in real-time with our integrated Swagger UI.</p>
                    </div>
                    <a href="/api-docs" target="_blank" className="inline-flex items-center gap-4 bg-primary text-white px-10 py-6 rounded-[2rem] font-black text-md uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/40">
                      Launch Swagger <ExternalLink className="w-6 h-6" />
                    </a>
                  </div>
                </div>

                <div className="h-20" />
              </div>
            </div>
          )}

          {activeTab === 'keys' && (
            <div className="flex-1 flex flex-col overflow-hidden bg-background">
              <div className="p-6 md:p-8 border-b border-border bg-white dark:bg-card shrink-0">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black tracking-tight text-foreground uppercase">Programmatic Access</h2>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Manage credentials & real-time hit analytics</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setInputModal({
                        isOpen: true,
                        title: 'Generate Key',
                        placeholder: 'Key label (e.g. Mobile App)',
                        value: '',
                        onChange: (val) => setInputModal(prev => ({ ...prev, value: val })),
                        onConfirm: () => {
                          // Note: We'll use the value from the closure in the handler
                        },
                        onCancel: () => setInputModal(prev => ({ ...prev, isOpen: false }))
                      });
                    }}
                    className="flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 bg-primary text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:opacity-95 hover:-translate-y-0.5 active:scale-[0.98] transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> Generate Key
                  </button>
                </div>
              </div>

              <div className="flex-1 flex overflow-hidden">
                {/* Keys List */}
                <div className={cn("flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar", selectedKeyLogs && "hidden xl:block")}>
                  <div className="max-w-5xl mx-auto space-y-6">
                    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-muted/50 border-b border-border">
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground w-1/3">Key Identity</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Hits</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Latency</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Error</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {apiKeys.length === 0 ? (
                            <tr>
                              <td colSpan="5" className="px-6 py-12 text-center">
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">No keys generated</p>
                              </td>
                            </tr>
                          ) : (
                            apiKeys.map(key => (
                              <tr key={key.id} className={cn(
                                "hover:bg-muted/30 transition-colors group",
                                selectedKeyLogs?.id === key.id && "bg-primary/5"
                              )}>
                                <td className="px-6 py-4">
                                  <div className="space-y-1.5">
                                    <p className="text-xs font-black text-foreground uppercase tracking-tight">{key.name}</p>
                                    <div className="flex items-center gap-2">
                                      <code className="text-[10px] font-mono text-muted-foreground bg-background px-2 py-0.5 rounded border border-border">
                                        {key.key_value.substring(0, 6)}•••
                                      </code>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-xs font-black tabular-nums text-foreground">{key.total_hits}</td>
                                <td className="px-6 py-4 text-xs font-black tabular-nums text-foreground">{Math.round(key.avg_latency || 0)}ms</td>
                                <td className="px-6 py-4">
                                  <span className={cn(
                                    "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest",
                                    key.total_hits > 0 && (key.error_count / key.total_hits) > 0.1 
                                      ? "bg-destructive/10 text-destructive" 
                                      : "bg-green-500/10 text-green-500"
                                  )}>
                                    {key.total_hits > 0 ? Math.round((key.error_count / key.total_hits) * 100) : 0}%
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center justify-end gap-2">
                                    <button 
                                      onClick={() => fetchKeyLogs(key.id)}
                                      className={cn(
                                        "p-2 rounded-lg transition-all",
                                        selectedKeyLogs?.id === key.id ? "bg-primary text-white" : "hover:bg-muted text-muted-foreground"
                                      )}
                                      title="View History"
                                    >
                                      <Activity className="w-4 h-4" />
                                    </button>
                                    <button 
                                      onClick={() => {
                                        navigator.clipboard.writeText(key.key_value);
                                        addToast('Key copied');
                                      }}
                                      className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
                                      title="Copy Key"
                                    >
                                      <Code className="w-4 h-4" />
                                    </button>
                                    <button 
                                      onClick={() => handleDeleteKey(key.id)}
                                      className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                                      title="Revoke Key"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex items-center gap-3 px-6 py-4 bg-muted/30 rounded-2xl border border-border border-dashed">
                      <ShieldCheck className="w-4 h-4 text-primary" />
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
                        Credentials are encrypted at rest. Use <code className="text-foreground">x-api-key</code> for authorization.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Audit Logs Drawer/Panel */}
                {selectedKeyLogs && (
                  <div className="w-full xl:w-[480px] border-l border-border bg-white dark:bg-card flex flex-col overflow-hidden animate-in slide-in-from-right duration-300 shadow-2xl">
                    <div className="p-6 border-b border-border bg-muted/30 flex items-center justify-between shrink-0">
                      <div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-foreground">Audit Stream</h3>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Latest 50 events for key #{selectedKeyLogs.id}</p>
                      </div>
                      <button 
                        onClick={() => setSelectedKeyLogs(null)}
                        className="p-2 hover:bg-muted rounded-lg transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                      {logLoading ? (
                        <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
                          <Activity className="w-6 h-6 animate-spin" />
                          <p className="text-[10px] font-black uppercase tracking-widest">Streaming logs...</p>
                        </div>
                      ) : selectedKeyLogs.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground opacity-50">
                          <Terminal className="w-8 h-8" />
                          <p className="text-[10px] font-black uppercase tracking-widest">No audit data available</p>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {selectedKeyLogs.data.map(log => (
                            <div key={log.id} className="p-3 hover:bg-muted/50 rounded-xl transition-all group border border-transparent hover:border-border">
                              <div className="flex items-start justify-between gap-4 mb-1.5">
                                <div className="flex items-center gap-2">
                                  <span className={cn(
                                    "px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
                                    log.method === 'GET' ? "bg-blue-500/10 text-blue-500" : "bg-purple-500/10 text-purple-500"
                                  )}>{log.method}</span>
                                  <code className="text-[10px] font-mono text-foreground truncate max-w-[180px]">{log.endpoint}</code>
                                </div>
                                <span className={cn(
                                  "text-[10px] font-black tabular-nums",
                                  log.status_code >= 400 ? "text-destructive" : "text-green-500"
                                )}>{log.status_code}</span>
                              </div>
                              <div className="flex items-center justify-between text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                                <div className="flex items-center gap-3">
                                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(log.timestamp).toLocaleTimeString()}</span>
                                  <span>{log.ip_address}</span>
                                </div>
                                <span className="text-foreground">{log.response_time}ms</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Logic Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-card text-card-foreground border border-border w-full max-w-xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-300 rounded-[2rem] overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-8 py-6 border-b border-border flex items-center justify-between shrink-0 bg-muted/30">
              <div>
                <h2 className="text-xl font-black text-foreground uppercase tracking-tighter">Source Configuration</h2>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mt-0.5">Logic & Extraction Parameters</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-accent rounded-xl transition-all text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveSource} className="p-8 space-y-6 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Internal Key</label>
                  <input 
                    value={formData.id} 
                    onChange={e => setFormData({...formData, id: e.target.value})} 
                    disabled={!!editingSource} 
                    placeholder="e.g. antara"
                    className="w-full h-12 bg-background border border-border rounded-xl px-4 text-xs font-mono outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/40 transition-all text-foreground disabled:opacity-50" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Display Name</label>
                  <input 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    placeholder="e.g. Antara News"
                    className="w-full h-12 bg-background border border-border rounded-xl px-4 text-xs font-black outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/40 transition-all text-foreground" 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Base Extraction URL</label>
                <input 
                  value={formData.baseUrl} 
                  onChange={e => setFormData({...formData, baseUrl: e.target.value})} 
                  placeholder="https://www.antaranews.com"
                  className="w-full h-12 bg-background border border-border rounded-xl px-4 text-xs font-mono outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/40 transition-all text-foreground" 
                />
              </div>

              <div className="space-y-8 pt-2">
                <KeyValueList 
                  title="Stream Categories"
                  data={formData.categories}
                  onChange={(val) => setFormData({...formData, categories: val})}
                  placeholder={{ key: 'Slug (e.g. politik)', value: 'Path (e.g. /politik)' }}
                />

                <KeyValueList 
                  title="Engine Selectors"
                  data={formData.selectors}
                  onChange={(val) => setFormData({...formData, selectors: val})}
                  placeholder={{ key: 'Selector (e.g. title)', value: 'CSS (e.g. .post-title)' }}
                />
              </div>

              <div className="pt-6 flex justify-end gap-3 border-t border-border">
                <button 
                  type="button" 
                  onClick={() => setModalOpen(false)} 
                  className="px-6 h-12 border border-border rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-accent transition-all text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-primary text-white px-8 h-12 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:opacity-90 hover:-translate-y-0.5 transition-all"
                >
                  Sync Logic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toasts */}
      <div className="fixed bottom-8 right-8 z-[200] flex flex-col gap-3">
        {toasts.map(t => (
          <div key={t.id} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 p-5 rounded-[1.25rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_50px_rgba(255,255,255,0.1)] flex items-center gap-4 animate-fade-up min-w-[320px] border border-white/10 dark:border-slate-200">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-inner",
              t.type === 'success' ? "bg-emerald-500/20 text-emerald-500" : "bg-red-500/20 text-red-500"
            )}>
              {t.type === 'success' ? <CheckCircle className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
            </div>
            <div className="flex-1">
              <p className="text-xs font-black uppercase tracking-widest mb-0.5">{t.type === 'success' ? 'Confirmed' : 'Intelligence Alert'}</p>
              <p className="text-[11px] font-medium opacity-80">{t.message}</p>
            </div>
            <button onClick={() => setToasts(toasts.filter(x => x.id !== t.id))} className="opacity-40 hover:opacity-100 transition-opacity p-1">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <Dialog 
        {...dialog} 
        onCancel={() => setDialog(prev => ({ ...prev, isOpen: false }))} 
      />
      
      <InputDialog 
        {...inputModal} 
        onConfirm={() => {
          if (inputModal.value) {
            handleCreateKey(inputModal.value);
            setInputModal(prev => ({ ...prev, isOpen: false }));
          }
        }}
        onCancel={() => setInputModal(prev => ({ ...prev, isOpen: false }))} 
      />

    </div>
  );
}
