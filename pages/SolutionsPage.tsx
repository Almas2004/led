
import React, { useEffect, useState } from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import { Solution } from '../types';
import { LeadForm } from '../components/LeadForm';
import { Link } from "react-router-dom";

export const SolutionsPage: React.FC = () => {
  const [solutions, setSolutions] = useState<Solution[]>([]);

  useEffect(() => {
    api.getSolutions().then(setSolutions);
  }, []);

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-black text-slate-900 mb-4">Готовые решения</h1>
        <p className="text-slate-500 mb-12 max-w-3xl">
          Мы собрали самые популярные конфигурации экранов для типовых задач. <br/>
          Цена включает в себя полный комплект оборудования, монтаж и пуско-наладку.
        </p>

        {solutions.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-slate-400 font-bold">На данный момент решений нет. Добавьте их в админке.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {solutions.map(s => (
              <div key={s.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col md:flex-row">
                <div className="md:w-2/5 relative">
                  <img src={s.images[0]} className="w-full h-full object-cover" alt={s.name} />
                </div>
                <div className="md:w-3/5 p-8">
                  <h3 className="text-2xl font-bold mb-2">{s.name}</h3>
                  <div className="flex gap-4 text-xs font-bold text-blue-600 mb-6">
                    <span>{s.width}х{s.height}м</span>
                    <span>{s.area}м²</span>
                    <span>{s.pixelPitch}</span>
                  </div>
                  <ul className="space-y-2 mb-8">
                    {s.included.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                          <Check size={12} />
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase">Цена от</p>
                      <p className="text-2xl font-black text-slate-900">{s.priceFrom.toLocaleString()} ₸</p>
                    </div>
                    <Link
                      to="/contacts"
                      className="inline-flex bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors"
                    >
                      Заказать
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-24 bg-slate-900 rounded-3xl p-12 text-white relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-black mb-6">Не нашли подходящее решение?</h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                Мы разработаем индивидуальный проект под ваши требования и бюджет в течение 24 часов. 
                Учтем особенности помещения, освещенность и задачи контента.
              </p>
              <div className="flex items-center gap-6">
                 <div className="flex -space-x-3">
                   <img className="w-12 h-12 rounded-full border-4 border-slate-900" src="https://i.pravatar.cc/150?u=1" alt=""/>
                   <img className="w-12 h-12 rounded-full border-4 border-slate-900" src="https://i.pravatar.cc/150?u=2" alt=""/>
                   <img className="w-12 h-12 rounded-full border-4 border-slate-900" src="https://i.pravatar.cc/150?u=3" alt=""/>
                 </div>
                 <p className="text-sm font-bold text-slate-300">Наши инженеры уже в сети</p>
              </div>
            </div>
            <LeadForm title="Индивидуальный расчет" source="solutions_custom" />
          </div>
        </div>
      </div>
    </div>
  );
};
