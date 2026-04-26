import { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { supabase } from '../lib/supabase';
import type { Product } from '../components/ShowcaseProductCard';

import { getImageUrl } from '../services/api';

const WHATSAPP = '584147148895';

const buildWhatsApp = (productName: string) => {
  const msg = encodeURIComponent(`Hola Tecnimedical, me interesa el producto: *${productName}*. ¿Pueden darme más información y precio?`);
  return `https://wa.me/${WHATSAPP}?text=${msg}`;
};

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      if (!slug) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) throw error;
        setProduct(data);
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-40 space-y-4">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-brand-blue rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-screen-xl mx-auto px-6 py-20 text-center">
          <h2 className="text-2xl font-bold text-slate-800">Producto no encontrado</h2>
          <Link to="/" className="mt-4 inline-block text-brand-blue font-bold hover:underline">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  // If we arrived from a promo card, use that specific promo image (?img=driveId).
  // Otherwise fall back to the product's own drive_id from Supabase.
  const promoImgParam = searchParams.get('img');
  const imageId = promoImgParam || product.drive_id;
  const imgUrl = imageId ? getImageUrl(imageId) : '/logo.png';

  const getCategorySlug = (cat: string) => {
    const map: Record<string, string> = {
      'Movilidad': 'movilidad',
      'Ortopedia': 'ortopedia',
      'Equipos e insumos': 'equipos-insumos',
      'Equipos e Insumos': 'equipos-insumos',
      'Fisioterapia': 'fisioterapia',
      'Ayudas sanitarias': 'ayudas-sanitarias',
      'Ayudas Sanitarias': 'ayudas-sanitarias',
      'Cuidado Personal': 'cuidado-personal',
      'Accesorios': 'accesorios-repuestos',
      'NA': 'accesorios-repuestos'
    };
    return map[cat] || cat.toLowerCase().replace(/\s+/g, '-');
  };

  return (
    <div className="bg-white min-h-screen font-body">
      <div className="pt-32 md:pt-52">
        {/* Breadcrumbs */}
        <nav className="max-w-screen-xl mx-auto px-6 py-4 flex items-center text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-400">
          <Link to="/" className="hover:text-brand-blue transition-colors">Inicio</Link>
          <span className="mx-2 text-slate-200">/</span>
          <Link to={`/categoria/${getCategorySlug(product.category)}`} className="hover:text-brand-blue transition-colors">
            {product.category === 'NA' ? 'Accesorios' : product.category}
          </Link>
          <span className="mx-2 text-slate-200">/</span>
          <span className="text-slate-800 truncate">{product.name}</span>
        </nav>

        <main className="max-w-screen-xl mx-auto px-6 pt-2 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Columna de Imagen (8 cols en desktop) */}
            <div className="lg:col-span-8 space-y-8">
              <div className="bg-white border border-slate-100 rounded-3xl p-4 md:p-8 flex items-center justify-center min-h-[400px] md:h-[750px]">
                <motion.img
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  src={imgUrl}
                  alt={product.name}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png'; }}
                />
              </div>

            {/* Descripción Detallada */}
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight border-b border-slate-100 pb-4">
                Descripción del Producto
              </h2>
              <div 
                className="text-slate-600 leading-relaxed space-y-4 text-base md:text-lg"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          </div>

          {/* Columna de Compra / Cotización (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-24 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider">
                    {product.stock_status === 'IN_STOCK' ? 'En Stock' : 'Consultar'}
                  </div>
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">{product.subcategory}</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-slate-800 leading-tight">
                  {product.name}
                </h1>
                
                {/* Estrellas Simuladas de CVS */}
                <div className="flex items-center gap-1 mt-2">
                  {[1,2,3,4,5].map(s => (
                    <span key={s} className="material-symbols-outlined text-yellow-400 text-[18px] fill-current">star</span>
                  ))}
                  <span className="text-brand-blue text-xs font-bold ml-2 underline cursor-pointer">4.9 (228 reseñas)</span>
                </div>
              </div>

              {/* Caja de Acción CVS Style */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
                <div className="space-y-1">
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Precio</p>
                  <p className="text-3xl font-black text-slate-900 leading-none">
                    Consultar <span className="text-slate-400 text-sm font-medium">al detal/mayor</span>
                  </p>
                </div>

                <div className="space-y-3 pt-4">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-emerald-500 mt-0.5">local_shipping</span>
                    <div>
                      <p className="text-sm font-bold text-slate-700 uppercase tracking-tight">Envío Nacional</p>
                      <p className="text-xs text-slate-500">Disponible vía MRW, Zoom o Tealca.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-brand-blue mt-0.5">store</span>
                    <div>
                      <p className="text-sm font-bold text-slate-700 uppercase tracking-tight">Retiro en Tienda</p>
                      <p className="text-xs text-slate-500">Pick-up en San Cristóbal, Táchira.</p>
                    </div>
                  </div>
                </div>

                <a
                  href={buildWhatsApp(product.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-brand-blue text-white rounded-xl py-4 text-sm font-black uppercase tracking-widest hover:bg-[#1a4b8a] transition-all shadow-md hover:shadow-lg active:scale-95 mt-6"
                >
                  <span className="material-symbols-outlined">chat</span>
                  Cotizar por WhatsApp
                </a>
                
                <p className="text-[10px] text-center text-slate-400 font-medium">
                  Atención inmediata de lunes a sábado de 8am a 6pm.
                </p>
              </div>

              {/* Botón Compartir */}
              <button 
                onClick={async () => {
                  const url = window.location.href;
                  const title = `Tecnimedical - ${product.name}`;
                  
                  if (navigator.share) {
                    try {
                      await navigator.share({ title, url });
                      return;
                    } catch (err) {
                      console.log('Share failed:', err);
                    }
                  }
                  
                  // Fallback to Clipboard
                  try {
                    await navigator.clipboard.writeText(url);
                    const btn = document.getElementById('share-btn');
                    if (btn) {
                      const originalText = btn.innerHTML;
                      btn.innerHTML = '<span class="material-symbols-outlined text-[18px]">check</span> Enlace Copiado';
                      setTimeout(() => { btn.innerHTML = originalText; }, 2000);
                    }
                  } catch (err) {
                    // Final fallback
                    const textArea = document.createElement("textarea");
                    textArea.value = url;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    alert('Enlace copiado al portapapeles');
                  }
                }}
                id="share-btn"
                className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-brand-blue transition-all font-bold text-xs uppercase tracking-widest border border-slate-200 rounded-xl py-4 active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">share</span>
                Compartir Producto
              </button>
            </div>
          </div>

        </div>
      </main>
      </div>
    </div>
  );
}
