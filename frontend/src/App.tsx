import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
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
                <div className="lg:col-span-2 relative group overflow-hidden bg-[#e6f4ed] flex items-center shadow-sm border border-brand-green/10 rounded-2xl">
                  <div className="absolute right-0 bottom-0 w-2/3 h-full">
                    <img
                      alt="Sillas de Ruedas de Alta Gama"
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                      src="/Inst1.png"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#e6f4ed] via-[#e6f4ed]/60 to-transparent"></div>
                  </div>
                  
                  <div className="relative z-10 p-8 md:p-12 lg:p-16 max-w-md space-y-5">
                    <div className="inline-flex bg-[#e57b3e] text-white px-3 py-1.5 rounded-md font-bold text-sm shadow-sm items-center gap-1">
                      <span className="material-symbols-outlined text-sm">local_fire_department</span>
                      -65% OFF
                    </div>
                    <div className="space-y-2">
                      <p className="text-brand-green font-bold text-lg">Movilidad Elite</p>
                      <h2 className="text-4xl lg:text-5xl font-extrabold text-primary leading-tight">Sillas de Ruedas: Ergonomía y Libertad</h2>
                    </div>
                    <button className="bg-brand-green hover:bg-brand-green/90 text-white px-8 py-3 font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-brand-green/20 rounded-lg">
                      Explorar Ofertas
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                </div>

                {/* Right Column Banners */}
                <div className="flex flex-col gap-6">
                  {/* Top Small Banner */}
                  <div className="relative group overflow-hidden bg-[#e3f2fd] flex-1 min-h-[210px] flex items-center border border-brand-blue/10 rounded-2xl">
                    <div className="absolute right-0 top-0 h-full w-1/2">
                      <img
                        alt="Fomenteras Eléctricas"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        src="/Inst2.png"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-[#e3f2fd] via-[#e3f2fd]/40 to-transparent"></div>
                    </div>
                    
                    <div className="relative z-10 p-8 space-y-3 w-[60%] lg:w-[65%]">
                      <div>
                        <span className="inline-block bg-[#e57b3e] text-white px-2.5 py-1 rounded-md font-bold text-xs shadow-sm">
                          -10% OFF
                        </span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-brand-blue font-semibold text-sm">Soporte Térmico</p>
                        <h3 className="text-xl font-bold text-primary leading-tight">Fomenteras Eléctricas</h3>
                      </div>
                      <button className="bg-brand-blue text-white px-5 py-2 text-sm font-bold flex items-center gap-1 hover:bg-brand-blue/90 transition-all active:scale-95 rounded-lg">
                        Comprar <span className="material-symbols-outlined text-xs">arrow_forward</span>
                      </button>
                    </div>
                  </div>

                  {/* Bottom Small Banner */}
                  <div className="relative group overflow-hidden bg-brand-blue flex-1 min-h-[210px] flex items-center border border-white/10 rounded-2xl">
                    <div className="absolute right-0 top-0 h-full w-1/2">
                      <img
                        alt="Andaderas de Nueva Generación"
                        className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
                        src="/Inst4.png"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-brand-blue via-brand-blue/60 to-transparent"></div>
                    </div>

                    <div className="relative z-10 p-8 pt-10 space-y-3 text-white w-[60%] lg:w-[65%]">
                      <div>
                        <span className="inline-block bg-[#e57b3e] text-white px-2.5 py-1 rounded-md font-bold text-xs shadow-sm shadow-black/10">
                          -40% OFF
                        </span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-white/70 font-semibold text-sm">Movilidad Segura</p>
                        <h3 className="text-xl font-bold leading-tight">Andaderas: Estabilidad Total</h3>
                      </div>
                      <p className="text-white/60 text-[10px] leading-relaxed">Diseños anatómicos que se adaptan a tu ritmo de vida.</p>
                    </div>
                    <span className="material-symbols-outlined absolute right-4 bottom-4 text-5xl text-white/10 pointer-events-none z-10">local_shipping</span>
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

            {/* Ubicación física — con mapa */}
            <div className="bg-white border-b border-slate-200">
              <div className="max-w-screen-2xl mx-auto px-4 md:px-12 py-8 md:py-10 flex flex-col md:flex-row items-stretch gap-6 md:gap-8">
                {/* Texto e info */}
                <div className="flex items-center gap-4 flex-shrink-0">
                  <span className="material-symbols-outlined text-brand-blue text-[32px] flex-shrink-0">location_on</span>
                  <div className="space-y-1">
                    <h4 className="font-black text-brand-blue uppercase text-sm tracking-widest">Tienda Física</h4>
                    <p className="text-slate-700 font-bold text-base">Calle Santa Teresa, CC Santa Teresa, L-13</p>
                    <p className="text-slate-500 text-xs text-brand-blue font-medium">Av. 19 de Abril, Edif. El Parque, L-15</p>
                    <p className="text-slate-500 text-xs">San Cristóbal, Táchira, Venezuela</p>
                    <a
                      href="https://www.google.com/maps/place/Tecnimedical.ve/@7.7986564,-72.2193905,1334m/data=!3m2!1e3!4b1!4m6!3m5!1s0x8e666de480c145df:0xc4200244066a6785!8m2!3d7.7986564!4d-72.2193905!16s%2Fg%2F11zk1s4yq3?entry=ttu&g_ep=EgoyMDI2MDQwNi4wIKXMDSoASAFQAw%3D%3D"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-3 bg-brand-blue hover:brightness-110 text-white px-5 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[14px]">directions</span>
                      Cómo llegar
                    </a>
                  </div>
                </div>

                {/* Mapa */}
                <div className="w-full md:flex-1 rounded-lg overflow-hidden shadow-md border border-slate-200 h-40 md:h-auto min-h-40">
                  <iframe
                    title="Ubicación Tecnimedical"
                    src="https://maps.google.com/maps?q=7.7986564,-72.2193905&z=17&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
            {/* Social Networks Bar */}
            <div className="bg-white border-b border-slate-200 py-6">
              <div className="max-w-screen-2xl mx-auto px-4 flex justify-center items-center gap-6">
                <a href="https://www.facebook.com/tecnimedical.ca/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-brand-blue hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-brand-blue hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"></path><path d="M9 3v15"></path><path d="M9 3c4 0 6 2 6 2"></path></svg>
                </a>
                <a href="https://www.instagram.com/tecnimedical.ve/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-brand-blue hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-brand-blue hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-brand-blue hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.11 1 12 1 12s0 3.89.46 5.58a2.78 2.78 0 0 0 1.94 2c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.89 23 12 23 12s0-3.89-.46-5.58z"></path><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"></polygon></svg>
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-12 gap-8 md:gap-12 px-4 md:px-12 py-12 md:py-16 max-w-screen-2xl mx-auto">

              {/* Logo, Copyright y Redes Sociales — 2 cols */}
              <div className="space-y-4 md:col-span-2">
                <img
                  alt="Tecnimedical Logo"
                  className="h-12 w-auto object-contain opacity-90"
                  src="/logo.png"
                />
                <p className="text-slate-500 text-xs leading-relaxed">© 2026 Tecnimedical. Suministros Médicos Venezuela.</p>
              </div>

              {/* Productos — 3 cols (2 columnas internas) */}
              <div className="space-y-2 md:col-span-3">
                <ul className="grid grid-cols-2 gap-x-3 gap-y-2">
                  <li><h4 className="font-bold text-brand-blue text-sm mb-2">Productos</h4></li>
                  <li></li>
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

              {/* Horario de Atención — 2 cols */}
              <div className="space-y-4 md:col-span-2">
                <h4 className="font-bold text-brand-blue text-sm">Horario de Atención</h4>
                <ul className="space-y-2 text-xs text-slate-500">
                  <li className="flex justify-between">
                    <span className="font-semibold">Lunes - Viernes:</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-semibold">Sábados:</span>
                    <span>10:00 AM - 1:00 PM</span>
                  </li>
                  <li className="flex justify-between text-red-400">
                    <span className="font-semibold">Domingos:</span>
                    <span>Cerrado</span>
                  </li>
                </ul>
              </div>
              {/* Contáctanos — 2 cols */}
              <div className="space-y-4 md:col-span-2">
                <h4 className="font-bold text-brand-blue text-sm">Contáctanos</h4>
                <ul className="space-y-3 text-sm">
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
                      href="mailto:Tecnimedicalca@gmail.com" 
                      className="flex items-center gap-3 text-slate-500 hover:text-brand-blue transition-colors group"
                    >
                      <span className="material-symbols-outlined text-[20px] text-brand-blue/70 group-hover:text-brand-blue transition-colors outline-none">mail</span>
                      <span>Email: Tecnimedicalca@gmail.com</span>
                    </a>
                  </li>
                </ul>
              </div>
              {/* Newsletter — 3 cols */}
              <div className="space-y-4 md:col-span-3">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-brand-blue text-sm">Newsletter</h4>
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
                    className="bg-brand-blue text-white p-2.5 rounded-lg hover:brightness-110 transition-all relative group/sub shadow-lg shadow-brand-blue/20 flex items-center justify-center"
                  >
                    <Send size={20} />
                    <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-brand-blue text-white text-[10px] px-3 py-1.5 rounded-lg opacity-0 group-hover/sub:opacity-100 transition-all scale-90 group-hover/sub:scale-100 whitespace-nowrap pointer-events-none font-bold uppercase tracking-wider shadow-xl border border-white/10">
                      Suscríbete ahora
                    </span>
                  </motion.button>
                </div>
              </div>
            </div>
          </footer>
        </div>
      )} />
    </Routes>
  );
}

export default App;
