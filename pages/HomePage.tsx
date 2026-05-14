import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Image as ImageIcon,
  Layers3,
  MonitorPlay,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Wrench,
  Zap,
} from 'lucide-react';
import { api } from '../services/api';
import { Case } from '../types';
import { LeadForm } from '../components/LeadForm';
import { Reveal } from '../components/Reveal';
import heroLedPanels from '../assets/hero-led-panels.png';
import partnerUnilumin from '../assets/partner-unilumin.png';
import partnerDahua from '../assets/partner-dahua.png';
import partnerAlstyle from '../assets/partner-alstyle.png';

const pickCaseImage = (images?: string[]) => (images ?? []).map((item) => item.trim()).find(Boolean);

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

const partners = [
  {
    name: 'Unilumin',
    href: 'https://www.unilumin.com/',
    logo: partnerUnilumin,
    logoClassName: 'h-10 w-auto',
  },
  {
    name: 'Dahua Security',
    href: 'https://www.dahuasecurity.com/ea',
    logo: partnerDahua,
    logoClassName: 'h-10 w-auto',
  },
  {
    name: 'AL-Style',
    href: 'https://al-style.kz',
    logo: partnerAlstyle,
    logoClassName: 'h-12 w-auto',
  },
] as const;

const heroHighlights = [
  { value: '3 года', label: 'гарантии на запуск и поддержку' },
  { value: '24/7', label: 'контроль яркости и работы экрана' },
  { value: '1 проект', label: 'одна команда от идеи до монтажа' },
];

