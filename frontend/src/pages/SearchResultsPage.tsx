import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ShowcaseProductCard from '../components/ShowcaseProductCard';
import { supabase } from '../lib/supabase';
import Fuse from 'fuse.js';

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFuzzy, setIsFuzzy] = useState(false);

  useEffect(() => {
    async function fetchResults() {
      setLoading(true);
      setIsFuzzy(false);
      try {
        // 1. Try DB Exact/Contains
        const { data } = await supabase
          .from('products')
          .select('*')
          .ilike('name', `%${query}%`);

        if (data && data.length > 0) {
          setProducts(data);
        } else {
          // 2. Fuzzy Fallback
          const { data: all } = await supabase.from('products').select('*');
          if (all) {
            const fuse = new Fuse(all, { keys: ['name'], threshold: 0.4 });
            const fuzzyResults = fuse.search(query).map(r => r.item);
            setProducts(fuzzyResults);
            if (fuzzyResults.length > 0) setIsFuzzy(true);
          }
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }
    if (query) fetchResults();
  }, [query]);

  return (
    <div className="bg-slate-50 min-h-screen font-body">
      <Navbar />

      <div className="pt-32 md:pt-44 max-w-screen-2xl mx-auto px-4 md:px-8 pb-20">
        <header className="mb-10 space-y-2">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
            <Link to="/" className="hover:text-brand-blue">Inicio</Link>
            <span>/</span>
            <span className="text-slate-800">Búsqueda</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
            {isFuzzy ? 'Mostrando resultados sugeridos' : `Resultados para "${query}"`}
          </h1>
          {isFuzzy && (
            <p className="text-brand-blue font-bold text-sm bg-brand-blue/5 px-3 py-1 rounded-full inline-block">
              No encontramos "{query}". ¿Quizás buscabas uno de estos?
            </p>
          )}
          <p className="text-slate-500 text-sm">
            {loading ? 'Buscando...' : `${products.length} productos encontrados`}
          </p>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-brand-blue rounded-full animate-spin" />
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {products.map(product => (
              <ShowcaseProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 space-y-6">
            <span className="material-symbols-outlined text-6xl text-slate-200">search_off</span>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-700">No encontramos coincidencias exactas</h2>
              <p className="text-slate-500 max-w-md mx-auto">
                Prueba buscando términos más generales como "silla", "andadera" o "GMD".
              </p>
            </div>
            <Link 
              to="/" 
              className="inline-block bg-brand-blue text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:brightness-110 transition-all"
            >
              Ver todo el catálogo
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
