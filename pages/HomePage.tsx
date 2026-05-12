import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowRight, CheckCircle2, Image as ImageIcon, Layers3, MonitorPlay, ShieldCheck, Wrench, Zap } from 'lucide-react';
import { api } from '../services/api';
import { Case } from '../types';
import { LeadForm } from '../components/LeadForm';
import { Reveal } from '../components/Reveal';
import heroLedPanels from '../assets/hero-led-panels.png';

const pickCaseImage = (images?: string[]) => {
  return (images ?? []).map((item) => item.trim()).find(Boolean);
};

const expertiseItems = [
  {
    title: 'Проектирование под задачу',
    text: 'Подбираем формат экрана, шаг пикселя, яркость и конструктив под ваш объект, а не по шаблону.',
    icon: Layers3,
  },
  {
    title: 'Монтаж и запуск',
    text: 'Берем на себя сборку, настройку, пусконаладку и подготовку экрана к реальной эксплуатации.',
    icon: Wrench,
  },
  {
    title: 'Контент и управление',
    text: 'Подсказываем, как организовать показ, чтобы экран работал на продажи, навигацию и внимание.',
    icon: MonitorPlay,
  },
];

const projectSteps = [
  {
    title: 'Бриф и замер',
    text: 'Уточняем задачу, площадку и формат использования, чтобы сразу считать правильную конфигурацию.',
  },
  {
    title: 'Предложение и визуализация',
    text: 'Показываем, как экран будет выглядеть в вашем пространстве, и считаем бюджет без лишнего шума.',
  },
  {
    title: 'Поставка, монтаж, сопровождение',
    text: 'Доводим проект до запуска и остаемся рядом, если понадобится настройка, сервис или расширение системы.',
  },
];

