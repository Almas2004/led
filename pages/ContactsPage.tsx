
import React from 'react';
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';
import { CONTACTS, COMPANY_NAME } from '../constants';
import { LeadForm } from '../components/LeadForm';

export const ContactsPage: React.FC = () => {
  return (
    <div className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-black text-slate-900 mb-4">Контакты</h1>
        <p className="text-slate-500 mb-12 max-w-2xl">
          Свяжитесь с нами любым удобным способом. Мы работаем по всему Казахстану и готовы проконсультировать вас по любому вопросу.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                  <Phone size={24} />
                </div>
                <h4 className="font-bold mb-2">Телефон</h4>
                <a href={`tel:${CONTACTS.phone}`} className="text-slate-600 hover:text-blue-600 transition-colors">
                  {CONTACTS.phone}
                </a>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-4">
                  <MessageCircle size={24} />
                </div>
                <h4 className="font-bold mb-2">WhatsApp</h4>
                <a href={`https://wa.me/${CONTACTS.whatsapp}`} className="text-slate-600 hover:text-green-600 transition-colors">
                  Написать в чат
                </a>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-4">
                  <Mail size={24} />
                </div>
                <h4 className="font-bold mb-2">Email</h4>
                <a href={`mailto:${CONTACTS.email}`} className="text-slate-600 hover:text-purple-600 transition-colors">
                  {CONTACTS.email}
                </a>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-4">
                  <Clock size={24} />
                </div>
                <h4 className="font-bold mb-2">Режим работы</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{CONTACTS.schedule}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600 flex-shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold mb-2">Адрес офиса</h4>
                  <p className="text-slate-600">{CONTACTS.address}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden h-80 border border-gray-200 shadow-inner">
              <iframe 
                src={CONTACTS.map_iframe}
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy"
              ></iframe>
            </div>
          </div>

          <div>
            <LeadForm 
              title="Заказать замер или расчет" 
              source="contacts_page" 
              buttonText="Отправить заявку"
            />
            <div className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-100">
              <h5 className="font-bold text-blue-900 mb-2">Почему стоит выбрать нас?</h5>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>• Работаем по договору с НДС</li>
                <li>• Собственный склад запчастей в РК</li>
                <li>• Обучение персонала управлению экраном</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
