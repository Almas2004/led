import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
// Fixed: Added AlertTriangle and Image as ImageIcon to lucide-react imports
import { Filter, SlidersHorizontal, ChevronRight, Info, Search, AlertTriangle, Image as ImageIcon } from 'lucide-react';
import { api } from '../services/api';
import { Product, ScreenType } from '../types';

export const CatalogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [backendError, setBackendError] = useState(false);

  // Filter States
  const typeFilter = searchParams.get('type') as ScreenType || ScreenType.INDOOR;
  const [selectedPurposes, setSelectedPurposes] = useState<string[]>([]);
  const [selectedPitches, setSelectedPitches] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(50000000);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await api.getProducts();
        setProducts(data);
        setBackendError(false);
      } catch (e) {
        console.error("Catalog load error:", e);
        setBackendError(true);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesType = p.type === typeFilter;
      const matchesPurpose = selectedPurposes.length === 0 || (p.purpose && p.purpose.some(pur => selectedPurposes.includes(pur)));
      const matchesPitch = selectedPitches.length === 0 || selectedPitches.includes(p.pixelPitch);
      const matchesPrice = !p.priceFrom || p.priceFrom <= maxPrice;
      return matchesType && matchesPurpose && matchesPitch && matchesPrice;
    });
  }, [products, typeFilter, selectedPurposes, selectedPitches, maxPrice]);

  const toggleType = (type: ScreenType) => {
    setSearchParams({ type });
  };

  const togglePurpose = (purpose: string) => {
    setSelectedPurposes(prev => prev.includes(purpose) ? prev.filter(p => p !== purpose) : [...prev, purpose]);
  };

  const pitchesByType: Record<ScreenType, string[]> = {
    [ScreenType.INDOOR]: ['4.0', '3.0', '2.5', '2.0', '1.8', '1.2'],   // indoor
    [ScreenType.OUTDOOR]: ['10', '8.0', '5.0', '4.0', '3.0', '2.5'],   // outdoor
  };

  const availablePitches = pitchesByType[typeFilter] ?? [];

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
            <Link to="/" className="hover:text-blue-600 transition-colors">Главная</Link>
            <ChevronRight size={10} />
            <span className="text-slate-900">Каталог</span>
          </nav>
          <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">Каталог LED Экранов</h1>
          <div className="flex p-1.5 bg-gray-100 rounded-2xl w-fit shadow-inner">
            <button 
              onClick={() => toggleType(ScreenType.INDOOR)}
              className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${typeFilter === ScreenType.INDOOR ? 'bg-white shadow-lg text-blue-600' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Внутренние
            </button>
            <button 
              onClick={() => toggleType(ScreenType.OUTDOOR)}
              className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${typeFilter === ScreenType.OUTDOOR ? 'bg-white shadow-lg text-blue-600' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Уличные
            </button>
          </div>
        </div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-3 bg-white px-5 py-3 rounded-full border border-gray-100 shadow-sm">
          <Info size={14} className="text-blue-600" /> 
          Найдено моделей: <span className="text-slate-900">{filteredProducts.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-1 space-y-10">
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm sticky top-28">
            <h3 className="flex items-center gap-3 font-black uppercase tracking-widest text-xs mb-8 text-slate-900">
              <SlidersHorizontal size={18} className="text-blue-600" /> Параметры подбора
            </h3>
            
            <div className="space-y-10">
              {/* Pitch Filter */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                  Шаг пикселя (P)
                </label>

                <div className="grid grid-cols-3 gap-2">
                  {availablePitches.map(p => (
                    <button
                      key={p}
                      onClick={() =>
                        setSelectedPitches(prev =>
                          prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
                        )
                      }
                      className={`px-2 py-2.5 text-[10px] font-black border rounded-xl transition-all ${
                        selectedPitches.includes(p)
                          ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20'
                          : 'bg-white border-gray-200 text-slate-500 hover:border-blue-400'
                      }`}
                    >
                      P{p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Purpose Filter */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Сфера применения</label>
                <div className="space-y-3">
                  {['Реклама', 'Образование', 'Сцена', 'Спорт', 'Конференц залы', 'Теле-студий'].map(p => (
                    <label key={p} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded-lg border-gray-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer" 
                        checked={selectedPurposes.includes(p)}
                        onChange={() => togglePurpose(p)}
                      />
                      <span className="text-xs font-bold text-slate-600 group-hover:text-blue-600 transition-colors uppercase tracking-widest">{p}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => { setSelectedPurposes([]); setSelectedPitches([]); setMaxPrice(50000000); }} 
                className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors border-t border-gray-100 mt-6"
              >
                Сбросить все фильтры
              </button>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1,2,3,4].map(i => (
                <div key={i} className="bg-white rounded-[2rem] p-6 space-y-4 border border-gray-100 shadow-sm">
                  <div className="h-64 bg-gray-50 animate-pulse rounded-2xl"></div>
                  <div className="h-8 bg-gray-50 animate-pulse rounded-full w-3/4"></div>
                  <div className="h-20 bg-gray-50 animate-pulse rounded-2xl"></div>
                </div>
              ))}
            </div>
          ) : backendError ? (
            <div className="bg-red-50 rounded-[2rem] p-16 text-center border border-red-100">
              <AlertTriangle size={48} className="text-red-500 mx-auto mb-6" />
              <h3 className="text-xl font-black text-red-900 mb-2 uppercase tracking-widest">Ошибка соединения</h3>
              <p className="text-red-600 mb-8 max-w-sm mx-auto font-medium">Не удалось получить данные из базы. Пожалуйста, убедитесь, что Go-сервер запущен.</p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-red-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-700 transition-all shadow-xl shadow-red-600/20"
              >
                Попробовать снова
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-gray-50 rounded-[2.5rem] p-20 text-center border-2 border-dashed border-gray-200">
              <Search size={48} className="text-slate-300 mx-auto mb-6" />
              <p className="text-slate-500 font-black uppercase tracking-widest text-sm mb-4">Ничего не найдено</p>
              <p className="text-slate-400 text-sm mb-8">Попробуйте изменить параметры фильтрации или выберите другой тип экрана.</p>
              <button 
                onClick={() => { setSelectedPurposes([]); setSelectedPitches([]); }} 
                className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-600 transition-all shadow-xl"
              >
                Показать все модели
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {filteredProducts.map(p => (
                <div 
                  key={p.id} 
                  onClick={() => navigate(`/catalog/${p.slug}`)}
                  className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group cursor-pointer"
                >
                  <div className="relative h-64 overflow-hidden">
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                        <ImageIcon size={64} />
                      </div>
                    )}
                    <div className="absolute top-6 left-6 flex gap-2">
                      <span className="bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-[10px] font-black text-slate-900 uppercase tracking-widest shadow-lg">
                        Шаг: P{p.pixelPitch}
                      </span>
                      {p.type === ScreenType.OUTDOOR && (
                        <span className="bg-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-widest shadow-lg shadow-blue-600/20">
                          IP65+
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-10">
                    <h3 className="text-2xl font-black mb-4 text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">{p.name}</h3>
                    <p className="text-slate-500 text-sm mb-8 line-clamp-2 font-medium leading-relaxed">
                      {p.shortDescription || "Профессиональный LED экран с высокими показателями яркости и контрастности для вашего бизнеса."}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-6 mb-8 text-[10px] font-black uppercase tracking-widest">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-slate-400">Яркость</span>
                        <span className="text-slate-900 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">{p.brightness} нит</span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className="text-slate-400">Частота</span>
                        <span className="text-slate-900 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">{p.refreshRate} Гц</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-8 border-t border-gray-100">
                      <div>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">Цена за м² от</p>
                        <p className="text-2xl font-black text-blue-600">
                          {p.priceFrom ? `${p.priceFrom.toLocaleString()} ₸` : 'По запросу'}
                        </p>
                      </div>
                      <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white group-hover:bg-blue-600 group-hover:shadow-xl group-hover:shadow-blue-600/30 transition-all">
                        <ChevronRight size={24} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};