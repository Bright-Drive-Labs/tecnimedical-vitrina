import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';

const WHATSAPP = '584147148895';
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

const CATEGORIES: Record<string, { label: string; description: string; folderId: string; image: string }> = {
  movilidad: {
    label: 'Movilidad',
    description: 'Sillas de ruedas, andaderas, bastones y muletas.',
    folderId: '1gWT2aehbNFXcPWpoW5inipUUPp_cKGif',
    image: '/Cat_Movilidad.png',
  },
  ortopedia: {
    label: 'Ortopedia',
    description: 'Línea blanda, colchones y cojines ortopédicos, y órtesis.',
    folderId: '1PLev5o-M0QVl1QMxaB3qaBM56xr0yRA2',
    image: '/Cat_Ortopedia.png',
  },
  'equipos-insumos': {
    label: 'Equipos e Insumos',
    description: 'Monitoreo de signos vitales, nebulizadores y descartables médicos.',
    folderId: '1ptvyu7cVLxCTaZ6GJ5bCVYHr_5rB0E3_',
    image: '/Cat_Equipos.png',
  },
  fisioterapia: {
    label: 'Fisioterapia',
    description: 'Electroterapia, masajeadores, rehabilitación y terapia frío/calor.',
    folderId: '1_GBb7XwTXmelpPBOZ9dfZRwTqzLiNqWM',
    image: '/Cat_Fisioterapia.png',
  },
  'ayudas-sanitarias': {
    label: 'Ayudas Sanitarias',
    description: 'Sillas de ducha, sanitarios portátiles y elevadores de WC.',
    folderId: '159aQLMoBjZz3gavpZE9jUpIemklcM54o',
    image: '/Cat_Sanitarias.png',
  },
  'cuidado-personal': {
    label: 'Cuidado Personal',
    description: 'Alivio del dolor, cuidado de la piel y medias de compresión.',
    folderId: '1On50xn71F_TMj1KspQgGmbc9hYT2veqQ',
    image: '/Cat_Cuidado.png',
  },
  'accesorios-repuestos': {
    label: 'Accesorios y Repuestos',
    description: 'Repuestos y accesorios para equipos médicos.',
    folderId: '1dgz8wObjlIn5M-FuzXTS7YdMwtH3uwqA',
    image: '/Cat_Accesorios.png',
  },
};

interface DriveImage { id: string; name: string; }
interface SubSection { id: string; name: string; images: DriveImage[]; }

const formatName = (filename: string) =>
  filename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

const buildWhatsApp = (productName: string) => {
  const msg = encodeURIComponent(`Hola Tecnimedical, me interesa el producto: *${productName}*. ¿Pueden darme más información y precio?`);
  return `https://wa.me/${WHATSAPP}?text=${msg}`;
};

