import { Link } from 'react-router-dom';

export default function Footer() {
  return (
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
          <Link 
            to="/admin" 
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-brand-blue transition-all mt-4 group"
          >
            <span className="material-symbols-outlined text-[14px]">lock</span>
            Acceso Admin
          </Link>
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
  );
}
