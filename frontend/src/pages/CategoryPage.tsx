import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ShowcaseProductCard from '../components/ShowcaseProductCard';
import { supabase } from '../lib/supabase';



const CATEGORIES: Record<string, { label: string; description: string; dbCategory: string; image: string }> = {
  movilidad: {
    label: 'Movilidad',
    description: 'Sillas de ruedas, andaderas, bastones y muletas.',
    dbCategory: 'Movilidad',
    image: '/Cat_Movilidad.png',
  },
  ortopedia: {
    label: 'Ortopedia',
    description: 'Línea blanda, colchones y cojines ortopédicos, y órtesis.',
    dbCategory: 'Ortopedia',
    image: '/Cat_Ortopedia.png',
  },
  'equipos-insumos': {
    label: 'Equipos e Insumos',
    description: 'Monitores, tensiómetros, nebulizadores y consumibles médicos.',
    dbCategory: 'Equipos e insumos',
    image: '/Cat_Equipos.png',
  },
  fisioterapia: {
    label: 'Fisioterapia',
    description: 'Equipos de rehabilitación, terapia física y recuperación muscular.',
    dbCategory: 'Fisioterapia',
    image: '/Cat_Fisio.png',
  },
  'ayudas-sanitarias': {
    label: 'Ayudas Sanitarias',
    description: 'Sillas para baño, elevadores de WC y accesorios de higiene segura.',
    dbCategory: 'Ayudas sanitarias',
    image: '/Cat_Ayudas.png',
  },
  'cuidado-personal': {
    label: 'Cuidado Personal',
    description: 'Productos para el cuidado diario, higiene y bienestar en casa.',
    dbCategory: 'Cuidado Personal',
    image: '/Cat_Cuidado.png',
  },
  'accesorios-repuestos': {
    label: 'Accesorios',
    description: 'Repuestos originales y accesorios para todos tus equipos médicos.',
    dbCategory: 'NA', // En el DB parece que están bajo NA o Sin Categoría
    image: '/Cat_Accesorios.png',
  },
};

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const category = CATEGORIES[slug ?? ''];
  const [productsBySubcategory, setProductsBySubcategory] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  const [selectedSub, setSelectedSub] = useState<string | null>(null);

  const normalizeSubcategory = (sub: string) => {
    if (!sub || sub.toUpperCase() === 'NA') return 'General';
    
    let normalized = sub.trim().toLowerCase();
    
    // Unify Ortorepdia
    if (normalized.includes('blanda')) return 'Blanda';
    if (normalized.includes('ortesis') || normalized.includes('órtesis')) return 'Órtesis';
    if (normalized.includes('colchones') || normalized.includes('cojines')) return 'Colchones y Cojines Ortopédicos';
    
    // Unify Movilidad
    if (normalized.includes('caminador') || normalized.includes('andadera')) return 'Andaderas';
    if (normalized.includes('silla') && normalized.includes('rueda')) return 'Silla de Ruedas';
    if (normalized.includes('bastone') || normalized.includes('muleta')) return 'Bastones y Muletas';

    // Unify Equipos
    if (normalized.includes('monitoreo') || normalized.includes('signos vitales')) return 'Monitoreos y Signos Vitales';
    
    // Title Case for others
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
  };

  useEffect(() => {
    if (!category) return;
    
    let isMounted = true;
    setSelectedSub(null);

    async function fetchProducts() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .ilike('category', category.dbCategory)
          .not('drive_id', 'is', null);

        if (error) {
          console.error('Error fetching products:', error);
          if (isMounted) setProductsBySubcategory({});
        } else if (data && isMounted) {
          const grouped: Record<string, any[]> = {};
          data.forEach((p: any) => {
            const rawSub = p.subcategory || 'General';
            const sub = normalizeSubcategory(rawSub);
            if (!grouped[sub]) grouped[sub] = [];
            grouped[sub].push(p);
          });
          setProductsBySubcategory(grouped);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchProducts();
    return () => { isMounted = false; };
  }, [slug, category]);

  if (!category) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-xl text-slate-500">Categoría no encontrada.</p>
      </div>
    );
  }

  const subcategories = Object.keys(productsBySubcategory).sort();
  const totalProducts = Object.values(productsBySubcategory).reduce((acc, curr) => acc + curr.length, 0);
  const isEmpty = !loading && totalProducts === 0;
  const displaySubs = selectedSub ? [selectedSub] : subcategories;

  return (
    <div className="bg-background min-h-screen font-body shadow-inner">
      <Navbar />

      {/* Header Premium (CVS Style Banner) */}
      <div
        className="relative h-64 md:h-80 bg-cover bg-center border-b border-slate-200"
        style={{ backgroundImage: `url('${category.image}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/50 to-transparent" />
        <div className="relative h-full flex flex-col justify-end px-6 md:px-8 max-w-[1400px] mx-auto pb-10 pt-32">
          <div className="space-y-2">
            <div className="flex items-center text-xs font-bold tracking-widest text-brand-cyan uppercase">
              <Link to="/" className="opacity-70 cursor-pointer hover:opacity-100">Catálogo</Link>
              <span className="mx-2 opacity-50">/</span>
              <span>{category.label}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">{category.label}</h1>
            <p className="text-white/80 text-sm md:text-base max-w-lg shadow-sm">{category.description}</p>
          </div>
        </div>
      </div>

      {/* Contenido / Grid */}
      <main className="max-w-[1400px] mx-auto px-6 md:px-8 py-10 md:py-12 flex flex-col lg:flex-row gap-8">
        
        {/* Left Sidebar (Filtros - Estilo CVS) */}
        <aside className="w-full lg:w-64 shrink-0 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 sticky top-24">
            <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm mb-4">Filtrar por</h3>
            <div className="space-y-3">
              <p className="text-sm font-bold text-slate-600 border-b pb-2">Subcategorías</p>
              <ul className="space-y-2.5">
                <li 
                  onClick={() => setSelectedSub(null)}
                  className={`flex justify-between items-center text-sm cursor-pointer transition-colors ${!selectedSub ? 'text-brand-blue font-bold' : 'text-slate-600 hover:text-brand-blue'}`}
                >
                  <span>Todos</span>
                  <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {totalProducts}
                  </span>
                </li>
                {subcategories.length > 0 ? (
                  subcategories.map(sub => (
                    <li 
                      key={sub} 
                      onClick={() => setSelectedSub(sub)}
                      className={`flex justify-between items-center text-sm cursor-pointer transition-colors ${selectedSub === sub ? 'text-brand-blue font-bold' : 'text-slate-600 hover:text-brand-blue'}`}
                    >
                      <span className="truncate pr-2">{sub}</span>
                      <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                        {productsBySubcategory[sub].length}
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-slate-400 italic">No hay filtros</li>
                )}
              </ul>
            </div>
          </div>
        </aside>

        {/* Right Content */}
        <div className="flex-1 min-w-0">
          {/* Top Bar for Sort/Count */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200">
            <span className="text-sm font-medium text-slate-500">
              {loading ? 'Buscando...' : `Mostrando ${selectedSub ? productsBySubcategory[selectedSub].length : totalProducts} productos`}
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-10 h-10 border-4 border-brand-green/20 border-t-brand-green rounded-full animate-spin"></div>
              <p className="text-brand-green font-bold uppercase tracking-widest text-xs animate-pulse">Cargando productos...</p>
            </div>
          ) : isEmpty ? (
            <div className="bg-white rounded-2xl border border-slate-200 text-center py-24 space-y-4 shadow-sm">
              <span className="material-symbols-outlined text-5xl text-slate-300">inventory_2</span>
              <p className="text-slate-500 font-medium">No se encontraron productos en esta selección.</p>
            </div>
          ) : (
             <div className="space-y-12">
               {displaySubs.map(sub => (
                 <div key={sub} className="scroll-mt-24" id={sub}>
                   <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight mb-6 flex items-center gap-3">
                     {sub}
                     <span className="flex-1 h-px bg-slate-100"></span>
                   </h2>
                   
                   <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                     {productsBySubcategory[sub].map((prod, i) => (
                       <ShowcaseProductCard key={prod.id} product={prod} delay={i * 0.05} />
                     ))}
                   </div>
                 </div>
               ))}
             </div>
          )}
        </div>
      </main>
    </div>
  );
}
