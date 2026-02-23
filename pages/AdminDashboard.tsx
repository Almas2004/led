import React, { useState, useEffect, useRef } from 'react';
// Fixed: Added Link import from react-router-dom
import { Link } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, FolderKanban, MessageSquare, Plus, Trash2, X, Save, Upload, Image as ImageIcon, AlertTriangle, RefreshCw, Globe } from 'lucide-react';
import { api } from '../services/api';
import { Lead, Product, Solution, Case, LeadStatus, ScreenType } from '../types';

type AdminTab = 'leads' | 'products' | 'solutions' | 'cases';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('leads');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isBackendOnline, setIsBackendOnline] = useState<boolean | null>(null);
  
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const checkBackend = async () => {
    try {
      await api.getLeads();
      setIsBackendOnline(true);
      setError(null);
    } catch (e) {
      setIsBackendOnline(false);
      setError("Бэкенд недоступен. Убедитесь, что Go-сервер запущен на порту 8080.");
    }
  };

  const loadAll = async () => {
    setError(null);
    try {
      if (activeTab === 'leads') {
        const data = await api.getLeads();
        setLeads(data);
      }
      if (activeTab === 'products') {
        const data = await api.getProducts();
        setProducts(data);
      }
      if (activeTab === 'solutions') {
        const data = await api.getSolutions();
        setSolutions(data);
      }
      if (activeTab === 'cases') {
        const data = await api.getCases();
        setCases(data);
      }
      setIsBackendOnline(true);
    } catch (e) {
      console.error(e);
      setError("Ошибка загрузки данных. Проверьте соединение с бэкендом.");
      setIsBackendOnline(false);
    }
  };

  useEffect(() => { 
    checkBackend();
    loadAll(); 
  }, [activeTab]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Файл слишком большой. Максимальный размер 2МБ.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingItem({
          ...editingItem,
          images: [reader.result as string]
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!editingItem.images || editingItem.images.length === 0) {
      alert("Необходимо загрузить изображение.");
      return;
    }
    if (!editingItem.slug) {
      alert("Необходимо заполнить Slug (URL путь).");
      return;
    }
    try {
      if (activeTab === 'products') await api.createProduct(editingItem);
      else if (activeTab === 'solutions') await api.createSolution(editingItem);
      else if (activeTab === 'cases') await api.createCase(editingItem);
      
      setShowModal(false);
      setEditingItem(null);
      loadAll();
    } catch (e) {
      alert("Ошибка при сохранении в базу данных. Возможно, не запущен сервер или дублируется Slug.");
    }
  };

  const openCreateModal = () => {
    const ts = Date.now();
    let newItem: any = { isFeatured: true, images: [], slug: `item-${ts}` };
    if (activeTab === 'products') {
      newItem = { ...newItem, name: '', type: ScreenType.INDOOR, pixelPitch: '2.5', priceFrom: 0, purpose: [], ipRating: 'IP20', refreshRate: 1920, brightness: 800, shortDescription: '', fullDescription: '', warranty: 3, leadTime: 15, viewingDistanceMin: 2, viewingDistanceMax: 10 };
    } else if (activeTab === 'solutions') {
      newItem = { ...newItem, name: '', type: ScreenType.INDOOR, width: 2, height: 1, area: 2, priceFrom: 0, included: ['Экран', 'Монтаж', 'Настройка'], shortDescription: '', fullDescription: '' };
    } else if (activeTab === 'cases') {
      newItem = { ...newItem, title: '', city: 'Алматы', industry: 'Реклама', task: '', solutionDesc: '', specs: [], duration: 5, result: '', shortDescription: '' };
    }
    setEditingItem(newItem);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col fixed h-full z-20">
        <div className="p-6 border-b border-slate-800 font-bold text-blue-500 uppercase tracking-widest text-xs flex items-center justify-between">
          <span>LED Vision Admin</span>
          <div className={`w-2 h-2 rounded-full ${isBackendOnline ? 'bg-green-500' : 'bg-red-500'}`} title={isBackendOnline ? "Бэкенд онлайн" : "Бэкенд офлайн"}></div>
        </div>
        <nav className="p-4 space-y-2">
          {(['leads', 'products', 'solutions', 'cases'] as AdminTab[]).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-all ${activeTab === tab ? 'bg-blue-600 shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800'}`}>
              <span className="capitalize">{tab === 'leads' ? 'Заявки' : tab === 'products' ? 'Каталог' : tab === 'solutions' ? 'Решения' : 'Кейсы'}</span>
            </button>
          ))}
        </nav>
        <div className="mt-auto p-4 border-t border-slate-800">
          <Link to="/" className="flex items-center gap-2 text-xs text-slate-500 hover:text-white transition-colors">
            <Globe size={14} /> Вернуться на сайт
          </Link>
        </div>
      </aside>

      <main className="ml-64 flex-grow p-10 overflow-x-hidden">
        {error && (
          <div className="mb-6 bg-red-900/20 border border-red-500/50 text-red-200 p-4 rounded-xl flex items-center gap-3 animate-pulse">
            <AlertTriangle /> 
            <div className="flex-grow">
              <p className="font-bold">Ошибка соединения</p>
              <p className="text-xs opacity-80">{error}</p>
            </div>
            <button onClick={() => { checkBackend(); loadAll(); }} className="p-2 hover:bg-red-500/20 rounded-lg transition-colors">
              <RefreshCw size={18} />
            </button>
          </div>
        )}
        
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight">{activeTab === 'leads' ? 'Заявки' : activeTab === 'products' ? 'Каталог' : activeTab === 'solutions' ? 'Решения' : 'Кейсы'}</h1>
            <p className="text-slate-500 text-sm">Управление контентом и данными сайта</p>
          </div>
          {activeTab !== 'leads' && (
            <button onClick={openCreateModal} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all active:scale-95">
              <Plus /> Создать новую запись
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
                  {leads.map(l => (
                    <tr key={l.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-white">{l.name}</p>
                        <p className="text-[10px] text-slate-500 mt-1">{new Date(l.createdAt).toLocaleString('ru-RU')}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-blue-400 font-black">{l.phone}</p>
                        <p className="text-[10px] text-slate-500">{l.city}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] bg-slate-800 px-2 py-1 rounded border border-slate-700 text-slate-400">{l.source}</span>
                      </td>
                      <td className="px-6 py-4">
                        <select 
                          value={l.status}
                          onChange={(e) => api.updateLead(l.id, { status: e.target.value as any }).then(loadAll)}
                          className="bg-slate-800 border-none rounded-lg text-[10px] font-black uppercase tracking-widest px-3 py-1.5 outline-none cursor-pointer focus:ring-2 focus:ring-blue-600"
                        >
                          <option value={LeadStatus.NEW}>Новая</option>
                          <option value={LeadStatus.IN_PROGRESS}>В работе</option>
                          <option value={LeadStatus.DONE}>Завершена</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-slate-500 hover:text-white transition-colors" title="Добавить заметку">
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
              {(activeTab === 'products' ? products : activeTab === 'solutions' ? solutions : cases).map((item: any) => (
                <div key={item.id} className="bg-slate-950 border border-slate-800 rounded-3xl p-5 group flex flex-col h-full hover:border-blue-500/50 transition-all hover:shadow-xl hover:shadow-blue-600/5">
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
                      <span className="text-sm font-black text-white">
                        {item.priceFrom ? `${item.priceFrom.toLocaleString()} ₸` : '---'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => { setEditingItem(item); setShowModal(true); }}
                        className="p-2 text-slate-500 hover:text-blue-400 hover:bg-blue-400/10 rounded-xl transition-all"
                      >
                        <Plus size={18} className="rotate-45" /> {/* Use Plus as edit for simplicity in icon set */}
                      </button>
                      <button 
                        onClick={async () => {
                          if (confirm('Вы уверены, что хотите удалить эту запись?')) {
                            try {
                              if (activeTab === 'products') await api.deleteProduct(item.id);
                              if (activeTab === 'solutions') await api.deleteSolution(item.id);
                              if (activeTab === 'cases') await api.deleteCase(item.id);
                              loadAll();
                            } catch (e) {
                              alert("Ошибка удаления. Проверьте соединение.");
                            }
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
              {(activeTab === 'products' ? products : activeTab === 'solutions' ? solutions : cases).length === 0 && (
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

      {showModal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] w-full max-w-5xl max-h-[92vh] overflow-y-auto p-10 shadow-2xl relative">
            <button 
              onClick={() => setShowModal(false)} 
              className="absolute top-8 right-8 text-slate-500 hover:text-white hover:bg-slate-800 p-2 rounded-full transition-all"
            >
              <X size={24} />
            </button>

            <div className="mb-10">
              <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-2">Настройка элемента</h2>
              <p className="text-slate-500 text-sm">Заполните все поля для корректного отображения на сайте</p>
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
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center px-4">Загрузить JPG/PNG<br/><span className="opacity-50 font-normal">до 2МБ</span></span>
                    </div>
                    <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Slug (Уникальный URL)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 text-xs">/</span>
                      <input 
                        type="text" 
                        placeholder="например: indoor-p2-5-almaty" 
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 pl-8 pr-4 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-600 transition-all text-blue-400" 
                        value={editingItem.slug} 
                        onChange={e => setEditingItem({...editingItem, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})} 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Категория / Тип</label>
                    <select 
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-600" 
                      value={editingItem.type || editingItem.industry || ScreenType.INDOOR} 
                      onChange={e => setEditingItem(activeTab === 'cases' ? {...editingItem, industry: e.target.value} : {...editingItem, type: e.target.value})}
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
                          <option value={ScreenType.INDOOR}>Indoor (Интерьерный)</option>
                          <option value={ScreenType.OUTDOOR}>Outdoor (Уличный)</option>
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
                    onChange={e => setEditingItem(activeTab === 'cases' ? {...editingItem, title: e.target.value} : {...editingItem, name: e.target.value})} 
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {activeTab !== 'cases' ? (
                    <>
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Цена "От" (₸)</label>
                        <input 
                          type="number" 
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-black text-white outline-none focus:ring-2 focus:ring-blue-600" 
                          value={editingItem.priceFrom} 
                          onChange={e => setEditingItem({...editingItem, priceFrom: Number(e.target.value)})} 
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Шаг пикселя (P)</label>
                        <input 
                          type="text" 
                          placeholder="например: 1.8" 
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-bold outline-none focus:ring-2 focus:ring-blue-600" 
                          value={editingItem.pixelPitch} 
                          onChange={e => setEditingItem({...editingItem, pixelPitch: e.target.value})} 
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
                          onChange={e => setEditingItem({...editingItem, city: e.target.value})} 
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Срок реализации (дней)</label>
                        <input 
                          type="number" 
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-bold outline-none" 
                          value={editingItem.duration} 
                          onChange={e => setEditingItem({...editingItem, duration: Number(e.target.value)})} 
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Короткое описание (превью)</label>
                    <textarea 
                      placeholder="Видно в списке товаров/кейсов..."
                      className="w-full h-24 bg-slate-950 border border-slate-800 rounded-2xl p-5 text-sm outline-none focus:ring-2 focus:ring-blue-600 transition-all resize-none" 
                      value={editingItem.shortDescription || editingItem.task || ''} 
                      onChange={e => setEditingItem(activeTab === 'cases' ? {...editingItem, task: e.target.value} : {...editingItem, shortDescription: e.target.value})} 
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Полное описание (детально)</label>
                    <textarea 
                      placeholder="Подробное описание продукта или кейса для детальной страницы..."
                      className="w-full h-48 bg-slate-950 border border-slate-800 rounded-2xl p-5 text-sm outline-none focus:ring-2 focus:ring-blue-600 transition-all resize-none" 
                      value={editingItem.fullDescription || editingItem.solutionDesc || ''} 
                      onChange={e => setEditingItem(activeTab === 'cases' ? {...editingItem, solutionDesc: e.target.value} : {...editingItem, fullDescription: e.target.value})} 
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 items-center">
                  <div className="flex items-center gap-4 bg-slate-950 border border-slate-800 px-6 py-4 rounded-2xl w-full sm:w-auto">
                    <input 
                      type="checkbox" 
                      id="feat" 
                      checked={editingItem.isFeatured} 
                      onChange={e => setEditingItem({...editingItem, isFeatured: e.target.checked})} 
                      className="w-6 h-6 accent-blue-600 rounded cursor-pointer" 
                    />
                    <label htmlFor="feat" className="font-black text-[10px] uppercase tracking-widest cursor-pointer select-none">Показывать на главной странице</label>
                  </div>

                  <button 
                    onClick={handleSave} 
                    className="flex-grow bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl uppercase tracking-widest text-sm shadow-2xl shadow-blue-600/30 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                  >
                    <Save size={20} /> Записать в базу данных
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