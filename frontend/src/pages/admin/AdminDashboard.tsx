import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { getImageUrl } from '../../services/api';
import Fuse from 'fuse.js';

interface Product {
  id: string;
  name: string;
  category: string;
  image_url: string | null;
  drive_id: string | null;
  slug: string;
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, category, image_url, drive_id, slug')
        .eq('tenant_id', '63e2d67c-9b1a-4d3b-8f32-5a2e6f9c8d1b')
        .order('created_at', { ascending: false });

      if (error) console.error(error);
      else setProducts(data || []);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    
    const fuse = new Fuse(products, {
      keys: ['name', 'category'],
      threshold: 0.3
    });
    
    return fuse.search(searchQuery).map(r => r.item);
  }, [searchQuery, products]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img src="/logo.png" className="h-8" alt="Tecnimedical" />
            <span className="text-slate-300">|</span>
            <span className="text-xs font-black uppercase tracking-widest text-slate-500">Panel Admin</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-brand-blue">Ver Tienda</Link>
            <button onClick={handleLogout} className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-700">Cerrar Sesión</button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 md:p-10">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Gestión de Catálogo</h1>
            <p className="text-slate-500 text-sm mt-1">Administra los productos que ven tus clientes</p>
          </div>
          
          <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-4">
            <div className="relative flex-1 sm:w-80">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
              <input 
                type="text"
                placeholder="Buscar por nombre o categoría..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all shadow-sm"
              />
            </div>
            
            <Link 
              to="/admin/nuevo" 
              className="bg-brand-blue text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#1a4b8a] transition-all flex items-center justify-center gap-2 shadow-lg shrink-0"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Añadir Producto
            </Link>
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-brand-blue rounded-full animate-spin"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center border border-slate-100 shadow-sm">
            <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">inventory_2</span>
            <h3 className="text-xl font-bold text-slate-400">No se encontraron productos</h3>
            <p className="text-slate-400 text-sm mt-1">Prueba con otra búsqueda o añade un nuevo producto.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(prod => (
              <div key={prod.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm group">
                <div className="h-48 bg-slate-50 flex items-center justify-center p-4 border-b border-slate-100">
                  <img 
                    src={getImageUrl(prod.image_url || prod.drive_id || '')} 
                    alt={prod.name} 
                    className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">{prod.category}</p>
                  <h3 className="font-bold text-slate-800 text-sm line-clamp-1">{prod.name}</h3>
                  <div className="mt-4 flex justify-between items-center">
                    <Link to={`/producto/${prod.slug}`} className="text-[10px] font-bold text-brand-blue hover:underline uppercase">Ver Publicado</Link>
                    <div className="flex gap-2">
                       <button className="text-slate-300 hover:text-slate-600"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