export const HomePage: React.FC = () => {
  const [featuredCases, setFeaturedCases] = useState<Case[]>([]);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const cases = await api.getCases({ full: true, featured: true, limit: 4 });
        setFeaturedCases(cases.slice(0, 4));
        setError(false);
      } catch (e) {
        console.error('Failed to load featured data', e);
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
      <section className="relative flex min-h-[85vh] items-center overflow-x-hidden bg-slate-900 py-12 sm:py-16 lg:py-0">
        <div className="absolute inset-0 z-0">
          <img src={heroLedPanels} alt="LED Background" className="h-full w-full object-cover opacity-40" />
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-l from-slate-900 via-slate-900/80 to-transparent" />

        <div className="relative z-20 w-full">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal className="max-w-2xl">
              <span className="mb-6 inline-block rounded-full border border-blue-600/30 bg-blue-600/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-400">
                LED-решения для бизнеса
              </span>

              <h1 className="mb-6 text-4xl font-extrabold leading-tight text-white sm:text-5xl md:text-7xl">
                Инженерия визуальных решений для вашего <span className="text-blue-500">бизнеса</span>
              </h1>

              <p className="mb-8 max-w-lg text-base leading-relaxed text-slate-300 sm:mb-10 sm:text-xl">
                Проектируем, поставляем и устанавливаем LED-экраны для залов, ритейла, мероприятий и корпоративных площадок с понятным запуском и сервисом.
              </p>

              <div className="flex flex-col gap-4 pb-2 sm:flex-row">
                <Link
                  to="/cases"
                  className="flex items-center justify-center gap-3 rounded-2xl bg-blue-600 px-8 py-4 text-base font-black uppercase tracking-widest text-white shadow-2xl shadow-blue-600/30 transition-all hover:bg-blue-700 active:scale-95 sm:px-10 sm:py-5 sm:text-lg"
                >
                  Смотреть кейсы <ArrowRight size={20} />
                </Link>

                <button
                  onClick={scrollToLeads}
                  className="flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-8 py-4 text-base font-black uppercase tracking-widest text-white backdrop-blur-md transition-all hover:bg-white/20 active:scale-95 sm:px-10 sm:py-5 sm:text-lg"
                >
                  Получить расчет
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {error && (
        <div className="flex items-center justify-center gap-3 border-y border-red-100 bg-red-50 py-3 text-xs font-bold uppercase tracking-widest text-red-600">
          <AlertCircle size={16} />
          Внимание: нет связи с сервером базы данных. Контент может быть неактуален.
        </div>
      )}

      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-3xl">
            <h2 className="mb-4 text-4xl font-black tracking-tight text-slate-900">Что мы делаем</h2>
            <p className="text-lg leading-8 text-slate-500">
              Мы помогаем запускать LED-системы так, чтобы они были красивыми в кадре, устойчивыми в работе и понятными в ежедневном использовании.
            </p>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {expertiseItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Reveal key={item.title} delay={index * 90} className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                    <Icon size={28} />
                  </div>
                  <h3 className="mb-3 text-2xl font-black text-slate-900">{item.title}</h3>
                  <p className="text-sm leading-7 text-slate-600">{item.text}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-3xl">
              <h2 className="mb-4 text-4xl font-black tracking-tight text-slate-900">Свежие кейсы</h2>
              <p className="text-lg leading-8 text-slate-500">
                Несколько проектов, которые показывают, как экраны ведут себя в реальных залах, шоурумах и коммерческих пространствах.
              </p>
            </div>
            <Link to="/cases" className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-blue-600 transition-all hover:gap-3">
              Все кейсы <ArrowRight size={18} />
            </Link>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
            {featuredCases.length > 0 ? (
              featuredCases.map((item, index) => {
                const image = pickCaseImage(item.images);

                return (
                  <Reveal key={item.id} delay={index * 80} className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
                    <div className="relative h-72 overflow-hidden bg-slate-100">
                      {image ? (
                        <img src={image} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-300">
                          <ImageIcon size={48} />
                        </div>
                      )}
                    </div>
                    <div className="space-y-4 p-6">
                      <h3 className="text-2xl font-black leading-tight text-slate-900">{item.title}</h3>
                      <p className="text-sm leading-7 text-slate-600">{item.result || item.solution || item.task}</p>
                      <Link
                        to="/contacts"
                        className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-3 text-sm font-black text-white transition-colors hover:bg-blue-600"
                      >
                        Хочу похожий проект
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </Reveal>
                );
              })
            ) : (
              <Reveal className="col-span-full rounded-[2rem] border-2 border-dashed border-slate-200 bg-white px-6 py-16 text-center">
                <p className="text-lg font-bold text-slate-500">Кейсы скоро появятся здесь. Сейчас можно оставить заявку и мы подберем решение под ваш объект.</p>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-3xl">
            <h2 className="mb-4 text-4xl font-black tracking-tight text-slate-900">Как проходит проект</h2>
            <p className="text-lg leading-8 text-slate-500">
              Работаем короткими понятными этапами, чтобы вы видели прогресс, понимали бюджет и спокойно запускали объект без затяжек.
            </p>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {projectSteps.map((step, index) => (
              <Reveal key={step.title} delay={index * 90} className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-sm font-black text-white">
                  {index + 1}
                </div>
                <h3 className="mb-3 text-2xl font-black text-slate-900">{step.title}</h3>
                <p className="text-sm leading-7 text-slate-600">{step.text}</p>
                <div className="mt-6 flex items-center gap-2 text-sm font-bold text-slate-500">
                  <CheckCircle2 size={16} className="text-blue-600" />
                  Понятный следующий шаг на каждом этапе
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="leads-section" className="scroll-mt-20 bg-slate-50 py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-24 lg:grid-cols-2">
            <Reveal>
              <div>
                <span className="mb-4 block text-xs font-black uppercase tracking-widest text-blue-600">Бесплатная консультация</span>
                <h2 className="mb-8 text-5xl font-black leading-tight text-slate-900">Готовы обсудить ваш проект?</h2>
                <p className="mb-12 text-xl font-medium text-slate-500">
                  Оставьте заявку, и мы подготовим предложение с конфигурацией, сроками и понятным сценарием запуска под вашу площадку.
                </p>

                <div className="space-y-6">
                  <Reveal className="hover-lift flex items-center gap-5 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-lg">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                      <ShieldCheck size={28} />
                    </div>
                    <div>
                      <h4 className="mb-1 text-sm font-black uppercase tracking-tight text-slate-900">Гарантия качества 3 года</h4>
                      <p className="text-xs font-medium text-slate-500">Официальный договор, понятные обязательства и сопровождение после запуска.</p>
                    </div>
                  </Reveal>

                  <Reveal delay={120} className="hover-lift flex items-center gap-5 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-lg">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-green-100 text-green-600">
                      <Zap size={28} />
                    </div>
                    <div>
                      <h4 className="mb-1 text-sm font-black uppercase tracking-tight text-slate-900">Быстрый запуск объекта</h4>
                      <p className="text-xs font-medium text-slate-500">Подскажем оптимальную конфигурацию и соберем рабочий план без лишних итераций.</p>
                    </div>
                  </Reveal>
                </div>
              </div>
            </Reveal>

            <Reveal variant="right" delay={120} className="relative">
              <div className="absolute -inset-4 -z-10 rounded-[3rem] bg-blue-600/5 blur-2xl"></div>
              <LeadForm id="home-form" title="Расчет стоимости за 15 минут" source="home_bottom" />
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
};
