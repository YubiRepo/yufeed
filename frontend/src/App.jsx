
import axios from 'axios';
import {
  Activity,
  AlertCircle,
  CheckCircle,
  Lock,
  Menu,
  Plus,
  Search,
  Terminal,
  Trash2,
  X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { cn } from './lib/utils';

import ArticleCard from './components/ArticleCard';
import ArticleDetail from './components/ArticleDetail';
import Sidebar from './components/Sidebar';
import SourceEditorForm from './components/SourceForm';
import SourcesInventory from './components/SourcesInventory';


import Auth from './components/Auth';
import ApiReference from './components/ApiReference';

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

// --- API Configuration ---
const api = axios.create({ baseURL: '' });

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const pathParts = location.pathname.split('/').filter(Boolean);
  const activeTab = pathParts[0] || 'feed';
  const urlSource = pathParts[1] || '';
  const urlCategory = pathParts[2] || '';

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sources, setSources] = useState({});
  const [currentSource, setCurrentSource] = useState(urlSource);
  const [currentCategory, setCurrentCategory] = useState(urlCategory);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [apiKeys, setApiKeys] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [sourcesList, setSourcesList] = useState([]);
  const [editingSource, setEditingSource] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('yufeed-theme') || 'dark');
  const [dialog, setDialog] = useState({ isOpen: false, title: '', message: '', onConfirm: null, type: 'danger' });
  const [inputModal, setInputModal] = useState({ isOpen: false, title: '', placeholder: '', onConfirm: null, value: '' });
  const [selectedKeyLogs, setSelectedKeyLogs] = useState(null);
  const [logLoading, setLogLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const articleUrl = searchParams.get('article');

    if (activeTab === 'feed') {
      if (urlSource) setCurrentSource(urlSource);
      if (urlCategory) setCurrentCategory(urlCategory);
      else setCurrentCategory('');

      if (!articleUrl) setSelectedArticle(null);
    } else {
      setSelectedArticle(null);
    }
  }, [location.pathname, location.search]);

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

  const checkAuth = async () => {
    try {
      const res = await api.get('/api/auth/me');
      if (res.data.loggedIn) setUser({ username: res.data.username, role: res.data.role });
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
      addToast(e.response?.data?.message || 'Authentication failed', 'error');
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
        navigate('/feed');
        setDialog(prev => ({ ...prev, isOpen: false }));
      },
      onCancel: () => setDialog(prev => ({ ...prev, isOpen: false })),
      type: 'danger'
    });
  };

  const loadConfig = async () => {
    try {
      const res = await api.get('/api/config');
      setSources(res.data);
      if (activeTab === 'feed' && !urlSource && Object.keys(res.data).length > 0) {
        navigate(`/feed/${Object.keys(res.data)[0]}`, { replace: true });
      }
    } catch (e) {
      addToast('Failed to load system config', 'error');
    }
  };

  const fetchNews = async (source, category = '') => {
    setLoading(true);
    try {
      const res = await api.get(`/api/news/${source}${category ? '/' + category : ''}`);
      if (res.data.success) setArticles(res.data.data.posts);
    } catch (e) {
      addToast('Error fetching news stream', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectArticle = async (article) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('article', article.link);
    navigate({ search: searchParams.toString() });

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

  const handleSourceSaveAction = async (data) => {
    try {
      await api.post('/api/sources', data);
      addToast('Intelligence source synchronized');
      fetchSourcesTable();
      loadConfig();
    } catch (e) {
      addToast('Synchronization failed', 'error');
      throw e;
    }
  };

  const fetchApiKeys = async () => {
    try {
      const res = await api.get('/api/user/keys');
      if (res.data.success) setApiKeys(res.data.keys);
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
      message: `Permanently remove "${id}"?`,
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

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };



  if (authLoading) return <div className="h-screen flex items-center justify-center bg-background"><Activity className="w-8 h-8 text-primary animate-spin" /></div>;
  if (!user) return <Auth authView="login" onLogin={handleLogin} theme={theme} />;

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans antialiased">
      <Sidebar
        user={user}
        activeTab={activeTab}
        sources={sources}
        currentSource={currentSource}
        setSidebarOpen={setSidebarOpen}
        sidebarOpen={sidebarOpen}
        handleLogout={handleLogout}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <main className="flex-1 flex flex-col min-w-0 bg-background text-foreground transition-all duration-500 overflow-hidden">
        <header className="h-20 border-b border-border bg-white/80 dark:bg-card/80 backdrop-blur-xl flex items-center justify-between px-8 shrink-0 z-40">
          <div className="flex items-center gap-8 min-w-0">
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-lg shadow-primary/5">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-sm font-black text-foreground uppercase tracking-tighter line-clamp-1">
                  {sources[currentSource]?.name || 'Intelligence Platform'}
                </h2>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    {activeTab === 'feed' ? 'Real-time Feed' : 'Management Console'}
                  </span>
                </div>
              </div>
            </div>

            {activeTab === 'feed' && (
              <nav className="hidden xl:flex items-center gap-1.5">
                {sources[currentSource]?.categories && Object.keys(sources[currentSource].categories).map(cat => (
                  <button
                    key={cat}
                    onClick={() => navigate(`/feed/${currentSource}/${cat}`)}
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
            )}
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

        <div className="flex-1 flex flex-col overflow-hidden relative">
          <Routes>
            <Route path="/" element={<Navigate to="/feed" replace />} />
            <Route path="/feed/*" element={
              !selectedArticle ? (
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
              ) : (
                <ArticleDetail
                  article={selectedArticle}
                  sourceName={sources[currentSource]?.name}
                  onBack={() => {
                    const searchParams = new URLSearchParams(location.search);
                    searchParams.delete('article');
                    navigate({ search: searchParams.toString() });
                    setSelectedArticle(null);
                  }}
                  loading={detailLoading}
                />
              )
            } />
            <Route path="/sources" element={
              user.role === 'admin' ? (
                <SourcesInventory
                  sourcesList={sourcesList}
                  onAdd={() => navigate('/sources/add')}
                  onEdit={(src) => navigate(`/sources/edit/${src.id}`)}
                  onDelete={handleDeleteSource}
                />
              ) : <Navigate to="/feed" replace />
            } />
            <Route path="/sources/add" element={
              user.role === 'admin' ? (
                <SourceEditorForm onSave={handleSourceSaveAction} sourcesList={sourcesList} />
              ) : <Navigate to="/feed" replace />
            } />
            <Route path="/sources/edit/:id" element={
              user.role === 'admin' ? (
                <SourceEditorForm onSave={handleSourceSaveAction} sourcesList={sourcesList} />
              ) : <Navigate to="/feed" replace />
            } />
            <Route path="/keys" element={
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
                          onConfirm: () => { },
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
                  <div className={cn("flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar", selectedKeyLogs && "hidden xl:block")}>
                    <div className="max-w-5xl mx-auto space-y-6">
                      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-muted/50 border-b border-border">
                              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground w-1/3">Key Identity</th>
                              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Hits</th>
                              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Latency</th>
                              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {apiKeys.length === 0 ? (
                              <tr>
                                <td colSpan="4" className="px-6 py-12 text-center text-muted-foreground uppercase tracking-widest text-xs font-bold">No keys generated</td>
                              </tr>
                            ) : (
                              apiKeys.map(key => (
                                <tr key={key.id} className={cn("hover:bg-muted/30 transition-colors group", selectedKeyLogs?.id === key.id && "bg-primary/5")}>
                                  <td className="px-6 py-4">
                                    <p className="text-xs font-black text-foreground uppercase tracking-tight">{key.name}</p>
                                    <code className="text-[10px] font-mono text-muted-foreground bg-background px-2 py-0.5 rounded border border-border mt-1 inline-block">{key.key_value.substring(0, 8)}•••</code>
                                  </td>
                                  <td className="px-6 py-4 text-xs font-black tabular-nums">{key.total_hits}</td>
                                  <td className="px-6 py-4 text-xs font-black tabular-nums">{Math.round(key.avg_latency || 0)}ms</td>
                                  <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                      <button onClick={() => fetchKeyLogs(key.id)} className={cn("p-2 rounded-lg transition-all", selectedKeyLogs?.id === key.id ? "bg-primary text-white" : "hover:bg-muted text-muted-foreground")}><Activity className="w-4 h-4" /></button>
                                      <button onClick={() => handleDeleteKey(key.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {selectedKeyLogs && (
                    <div className="w-full xl:w-[480px] border-l border-border bg-white dark:bg-card flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
                      <div className="p-6 border-b border-border bg-muted/30 flex items-center justify-between shrink-0">
                        <div>
                          <h3 className="text-xs font-black uppercase tracking-widest text-foreground">Audit Stream</h3>
                          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Latest events for key #{selectedKeyLogs.id}</p>
                        </div>
                        <button onClick={() => setSelectedKeyLogs(null)} className="p-2 hover:bg-muted rounded-lg transition-all"><X className="w-4 h-4" /></button>
                      </div>
                      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                        {logLoading ? <div className="h-full flex items-center justify-center"><Activity className="w-6 h-6 animate-spin text-primary" /></div> : (
                          <div className="space-y-1">
                            {selectedKeyLogs.data.map(log => (
                              <div key={log.id} className="p-3 hover:bg-muted/50 rounded-xl transition-all group border border-transparent hover:border-border text-[10px]">
                                <div className="flex items-start justify-between mb-1">
                                  <span className={cn("px-1.5 py-0.5 rounded font-black", log.status_code >= 400 ? "bg-destructive/10 text-destructive" : "bg-green-500/10 text-green-500")}>{log.status_code}</span>
                                  <span className="font-mono text-muted-foreground">{new Date(log.timestamp).toLocaleTimeString()}</span>
                                </div>
                                <code className="text-foreground block truncate">{log.endpoint}</code>
                                <div className="flex items-center justify-between mt-2 text-[9px] text-muted-foreground font-black uppercase tracking-widest">
                                  <span>{log.method}</span>
                                  <span>{log.response_time}ms</span>
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
            } />
            <Route path="/docs" element={<ApiReference theme={theme} />} />
          </Routes>
        </div>
      </main>

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
