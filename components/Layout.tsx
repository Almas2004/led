import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, MessageCircle, Phone, X } from 'lucide-react';
import { COMPANY_NAME, CONTACTS, NAV_LINKS } from '../constants';

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 z-50 w-full glass-effect border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex flex-shrink-0 items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-xl font-bold text-white">AL</div>
              <span className="hidden text-xl font-extrabold tracking-tight text-slate-900 sm:block">
                ARDI <span className="text-blue-600">LED</span>
              </span>
            </Link>
          </div>

          <div className="hidden items-center space-x-8 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-semibold transition-colors ${
                  location.pathname === link.path ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/contacts"
              className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700"
            >
              Заказать расчет
            </Link>
          </div>

          <div className="flex items-center md:hidden">
            <button onClick={() => setIsOpen((current) => !current)} className="text-slate-600" aria-label="Открыть меню">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="border-b border-gray-100 bg-white shadow-xl md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block border-b border-gray-50 px-3 py-4 text-base font-bold text-slate-900 last:border-0"
              >
                {link.label}
              </Link>
            ))}
            <Link to="/contacts" onClick={() => setIsOpen(false)} className="block px-3 py-4 text-base font-bold text-blue-600">
              Заказать расчет
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 bg-slate-900 py-16 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div>
            <div className="mb-6 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-bold">AL</div>
              <span className="text-xl font-bold tracking-tight">{COMPANY_NAME}</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              LED-решения для бизнеса: проектирование, поставка, монтаж и поддержка экранов для коммерческих площадок,
              конференц-залов и мероприятий.
            </p>
          </div>

          <div>
            <h4 className="mb-6 font-bold">Разделы</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <Link to="/" className="hover:text-blue-400">
                  Главная
                </Link>
              </li>
              <li>
                <Link to="/cases" className="hover:text-blue-400">
                  Кейсы
                </Link>
              </li>
              <li>
                <Link to="/contacts" className="hover:text-blue-400">
                  Контакты
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 font-bold">Для связи</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>Расчет проекта под вашу площадку</li>
              <li>Подбор конфигурации и сроков</li>
              <li>Сопровождение после запуска</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 font-bold">Связаться</h4>
            <div className="space-y-4 text-sm text-slate-400">
              <a href={`tel:+${CONTACTS.phoneHref}`} className="flex items-center gap-3 hover:text-white">
                <Phone size={16} /> {CONTACTS.phone}
              </a>
              <a href={CONTACTS.whatsappUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-white">
                <MessageCircle size={16} /> WhatsApp
              </a>
              <div>Режим работы: {CONTACTS.schedule}</div>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-slate-800 pt-8 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} {COMPANY_NAME}. Все права защищены.
        </div>
      </div>
    </footer>
  );
};
