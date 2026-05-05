import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../services/api';

const WHATSAPP = '584147148895';

export interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  description: string;
  image_url?: string | null;
  drive_id?: string | null;
  slug: string;
  price: number;
  stock_status: string;
}

const buildWhatsApp = (productName: string) => {
  const msg = encodeURIComponent(`Hola Tecnimedical, me interesa el producto: *${productName}*. ¿Pueden darme más información y cotización?`);
  return `https://wa.me/${WHATSAPP}?text=${msg}`;
};

export default function ShowcaseProductCard({ product, delay = 0 }: { product: Product; delay?: number }) {
  // Try to extract a short preview from description (usually the first bullet point)
  const previewText = product.description?.split('<br>')[0].replace('•', '').trim() || '';
  const imgUrl = product.image_url
    ? getImageUrl(product.image_url)
    : product.drive_id
      ? getImageUrl(product.drive_id)
      : '/logo.png';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full"
    >
      <Link to={`/producto/${product.slug}`} className="flex flex-col h-full">
        {/* Image Container */}
        <div className="relative h-48 sm:h-56 md:h-64 bg-white p-4 md:p-6 flex items-center justify-center overflow-hidden border-b border-slate-50">
          <img
            src={imgUrl}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 will-change-transform"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/logo.png';
            }}
          />
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <span className="bg-brand-blue text-white text-[9px] font-black uppercase px-2.5 py-1 rounded-lg shadow-lg tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">Ver detalle</span>
          </div>
        </div>

        {/* Cuerpo y Texto */}
        <div className="p-5 flex flex-col flex-1">
          <p className="text-[10px] text-slate-400 font-black tracking-widest uppercase mb-1">
            {product.category}
          </p>
          
          <h3 className="font-bold text-slate-800 leading-snug line-clamp-2 text-sm md:text-base group-hover:text-brand-blue transition-colors">
            {product.name}
          </h3>
          
          <p className="text-xs text-slate-500 mt-2 line-clamp-2 hidden sm:block leading-relaxed">
            {previewText}
          </p>
          
          {/* Status Checks (Estilo CVS) */}
          <div className="mt-4 space-y-1">
            <div className="flex items-center text-[10px] text-emerald-600 font-bold uppercase tracking-tight">
              <span className="material-symbols-outlined text-[14px] mr-1.5">check_circle</span>
              Entrega inmediata
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="px-5 pb-5">
          <button
            onClick={(e) => {
              e.preventDefault();
              window.open(buildWhatsApp(product.name), '_blank');
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
}
