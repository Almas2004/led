
import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Case } from '../types';
import { LeadForm } from '../components/LeadForm';
import { MapPin, ArrowRight } from 'lucide-react';
import { Link } from "react-router-dom";

export const CasesPage: React.FC = () => {
  const [cases, setCases] = useState<Case[]>([]);

  useEffect(() => {
    api.getCases().then(setCases);
  }, []);

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-black text-slate-900 mb-4">Наши проекты</h1>
        <p className="text-slate-500 mb-12 max-w-3xl">
          Смотрите примеры реализованных проектов по всему Казахстану. <br/>
          Мы устанавливаем LED экраны любой сложности — от компактных витрин до масштабных медиафасадов.
        </p>

        {cases.length === 0 ? (
          <div className="text-center py-24 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-slate-400 font-bold mb-4">Портфолио наполняется. Зайдите позже или посмотрите каталог.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {cases.map(c => (
              <div key={c.id} className="group relative bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500">
                <div className="h-80 relative overflow-hidden">
                  <img src={c.images[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={c.title} />
                  <div className="absolute top-6 left-6 flex gap-2">
                    <span className="bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-xs font-bold text-slate-900 flex items-center gap-1 shadow-sm">
                      <MapPin size={12} className="text-blue-600" /> {c.city}
                    </span>
                    <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-sm">
                      {c.industry}
                    </span>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-blue-600 transition-colors">{c.title}</h3>
                  <p className="text-slate-500 text-sm mb-8 line-clamp-3">{c.task}</p>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border-2 border-white text-[10px] font-bold">LED</div>
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center border-2 border-white text-[10px] font-bold">PRO</div>
                    </div>
                    <Link
                      to="/contacts"
                      className="text-blue-600 font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all"
                    >
                      Хочу так же <ArrowRight size={16} />
                    </Link>

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-20">
          <LeadForm title="Обсудить ваш проект" source="cases_bottom" buttonText="Оставить заявку" />
        </div>
      </div>
    </div>
  );
};
