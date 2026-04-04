import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductDetail from './components/ProductDetail';
import LeadCaptureModal from './components/LeadCaptureModal';
import ChatWidget from './components/ChatWidget';
import CategoryCarousel from './components/CategoryCarousel';
import HeroCarousel from './components/HeroCarousel';
import CategoryPage from './pages/CategoryPage';
import PromoPage from './pages/PromoPage';
import Navbar from './components/Navbar';
import PromoSection from './components/PromoSection';

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

function App() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

  return (
    <Routes>
      <Route path="/categoria/:slug" element={<CategoryPage />} />
      <Route path="/promociones" element={<PromoPage />} />
      <Route path="*" element={
    <div className="bg-background font-body text-on-background antialiased overflow-x-hidden min-h-screen">
      <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      <LeadCaptureModal isOpen={isLeadModalOpen} onClose={() => setIsLeadModalOpen(false)} />
      {/* ChatWidget: montado globalmente para estar disponible en toda la vitrina */}
      <ChatWidget />

      <Navbar onOpenCatalog={() => setIsLeadModalOpen(true)} />

      <main className="pt-28 md:pt-32">
        {/* Interactive Hero Carousel */}
        <HeroCarousel onOpenCatalog={() => setIsLeadModalOpen(true)} />

        {/* Offers and Promotions Section */}
        <section className="max-w-screen-2xl mx-auto px-4 md:px-8 pt-16 md:pt-32 pb-8 md:pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[450px]">
            {/* Main Featured Banner */}
            <div className="lg:col-span-2 relative group overflow-hidden bg-[#e6f4ed] flex items-center shadow-sm border border-brand-green/10">
              <div className="absolute right-0 bottom-0 w-2/3 h-full">
                <img
                  alt="Sillas de Ruedas de Alta Gama"
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                  src="/Inst1.png"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#e6f4ed] via-[#e6f4ed]/60 to-transparent"></div>
              </div>
              <div className="relative z-10 p-12 lg:p-16 max-w-md space-y-6">
                <span className="inline-block px-3 py-1 bg-[#ff5252] text-white text-xs font-bold uppercase tracking-wider">Big Sale 65% OFF</span>
                <div className="space-y-2">
                  <p className="text-brand-green font-bold text-lg">Movilidad Elite</p>
                  <h2 className="text-4xl lg:text-5xl font-extrabold text-primary leading-tight">Sillas de Ruedas: Ergonomía y Libertad</h2>
                </div>
                <button className="bg-brand-green hover:bg-brand-green/90 text-white px-8 py-3 font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-brand-green/20">
                  Explorar Ofertas
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>

            {/* Right Column Banners */}
            <div className="flex flex-col gap-6">
              {/* Top Small Banner */}
              <div className="relative group overflow-hidden bg-[#e3f2fd] flex-1 min-h-[210px] flex items-center border border-brand-blue/10">
                <div className="absolute right-0 top-0 h-full w-1/2">
                  <img
                    alt="Fomenteras Eléctricas"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    src="/Inst2.png"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#e3f2fd] via-[#e3f2fd]/40 to-transparent"></div>
                </div>
                <div className="relative z-10 p-8 space-y-3">
                  <span className="inline-block px-2 py-0.5 bg-[#ff5252] text-white text-[10px] font-bold uppercase tracking-widest">10% OFF</span>
                  <div className="space-y-1">
                    <p className="text-brand-blue font-semibold text-sm">Soporte Térmico</p>
                    <h3 className="text-xl font-bold text-primary">Fomenteras Eléctricas</h3>
                  </div>
                  <button className="bg-brand-blue text-white px-5 py-2 text-sm font-bold flex items-center gap-1 hover:bg-brand-blue/90 transition-all active:scale-95">
                    Comprar Ahora <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </button>
                </div>
              </div>

              {/* Bottom Small Banner */}
              <div className="relative group overflow-hidden bg-brand-blue flex-1 min-h-[210px] flex items-center border border-white/10">
                <div className="absolute right-0 top-0 h-full w-1/2">
                  <img
                    alt="Andaderas de Nueva Generación"
                    className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
                    src="/Inst4.png"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-blue via-brand-blue/60 to-transparent"></div>
                </div>
                <div className="relative z-10 p-8 space-y-3 text-white">
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-secondary-fixed tracking-tighter">40%</span>
                    <span className="text-2xl font-bold uppercase">OFF</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-white/70 font-semibold text-sm">Movilidad Segura</p>
                    <h3 className="text-xl font-bold">Andaderas: Estabilidad Total</h3>
                  </div>
                  <p className="text-white/60 text-[10px] leading-relaxed max-w-[180px]">Diseños anatómicos que se adaptan a tu ritmo de vida.</p>
                </div>
                <span className="material-symbols-outlined absolute right-4 bottom-4 text-5xl text-white/10 pointer-events-none">local_shipping</span>
              </div>
            </div>
          </div>
        </section>

        {/* Promociones */}
        <PromoSection />

        {/* Categorías Especializadas — Carousel */}
        <CategoryCarousel />

        {/* Help Banner */}
        <div className="max-w-screen-2xl mx-auto px-4 md:px-8 pb-16">
          <div className="relative overflow-hidden bg-brand-blue p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-white/10 group">
            <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
              <img src="/Inst3.png" alt="Soporte Técnico" className="w-full h-full object-cover" />
            </div>
            <div className="relative z-10 flex items-center gap-6">
              <div className="w-16 h-16 bg-brand-green flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-white text-3xl">support_agent</span>
              </div>
              <div className="space-y-1">
                <h4 className="text-2xl font-extrabold text-white leading-tight">¿Necesitas asesoría especializada?</h4>
                <p className="text-white/80 text-lg font-light">Nuestros expertos certificados te ayudarán a elegir el equipo ideal.</p>
              </div>
            </div>
            <button 
              onClick={() => window.dispatchEvent(new Event('tecni-open-chat'))}
              className="relative z-10 bg-brand-green hover:brightness-110 hover:scale-105 active:scale-95 text-white px-10 py-4 font-bold text-lg shadow-lg shadow-brand-green/20 transition-all whitespace-nowrap"
            >
              Contactar Experto
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 w-full mt-auto border-t border-slate-200 text-sm leading-relaxed">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 px-4 md:px-12 py-10 md:py-16 max-w-screen-2xl mx-auto">
          <div className="space-y-6">
            <img 
              alt="Tecnimedical Logo" 
              className="h-14 w-auto object-contain opacity-90" 
              src="/logo.png" 
            />
            <p className="text-slate-500">© 2026 Tecnimedical. Suministros Médicos Venezuela.</p>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-brand-blue">Productos</h4>
            <ul className="space-y-2">
              <li><Link className="text-slate-500 hover:text-brand-blue hover:underline decoration-brand-blue/30 underline-offset-4 transition-opacity opacity-80 hover:opacity-100" to="/categoria/movilidad">Movilidad</Link></li>
              <li><Link className="text-slate-500 hover:text-brand-blue hover:underline decoration-brand-blue/30 underline-offset-4 transition-opacity opacity-80 hover:opacity-100" to="/categoria/colchones">Colchones y Cojines</Link></li>
              <li><Link className="text-slate-500 hover:text-brand-blue hover:underline decoration-brand-blue/30 underline-offset-4 transition-opacity opacity-80 hover:opacity-100" to="/categoria/monitoreo">Monitoreo</Link></li>
              <li><Link className="text-slate-500 hover:text-brand-blue hover:underline decoration-brand-blue/30 underline-offset-4 transition-opacity opacity-80 hover:opacity-100" to="/categoria/nebulizadores">Nebulizadores</Link></li>
              <li><Link className="text-slate-500 hover:text-brand-blue hover:underline decoration-brand-blue/30 underline-offset-4 transition-opacity opacity-80 hover:opacity-100" to="/categoria/ayudas-sanitarias">Ayudas Sanitarias</Link></li>
              <li><Link className="text-brand-green font-bold hover:underline decoration-brand-green/30 underline-offset-4 transition-opacity opacity-80 hover:opacity-100" to="/promociones">Promociones</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-brand-blue">Contáctanos</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href={`https://wa.me/584147148895`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-3 text-slate-500 hover:text-brand-blue transition-colors group"
                >
                  <span className="material-symbols-outlined text-[20px] text-brand-blue/70 group-hover:text-brand-blue transition-colors outline-none">chat</span>
                  <span>Solo WhatsApp: +58 414 714 8895</span>
                </a>
              </li>
              <li>
                <button 
                  onClick={() => window.dispatchEvent(new Event('tecni-open-chat'))}
                  className="flex items-center gap-3 text-slate-500 hover:text-brand-blue transition-colors group cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px] text-brand-blue/70 group-hover:text-brand-blue transition-colors outline-none">support_agent</span>
                  <span>Chat en vivo</span>
                </button>
              </li>
              <li>
                <a 
                  href="mailto:ventas@tecnimedical.com" 
                  className="flex items-center gap-3 text-slate-500 hover:text-brand-blue transition-colors group"
                >
                  <span className="material-symbols-outlined text-[20px] text-brand-blue/70 group-hover:text-brand-blue transition-colors outline-none">mail</span>
                  <span>Email: ventas@tecnimedical.com</span>
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h4 className="font-bold text-brand-blue">Newsletter</h4>
              <motion.span 
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="text-[9px] bg-brand-green text-white px-2 py-0.5 rounded-full font-black uppercase tracking-widest shadow-lg shadow-brand-green/20"
              >
                ¡ÚNETE!
              </motion.span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Recibe ofertas exclusivas y novedades de Tecnimedical.</p>
            <div className="flex gap-2 relative group-newsletter">
              <input 
                className="bg-white dark:bg-slate-800 border border-slate-200 px-4 py-2 text-sm focus:ring-1 ring-brand-blue w-full rounded-lg transition-all" 
                placeholder="Tu correo electrónico" 
                type="email"
              />
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="bg-brand-blue text-white p-2.5 rounded-lg hover:brightness-110 transition-all relative group/sub shadow-lg shadow-brand-blue/20"
              >
                <span className="material-symbols-outlined text-[20px]">send</span>
                <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-brand-blue text-white text-[10px] px-3 py-1.5 rounded-lg opacity-0 group-hover/sub:opacity-100 transition-all scale-90 group-hover/sub:scale-100 whitespace-nowrap pointer-events-none font-bold uppercase tracking-wider shadow-xl border border-white/10">
                  Suscríbete ahora
                </span>
              </motion.button>
            </div>
          </div>
        </div>
      </footer>
    </div>
      } />
    </Routes>
  );
}

export default App;
