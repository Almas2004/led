import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// Fixed: Added Image as ImageIcon to lucide-react imports
import { ArrowRight, ShieldCheck, Zap, Cog, Smartphone, ChevronRight, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { api } from '../services/api';
import { Product, Solution, Case, ScreenType } from '../types';
import { LeadForm } from '../components/LeadForm';
import { FAQ_ITEMS } from '../constants';

export const HomePage: React.FC = () => {
  const [featuredSolutions, setFeaturedSolutions] = useState<Solution[]>([]);
  const [featuredCases, setFeaturedCases] = useState<Case[]>([]);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const solutions = await api.getSolutions();
        const cases = await api.getCases();
        setFeaturedSolutions(solutions.filter(s => s.isFeatured).slice(0, 4));
        setFeaturedCases(cases.filter(c => c.isFeatured).slice(0, 4));
        setError(false);
      } catch (e) {
        console.error("Failed to load featured data", e);
        setError(true);
      }
    };
    loadData();
  }, []);

  const scrollToLeads = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('leads-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section
  className="
    relative flex items-center
    min-h-[85vh] h-auto
    py-12 sm:py-16 lg:py-0
    overflow-x-hidden bg-slate-900
  "
>
  {/* BACKGROUND IMAGE */}
  <div className="absolute inset-0 z-0">
    <img
      src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=2070"
      alt="LED Background"
      className="w-full h-full object-cover opacity-40"
    />
  </div>

  {/* OVERLAY GRADIENT */}
  <div className="absolute inset-0 z-10 bg-gradient-to-l from-slate-900 via-slate-900/80 to-transparent" />

  {/* CONTENT */}
  <div className="relative z-20 w-full">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <span className="inline-block px-4 py-1.5 bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-full text-xs font-bold tracking-widest uppercase mb-6 animate-pulse">
          №1 в Казахстане по LED технологиям
        </span>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
          Инженерия визуальных решений для вашего{" "}
          <span className="text-blue-500">Бизнеса</span>
        </h1>

        <p className="text-base sm:text-xl text-slate-300 mb-8 sm:mb-10 leading-relaxed max-w-lg">
          Проектируем, поставляем и устанавливаем LED-экраны любой сложности с гарантией 3 года.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 pb-2">
          <Link
            to="/catalog"
            className="bg-blue-600 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-2xl text-base sm:text-lg font-black uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-blue-600/30 active:scale-95"
          >
            Смотреть каталог <ArrowRight size={20} />
          </Link>

          <button
            onClick={scrollToLeads}
            className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 sm:px-10 py-4 sm:py-5 rounded-2xl text-base sm:text-lg font-black uppercase tracking-widest hover:bg-white/20 transition-all flex items-center justify-center active:scale-95"
          >
            Получить расчет
          </button>
        </div>
      </div>
    </div>
  </div>
</section>
          

      {/* Connection Error Message */}
      {error && (
        <div className="bg-red-50 border-y border-red-100 py-3 flex items-center justify-center gap-3 text-red-600 text-xs font-bold uppercase tracking-widest">
          <AlertCircle size={16} /> 
          Внимание: Нет связи с сервером базы данных. Контент может быть неактуален.
        </div>
      )}

      {/* Featured Solutions */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl font-black text-slate-900 mb-4 uppercase tracking-tight">Готовые решения</h2>
              <p className="text-slate-500 font-medium">Оптимальные пакеты под типовые задачи с фиксированной ценой.</p>
            </div>
            <Link to="/solutions" className="hidden sm:flex items-center gap-2 text-blue-600 font-black uppercase tracking-widest text-xs hover:gap-4 transition-all group">
              Все решения <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredSolutions.length > 0 ? featuredSolutions.map(s => (
              <div key={s.id} className="bg-gray-50 rounded-[2.5rem] overflow-hidden border border-gray-100 hover:shadow-2xl transition-all group">
                <div className="relative h-56">
                  {s.images?.[0] ? (
                    <img src={s.images[0]} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">
                      <ImageIcon size={48} />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20">
                      {s.type === ScreenType.INDOOR ? 'Indoor' : 'Outdoor'}
                    </span>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-black mb-3 text-slate-900 leading-tight">{s.name}</h3>
                  <div className="flex items-center gap-4 text-xs font-bold text-slate-400 mb-6">
                    <span>{s.width}х{s.height}м</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span>P{s.pixelPitch}</span>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-100">
                    <div>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Цена пакета от</p>
                      <p className="text-2xl font-black text-blue-600">{s.priceFrom.toLocaleString()} ₸</p>
                    </div>
                    <Link to="/solutions" className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-blue-600 transition-all shadow-lg active:scale-90">
                      <ArrowRight size={20} />
                    </Link>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-24 text-center bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
                <div className="flex flex-col items-center gap-6 opacity-30">
                  <Smartphone size={48} />
                  <p className="text-slate-500 font-black uppercase tracking-widest text-sm">Добавьте решения в админ-панели</p>
                </div>
              </div>
            )}
          </div>
          <div className="mt-12 sm:hidden">
             <Link to="/solutions" className="block w-full text-center py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs">
               Смотреть все решения
             </Link>
          </div>
        </div>
      </section>

      {/* Lead Capture Section */}
      <section id="leads-section" className="py-32 bg-slate-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
              <span className="text-blue-600 font-black uppercase tracking-widest text-xs mb-4 block">Бесплатная консультация</span>
              <h2 className="text-5xl font-black text-slate-900 mb-8 leading-tight">Готовы обсудить ваш проект?</h2>
              <p className="text-xl text-slate-500 mb-12 font-medium">Оставьте заявку, и мы бесплатно подготовим коммерческое предложение с расчетом окупаемости для вашего бизнеса.</p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-5 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-lg">
                  <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 flex-shrink-0">
                    <ShieldCheck size={28} />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 uppercase text-sm tracking-tight mb-1">Гарантия качества 3 года</h4>
                    <p className="text-xs text-slate-500 font-medium">Официальный договор и сервисное обслуживание.</p>
                  </div>
                </div>
                <div className="flex items-center gap-5 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-lg">
                  <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 flex-shrink-0">
                    <Zap size={28} />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 uppercase text-sm tracking-tight mb-1">Быстрая установка</h4>
                    <p className="text-xs text-slate-500 font-medium">Срок реализации проекта от 15 рабочих дней.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-blue-600/5 rounded-[3rem] -z-10 blur-2xl"></div>
              <LeadForm id="home-form" title="Расчет стоимости за 15 минут" source="home_bottom" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};