export const HomePage: React.FC = () => {
  const [featuredCases, setFeaturedCases] = useState<Case[]>([]);
  const [error, setError] = useState(false);

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
    <div>
      <style>
        {`
          @keyframes heroFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
        `}
      </style>
      <section className="relative min-h-screen overflow-hidden bg-slate-950">
        <div className="absolute inset-0 z-0">
          <img src={heroLedPanels} alt="LED панели ARDI LED" className="h-full w-full object-cover object-center opacity-50" />
        </div>
        <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_72%_30%,rgba(59,130,246,0.26),transparent_28%),linear-gradient(90deg,rgba(2,6,23,0.96)_0%,rgba(2,6,23,0.84)_44%,rgba(2,6,23,0.46)_72%,rgba(2,6,23,0.18)_100%)]" />

        <div className="relative z-20 flex min-h-screen items-center">
          <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-4 pb-12 pt-28 sm:px-6 sm:pb-16 sm:pt-32 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.9fr)] lg:items-center lg:px-8 lg:pb-16 lg:pt-28">
            <Reveal className="max-w-3xl">
              <span className="mb-6 inline-block rounded-full border border-blue-500/30 bg-blue-500/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-300">
                LED-решения для бизнеса
              </span>

              <h1 className="mb-6 text-4xl font-extrabold leading-[0.95] text-white sm:text-5xl md:text-7xl">
                Инженерия визуальных решений для вашего <span className="text-blue-500">бизнеса</span>
              </h1>

              <p className="mb-8 max-w-xl text-base leading-relaxed text-slate-200 sm:mb-10 sm:text-xl">
                Проектируем, поставляем и устанавливаем LED-экраны для залов, ритейла, мероприятий и корпоративных площадок с понятным запуском и сервисом.
              </p>

              <div className="mb-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/cases"
                  className="flex items-center justify-center gap-3 rounded-2xl bg-blue-600 px-6 py-3.5 text-sm font-black uppercase tracking-widest text-white shadow-2xl shadow-blue-600/30 transition-all hover:bg-blue-700 active:scale-95 sm:px-8 sm:py-4 sm:text-base"
                >
                  Смотреть кейсы <ArrowRight size={20} />
                </Link>

                <button
                  onClick={scrollToLeads}
                  className="flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-black uppercase tracking-widest text-white backdrop-blur-md transition-all hover:bg-white/20 active:scale-95 sm:px-8 sm:py-4 sm:text-base"
                >
                  Получить расчет
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {heroHighlights.map((item) => (
                  <div key={item.value} className="rounded-[1.5rem] border border-white/10 bg-white/10 px-5 py-4 backdrop-blur-md">
                    <div className="text-2xl font-black text-white">{item.value}</div>
                    <div className="mt-2 text-sm leading-6 text-slate-300">{item.label}</div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal variant="right" delay={120} className="hidden lg:block">
              <div className="relative ml-auto max-w-[31rem]">
                <div className="absolute -right-10 top-8 h-44 w-44 rounded-full bg-blue-500/20 blur-3xl" />
                <div className="absolute right-16 top-1/2 h-32 w-32 rounded-full bg-fuchsia-500/20 blur-3xl" />

                <div className="grid gap-4">
                  <div
                    className="ml-auto max-w-[19rem] rounded-[1.6rem] border border-white/10 bg-slate-900/65 p-4 text-white shadow-[0_24px_80px_rgba(15,23,42,0.45)] backdrop-blur-xl"
                    style={{ animation: 'heroFloat 6s ease-in-out infinite' }}
                  >
                    <div className="mb-4 flex items-center gap-3 text-blue-300">
                      <Sparkles size={16} />
                      <span className="text-xs font-black uppercase tracking-[0.2em]">Визуальный эффект</span>
                    </div>
                    <h3 className="text-lg font-black leading-snug">Экран становится частью пространства, а не просто оборудованием.</h3>
                  </div>

                  <div className="grid grid-cols-[1.05fr_0.95fr] gap-4">
                    <div
                      className="rounded-[1.6rem] border border-white/10 bg-white/10 p-4 text-white backdrop-blur-xl"
                      style={{ animation: 'heroFloat 7s ease-in-out infinite', animationDelay: '0.8s' }}
                    >
                      <div className="mb-3 flex items-center gap-3 text-emerald-300">
                        <ShieldCheck size={16} />
                        <span className="text-xs font-black uppercase tracking-[0.2em]">Под контролем</span>
                      </div>
                      <p className="text-xs leading-6 text-slate-200">
                        Настройка, монтаж и запуск ведутся одной командой, поэтому проект не рассыпается между подрядчиками.
                      </p>
                    </div>

                    <div
                      className="rounded-[1.6rem] border border-white/10 bg-slate-900/70 p-4 text-white backdrop-blur-xl"
                      style={{ animation: 'heroFloat 6.5s ease-in-out infinite', animationDelay: '1.6s' }}
                    >
                      <div className="mb-3 flex items-center gap-3 text-fuchsia-300">
                        <PlayCircle size={16} />
                        <span className="text-xs font-black uppercase tracking-[0.2em]">Контент</span>
                      </div>
                      <p className="text-xs leading-6 text-slate-200">Показываем, как экран будет смотреться в живом сценарии еще до монтажа.</p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {error && (
        <div className="flex items-center justify-center gap-3 border-y border-red-100 bg-red-50 py-3 text-xs font-bold uppercase tracking-widest text-red-600">
          <AlertCircle size={16} />
          Внимание: база данных временно недоступна. Часть контента может не загрузиться.
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
          <Reveal className="max-w-3xl">
            <h2 className="mb-4 text-4xl font-black tracking-tight text-slate-900">Партнеры</h2>
            <p className="text-lg leading-8 text-slate-500">Работаем с брендами и поставщиками, на которых можно уверенно опираться в реальных проектах.</p>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {partners.map((partner, index) => (
              <Reveal key={partner.name} delay={index * 90}>
                <a
                  href={partner.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex min-h-36 items-center justify-center rounded-[2rem] border border-slate-200 bg-white px-6 py-8 shadow-[0_18px_50px_rgba(15,23,42,0.05)] transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_20px_60px_rgba(15,23,42,0.10)]"
                >
                  <img src={partner.logo} alt={partner.name} className={partner.logoClassName} loading="lazy" decoding="async" />
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-3xl">
              <h2 className="mb-4 text-4xl font-black tracking-tight text-slate-900">Свежие кейсы</h2>
              <p className="text-lg leading-8 text-slate-500">Несколько проектов, которые показывают, как экраны ведут себя в реальных залах, шоурумах и коммерческих пространствах.</p>
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
                        <img src={image} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" loading={index < 2 ? 'eager' : 'lazy'} />
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
                <p className="text-lg font-bold text-slate-500">Кейсы скоро появятся здесь. Сейчас можно оставить заявку, и мы подберем решение под ваш объект.</p>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-3xl">
            <h2 className="mb-4 text-4xl font-black tracking-tight text-slate-900">Как проходит проект</h2>
            <p className="text-lg leading-8 text-slate-500">Работаем короткими понятными этапами, чтобы вы видели прогресс, понимали бюджет и спокойно запускали объект без затяжек.</p>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {projectSteps.map((step, index) => (
              <Reveal key={step.title} delay={index * 90} className="rounded-[2rem] border border-slate-200 bg-white p-8">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-sm font-black text-white">{index + 1}</div>
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
