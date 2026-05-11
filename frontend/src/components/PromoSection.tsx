import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { getImageUrl } from '../services/api';
import { handleWhatsAppContact } from '../utils/navigation';
import type { Product } from './ShowcaseProductCard';

export default function PromoSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchPromos() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_visible', true)
          .eq('is_promo', true);
          
        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        console.error('Error loading promo products:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPromos();
  }, []);

  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth < 640) setItemsPerPage(1);
      else if (window.innerWidth < 1024) setItemsPerPage(2);
      else setItemsPerPage(3);
    };
    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);


  const paginate = (newDirection: number) => {
    setIndex((prev) => {
      let nextIndex = prev + newDirection;
      if (nextIndex < 0) nextIndex = Math.max(0, products.length - itemsPerPage);
      else if (nextIndex > products.length - itemsPerPage) nextIndex = 0;
      return nextIndex;
    });
  };

  if (!loading && products.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-20 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-green/10 text-brand-green text-[10px] md:text-xs font-black uppercase tracking-widest rounded-full">
              <span className="w-1.5 h-1.5 bg-brand-green animate-pulse rounded-full" />
              Ofertas Especiales
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-brand-blue tracking-tighter leading-none">
            Promociones <span className="text-brand-green">Exclusivas</span>
          </h2>
          <p className="text-slate-500 max-w-xl text-sm md:text-lg font-light">
            Equipos médicos de alta gama con descuentos especiales. Unificamos nuestro inventario para ofrecerte lo mejor directamente.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <button 
              onClick={() => paginate(-1)}
              className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center hover:bg-brand-blue hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-current"
              disabled={products.length <= itemsPerPage}
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button 
              onClick={() => paginate(1)}
              className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center hover:bg-brand-blue hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-current"
              disabled={products.length <= itemsPerPage}
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
          <Link
            to="/promociones"
            className="hidden sm:flex items-center gap-2 bg-brand-blue/5 text-brand-blue font-black px-6 py-3 rounded-full text-xs hover:bg-brand-blue hover:text-white transition-all uppercase tracking-widest"
          >
            Ver Catálogo Promo
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative" ref={containerRef}>
        {loading ? (
          <div className="flex gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex-1 min-w-[300px] animate-pulse bg-slate-50 rounded-2xl h-[400px]" />
            ))}
          </div>
        ) : (
          <motion.div 
            className="flex gap-4 md:gap-6"
            animate={{ x: `calc(-${index * (100 / itemsPerPage)}% - ${index * (index === 0 ? 0 : 24 / itemsPerPage)}px)` }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          >
            {products.map((prod) => {
              const targetUrl = `/producto/${prod.slug}`;
              const imgUrl = prod.image_url || (prod.drive_id ? getImageUrl(prod.drive_id) : '/logo.png');

              return (
                <motion.div
                  key={prod.id}
                  className="flex-shrink-0 w-[calc(100%/1)] sm:w-[calc(100%/2-12px)] lg:w-[calc(100%/3-16px)] bg-white border border-slate-100 hover:shadow-2xl transition-all group flex flex-col relative rounded-2xl overflow-hidden"
                >
                  {/* Badge */}
                  <div className="absolute top-4 left-4 z-10 bg-brand-green text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-lg shadow-brand-green/20">
                    Promo Activa
                  </div>
                  
                  {/* Image */}
                  <Link to={targetUrl} className="aspect-[4/3] overflow-hidden bg-white p-8 relative block">
                    <img
                      src={imgUrl}
                      alt={prod.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 ease-out"
                      onError={e => { (e.target as HTMLImageElement).src = '/logo.png'; }}
                    />
                    <div className="absolute inset-0 bg-brand-blue/0 group-hover:bg-brand-blue/5 transition-colors pointer-events-none" />
                  </Link>

                  {/* Body */}
                  <div className="p-6 md:p-8 flex flex-col gap-4 flex-1 bg-slate-50/30">
                    <div className="flex flex-col gap-1">
                      <p className="text-[10px] font-bold text-brand-green uppercase tracking-[0.2em]">{prod.category || 'Tecnimedical Stock'}</p>
                      <h3 className="text-lg md:text-xl font-extrabold text-brand-blue leading-tight line-clamp-2 min-h-[3.5rem] hover:text-brand-green transition-colors">
                        <Link to={targetUrl}>
                          {prod.name}
                        </Link>
                      </h3>
                    </div>
                    
                    <div className="mt-auto flex flex-col gap-4">
                      <div className="w-full h-px bg-slate-100" />
                      <button
                        onClick={() => handleWhatsAppContact(prod.name)}
                        className="w-full flex items-center justify-center gap-3 bg-brand-blue border-2 border-brand-blue text-white hover:bg-white hover:text-brand-blue py-3 font-black uppercase tracking-widest text-xs transition-all active:scale-95 rounded-full shadow-sm"
                      >
                        <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                        Consultar Disponibilidad
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* Progress Dots */}
      {!loading && products.length > itemsPerPage && (
        <div className="flex justify-center gap-2 mt-12">
          {Array.from({ length: products.length - itemsPerPage + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-1.5 transition-all duration-300 rounded-full ${i === index ? 'w-8 bg-brand-green' : 'w-2 bg-slate-200'}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
