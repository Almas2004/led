import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Image as ImageIcon, Play, Quote } from 'lucide-react';
import { api } from '../services/api';
import { Case } from '../types';
import { LeadForm } from '../components/LeadForm';
import { Reveal } from '../components/Reveal';

const cardHeights = ['h-[24rem]', 'h-[30rem]', 'h-[26rem]', 'h-[34rem]'] as const;

const getCardHeight = (index: number, imageCount: number): string => {
  if (imageCount > 1) {
    return cardHeights[index % cardHeights.length];
  }

  return index % 2 === 0 ? 'h-[28rem]' : 'h-[24rem]';
};

const pickCaseImages = (images: string[] | undefined) => {
  const validImages = (images ?? []).map((item) => item.trim()).filter(Boolean);
  return {
    previewImage: validImages[0],
    secondaryImage: validImages[1],
  };
};

const CaseImage: React.FC<{
  src?: string;
  alt: string;
  className: string;
  eager?: boolean;
}> = ({ src, alt, className, eager = false }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
  }, [src]);

  if (!src) {
    return (
      <div className="flex h-full w-full items-center justify-center text-slate-300">
        <ImageIcon size={52} />
      </div>
    );
  }

  return (
    <>
      <div
        className={`absolute inset-0 bg-slate-200 transition-opacity duration-500 ${
          loaded ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="h-full w-full animate-pulse bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200" />
      </div>
      <img
        src={src}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : 'auto'}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        className={`${className} transition-all duration-700 ${loaded ? 'scale-100 opacity-100' : 'scale-[1.02] opacity-0'}`}
      />
    </>
  );
};

export const CasesPage: React.FC = () => {
  const [cases, setCases] = useState<Case[]>([]);

  useEffect(() => {
    api.getCases({ full: true, limit: 60, page: 1 }).then(setCases);
  }, []);

  return (
    <div className="bg-white pb-20 pt-28">
      <section className="pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-3xl">
            <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">Кейсы</h1>
            <p className="mt-5 text-base leading-8 text-slate-500 sm:text-lg">
              Подборка реализованных проектов с крупными визуалами, деталями монтажа и тем, как экраны живут в реальном
              пространстве.
            </p>
          </Reveal>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {cases.length === 0 ? (
            <Reveal className="rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-20 text-center">
              <p className="text-lg font-bold text-slate-500">Портфолио наполняется. Скоро здесь появятся новые проекты.</p>
            </Reveal>
          ) : (
            <div className="columns-1 gap-6 md:columns-2 xl:columns-3 [column-fill:_balance]">
              {cases.map((c, index) => {
                const { previewImage, secondaryImage } = pickCaseImages(c.images);
                const cardHeight = getCardHeight(index, c.images?.length ?? 0);
                const eagerImage = index < 3;

                return (
                  <Reveal
                    key={c.id}
                    delay={index * 70}
                    className="mb-6 break-inside-avoid overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.10)] transition-transform duration-300 hover:-translate-y-1"
                  >
                    <article className="overflow-hidden">
                      <div className={`relative ${cardHeight} overflow-hidden bg-slate-100`}>
                        <CaseImage
                          src={previewImage}
                          alt={c.title}
                          eager={eagerImage}
                          className="h-full w-full object-cover hover:scale-105"
                        />

                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent p-5 text-white sm:p-6">
                          <h2 className="text-2xl font-black leading-tight sm:text-3xl">{c.title}</h2>
                        </div>
                      </div>

                      <div className="space-y-5 p-5 sm:p-6">
                        <p className="text-sm leading-7 text-slate-600">{c.result || c.solution || c.task}</p>

                        {secondaryImage && (
                          <div className="relative overflow-hidden rounded-[1.5rem] bg-slate-100">
                            <CaseImage src={secondaryImage} alt={c.title} className="h-48 w-full object-cover" />
                          </div>
                        )}

                        {c.testimonial && (
                          <div className="rounded-[1.5rem] bg-slate-50 p-4 sm:p-5">
                            <div className="mb-3 flex items-center gap-2 text-slate-400">
                              <Quote size={16} />
                              <span className="text-[11px] font-black uppercase tracking-[0.18em]">Отзыв</span>
                            </div>
                            <p className="text-sm leading-6 text-slate-600">{c.testimonial}</p>
                          </div>
                        )}

                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                          <Link
                            to="/contacts"
                            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-3 text-sm font-black text-white transition-colors hover:bg-blue-600"
                          >
                            Хочу похожий проект
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
                              Видео
                            </a>
                          ) : (
                            <span className="text-sm font-bold text-slate-400">Под ключ</span>
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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <LeadForm title="Обсудить ваш проект" source="cases_bottom" buttonText="Оставить заявку" />
          </Reveal>
        </div>
      </section>
    </div>
  );
};
