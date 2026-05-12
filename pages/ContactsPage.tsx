import React from 'react';
import { Clock, Mail, MessageCircle, Phone } from 'lucide-react';
import { CONTACTS } from '../constants';
import { LeadForm } from '../components/LeadForm';
import { Reveal } from '../components/Reveal';

export const ContactsPage: React.FC = () => {
  return (
    <div className="pb-20 pt-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <h1 className="mb-4 text-4xl font-black text-slate-900">Контакты</h1>
          <p className="mb-12 max-w-2xl text-slate-500">
            Свяжитесь с нами удобным способом. Поможем с выбором экрана, конфигурацией проекта, сроками и расчетом под ваш объект.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          <div className="space-y-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <Reveal className="hover-lift rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <Phone size={24} />
                </div>
                <h4 className="mb-2 font-bold">Телефон</h4>
                <a href={`tel:+${CONTACTS.phoneHref}`} className="text-slate-600 transition-colors hover:text-blue-600">
                  {CONTACTS.phone}
                </a>
              </Reveal>

              <Reveal delay={80} className="hover-lift rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
                  <MessageCircle size={24} />
                </div>
                <h4 className="mb-2 font-bold">WhatsApp</h4>
                <a href={CONTACTS.whatsappUrl} target="_blank" rel="noreferrer" className="text-slate-600 transition-colors hover:text-green-600">
                  Написать в WhatsApp
                </a>
              </Reveal>

              <Reveal delay={160} className="hover-lift rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                  <Mail size={24} />
                </div>
                <h4 className="mb-2 font-bold">Email</h4>
                <a href={`mailto:${CONTACTS.email}`} className="text-slate-600 transition-colors hover:text-purple-600">
                  {CONTACTS.email}
                </a>
              </Reveal>

              <Reveal delay={240} className="hover-lift rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                  <Clock size={24} />
                </div>
                <h4 className="mb-2 font-bold">Режим работы</h4>
                <p className="text-sm leading-relaxed text-slate-600">{CONTACTS.schedule}</p>
              </Reveal>
            </div>

            <Reveal className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
              <h5 className="mb-3 font-bold text-blue-900">Как мы помогаем</h5>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Подбираем конфигурацию под вашу площадку и задачу</li>
                <li>• Считаем сроки, бюджет и запуск без лишней переписки</li>
                <li>• Сопровождаем проект после монтажа и старта работы</li>
              </ul>
            </Reveal>
          </div>

          <Reveal variant="right">
            <LeadForm title="Заказать расчет" source="contacts_page" buttonText="Отправить заявку" />
          </Reveal>
        </div>
      </div>
    </div>
  );
};
