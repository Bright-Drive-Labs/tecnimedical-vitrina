import { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

  return (
    <Routes>
      <Route path="/categoria/:slug" element={<CategoryPage />} />
      <Route path="/producto/:slug" element={<ProductDetailPage />} />
      <Route path="/buscar" element={<SearchResultsPage />} />
      <Route path="/promociones" element={<PromoPage />} />
      <Route path="*" element={(
        <div className="bg-background font-body text-on-background antialiased overflow-x-hidden min-h-screen">
          <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} />
          <LeadCaptureModal isOpen={isLeadModalOpen} onClose={() => setIsLeadModalOpen(false)} />
          {/* ChatWidget: montado globalmente para estar disponible en toda la vitrina */}
          <ChatWidget />

          <Navbar onOpenCatalog={() => setIsLeadModalOpen(true)} />

          <main className="pt-24 md:pt-40">
            {/* Interactive Hero Carousel */}
            <HeroCarousel onOpenCatalog={() => setIsLeadModalOpen(true)} />

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

            {/* Testimonios + Reel de Instagram — social proof en el pico de interés */}
            <InstagramReelSection />

            {/* Promociones */}
            <PromoSection />

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
          </main>

          {/* Footer */}
          <footer className="bg-slate-50 w-full mt-auto border-t border-slate-200 text-sm leading-relaxed">

            {/* Social Networks Bar */}
            <div className="bg-white border-b border-slate-200 py-6 text-center">
              <div className="max-w-screen-2xl mx-auto px-4 flex justify-center items-center gap-12">
                <a 
                  href="https://www.facebook.com/p/tecnimedicalca-100090892604074/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 text-slate-400 hover:text-[#1877F2] transition-all hover:scale-110 active:scale-95 group"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:fill-[#1877F2]/10"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                  <span className="text-[10px] font-black uppercase tracking-widest hidden md:inline">Facebook</span>
                </a>
                
                <a 
                  href="https://www.instagram.com/tecnimedical.ve?igsh=NnBlZTQzOGR3NmRq" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  referrerPolicy="no-referrer"
                  className="flex items-center gap-2 text-slate-400 hover:text-[#E4405F] transition-all hover:scale-110 active:scale-95 group"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:fill-[#E4405F]/10"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  <span className="text-[10px] font-black uppercase tracking-widest hidden md:inline">Instagram</span>
                </a>
              </div>
            </div>

            {/* Ubicación física — DOS SUCURSALES */}
            <div id="tiendas-fisicas" className="bg-slate-50 border-t border-slate-100">
              <div className="max-w-screen-2xl mx-auto px-4 md:px-12 py-16 md:py-24">
                <div className="text-center mb-16 space-y-2">
                  <h2 className="text-2xl md:text-3xl font-black text-brand-blue uppercase tracking-tight">Nuestras Tiendas Físicas</h2>
                  <p className="text-slate-500 italic text-sm">Visítanos en San Cristóbal, Estado Táchira</p>
                </div>
                 
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                   {/* Sucursal 1: Santa Teresa */}
                   <div className="flex flex-col md:flex-row gap-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-100 hover:border-brand-blue/20 transition-all">
                     <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-brand-blue">location_on</span>
                          <h5 className="font-black text-slate-800 uppercase tracking-tight">Sede Santa Teresa</h5>
                        </div>
                        <div className="text-sm text-slate-600 space-y-1">
                          <p className="font-bold text-slate-800 text-base">Calle Santa Teresa, CC Santa Teresa, L-13</p>
                          <p>San Cristóbal, Táchira</p>
                        </div>
                        <a
                          href="https://www.google.com/maps/place/Tecnimedical.ve/@7.7986564,-72.2193905,17z"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-brand-blue hover:brightness-110 text-white px-5 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-md shadow-brand-blue/10"
                        >
                          <span className="material-symbols-outlined text-[16px]">directions</span>
                          Cómo llegar
                        </a>
                     </div>
                     <div className="w-full md:w-64 h-44 rounded-xl overflow-hidden shadow-inner border border-slate-200">
                        <iframe
                          title="Ubicación Santa Teresa"
                          src="https://maps.google.com/maps?q=7.7986564,-72.2193905&z=17&output=embed"
                          width="100%" height="100%" style={{ border: 0 }} loading="lazy"
                        />
                     </div>
                   </div>

                   {/* Sucursal 2: El Parque */}
                   <div className="flex flex-col md:flex-row gap-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-100 hover:border-brand-blue/20 transition-all">
                     <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-brand-blue">storefront</span>
                          <h5 className="font-black text-slate-800 uppercase tracking-tight">Sede El Parque</h5>
                        </div>
                        <div className="text-sm text-slate-600 space-y-1">
                          <p className="font-bold text-slate-800 text-base">Residencias El Parque, Local L-15</p>
                          <p>Av. 19 de Abril, San Cristóbal, Táchira</p>
                        </div>
                        <a
                          href="https://maps.app.goo.gl/ohKr5Et6L7Yaa4Am7"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-brand-blue hover:brightness-110 text-white px-5 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-md shadow-brand-blue/10"
                        >
                          <span className="material-symbols-outlined text-[16px]">directions</span>
                          Cómo llegar
                        </a>
                     </div>
                     <div className="w-full md:w-64 h-44 rounded-xl overflow-hidden shadow-inner border border-slate-200">
                        <iframe
                          title="Ubicación El Parque"
                          src="https://maps.google.com/maps?q=7.7598798,-72.2143562&z=17&output=embed"
                          width="100%" height="100%" style={{ border: 0 }} loading="lazy"
                        />
                     </div>
                   </div>
                 </div>
               </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 px-4 md:px-12 py-12 md:py-16 max-w-screen-2xl mx-auto items-start">

              {/* Logo y Copyright — Col 1 */}
              <div className="space-y-4">
                <img
                  alt="Tecnimedical Logo"
                  className="h-12 w-auto object-contain opacity-90"
                  src="/logo.png"
                />
                <p className="text-slate-500 text-xs leading-relaxed max-w-[200px]">© 2026 Tecnimedical. Suministros Médicos Venezuela.</p>
              </div>

              {/* Productos — Col 2 */}
              <div className="space-y-2">
                <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <li className="col-span-2"><h4 className="font-bold text-brand-blue text-sm mb-2 uppercase tracking-widest">Productos</h4></li>
                  <li><Link className="text-slate-500 hover:text-brand-blue hover:underline decoration-brand-blue/30 underline-offset-4 transition-opacity opacity-80 hover:opacity-100" to="/categoria/movilidad">Movilidad</Link></li>
                  <li><Link className="text-slate-500 hover:text-brand-blue hover:underline decoration-brand-blue/30 underline-offset-4 transition-opacity opacity-80 hover:opacity-100" to="/categoria/ortopedia">Ortopedia</Link></li>
                  <li><Link className="text-slate-500 hover:text-brand-blue hover:underline decoration-brand-blue/30 underline-offset-4 transition-opacity opacity-80 hover:opacity-100" to="/categoria/equipos-insumos">Equipos e Insumos</Link></li>
                  <li><Link className="text-slate-500 hover:text-brand-blue hover:underline decoration-brand-blue/30 underline-offset-4 transition-opacity opacity-80 hover:opacity-100" to="/categoria/fisioterapia">Fisioterapia</Link></li>
                  <li><Link className="text-slate-500 hover:text-brand-blue hover:underline decoration-brand-blue/30 underline-offset-4 transition-opacity opacity-80 hover:opacity-100" to="/categoria/ayudas-sanitarias">Ayudas Sanitarias</Link></li>
                  <li><Link className="text-slate-500 hover:text-brand-blue hover:underline decoration-brand-blue/30 underline-offset-4 transition-opacity opacity-80 hover:opacity-100" to="/categoria/cuidado-personal">Cuidado Personal</Link></li>
                  <li><Link className="text-slate-500 hover:text-brand-blue hover:underline decoration-brand-blue/30 underline-offset-4 transition-opacity opacity-80 hover:opacity-100" to="/categoria/accesorios-repuestos">Accesorios y Repuestos</Link></li>
                  <li><Link className="text-brand-green font-bold hover:underline decoration-brand-green/30 underline-offset-4 transition-opacity opacity-80 hover:opacity-100" to="/promociones">Promociones</Link></li>
                </ul>
              </div>

              {/* Horario de Atención — Col 3 */}
              <div className="space-y-4">
                <h4 className="font-bold text-brand-blue text-sm uppercase tracking-widest">Horario de Atención</h4>
                <ul className="space-y-3 text-xs text-slate-500">
                  <li className="flex justify-between border-b border-slate-100 pb-1">
                    <span className="font-semibold">Lunes - Viernes:</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </li>
                  <li className="flex justify-between border-b border-slate-100 pb-1">
                    <span className="font-semibold">Sábados:</span>
                    <span>10:00 AM - 1:00 PM</span>
                  </li>
                  <li className="flex justify-between text-red-400 font-bold">
                    <span className="font-semibold uppercase tracking-tighter">Domingos:</span>
                    <span className="bg-red-50 px-2 py-0.5 rounded">Cerrado</span>
                  </li>
                </ul>
              </div>

              {/* Contáctanos — Col 4 */}
              <div className="space-y-4">
                <h4 className="font-bold text-brand-blue text-sm uppercase tracking-widest">Contáctanos</h4>
                <ul className="space-y-4 text-sm">
                  <li>
                    <a 
                      href={`https://wa.me/584147148895`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-3 text-slate-500 hover:text-brand-blue transition-colors group"
                    >
                      <span className="material-symbols-outlined text-[20px] text-brand-blue/70 group-hover:text-brand-blue transition-colors outline-none">chat</span>
                      <span className="font-medium">Solo WhatsApp: +58 414 714 8895</span>
                    </a>
                  </li>
                  <li>
                    <button 
                      onClick={() => window.dispatchEvent(new Event('tecni-open-chat'))}
                      className="flex items-center gap-3 text-slate-500 hover:text-brand-blue transition-colors group cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[20px] text-brand-blue/70 group-hover:text-brand-blue transition-colors outline-none">support_agent</span>
                      <span className="font-medium">Chat en vivo</span>
                    </button>
                  </li>
                  <li>
                    <a 
                      href="mailto:Tecnimedicalca@gmail.com" 
                      className="flex items-center gap-3 text-slate-500 hover:text-brand-blue transition-colors group"
                    >
                      <span className="material-symbols-outlined text-[20px] text-brand-blue/70 group-hover:text-brand-blue transition-colors outline-none">mail</span>
                      <span className="font-medium">Email: Tecnimedicalca@gmail.com</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </footer>
        </div>
      )} />
    </Routes>
  );
}

export default App;
