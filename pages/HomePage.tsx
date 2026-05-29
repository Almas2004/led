import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Image as ImageIcon,
  LayoutTemplate,
  MonitorPlay,
  ShieldCheck,
  Sparkles,
  Tv,
  Wrench,
} from 'lucide-react';
import { api } from '../services/api';
import { Case } from '../types';
import { LeadForm } from '../components/LeadForm';
import { Reveal } from '../components/Reveal';
import heroLedPanels from '../assets/hero-led-panels.png';
import partnerUnilumin from '../assets/partner-unilumin.png';
import partnerDahua from '../assets/partner-dahua.png';
import partnerAlstyle from '../assets/partner-alstyle.png';

const normalizeImages = (images?: string[]) => (images ?? []).map((item) => item.trim()).filter(Boolean);

const heroPoints = [
  'Интеграция в архитектуру',
  'Визуализация до монтажа',
  'Управление 24/7',
  'Полный цикл реализации',
];

const trustStats = [
  { value: '50+', label: 'проектов реализовано' },
  { value: '10 000+ м²', label: 'LED-экранов внедрено' },
  { value: 'до 30 дней', label: 'реализация проекта' },
  { value: '3 года', label: 'гарантии и сервиса' },
];

const applications = ['ТРЦ и ритейл', 'Конференц-залы', 'Event-площадки', 'Спортивные объекты', 'Корпоративные пространства'];

const processSteps = [
  'Анализ задач и проектирование',
  'Визуализация и расчёт',
  'Поставка оборудования',
  'Монтаж и интеграция',
  'Пуско-наладка',
  'Сервис и поддержка',
];

const advantages = [
  'Полный цикл без подрядчиков',
  'Инженерная экспертиза',
  'Контроль на каждом этапе',
  'Гарантия и сервис',
  'Реализация сложных проектов',
];

const services = [
  { title: 'LED-экраны для помещений', icon: Tv },
  { title: 'Уличные LED-экраны', icon: MonitorPlay },
  { title: 'Сценические LED-решения', icon: Sparkles },
  { title: 'Медиафасады', icon: LayoutTemplate },
  { title: 'AV и интеграционные решения', icon: Wrench },
];

const audiences = ['Девелоперы и ТРЦ', 'Event-агентства', 'Государственные заказчики', 'Бизнес-центры', 'Спортивные организации'];

const partnerLogos = [
  { name: 'Dahua Security', href: 'https://www.dahuasecurity.com/ea', logo: partnerDahua, className: 'h-10 w-auto' },
  { name: 'AL-Style', href: 'https://al-style.kz', logo: partnerAlstyle, className: 'h-14 w-auto' },
  { name: 'Unilumin', href: 'https://www.unilumin.com/', logo: partnerUnilumin, className: 'h-10 w-auto' },
] as const;

const HeroInsightCard: React.FC<{ title: string; text: string; icon: React.ElementType; delay?: string }> = ({ title, text, icon: Icon, delay = '0s' }) => (
  <div
    className="rounded-[1.5rem] border border-white/12 bg-slate-950/55 p-4 text-white shadow-[0_20px_80px_rgba(2,6,23,0.35)] backdrop-blur-xl"
    style={{ animation: `heroDrift 7s ease-in-out infinite`, animationDelay: delay }}
  >
    <div className="mb-3 flex items-center gap-3 text-blue-300">
      <Icon size={18} />
      <span className="text-[11px] font-black uppercase tracking-[0.18em]">{title}</span>
    </div>
    <p className="text-sm leading-6 text-slate-200">{text}</p>
  </div>
);

const CasePreviewImage: React.FC<{ images?: string[]; alt: string; eager?: boolean }> = ({ images, alt, eager = false }) => {
  const sources = useMemo(() => normalizeImages(images), [images]);
  const [index, setIndex] = useState(0);
  const src = sources[index];

  useEffect(() => {
    setIndex(0);
  }, [sources]);

  if (!src) {
    return (
      <div className="flex h-full w-full items-center justify-center text-slate-300">
        <ImageIcon size={42} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : 'auto'}
      decoding="async"
      onError={() => {
        if (index < sources.length - 1) {
          setIndex((current) => current + 1);
        }
      }}
      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
    />
  );
};

