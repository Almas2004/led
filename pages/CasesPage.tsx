import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock3, Image as ImageIcon, MapPin, Play, Quote, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { Case } from '../types';
import { LeadForm } from '../components/LeadForm';
import { Reveal } from '../components/Reveal';

const cardHeights = ['h-72', 'h-[28rem]', 'h-80', 'h-[32rem]'] as const;

const getCardHeight = (index: number, imageCount: number): string => {
  if (imageCount > 1) {
    return cardHeights[index % cardHeights.length];
  }

  return index % 2 === 0 ? 'h-80' : 'h-[26rem]';
};

export const CasesPage: React.FC = () => {
  const [cases, setCases] = useState<Case[]>([]);

  useEffect(() => {
    api.getCases().then(setCases);
  }, []);

  return (
    <div className="pt-28 pb-20 bg-white">
      <section className="pb-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-4xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-blue-600">
              <Sparkles size={14} />
              Реальные проекты
            </span>
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950">
              Кейсы в формате живой доски, как у Pinterest
            </h1>
            <p className="mt-6 max-w-3xl text-base sm:text-xl leading-8 text-slate-500">
              Здесь собраны проекты, где можно быстро почувствовать масштаб, посмотреть детали монтажа и понять,
              как LED-решения выглядят в реальной среде: от торговых залов и витрин до фасадов и сценических инсталляций.
            </p>
          </Reveal>
        </div>
      </section>

      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {cases.length === 0 ? (
            <Reveal className="rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-20 text-center">
              <p className="text-lg font-bold text-slate-500">Портфолио наполняется. Скоро здесь появятся новые проекты.</p>
            </Reveal>
          ) : (
            <div className="columns-1 md:columns-2 xl:columns-3 gap-6 [column-fill:_balance]">
              {cases.map((c, index) => {
                const previewImage = c.images?.[0];
                const secondaryImage = c.images?.[1];
                const cardHeight = getCardHeight(index, c.images?.length ?? 0);

                return (
                  <Reveal
                    key={c.id}
                    delay={index * 70}
                    className="mb-6 break-inside-avoid overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition-transform duration-300 hover:-translate-y-1"
                  >
                    <article className="overflow-hidden">
                      <div className={`relative ${cardHeight} overflow-hidden bg-slate-100`}>
                        {previewImage ? (
                          <img
                            src={previewImage}
                            alt={c.title}
                            className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-slate-300">
                            <ImageIcon size={52} />
                          </div>
                        )}

                        <div className="absolute inset-x-0 top-0 flex flex-wrap gap-2 p-4">
                          <span className="inline-flex items-center gap-1 rounded-full bg-white/92 px-3 py-1.5 text-xs font-bold text-slate-900 shadow-sm backdrop-blur">
                            <MapPin size={12} className="text-blue-600" />
                            {c.city}
                          </span>
                          <span className="rounded-full bg-slate-950/88 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
                            {c.industry}
                          </span>
                        </div>

                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent p-5 text-white">
                          <h2 className="text-2xl font-black leading-tight sm:text-[2rem]">{c.title}</h2>
                          <p className="mt-2 max-w-xl text-sm leading-6 text-white/82">{c.result || c.task}</p>
                        </div>
                      </div>

                      <div className="space-y-5 p-5 sm:p-6">
                        <div className="flex flex-wrap gap-2 text-xs font-bold text-slate-500">
                          {c.specs?.slice(0, 3).map((spec) => (
                            <span key={spec} className="rounded-full bg-slate-100 px-3 py-1.5">
                              {spec}
                            </span>
                          ))}
                          {c.duration > 0 && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1.5 text-blue-700">
                              <Clock3 size={12} />
                              {c.duration} дн.
                            </span>
                          )}
                        </div>

                        <div className="space-y-3">
                          <div>
                            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">Задача</p>
                            <p className="mt-1 text-sm leading-6 text-slate-600">{c.task}</p>
                          </div>
                          <div>
                            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">Решение</p>
                            <p className="mt-1 text-sm leading-6 text-slate-950">{c.solution}</p>
                          </div>
                        </div>

                        {secondaryImage && (
                          <div className="overflow-hidden rounded-2xl bg-slate-100">
                            <img src={secondaryImage} alt={`${c.title} - деталь проекта`} className="h-44 w-full object-cover" />
                          </div>
                        )}

                        {c.testimonial && (
                          <div className="rounded-2xl bg-slate-50 p-4">
                            <div className="mb-2 flex items-center gap-2 text-slate-400">
                              <Quote size={16} />
                              <span className="text-[11px] font-black uppercase tracking-[0.18em]">Отзыв</span>
                            </div>
                            <p className="text-sm leading-6 text-slate-600">{c.testimonial}</p>
                          </div>
                        )}

                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                          <Link
                            to="/contacts"
                            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-3 text-sm font-black text-white transition-colors hover:bg-blue-700"
                          >
                            Обсудить похожий проект
                            <ArrowRight size={16} />
                          </Link>

                          {c.videoUrl ? (
                            <a
                              href={c.videoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 transition-colors hover:text-blue-600"
                            >
                              <Play size={16} />
                              Смотреть видео
                            </a>
                          ) : (
                            <span className="text-sm font-bold text-slate-400">Монтаж и запуск под ключ</span>
                          )}
                        </div>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <LeadForm title="Обсудить ваш проект" source="cases_bottom" buttonText="Оставить заявку" />
          </Reveal>
        </div>
      </section>
    </div>
  );
};
