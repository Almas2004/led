
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ShieldCheck, Zap, Cog, Smartphone, Package, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { Product } from '../types';
import { LeadForm } from '../components/LeadForm';

export const ProductDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (slug) {
      api.getProductBySlug(slug)
        .then(setProduct)
        .catch(() => setError(true))
        .finally(() => setLoading(false));
    }
  }, [slug]);

  if (loading) return <div className="pt-40 pb-20 text-center font-bold text-slate-500">Загрузка данных товара...</div>;
  if (error || !product) return <div className="pt-40 pb-20 text-center font-bold text-red-500">Товар не найден.</div>;

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/catalog" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold mb-8 transition-colors">
          <ChevronLeft size={20} /> Назад в каталог
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="aspect-video bg-gray-100 rounded-3xl overflow-hidden border border-gray-200">
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.slice(1).map((img, idx) => (
                  <div key={idx} className="aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="flex gap-2 mb-4">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                {product.type === 'indoor' ? 'Интерьерный' : 'Уличный'}
              </span>
              <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                P{product.pixelPitch}
              </span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 mb-6">{product.name}</h1>
            <p className="text-lg text-slate-500 mb-8 leading-relaxed">
              {product.shortDescription || 'Профессиональное решение для яркой и четкой визуализации вашего контента.'}
            </p>

            <div className="bg-blue-50 border border-blue-100 rounded-3xl p-8 mb-8">
              <p className="text-xs text-blue-600 font-black uppercase tracking-widest mb-2">Цена от</p>
              <p className="text-4xl font-black text-blue-700">{product.priceFrom?.toLocaleString() || '---'} ₸ <span className="text-lg font-bold text-blue-400">/ м²</span></p>
              <p className="text-xs text-blue-400 mt-2">* Точная стоимость рассчитывается индивидуально под проект</p>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-10">
              <div className="flex items-start gap-3">
                <ShieldCheck className="text-blue-600 mt-1" size={20} />
                <div>
                  <p className="font-bold text-slate-900">Гарантия {product.warranty || 3} года</p>
                  <p className="text-xs text-slate-500">На все компоненты</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Zap className="text-blue-600 mt-1" size={20} />
                <div>
                  <p className="font-bold text-slate-900">{product.leadTime || 15} дней</p>
                  <p className="text-xs text-slate-500">Срок поставки</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Specs and Description */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <Smartphone className="text-blue-600" /> Описание товара
              </h2>
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
                {product.fullDescription || 'Этот светодиодный экран обеспечивает высочайшее качество изображения благодаря использованию передовых чипов и систем управления. Идеально подходит для коммерческих объектов, где требуется максимальная надежность и яркость.'}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <Package className="text-blue-600" /> Технические характеристики
              </h2>
              <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                {[
                  { label: 'Шаг пикселя', value: `P${product.pixelPitch}` },
                  { label: 'Тип диода', value: 'SMD' },
                  { label: 'Яркость', value: `${product.brightness} кд/м²` },
                  { label: 'Частота обновления', value: `${product.refreshRate} Гц` },
                  { label: 'Класс защиты', value: product.ipRating },
                  { label: 'Дистанция обзора', value: `${product.viewingDistanceMin} - ${product.viewingDistanceMax} м` },
                ].map((spec, idx) => (
                  <div key={idx} className="flex justify-between items-center p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                    <span className="text-slate-500 font-medium">{spec.label}</span>
                    <span className="text-slate-900 font-bold">{spec.value}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside>
            <div className="sticky top-28">
              <LeadForm 
                title="Заказать расчет" 
                source={`product_page_${product.slug}`} 
                productId={product.id.toString()}
                buttonText="Получить смету"
              />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
