import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import ProductDetail from './components/ProductDetail';
import LeadCaptureModal from './components/LeadCaptureModal';
import ChatWidget from './components/ChatWidget';
import CategoryCarousel from './components/CategoryCarousel';
import HeroCarousel from './components/HeroCarousel';
import CategoryPage from './pages/CategoryPage';
import ProductDetailPage from './pages/ProductDetailPage';
import SearchResultsPage from './pages/SearchResultsPage';
import PromoPage from './pages/PromoPage';
import Navbar from './components/Navbar';
import PromoSection from './components/PromoSection';
import InstagramReelSection from './components/InstagramReelSection';
import Footer from './components/Footer';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductForm from './pages/admin/ProductForm';
import { supabase } from './lib/supabase';

// Types
interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  ref: string;
  description: string;
  specs?: Record<string, string>;
  benefits?: string[];
}

function HomePage({ onOpenCatalog }: { onOpenCatalog: () => void }) {
  const navigate = useNavigate();
  return (
    <>
      {/* Interactive Hero Carousel */}
      <HeroCarousel onOpenCatalog={onOpenCatalog} />

      {/* Offers and Promotions Section */}
      <section className="max-w-screen-2xl mx-auto px-4 md:px-8 pt-16 md:pt-32 pb-8 md:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[450px]">
          {/* Main Featured Banner */}
          <div 
            onClick={() => navigate('/categoria/movilidad')}
            className="lg:col-span-2 relative group overflow-hidden bg-[#e6f4ed] flex items-center shadow-sm border border-brand-green/10 rounded-2xl cursor-pointer"
          >
            <div className="absolute right-0 bottom-0 w-2/3 h-full">
              <img
                alt="Sillas de Ruedas de Alta Gama"
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                src="/Inst1.png"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#e6f4ed] via-[#e6f4ed]/60 to-transparent"></div>
            </div>
            
            <div className="relative z-10 p-8 md:p-12 lg:p-16 max-w-md space-y-5">
            <div className="space-y-2">
                <p className="text-brand-green font-bold text-lg">Movilidad Elite</p>
                <h2 className="text-4xl lg:text-5xl font-extrabold text-primary leading-tight">Sillas de Ruedas: Ergonomía y Libertad</h2>
              </div>
              <div className="bg-brand-green hover:bg-brand-green/90 text-white px-8 py-3 font-bold inline-flex items-center gap-2 transition-all group-hover:px-10 shadow-lg shadow-brand-green/20 rounded-lg">
                Explorar Ofertas
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </div>
            </div>
          </div>

          {/* Right Column Banners */}
          <div className="flex flex-col gap-6">
            {/* Top Small Banner */}
            <div 
              onClick={() => navigate('/categoria/fisioterapia')}
              className="relative group overflow-hidden bg-[#e3f2fd] flex-1 min-h-[210px] flex items-center border border-brand-blue/10 rounded-2xl cursor-pointer"
            >
              <div className="absolute right-0 top-0 h-full w-1/2">
                <img
                  alt="Fomenteras Eléctricas"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  src="/Inst2.png"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#e3f2fd] via-[#e3f2fd]/40 to-transparent"></div>
              </div>
              
              <div className="relative z-10 p-8 space-y-3 w-[60%] lg:w-[65%]">
                <div className="space-y-1">
                  <p className="text-brand-blue font-semibold text-sm">Soporte Térmico</p>
                  <h3 className="text-xl font-bold text-primary leading-tight">Fomenteras Eléctricas</h3>
                </div>
                <div className="bg-brand-blue text-white px-5 py-2 text-sm font-bold inline-flex items-center gap-1 hover:bg-brand-blue/90 transition-all rounded-lg group-hover:px-7">
                  Comprar <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </div>
              </div>
            </div>

            {/* Bottom Small Banner */}
            <div 
              onClick={() => navigate('/categoria/movilidad')}
              className="relative group overflow-hidden bg-brand-blue flex-1 min-h-[210px] flex items-center border border-white/10 rounded-2xl cursor-pointer"
            >
              <div className="absolute right-0 top-0 h-full w-1/2">
                <img
                  alt="Andaderas de Nueva Generación"
                  className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
                  src="/Inst4.png"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-brand-blue via-brand-blue/60 to-transparent"></div>
              </div>

              <div className="relative z-10 p-8 pt-10 space-y-3 text-white w-[60%] lg:w-[65%]">
                <div className="space-y-1">
                  <p className="text-white/70 font-semibold text-sm">Movilidad Segura</p>
                  <h3 className="text-xl font-bold leading-tight">Andaderas: Estabilidad Total</h3>
                </div>
                <p className="text-white/60 text-[10px] leading-relaxed">Diseños anatómicos que se adaptan a tu ritmo de vida.</p>
                <div className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-2 text-sm font-bold inline-flex items-center gap-1 transition-all rounded-lg group-hover:px-7 mt-2">
                  Ver Modelos <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </div>
              </div>
              <span className="material-symbols-outlined absolute right-4 bottom-4 text-5xl text-white/10 pointer-events-none z-10">local_shipping</span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonios + Reel de Instagram */}
      <InstagramReelSection />

      {/* Promociones */}
      <PromoSection />

      {/* Catálogo Completo */}
      <FeaturedProducts />

      {/* Categorías Especializadas — Carousel */}
      <CategoryCarousel />

      {/* Help Banner */}
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 pb-16">
        <div className="relative overflow-hidden bg-brand-blue p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-white/10 group rounded-2xl">
          <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
            <img src="/Inst3.png" alt="Soporte Técnico" className="w-full h-full object-cover" />
          </div>
          <div className="relative z-10 flex items-center gap-6">
            <div className="w-16 h-16 bg-brand-green flex items-center justify-center shrink-0 rounded-xl">
              <span className="material-symbols-outlined text-white text-3xl">support_agent</span>
            </div>
            <div className="space-y-1">
              <h4 className="text-2xl font-extrabold text-white leading-tight">¿Necesitas asesoría especializada?</h4>
              <p className="text-white/80 text-lg font-light">Nuestros expertos certificados te ayudarán a elegir el equipo ideal.</p>
            </div>
          </div>
          <button
            onClick={() => window.dispatchEvent(new Event('tecni-open-chat'))}
            className="relative z-10 bg-brand-green hover:brightness-110 hover:scale-105 active:scale-95 text-white px-10 py-4 font-bold text-lg shadow-lg shadow-brand-green/20 transition-all whitespace-nowrap rounded-lg"
          >
            Contactar Experto
          </button>
        </div>
      </div>
    </>
  );
}

