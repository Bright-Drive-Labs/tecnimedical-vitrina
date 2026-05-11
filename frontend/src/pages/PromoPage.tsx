import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { getImageUrl } from '../services/api';
import { handleWhatsAppContact } from '../utils/navigation';

interface PromoProduct {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  description: string;
  image_url: string | null;
  drive_id: string | null;
  slug: string;
  stock_status: string;
}

export default function PromoPage() {
  const [products, setProducts] = useState<PromoProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    async function loadPromos() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('id, name, category, subcategory, description, image_url, drive_id, slug, stock_status')
          .eq('is_visible', true)
          .eq('is_promo', true);

        if (error) throw error;

        if (data) {
          setProducts(data);
        }
      } catch (err) {
        console.error('Error loading promo products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPromos();
  }, []);

  // Group by category for the sidebar
  const categoryCounts: Record<string, number> = {};
  products.forEach(p => {
    const cat = p.category || 'General';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });
  const categories = Object.keys(categoryCounts).sort();

  const displayProducts = selectedCategory
    ? products.filter(p => p.category === selectedCategory)
    : products;

  return (
    <div className="bg-background min-h-screen font-body shadow-inner">
      {/* Header — mismo estilo que CategoryPage */}
      <div className="relative h-64 md:h-80 bg-slate-900 border-b border-slate-200 overflow-hidden">
        {/* Background - using a placeholder image for promos */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 scale-105"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent" />
        
        <div className="relative h-full flex flex-col justify-end px-6 md:px-8 max-w-[1400px] mx-auto pb-10 pt-32">
          <div className="space-y-2">
            <div className="flex items-center text-xs font-bold tracking-widest text-brand-cyan uppercase">
              <Link to="/" className="opacity-70 cursor-pointer hover:opacity-100">Catálogo</Link>
              <span className="mx-2 opacity-50">/</span>
              <span>Promociones</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">Promociones</h1>
            <p className="text-white/80 text-sm md:text-base max-w-lg">
              Equipos médicos seleccionados con precios especiales por tiempo limitado.
            </p>
          </div>
        </div>
      </div>

      {/* Contenido / Grid — idéntico a CategoryPage */}
      <main className="max-w-[1400px] mx-auto px-6 md:px-8 py-10 md:py-12 flex flex-col lg:flex-row gap-8">

        {/* Sidebar filtros */}
        <aside className="w-full lg:w-64 shrink-0 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 sticky top-24">
            <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm mb-4">Filtrar por</h3>
            <div className="space-y-3">
              <p className="text-sm font-bold text-slate-600 border-b pb-2">Categorías</p>
              <ul className="space-y-2.5">
                <li
                  onClick={() => setSelectedCategory(null)}
                  className={`flex justify-between items-center text-sm cursor-pointer transition-colors ${!selectedCategory ? 'text-brand-blue font-bold' : 'text-slate-600 hover:text-brand-blue'}`}
                >
                  <span>Todos</span>
                  <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {products.length}
                  </span>
                </li>
                {categories.map(cat => (
                  <li
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`flex justify-between items-center text-sm cursor-pointer transition-colors ${selectedCategory === cat ? 'text-brand-blue font-bold' : 'text-slate-600 hover:text-brand-blue'}`}
                  >
                    <span className="truncate pr-2">{cat}</span>
                    <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                      {categoryCounts[cat]}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* Grid de productos */}
        <div className="flex-1 min-w-0">
          {/* Contador */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200">
            <span className="text-sm font-medium text-slate-500">
              {loading ? 'Buscando...' : `Mostrando ${displayProducts.length} producto${displayProducts.length !== 1 ? 's' : ''}`}
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-10 h-10 border-4 border-brand-green/20 border-t-brand-green rounded-full animate-spin"></div>
              <p className="text-brand-green font-bold uppercase tracking-widest text-xs animate-pulse">Cargando promociones...</p>
            </div>
          ) : displayProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 text-center py-24 space-y-4 shadow-sm">
              <span className="material-symbols-outlined text-5xl text-slate-300">local_offer</span>
              <p className="text-slate-500 font-medium">No se encontraron promociones en esta selección.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {displayProducts.map((prod, i) => {
                const previewText = prod.description?.split('<br>')[0].replace('•', '').trim() || 'Equipo Médico en Promoción';
                const imgUrl = prod.image_url || (prod.drive_id ? getImageUrl(prod.drive_id) : '/logo.png');

                return (
                  <motion.div
                    key={prod.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="group relative"
                  >
                    <Link
                      to={`/producto/${prod.slug}`}
                      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer"
                    >
                      {/* Badge DISPONIBLE */}
                      <div className="absolute top-0 left-0 bg-brand-cyan text-white text-[10px] uppercase font-black px-3 py-1.5 rounded-br-xl z-20 shadow-sm tracking-wider">
                        Disponible
                      </div>

                      {/* Imagen */}
                      <div className="relative h-60 md:h-72 bg-white p-6 flex justify-center items-center overflow-hidden border-b border-slate-100">
                        <img
                          src={imgUrl}
                          alt={prod.name}
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 will-change-transform"
                          onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png'; }}
                        />
                      </div>

                      {/* Texto */}
                      <div className="p-5 flex flex-col flex-1">
                        <p className="text-[10px] text-slate-400 font-black tracking-widest uppercase mb-1">
                          {prod.category}
                        </p>
                        <h3 className="font-bold text-slate-800 leading-snug line-clamp-2 text-sm md:text-base group-hover:text-brand-blue transition-colors">
                          {prod.name}
                        </h3>
                        <p className="text-xs text-slate-500 mt-2 line-clamp-2 hidden sm:block leading-relaxed">
                          {previewText}
                        </p>
                        <div className="mt-4 space-y-1">
                          <div className="flex items-center text-[10px] text-emerald-600 font-bold uppercase tracking-tight">
                            <span className="material-symbols-outlined text-[14px] mr-1.5">check_circle</span>
                            Entrega inmediata
                          </div>
                        </div>
                      </div>

                      {/* Botón Cotizar */}
                      <div className="px-5 pb-5">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleWhatsAppContact(prod.name);
                          }}
                          className="w-full flex items-center justify-center gap-2 bg-brand-blue text-white rounded-xl py-2.5 text-xs font-black uppercase tracking-widest hover:bg-[#1a4b8a] transition-colors shadow-sm active:scale-95"
                        >
                          <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                          Cotizar
                        </button>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
