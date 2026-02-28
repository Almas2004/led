
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, MessageCircle, MapPin } from 'lucide-react';
import { NAV_LINKS, COMPANY_NAME } from '../constants';

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 w-full z-50 glass-effect border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">AL</div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 hidden sm:block">
                ARDI <span className="text-blue-600">LED</span>
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
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
              className="bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            >
              Заказать расчет
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 shadow-xl">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-4 text-base font-bold text-slate-900 border-b border-gray-50 last:border-0"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-white py-16 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">AL</div>
              <span className="text-xl font-bold tracking-tight">ARDI LED</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Лидер в области светодиодных технологий в Казахстане. От проектирования до сервисного обслуживания.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-6">Продукция</h4>
            <ul className="space-y-3 text-slate-400 text-sm">
              <li><Link to="/catalog?type=indoor" className="hover:text-blue-400">Indoor экраны</Link></li>
              <li><Link to="/catalog?type=outdoor" className="hover:text-blue-400">Outdoor экраны</Link></li>
              <li><Link to="/solutions" className="hover:text-blue-400">Готовые решения</Link></li>
              <li><Link to="/service" className="hover:text-blue-400">Сервис и запчасти</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">О компании</h4>
            <ul className="space-y-3 text-slate-400 text-sm">
              <li><Link to="/cases" className="hover:text-blue-400">Наши проекты</Link></li>
              <li><Link to="/contacts" className="hover:text-blue-400">Контакты</Link></li>
              <li><Link to="/admin" className="hover:text-slate-300">Вход для сотрудников</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Связаться</h4>
            <div className="space-y-4 text-sm text-slate-400">
              <a href="tel:+77000000000" className="flex items-center gap-3 hover:text-white">
                <Phone size={16} /> +7 (700) 000-00-00
              </a>
              <a href="https://wa.me/77000000000" className="flex items-center gap-3 hover:text-white">
                <MessageCircle size={16} /> WhatsApp
              </a>
              <div className="flex items-start gap-3">
                <MapPin size={16} className="mt-1 flex-shrink-0" /> 
                <span>Алматы, пр. Абая, 150<br/>Астана, ул. Кунаева, 12</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-slate-800 text-center text-slate-500 text-xs">
          © {new Date().getFullYear()} {COMPANY_NAME}. Все права защищены.
        </div>
      </div>
    </footer>
  );
};
