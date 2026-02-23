
import React, { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { api } from '../services/api';
import { LeadStatus } from '../types';

interface LeadFormProps {
  title?: string;
  source?: string;
  productId?: string;
  solutionId?: string;
  buttonText?: string;
  id?: string;
}

export const LeadForm: React.FC<LeadFormProps> = ({ 
  title = "Получить бесплатный расчет", 
  source = "general",
  productId,
  solutionId,
  buttonText = "Отправить запрос",
  id
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const lead = {
      createdAt: new Date().toISOString(),
      ...formData,
      pageUrl: window.location.href,
      source,
      productId,
      solutionId,
      status: LeadStatus.NEW
    };

    try {
      await api.saveLead(lead);
      setIsSuccess(true);
      setFormData({ name: '', phone: '', city: '', message: '' });
    } catch (error) {
      alert("Ошибка соединения с сервером. Пожалуйста, убедитесь, что Go бэкенд запущен на порту 8080.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div id={id} className="bg-white p-8 rounded-2xl border-2 border-green-100 shadow-xl text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="text-green-600" size={32} />
        </div>
        <h3 className="text-2xl font-bold !text-slate-900 mb-2">Спасибо!</h3>
        <p className="text-slate-600 mb-6">Ваша заявка принята. Менеджер свяжется с вами в течение 15 минут.</p>
        <button 
          onClick={() => setIsSuccess(false)}
          className="text-blue-600 font-bold hover:underline"
        >
          Отправить еще одну заявку
        </button>
      </div>
    );
  }

  return (
    <div id={id} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-xl">
      <h3 className="text-2xl font-bold !text-slate-900 mb-6">{title}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Имя</label>
            <input
              required
              type="text"
              placeholder="Иван Иванов"
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 !text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Телефон</label>
            <input
              required
              type="tel"
              placeholder="+7 (7__) ___-__-__"
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 !text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Город</label>
          <input
            required
            type="text"
            placeholder="Алматы, Астана..."
            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 !text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
            value={formData.city}
            onChange={e => setFormData({...formData, city: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Ваши пожелания</label>
          <textarea
            rows={3}
            placeholder="Размер экрана, место установки..."
            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 !text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
            value={formData.message}
            onChange={e => setFormData({...formData, message: e.target.value})}
          />
        </div>
        <button
          disabled={isSubmitting}
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? "Отправка..." : (
            <>
              {buttonText} <Send size={18} />
            </>
          )}
        </button>
        <p className="text-[10px] text-center text-slate-400 mt-4 leading-tight">
          Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности и обработки данных.
        </p>
      </form>
    </div>
  );
};
