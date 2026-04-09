import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';

const WHATSAPP = '584147148895';
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';
const PROMO_FOLDER_ID = '1x1TWXLJWr_UIiPRzHPbKB5jJWt2E0QQn';

interface DriveImage { id: string; name: string; }

const formatName = (filename: string) =>
  filename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

const buildWhatsApp = (name: string) => {
  const msg = encodeURIComponent(`Hola Tecnimedical, me interesa el producto en promoción: *${name}*. ¿Pueden darme más información y precio?`);
  return `https://wa.me/${WHATSAPP}?text=${msg}`;
};

export default function PromoPage() {
  const [images, setImages] = useState<DriveImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/gallery/${PROMO_FOLDER_ID}`)
      .then(r => r.json())
      .then(data => setImages(data.images ?? []))
      .catch(() => setImages([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-background min-h-screen font-body">
      <Navbar />

      {/* Header */}
      <div className="relative h-56 md:h-72 bg-cover bg-center" style={{ backgroundImage: "url('/background.png')" }}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
        <div className="relative h-full flex flex-col justify-end px-4 md:px-8 max-w-screen-2xl mx-auto pb-6 md:pb-8 pt-24 md:pt-40">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-brand-green text-white text-xs font-black uppercase tracking-widest">
              <span className="w-1.5 h-1.5 bg-white animate-pulse rounded-full" />
              Ofertas Especiales
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">Promociones</h1>
            <p className="text-white/70 text-sm md:text-base max-w-lg">
              Los mejores precios en equipos médicos. Ofertas por tiempo limitado.
            </p>
          </div>
        </div>
      </div>

      {/* Grid */}
      <main className="max-w-screen-2xl mx-auto px-4 md:px-8 py-10 md:py-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-12 h-12 border-4 border-brand-green/20 border-t-brand-green rounded-full animate-spin"></div>
            <p className="text-brand-green font-bold uppercase tracking-widest text-sm animate-pulse">Cargando promociones...</p>
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-24 space-y-4">
            <span className="material-symbols-outlined text-5xl text-slate-300">local_offer</span>
            <p className="text-slate-400 text-lg">Próximamente nuevas promociones.</p>
            <a
              href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Hola, quiero información sobre las promociones disponibles')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-brand-green text-white px-6 py-3 font-bold text-sm uppercase tracking-widest hover:brightness-110 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">chat</span>
              Consultar por WhatsApp
            </a>
          </div>
        ) : (
          <>
            <p className="text-on-surface-variant text-sm mb-8">{images.length} productos en promoción</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {images.map((img, i) => {
                const name = formatName(img.name);
                return (
                  <motion.div
                    key={img.id}
                    className="bg-white border border-outline-variant/30 hover:shadow-xl transition-all group flex flex-col relative rounded-2xl overflow-hidden"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                  >
                    <div className="absolute top-2 left-2 z-10 bg-brand-green text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5">
                      Promo
                    </div>
                    <div className="h-48 md:h-56 w-full overflow-hidden bg-white p-6 border-b border-slate-50">
                      <img
                        src={`${API_BASE}/api/image/${img.id}`}
                        alt={name}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                        onError={e => { (e.target as HTMLImageElement).src = '/logo.png'; }}
                      />
                    </div>
                    <div className="p-4 pb-6 flex flex-col gap-3 flex-1 text-center">
                      <h3 className="text-sm md:text-base font-bold text-on-surface leading-tight line-clamp-2 min-h-[2.5rem] flex items-center justify-center">
                        {name}
                      </h3>
                      <div className="mt-auto">
                        <a
                          href={buildWhatsApp(name)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 bg-brand-blue border-2 border-brand-blue text-white hover:bg-white hover:text-brand-blue px-5 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all active:scale-[0.98] rounded-full shadow-sm"
                        >
                          <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
                          Cotizar
                        </a>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
