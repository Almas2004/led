import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  Globe,
  Image as ImageIcon,
  Lock,
  LogOut,
  MessageSquare,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { api } from '../services/api';
import { Case, Lead, LeadStatus, Product, ScreenType, Solution } from '../types';

type AdminTab = 'leads' | 'products' | 'solutions' | 'cases';

const ADMIN_TABS: AdminTab[] = ['leads', 'products', 'solutions', 'cases'];

const TAB_LABELS: Record<AdminTab, string> = {
  leads: 'Заявки',
  products: 'Каталог',
  solutions: 'Решения',
  cases: 'Кейсы',
};

const defaultError = 'Не удалось загрузить данные. Проверьте подключение и учетные данные администратора.';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('leads');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isBackendOnline, setIsBackendOnline] = useState<boolean | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(api.hasAdminCredentials());
  const [authError, setAuthError] = useState<string | null>(null);
  const [authForm, setAuthForm] = useState({ username: '', password: '' });
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentItems = useMemo(
    () => (activeTab === 'products' ? products : activeTab === 'solutions' ? solutions : cases),
    [activeTab, cases, products, solutions],
  );

  const verifyAdmin = async () => {
    try {
      await api.verifyAdmin();
      setIsAuthorized(true);
      setAuthError(null);
      return true;
    } catch {
      setIsAuthorized(false);
      return false;
    }
  };

  const checkBackend = async () => {
    try {
      await api.verifyAdmin();
      setIsBackendOnline(true);
      setError(null);
      setIsAuthorized(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка авторизации.';
      setIsBackendOnline(false);
      if (message.includes('401')) {
        setAuthError('Введите корректные учетные данные администратора.');
        setIsAuthorized(false);
      } else {
        setError('Backend недоступен. Проверьте переменные окружения и запуск Go-сервера.');
      }
    }
  };

  const loadAll = async () => {
    setError(null);
    try {
      if (activeTab === 'leads') {
        setLeads(await api.getLeads());
      } else if (activeTab === 'products') {
        setProducts(await api.getProducts());
      } else if (activeTab === 'solutions') {
        setSolutions(await api.getSolutions());
      } else {
        setCases(await api.getCases());
      }
      setIsBackendOnline(true);
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : defaultError;
      setError(message.includes('401') ? 'Доступ запрещен. Войдите как администратор.' : defaultError);
      setIsBackendOnline(false);
      if (message.includes('401')) {
        setIsAuthorized(false);
      }
    }
  };

  useEffect(() => {
    if (!isAuthorized) {
      return;
    }
    checkBackend();
    loadAll();
  }, [activeTab, isAuthorized]);

  useEffect(() => {
    if (api.hasAdminCredentials()) {
      verifyAdmin();
    }
  }, []);

  const handleAuthSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setAuthError(null);
    api.setAdminCredentials(authForm.username.trim(), authForm.password);
    const ok = await verifyAdmin();
    if (!ok) {
      api.clearAdminCredentials();
      setAuthError('Неверный логин или пароль.');
      return;
    }
    setAuthForm({ username: '', password: '' });
    setIsBackendOnline(true);
  };

  const handleLogout = () => {
    api.clearAdminCredentials();
    setIsAuthorized(false);
    setIsBackendOnline(null);
    setAuthError(null);
    setError(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Файл слишком большой. Максимальный размер 2 МБ.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setEditingItem((current: any) => ({
        ...current,
        images: [reader.result as string],
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!editingItem?.images || editingItem.images.length === 0) {
      alert('Нужно загрузить изображение.');
      return;
    }
    if (!editingItem.slug) {
      alert('Заполните slug.');
      return;
    }

    try {
      if (activeTab === 'products') {
        await api.createProduct(editingItem);
      } else if (activeTab === 'solutions') {
        await api.createSolution(editingItem);
      } else {
        await api.createCase(editingItem);
      }

      setShowModal(false);
      setEditingItem(null);
      await loadAll();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Не удалось сохранить запись.');
    }
  };

  const openCreateModal = () => {
    const timestamp = Date.now();
    let nextItem: any = { isFeatured: true, images: [], slug: `item-${timestamp}` };

    if (activeTab === 'products') {
      nextItem = {
        ...nextItem,
        name: '',
        type: ScreenType.INDOOR,
        pixelPitch: '2.5',
        priceFrom: 0,
        purpose: [],
        ipRating: 'IP20',
        refreshRate: 1920,
        brightness: 800,
        shortDescription: '',
        fullDescription: '',
        warranty: 3,
        leadTime: 15,
        viewingDistanceMin: 2,
        viewingDistanceMax: 10,
      };
    } else if (activeTab === 'solutions') {
      nextItem = {
        ...nextItem,
        name: '',
        type: ScreenType.INDOOR,
        width: 2,
        height: 1,
        area: 2,
        priceFrom: 0,
        included: ['Экран', 'Настройка', 'Пусконаладка'],
        shortDescription: '',
        fullDescription: '',
      };
    } else if (activeTab === 'cases') {
      nextItem = {
        ...nextItem,
        title: '',
        city: 'Алматы',
        industry: 'Реклама',
        task: '',
        solutionDesc: '',
        specs: [],
        duration: 5,
        result: '',
      };
    }

    setEditingItem(nextItem);
    setShowModal(true);
  };

  const renderLogin = () => (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center mb-5">
          <Lock size={22} />
        </div>
        <h1 className="text-2xl font-black mb-2">Вход в админку</h1>
        <p className="text-sm text-slate-400 mb-6">Доступ к заявкам и управлению контентом защищен базовой авторизацией.</p>
        <form className="space-y-4" onSubmit={handleAuthSubmit}>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Логин</label>
            <input
              type="text"
              autoComplete="username"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600"
              value={authForm.username}
              onChange={(event) => setAuthForm((current) => ({ ...current, username: event.target.value }))}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Пароль</label>
            <input
              type="password"
              autoComplete="current-password"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600"
              value={authForm.password}
              onChange={(event) => setAuthForm((current) => ({ ...current, password: event.target.value }))}
            />
          </div>
          {authError && <p className="text-sm text-red-300">{authError}</p>}
          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 px-4 py-3 font-bold text-white transition-colors hover:bg-blue-700"
          >
            Войти
          </button>
        </form>
      </div>
    </div>
  );

  if (!isAuthorized) {
    return renderLogin();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col fixed h-full z-20">
        <div className="p-6 border-b border-slate-800 font-bold text-blue-500 uppercase tracking-widest text-xs flex items-center justify-between">
          <span>ARDI LED Admin</span>
          <div
            className={`w-2 h-2 rounded-full ${isBackendOnline ? 'bg-green-500' : 'bg-red-500'}`}
            title={isBackendOnline ? 'Backend онлайн' : 'Backend офлайн'}
          />
        </div>
        <nav className="p-4 space-y-2">
          {ADMIN_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-all ${
                activeTab === tab ? 'bg-blue-600 shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </nav>
        <div className="mt-auto p-4 border-t border-slate-800 space-y-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-3 text-sm font-bold text-slate-300 hover:bg-slate-800"
          >
            <LogOut size={16} /> Выйти
          </button>
          <Link to="/" className="flex items-center justify-center gap-2 text-xs text-slate-500 hover:text-white transition-colors">
            <Globe size={14} /> Вернуться на сайт
          </Link>
        </div>
      </aside>

      <main className="ml-64 flex-grow p-10 overflow-x-hidden">
        {error && (
          <div className="mb-6 bg-red-900/20 border border-red-500/50 text-red-200 p-4 rounded-xl flex items-center gap-3">
            <AlertTriangle />
            <div className="flex-grow">
              <p className="font-bold">Ошибка</p>
              <p className="text-xs opacity-80">{error}</p>
            </div>
            <button onClick={() => loadAll()} className="p-2 hover:bg-red-500/20 rounded-lg transition-colors">
              <RefreshCw size={18} />
            </button>
          </div>
        )}

        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight">{TAB_LABELS[activeTab]}</h1>
            <p className="text-slate-500 text-sm">Управление контентом и заявками сайта</p>
          </div>
          {activeTab !== 'leads' && (
            <button
              onClick={openCreateModal}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all active:scale-95"
            >
              <Plus size={18} /> Создать запись
            </button>
          )}
        </div>

        <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
          {activeTab === 'leads' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-800/50 text-slate-400 uppercase text-[10px] font-black tracking-widest">
                  <tr>
                    <th className="px-6 py-5">Клиент / Дата</th>
                    <th className="px-6 py-5">Контактные данные</th>
                    <th className="px-6 py-5">Источник</th>
                    <th className="px-6 py-5">Статус</th>
                    <th className="px-6 py-5">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-white">{lead.name || 'Без имени'}</p>
                        <p className="text-[10px] text-slate-500 mt-1">
                          {lead.createdAt ? new Date(lead.createdAt).toLocaleString('ru-RU') : 'Без даты'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-blue-400 font-black">{lead.phone || 'Не указан'}</p>
                        <p className="text-[10px] text-slate-500">{lead.city || 'Город не указан'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] bg-slate-800 px-2 py-1 rounded border border-slate-700 text-slate-400">
                          {lead.source || 'unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={lead.status}
                          onChange={(event) => api.updateLead(lead.id, { status: event.target.value as LeadStatus }).then(loadAll)}
                          className="bg-slate-800 border-none rounded-lg text-[10px] font-black uppercase tracking-widest px-3 py-1.5 outline-none cursor-pointer focus:ring-2 focus:ring-blue-600"
                        >
                          <option value={LeadStatus.NEW}>Новая</option>
                          <option value={LeadStatus.IN_PROGRESS}>В работе</option>
                          <option value={LeadStatus.DONE}>Завершена</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-slate-500 hover:text-white transition-colors" title="Комментарий менеджера">
                          <MessageSquare size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {leads.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center gap-4 opacity-30">
                          <MessageSquare size={48} />
                          <p className="font-bold uppercase tracking-widest text-xs">Заявок пока нет</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentItems.map((item: any) => (
                <div
                  key={item.id}
                  className="bg-slate-950 border border-slate-800 rounded-3xl p-5 group flex flex-col h-full hover:border-blue-500/50 transition-all hover:shadow-xl hover:shadow-blue-600/5"
                >
                  <div className="h-44 bg-slate-900 rounded-2xl mb-5 overflow-hidden relative shadow-inner">
                    {item.images?.[0] ? (
                      <img src={item.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-800 bg-slate-900/50">
                        <ImageIcon size={48} />
                      </div>
                    )}
                    <div className="absolute top-3 right-3 flex gap-2">
                      {item.isFeatured && (
                        <span className="px-2 py-1 rounded bg-blue-600 text-white text-[8px] font-black uppercase tracking-widest shadow-lg">
                          Главная
                        </span>
                      )}
                      <span className="px-2 py-1 rounded bg-slate-900/80 backdrop-blur-sm text-white text-[8px] font-black uppercase tracking-widest border border-slate-700">
                        {item.type || item.industry}
                      </span>
                    </div>
                  </div>
                  <h4 className="font-bold text-white mb-1 group-hover:text-blue-400 transition-colors truncate">{item.name || item.title}</h4>
                  <p className="text-[10px] text-slate-500 font-mono mb-4 truncate opacity-60">/{item.slug}</p>

                  <div className="mt-auto pt-5 border-t border-slate-900 flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Цена от</span>
                      <span className="text-sm font-black text-white">{item.priceFrom ? `${Number(item.priceFrom).toLocaleString()} ₸` : '—'}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setShowModal(true);
                        }}
                        className="p-2 text-slate-500 hover:text-blue-400 hover:bg-blue-400/10 rounded-xl transition-all"
                      >
                        <Plus size={18} className="rotate-45" />
                      </button>
                      <button
                        onClick={async () => {
                          if (!confirm('Удалить эту запись?')) {
                            return;
                          }
                          try {
                            if (activeTab === 'products') {
                              await api.deleteProduct(item.id);
                            } else if (activeTab === 'solutions') {
                              await api.deleteSolution(item.id);
                            } else {
                              await api.deleteCase(item.id);
                            }
                            await loadAll();
                          } catch (err) {
                            alert(err instanceof Error ? err.message : 'Не удалось удалить запись.');
                          }
                        }}
                        className="text-slate-500 hover:text-red-500 p-2 hover:bg-red-500/10 rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {currentItems.length === 0 && (
                <div className="col-span-full py-32 text-center">
                  <div className="flex flex-col items-center gap-6 opacity-20">
                    <ImageIcon size={64} />
                    <p className="font-black uppercase tracking-[0.2em] text-sm">В этом разделе пока пусто</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {showModal && editingItem && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] w-full max-w-5xl max-h-[92vh] overflow-y-auto p-10 shadow-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-8 right-8 text-slate-500 hover:text-white hover:bg-slate-800 p-2 rounded-full transition-all"
            >
              <X size={24} />
            </button>

            <div className="mb-10">
              <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-2">Настройка элемента</h2>
              <p className="text-slate-500 text-sm">Заполните поля для корректного отображения записи на сайте.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Главное изображение</label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-64 bg-slate-950 border-2 border-dashed border-slate-700 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-600 hover:bg-blue-600/5 transition-all overflow-hidden relative group"
                  >
                    {editingItem.images?.[0] ? (
                      <img src={editingItem.images[0]} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" alt="" />
                    ) : null}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 mb-3 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-lg">
                        <Upload size={20} />
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center px-4">
                        Загрузить JPG/PNG
                        <br />
                        <span className="opacity-50 font-normal">до 2 МБ</span>
                      </span>
                    </div>
                    <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Slug</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 text-xs">/</span>
                      <input
                        type="text"
                        placeholder="например: indoor-p2-5-almaty"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 pl-8 pr-4 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-600 transition-all text-blue-400"
                        value={editingItem.slug}
                        onChange={(event) =>
                          setEditingItem((current: any) => ({
                            ...current,
                            slug: event.target.value.toLowerCase().replace(/\s+/g, '-'),
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Категория / Тип</label>
                    <select
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-600"
                      value={editingItem.type || editingItem.industry || ScreenType.INDOOR}
                      onChange={(event) =>
                        setEditingItem((current: any) =>
                          activeTab === 'cases'
                            ? { ...current, industry: event.target.value }
                            : { ...current, type: event.target.value as ScreenType },
                        )
                      }
                    >
                      {activeTab === 'cases' ? (
                        <>
                          <option value="Реклама">Реклама</option>
                          <option value="Сцена">Сцена / Шоу</option>
                          <option value="Витрина">Витрина</option>
                          <option value="Гос. сектор">Гос. сектор</option>
                        </>
                      ) : (
                        <>
                          <option value={ScreenType.INDOOR}>Indoor</option>
                          <option value={ScreenType.OUTDOOR}>Outdoor</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3 space-y-8">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Название / Заголовок</label>
                  <input
                    type="text"
                    placeholder="Название для отображения"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 text-lg font-black outline-none focus:ring-2 focus:ring-blue-600 transition-all placeholder:text-slate-800"
                    value={editingItem.name || editingItem.title || ''}
                    onChange={(event) =>
                      setEditingItem((current: any) =>
                        activeTab === 'cases' ? { ...current, title: event.target.value } : { ...current, name: event.target.value },
                      )
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {activeTab !== 'cases' ? (
                    <>
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Цена от (₸)</label>
                        <input
                          type="number"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-black text-white outline-none focus:ring-2 focus:ring-blue-600"
                          value={editingItem.priceFrom}
                          onChange={(event) => setEditingItem((current: any) => ({ ...current, priceFrom: Number(event.target.value) }))}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Шаг пикселя (P)</label>
                        <input
                          type="text"
                          placeholder="например: 1.8"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-bold outline-none focus:ring-2 focus:ring-blue-600"
                          value={editingItem.pixelPitch}
                          onChange={(event) => setEditingItem((current: any) => ({ ...current, pixelPitch: event.target.value }))}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Город</label>
                        <input
                          type="text"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-bold outline-none"
                          value={editingItem.city}
                          onChange={(event) => setEditingItem((current: any) => ({ ...current, city: event.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Срок реализации (дней)</label>
                        <input
                          type="number"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-bold outline-none"
                          value={editingItem.duration}
                          onChange={(event) => setEditingItem((current: any) => ({ ...current, duration: Number(event.target.value) }))}
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Короткое описание</label>
                    <textarea
                      placeholder="Краткое описание для списка"
                      className="w-full h-24 bg-slate-950 border border-slate-800 rounded-2xl p-5 text-sm outline-none focus:ring-2 focus:ring-blue-600 transition-all resize-none"
                      value={editingItem.shortDescription || editingItem.task || ''}
                      onChange={(event) =>
                        setEditingItem((current: any) =>
                          activeTab === 'cases' ? { ...current, task: event.target.value } : { ...current, shortDescription: event.target.value },
                        )
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Полное описание</label>
                    <textarea
                      placeholder="Подробное описание записи"
                      className="w-full h-48 bg-slate-950 border border-slate-800 rounded-2xl p-5 text-sm outline-none focus:ring-2 focus:ring-blue-600 transition-all resize-none"
                      value={editingItem.fullDescription || editingItem.solutionDesc || ''}
                      onChange={(event) =>
                        setEditingItem((current: any) =>
                          activeTab === 'cases' ? { ...current, solutionDesc: event.target.value } : { ...current, fullDescription: event.target.value },
                        )
                      }
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 items-center">
                  <div className="flex items-center gap-4 bg-slate-950 border border-slate-800 px-6 py-4 rounded-2xl w-full sm:w-auto">
                    <input
                      type="checkbox"
                      id="feat"
                      checked={editingItem.isFeatured}
                      onChange={(event) => setEditingItem((current: any) => ({ ...current, isFeatured: event.target.checked }))}
                      className="w-6 h-6 accent-blue-600 rounded cursor-pointer"
                    />
                    <label htmlFor="feat" className="font-black text-[10px] uppercase tracking-widest cursor-pointer select-none">
                      Показывать на главной
                    </label>
                  </div>

                  <button
                    onClick={handleSave}
                    className="flex-grow bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl uppercase tracking-widest text-sm shadow-2xl shadow-blue-600/30 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                  >
                    <Save size={20} /> Сохранить
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
