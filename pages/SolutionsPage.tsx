import React, { useEffect, useMemo, useState } from 'react';
import { Check, ChevronDown, ChevronUp, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LeadForm } from '../components/LeadForm';
import { Reveal } from '../components/Reveal';
import { api } from '../services/api';
import { Solution } from '../types';

const shouldHideIncludedItem = (item: string) => item.trim().toLowerCase().includes('монтаж');

export const SolutionsPage: React.FC = () => {
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    api.getSolutions().then(setSolutions);
  }, []);

  const preparedSolutions = useMemo(
    () =>
      solutions.map((solution) => ({
        ...solution,
        includedForCard: (solution.included ?? []).filter((item) => !shouldHideIncludedItem(item)),
      })),
    [solutions],
  );

  const toggleExpanded = (id: string) => {
    setExpandedIds((current) => ({ ...current, [id]: !current[id] }));
  };

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <h1 className="text-4xl font-black text-slate-900 mb-4">Готовые решения</h1>
          <p className="text-slate-500 mb-12 max-w-3xl">
            Мы собрали самые популярные конфигурации экранов для типовых задач. <br />
            Цена включает в себя полный комплект оборудования и пуско-наладку.
          </p>
        </Reveal>

        {preparedSolutions.length === 0 ? (
          <Reveal>
            <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <p className="text-slate-400 font-bold">На данный момент решений нет. Добавьте их в админке.</p>
            </div>
          </Reveal>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {preparedSolutions.map((s, index) => {
              const isExpanded = Boolean(expandedIds[s.id]);
              return (
                <Reveal
                  key={s.id}
                  delay={index * 90}
                  className="hover-lift bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col md:flex-row"
                >
                  <div className="md:w-2/5 relative min-h-[240px]">
                    {s.images?.[0] ? (
                      <img src={s.images[0]} className="w-full h-full object-cover" alt={s.name} />
                    ) : (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                        <ImageIcon size={48} />
                      </div>
                    )}
                  </div>
                  <div className="md:w-3/5 p-8 flex flex-col">
                    <h3 className="text-2xl font-bold mb-2">{s.name}</h3>
                    <div className="flex flex-wrap gap-4 text-xs font-bold text-blue-600 mb-4">
                      <span>{s.width}х{s.height}м</span>
                      <span>{s.area}м²</span>
                      <span>{s.pixelPitch}</span>
                    </div>

                    {s.shortDescription && (
                      <p className="text-sm text-slate-600 leading-relaxed mb-5">{s.shortDescription}</p>
                    )}

                    {s.includedForCard.length > 0 && (
                      <ul className="space-y-2 mb-5">
                        {s.includedForCard.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center text-green-600 shrink-0">
                              <Check size={12} />
                            </div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}

                    {s.fullDescription && (
                      <div className="mb-6">
                        <button
                          type="button"
                          onClick={() => toggleExpanded(s.id)}
                          className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          {isExpanded ? 'Скрыть подробности' : 'Подробнее'}
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        <div
                          className={`grid transition-all duration-300 ease-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0'}`}
                        >
                          <div className="overflow-hidden">
                            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 text-sm leading-relaxed text-slate-600 whitespace-pre-line">
                              {s.fullDescription}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-end justify-between mt-auto gap-4">
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
                </Reveal>
              );
            })}
          </div>
        )}

        <Reveal className="mt-16 sm:mt-24 bg-slate-900 rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-12 text-white relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-w-0">
            <div className="min-w-0 text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-black mb-5 sm:mb-6 leading-tight break-words">Не нашли подходящее решение?</h2>
              <p className="text-sm sm:text-base text-slate-400 mb-7 sm:mb-8 leading-relaxed">
                Мы разработаем индивидуальный проект под ваши требования и бюджет в течение 24 часов.
                Учтем особенности помещения, освещенность и задачи контента.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4 sm:gap-6">
                <div className="flex -space-x-3 shrink-0">
                  <img className="w-12 h-12 rounded-full border-4 border-slate-900" src="https://i.pravatar.cc/150?u=1" alt="" />
                  <img className="w-12 h-12 rounded-full border-4 border-slate-900" src="https://i.pravatar.cc/150?u=2" alt="" />
                  <img className="w-12 h-12 rounded-full border-4 border-slate-900" src="https://i.pravatar.cc/150?u=3" alt="" />
                </div>
                <p className="text-sm font-bold text-slate-300 leading-snug max-w-56">Наши инженеры уже в сети</p>
              </div>
            </div>
            <LeadForm title="Индивидуальный расчет" source="solutions_custom" />
          </div>
        </Reveal>
      </div>
    </div>
  );
};