const BACKEND = 'https://bright-drive-backend-agent-production.up.railway.app';

function getProductImg(product: any): string {
  if (product.image_url) return product.image_url;
  if (product.drive_id) return `${BACKEND}/api/image/${product.drive_id}`;
  return '/logo.png';
}

function FeaturedProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    async function loadProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_visible', true)
          .order('created_at', { ascending: false })
          .limit(20);

        if (isMounted) {
          if (data && !error) setProducts(data);
          setLoading(false);
        }
      } catch {
        if (isMounted) setLoading(false);
      }
    }

    loadProducts();
    return () => { isMounted = false; };
  }, [location.key]);

  if (loading) return (
    <section className="max-w-screen-2xl mx-auto px-4 md:px-8 py-16">
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-brand-blue rounded-full animate-spin" />
      </div>
    </section>
  );

  if (products.length === 0) return null;

  return (
    <section className="max-w-screen-2xl mx-auto px-4 md:px-8 py-16">
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 uppercase tracking-tight">Nuestro Catálogo</h2>
          <p className="text-slate-500 font-medium">Equipos médicos de alta gama con garantía oficial</p>
        </div>
        <button
          onClick={() => navigate('/buscar?q=')}
          className="text-xs font-black uppercase tracking-widest text-brand-blue hover:text-brand-green transition-colors flex items-center gap-2"
        >
          Ver todo el inventario <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {products.map((product: any) => (
          <div key={product.id} onClick={() => navigate(`/producto/${product.slug}`)} className="cursor-pointer group">
            <div className="aspect-square bg-slate-50 rounded-2xl overflow-hidden mb-3 border border-slate-100 relative">
              <img
                src={getProductImg(product)}
                alt={product.name}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 p-4"
                onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png'; }}
              />
              {product.stock_status === 'CONSULT' && (
                <div className="absolute top-2 right-2 bg-amber-500 text-white text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md">Consultar</div>
              )}
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-brand-blue mb-1">{product.category}</p>
            <h3 className="font-bold text-slate-800 line-clamp-2 text-sm group-hover:text-brand-blue transition-colors">{product.name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkRole(user: any) {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('tenant_id', '63e2d67c-9b1a-4d3b-8f32-5a2e6f9c8d1b')
        .eq('role', 'admin')
        .single();

      setIsAdmin(!!data && !error);
      setLoading(false);
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) checkRole(session.user);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) checkRole(session.user);
      else {
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-8 h-8 border-4 border-slate-200 border-t-brand-blue rounded-full animate-spin"></div>
    </div>
  );

  if (!session) return <Navigate to="/admin/login" />;
  
  if (isAdmin === false) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
        <span className="material-symbols-outlined text-red-500 text-6xl mb-4">gpp_bad</span>
        <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Acceso Denegado</h1>
        <p className="text-slate-500 mt-2 max-w-sm">No tienes permisos de administrador para Tecnimedical. Contacta al soporte técnico si crees que esto es un error.</p>
        <button 
          onClick={() => supabase.auth.signOut()}
          className="mt-8 text-xs font-black uppercase tracking-widest text-brand-blue hover:underline"
        >
          Cerrar sesión e intentar con otra cuenta
        </button>
      </div>
    );
  }

  return <>{children}</>;
}

function App() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="bg-background font-body text-on-background antialiased overflow-x-hidden min-h-screen flex flex-col">
      <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      <LeadCaptureModal isOpen={isLeadModalOpen} onClose={() => setIsLeadModalOpen(false)} />
      {!isAdmin && <ChatWidget />}
      {!isAdmin && <Navbar onOpenCatalog={() => setIsLeadModalOpen(true)} />}

      <main className={`flex-1 ${isAdmin ? 'pt-0' : 'pt-24 md:pt-40'}`}>
        <Routes>
          <Route path="/" element={<HomePage onOpenCatalog={() => setIsLeadModalOpen(true)} />} />
          <Route path="/categoria/:slug" element={<CategoryPage />} />
          <Route path="/producto/:slug" element={<ProductDetailPage />} />
          <Route path="/buscar" element={<SearchResultsPage />} />
          <Route path="/promociones" element={<PromoPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/nuevo" element={<ProtectedRoute><ProductForm /></ProtectedRoute>} />
          <Route path="/admin/editar/:id" element={<ProtectedRoute><ProductForm /></ProtectedRoute>} />

          {/* Fallback to Home */}
          <Route path="*" element={<HomePage onOpenCatalog={() => setIsLeadModalOpen(true)} />} />
        </Routes>
      </main>

      {!isAdmin && <Footer />}
    </div>
  );
}

export default App;
