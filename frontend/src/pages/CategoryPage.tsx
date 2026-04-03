import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';

const WHATSAPP = '584147148895';
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

const CATEGORIES: Record<string, { label: string; description: string; folderId: string; image: string }> = {
  movilidad: {
    label: 'Movilidad',
    description: 'Sillas de ruedas, andadores, bastones y scooters médicos.',
    folderId: '1gWT2aehbNFXcPWpoW5inipUUPp_cKGif',
    image: '/Cat_Sillas.png',
  },
  colchones: {
    label: 'Colchones y Cojines',
    description: 'Colchones antiescaras, cojines posturales y superficies de alivio de presión.',
    folderId: '1vz3N4UsxrxKF_KLLK1gBIYOo4rEMBlIQ',
    image: '/Cat_Antiescaras.png',
  },
  monitoreo: {
    label: 'Monitoreo',
    description: 'Tensiómetros, pulsioxímetros, glucómetros y equipos de signos vitales.',
    folderId: '1cbtb17LcB9ydjCMViRpsyBzIkTUP3uFl',
    image: '/Cat_Diagnostico.png',
  },
  nebulizadores: {
    label: 'Nebulizadores',
    description: 'Nebulizadores de malla y pistón, concentradores de oxígeno y accesorios.',
    folderId: '1vZG7WJDmtW_M1xEb9ist4xJG2IcIRCzP',
    image: '/Cat_Respiratorio.png',
  },
  'ayudas-sanitarias': {
    label: 'Ayudas Sanitarias',
    description: 'Sillas de baño, alzadores de WC, barras de apoyo y adaptadores sanitarios.',
    folderId: '159aQLMoBjZz3gavpZE9jUpIemklcM54o',
    image: '/Cat_Ayudas_Portada.png',
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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {images.map((img, i) => {
        const name = formatName(img.name);
        return (
          <motion.div
            key={img.id}
            className="bg-white border border-outline-variant/30 hover:shadow-xl transition-all group flex flex-col"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
          >
            <div className="aspect-square overflow-hidden bg-white p-4 border-b border-slate-50">
              <img
                src={`${API_BASE}/api/image/${img.id}`}
                alt={name}
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                onError={e => { (e.target as HTMLImageElement).src = fallbackImg; }}
              />
            </div>
            <div className="p-4 flex flex-col gap-3 flex-1">
              <h3 className="text-sm md:text-base font-bold text-on-surface leading-tight line-clamp-2">{name}</h3>
              <a
                href={buildWhatsApp(name)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto flex items-center justify-center gap-2 bg-brand-green hover:brightness-110 text-white px-4 py-2.5 text-xs font-black uppercase tracking-widest transition-all active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-[16px]">chat</span>
                Cotizar
              </a>
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
          setSections(results);
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
        <div className="relative h-full flex flex-col justify-end px-4 md:px-8 max-w-screen-2xl mx-auto pb-6 md:pb-8 pt-20 md:pt-24">
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-slate-200 mb-3" />
                <div className="h-4 bg-slate-200 rounded mb-2 w-3/4" />
                <div className="h-8 bg-slate-100 rounded" />
              </div>
            ))}
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
                {section.images.length > 0
                  ? <ProductGrid images={section.images} fallbackImg={category.image} />
                  : <p className="text-slate-400 text-sm py-4 text-center border border-dashed border-slate-200 rounded-xl my-4">Sin productos en esta sección aún.</p>
                }
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
