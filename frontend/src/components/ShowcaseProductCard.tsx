import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const WHATSAPP = '584147148895';
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

export interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  description: string;
  drive_id: string | null;
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
  const previewText = product.description.split('<br>')[0].replace('•', '').trim() || 'Equipo Médico Premium';
  const imgUrl = product.drive_id ? `${API_BASE}/api/image/${product.drive_id}` : '/placeholder-medical.png';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="group relative"
    >
      <Link 
        to={`/producto/${product.slug}`}
        className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer"
      >
        {/* Badge Superior */}
        {product.stock_status === 'IN_STOCK' && (
          <div className="absolute top-0 left-0 bg-brand-cyan text-white text-[10px] uppercase font-black px-3 py-1.5 rounded-br-xl z-20 shadow-sm tracking-wider">
            Disponible
          </div>
        )}

        {/* Área de Imagen */}
        <div className="relative h-60 md:h-72 bg-white p-6 flex justify-center items-center overflow-hidden border-b border-slate-100">
          <img
            src={imgUrl}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 will-change-transform"
            onError={(e) => { (e.target as HTMLImageElement).src = '/logo-tecni.png'; }}
          />
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