function ProductGrid({ images, fallbackImg }: { images: DriveImage[]; fallbackImg: string }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6 lg:gap-8">
      {images.map((img, i) => {
        const name = formatName(img.name);
        return (
          <motion.div
            key={img.id}
            className="bg-white border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 group flex flex-col overflow-hidden rounded-2xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
          >
            {/* Imagen */}
            <div className="h-48 md:h-56 w-full bg-white p-6 flex items-center justify-center border-b border-slate-100">
              <img
                src={`${API_BASE}/api/image/${img.id}`}
                alt={name}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                onError={e => { (e.target as HTMLImageElement).src = fallbackImg; }}
              />
            </div>

            {/* Contenido */}
            <div className="px-4 pb-6 flex flex-col gap-3 flex-1 text-center">
              <h3 className="text-sm font-semibold text-slate-800 leading-snug line-clamp-2 min-h-[2.5rem] flex items-center justify-center">
                {name}
              </h3>
              <div className="mt-auto">
                <a
                  href={buildWhatsApp(name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-brand-blue border-2 border-brand-blue text-white hover:bg-white hover:text-brand-blue px-5 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 rounded-full shadow-sm"
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
  );
}

function SectionDivider({ title }: { title: string }) {
  return (
    <div className="pt-16 pb-8">
      <h2 className="text-xl md:text-2xl font-black text-on-surface uppercase tracking-wide">
        {title}
        <div className="h-1 w-14 bg-brand-green mt-3" />
      </h2>
    </div>
  );
}

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const category = CATEGORIES[slug ?? ''];
  const [sections, setSections] = useState<SubSection[]>([]);
  const [rootImages, setRootImages] = useState<DriveImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category) return;
    setLoading(true);
    setSections([]);
    setRootImages([]);

    const folderId = category.folderId;

    // Primero buscamos subcarpetas
    fetch(`${API_BASE}/api/gallery/albums/${folderId}`)
      .then(r => r.json())
      .then(async data => {
        const subfolders: { id: string; name: string }[] = data.albums ?? [];

        if (subfolders.length > 0) {
          // Tiene subcarpetas — cargamos cada una en paralelo
          const results = await Promise.all(
            subfolders.map(async folder => {
              const res = await fetch(`${API_BASE}/api/gallery/${folder.id}`);
              const d = await res.json();
              return { id: folder.id, name: folder.name, images: d.images ?? [] };
            })
          );
          setSections(results.filter(s => s.images.length > 0));
        } else {
          // Sin subcarpetas — cargamos imágenes directas
          const res = await fetch(`${API_BASE}/api/gallery/${folderId}`);
          const d = await res.json();
          setRootImages(d.images ?? []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (!category) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-xl text-slate-500">Categoría no encontrada.</p>
      </div>
    );
  }

  const totalProducts = sections.reduce((acc, s) => acc + s.images.length, 0) + rootImages.length;
  const isEmpty = !loading && totalProducts === 0;

  return (
    <div className="bg-background min-h-screen font-body">
      <Navbar />

      {/* Header */}
      <div
        className="relative h-56 md:h-72 bg-cover bg-center"
        style={{ backgroundImage: `url('${category.image}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="relative h-full flex flex-col justify-end px-4 md:px-8 max-w-screen-2xl mx-auto pb-6 md:pb-8 pt-24 md:pt-40">
          <div className="space-y-1">
            <p className="text-brand-cyan text-xs font-black uppercase tracking-widest">Categoría</p>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">{category.label}</h1>
            <p className="text-white/70 text-sm md:text-base max-w-lg">{category.description}</p>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <main className="max-w-screen-2xl mx-auto px-4 md:px-8 py-10 md:py-16">

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-12 h-12 border-4 border-brand-green/20 border-t-brand-green rounded-full animate-spin"></div>
            <p className="text-brand-green font-bold uppercase tracking-widest text-sm animate-pulse">Cargando catálogo...</p>
          </div>
        ) : isEmpty ? (
          <div className="text-center py-24 space-y-4">
            <span className="material-symbols-outlined text-5xl text-slate-300">inventory_2</span>
            <p className="text-slate-400 text-lg">Productos próximamente disponibles.</p>
            <a
              href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hola, quiero información sobre ${category.label}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-brand-green text-white px-6 py-3 font-bold text-sm uppercase tracking-widest hover:brightness-110 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">chat</span>
              Consultar por WhatsApp
            </a>
          </div>

        ) : sections.length > 0 ? (
          // Categoría con subcarpetas — una sección por carpeta
          <>
            {sections.map((section) => (
              <div key={section.id} className="first:pt-0">
                <SectionDivider title={formatName(section.name)} />
                <ProductGrid images={section.images} fallbackImg={category.image} />
              </div>
            ))}
          </>

        ) : (
          // Categoría sin subcarpetas — grid directo
          <div className="first:pt-0">
            <SectionDivider title={category.label} />
            <ProductGrid images={rootImages} fallbackImg={category.image} />
          </div>
        )}

      </main>
    </div>
  );
}