export const HomePage: React.FC = () => {
  const [featuredCases, setFeaturedCases] = useState<Case[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const cases = await api.getCases({ full: true, featured: true, limit: 3 });
        setFeaturedCases(cases.slice(0, 3));
        setError(false);
      } catch (e) {
        console.error('Failed to load featured cases', e);
        setError(true);
      }
    };

    loadData();
  }, []);

  const scrollToLeadForm = (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    event.preventDefault();
    const element = document.getElementById('lead-capture');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-slate-950">
      <style>
        {`
          @keyframes heroDrift {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
        `}
      </style>

      <section className="relative min-h-screen overflow-hidden border-b border-white/10 bg-slate-950">
        <div className="absolute inset-0">
          <img
            src={heroLedPanels}
            alt="LED-экраны ARDI LED"
            className="h-full w-full object-cover object-[74%_center] opacity-70"
          />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.96)_0%,rgba(2,6,23,0.9)_42%,rgba(2,6,23,0.42)_72%,rgba(2,6,23,0.22)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_28%,rgba(59,130,246,0.22),transparent_24%),radial-gradient(circle_at_82%_62%,rgba(147,51,234,0.18),transparent_18%)]" />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-4 pb-12 pt-28 sm:px-6 sm:pt-32 lg:px-8">
          <div className="grid w-full grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.02fr)_minmax(320px,0.82fr)] lg:items-center">
            <Reveal className="max-w-3xl">
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-blue-200">
                <Sparkles size={14} />
                Инженерия ярких решений
              </span>

              <h1 className="max-w-4xl text-4xl font-extrabold leading-[0.92] text-white sm:text-6xl lg:text-7xl">
                LED-экраны под ключ <br />
                для <span className="text-blue-500">бизнеса</span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-200 sm:text-xl">
                Проектируем, поставляем и внедряем LED-решения для ритейла, мероприятий и коммерческих пространств с
                гарантированным запуском и сервисом.
              </p>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-lg">
                Увеличивайте вовлечённость клиентов, усиливайте визуальное присутствие бренда и управляйте контентом в
                реальном времени.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={scrollToLeadForm}
                  className="inline-flex items-center justify-center gap-3 rounded-2xl bg-blue-600 px-6 py-4 text-sm font-black text-white shadow-[0_18px_60px_rgba(37,99,235,0.35)] transition-all hover:bg-blue-500 sm:px-7"
                >
                  Получить коммерческое предложение за 24 часа
                  <ArrowRight size={18} />
                </button>
                <Link
                  to="/contacts"
                  className="inline-flex items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/8 px-6 py-4 text-sm font-black text-white backdrop-blur-md transition-all hover:bg-white/14 sm:px-7"
                >
                  Рассчитать стоимость проекта
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {heroPoints.map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/6 px-4 py-3 backdrop-blur-md">
                    <CheckCircle2 size={18} className="text-blue-400" />
                    <span className="text-sm font-semibold text-slate-100">{item}</span>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal variant="right" delay={120} className="hidden lg:block">
              <div className="ml-auto max-w-[28rem] space-y-4">
                <HeroInsightCard
                  title="Под ключ"
                  text="Один подрядчик ведёт проект от концепции и расчёта до монтажа, запуска и последующего сервиса."
                  icon={ClipboardList}
                />
                <div className="grid grid-cols-2 gap-4">
                  <HeroInsightCard
                    title="Визуализация"
                    text="Показываем, как экран встроится в архитектуру и контентную логику объекта ещё до закупки."
                    icon={LayoutTemplate}
                    delay="0.6s"
                  />
                  <HeroInsightCard
                    title="Контроль"
                    text="Держим сроки, качество сборки и рабочий результат под постоянным инженерным контролем."
                    icon={ShieldCheck}
                    delay="1.2s"
                  />
                </div>
                <div className="rounded-[1.75rem] border border-white/12 bg-white/6 p-5 backdrop-blur-xl">
                  <div className="grid grid-cols-2 gap-4">
                    {trustStats.map((item) => (
                      <div key={item.label} className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
                        <div className="text-2xl font-black text-white">{item.value}</div>
                        <div className="mt-2 text-xs uppercase tracking-[0.12em] text-slate-300">{item.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {error && (
        <div className="border-y border-red-500/25 bg-red-500/10 py-3 text-center text-xs font-black uppercase tracking-[0.18em] text-red-200">
          <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 sm:px-6 lg:px-8">
            <AlertCircle size={16} />
            Часть данных временно недоступна. Витрина кейсов загрузится автоматически, как только восстановится база.
          </div>
        </div>
      )}

      <section className="border-b border-white/10 bg-slate-950 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="grid grid-cols-2 gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:grid-cols-4 md:p-8">
            {trustStats.map((item) => (
              <div key={item.label} className="border-white/10 md:border-r md:pr-6 last:md:border-r-0 last:md:pr-0">
                <div className="text-3xl font-black text-white">{item.value}</div>
                <div className="mt-2 text-sm leading-6 text-slate-300">{item.label}</div>
              </div>
            ))}
          </Reveal>

          <div className="mt-10">
            <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-300">Партнёры</p>
                <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">Работаем с брендами, на которые можно опираться в реальных проектах</h2>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:min-w-[44rem]">
                {partnerLogos.map((partner) => (
                  <a
                    key={partner.name}
                    href={partner.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex min-h-24 items-center justify-center rounded-[1.5rem] border border-white/10 bg-white px-6 py-5 transition-transform hover:-translate-y-1"
                  >
                    <img src={partner.logo} alt={partner.name} className={partner.className} loading="lazy" decoding="async" />
                  </a>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-3xl">
            <span className="text-sm font-black uppercase tracking-[0.18em] text-blue-600">Кейсы и доверие</span>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Реализованные проекты и опыт</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Мы внедряем LED-решения для коммерческих объектов, обеспечивая стабильную работу и предсказуемый результат.
            </p>
          </Reveal>

          <div className="mt-10 flex flex-wrap gap-3">
            {applications.map((item) => (
              <span key={item} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-700">
                {item}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/cases"
              className="inline-flex items-center justify-center gap-3 rounded-2xl bg-slate-950 px-6 py-4 text-sm font-black text-white transition-all hover:bg-blue-600"
            >
              Смотреть проекты
              <ArrowRight size={18} />
            </Link>
            <button
              onClick={scrollToLeadForm}
              className="inline-flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-black text-slate-950 transition-all hover:border-blue-200 hover:text-blue-600"
            >
              Запросить кейсы
            </button>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {featuredCases.length > 0 ? (
              featuredCases.map((item, index) => (
                <Reveal key={item.id} delay={index * 90} className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
                  <div className="relative h-80 overflow-hidden bg-slate-100">
                    <CasePreviewImage images={item.images} alt={item.title} eager={index === 0} />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/95 via-slate-950/55 to-transparent p-6">
                      <h3 className="text-2xl font-black text-white">{item.title}</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-sm leading-7 text-slate-600">{item.result || item.solution || item.task}</p>
                  </div>
                </Reveal>
              ))
            ) : (
              <Reveal className="lg:col-span-3 rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center">
                <p className="text-lg font-bold text-slate-500">Подборка кейсов появится здесь автоматически после синхронизации базы.</p>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-3xl">
            <span className="text-sm font-black uppercase tracking-[0.18em] text-blue-600">Процесс работы</span>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Как мы реализуем проекты</h2>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {processSteps.map((item, index) => (
              <Reveal key={item} delay={index * 70} className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-950 text-sm font-black text-white">{index + 1}</div>
                <h3 className="text-xl font-black text-slate-950">{item}</h3>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10 rounded-[2rem] border border-blue-100 bg-blue-50 p-8">
            <h3 className="text-2xl font-black text-slate-950">Результат</h3>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {['Готовое решение под ключ', 'Прозрачные сроки', 'Минимальные риски'].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-4">
                  <CheckCircle2 size={18} className="text-blue-600" />
                  <span className="text-sm font-bold text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.92fr)] lg:px-8">
          <Reveal>
            <span className="text-sm font-black uppercase tracking-[0.18em] text-blue-600">Почему мы</span>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Мы не продаём оборудование — мы внедряем систему</h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Работаем как инженерный партнёр: берём на себя архитектуру решения, координацию внедрения, качество монтажа и сервис после запуска.
            </p>
          </Reveal>

          <Reveal variant="right" delay={100}>
            <div className="grid gap-4">
              {advantages.map((item) => (
                <div key={item} className="flex items-center gap-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 px-5 py-5">
                  <CheckCircle2 size={18} className="text-blue-600" />
                  <span className="text-base font-bold text-slate-800">{item}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-slate-950 py-24 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-3xl">
            <span className="text-sm font-black uppercase tracking-[0.18em] text-blue-300">Услуги</span>
            <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Наши решения</h2>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-5">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Reveal key={service.title} delay={index * 70} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-300">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-lg font-black leading-7 text-white">{service.title}</h3>
                </Reveal>
              );
            })}
          </div>

          <div className="mt-8">
            <button
              onClick={scrollToLeadForm}
              className="inline-flex items-center gap-3 rounded-2xl bg-blue-600 px-6 py-4 text-sm font-black text-white transition-all hover:bg-blue-500"
            >
              Подобрать решение
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-3xl">
            <span className="text-sm font-black uppercase tracking-[0.18em] text-blue-600">Для кого</span>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Кому подойдут наши решения</h2>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {audiences.map((item, index) => (
              <Reveal key={item} delay={index * 60} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 px-5 py-8 text-center">
                <span className="text-lg font-black text-slate-900">{item}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="lead-capture" className="scroll-mt-24 bg-slate-50 py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(380px,0.88fr)] lg:items-start">
            <Reveal>
              <span className="text-sm font-black uppercase tracking-[0.18em] text-blue-600">Лидогенерация</span>
              <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Получите расчёт проекта</h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                Оставьте заявку — подготовим решение под ваш объект. Работаем по всему Казахстану, без обязательств и с понятным инженерным ответом.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {['Расчёт стоимости', 'Визуализацию', 'Подбор оборудования', 'Консультацию инженера'].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4">
                    <CheckCircle2 size={18} className="text-blue-600" />
                    <span className="text-sm font-bold text-slate-700">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-[1.75rem] border border-slate-200 bg-white p-6">
                <div className="text-3xl font-black text-slate-950">до 24 часов</div>
                <p className="mt-3 text-base leading-7 text-slate-600">Бесплатная консультация, без обязательств, с понятным следующим шагом по вашему объекту.</p>
              </div>
            </Reveal>

            <Reveal variant="right" delay={120}>
              <LeadForm id="home-form" title="Получить коммерческое предложение" source="home_landing" buttonText="Отправить заявку" />
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
};
