import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const NAV_LINKS = [
  { label: 'Movilidad',          slug: 'movilidad' },
  { label: 'Ortopedia',          slug: 'ortopedia' },
  { label: 'Equipos e Insumos',  slug: 'equipos-insumos' },
  { label: 'Fisioterapia',       slug: 'fisioterapia' },
  { label: 'Ayudas Sanitarias',  slug: 'ayudas-sanitarias' },
  { label: 'Cuidado Personal',   slug: 'cuidado-personal' },
  { label: 'Accesorios',         slug: 'accesorios-repuestos' },
  { label: 'Promociones',        slug: '__promociones__' },
];

interface NavbarProps {
  onOpenCatalog?: () => void;
}

export default function Navbar({ onOpenCatalog }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/';

  const handleCategoryClick = (slug: string) => {
    setIsMobileMenuOpen(false);
    if (slug === '__promociones__') {
      navigate('/promociones');
    } else {
      navigate(`/categoria/${slug}`);
    }
  };

  return (
    <>
      {/* Row 1 — Announcement Bar */}
      <div className="fixed top-0 w-full z-50 bg-brand-blue text-white text-xs md:text-sm font-bold tracking-wide">
        <div className="flex items-center justify-center gap-2 md:gap-4 px-4 py-2">
          <span className="text-base md:text-lg">🚚</span>
          <span className="uppercase tracking-widest">
            Envíos <span className="text-brand-cyan">GRATIS</span> Lun · Mar · Mié
          </span>
          <span className="hidden sm:inline text-white/60">—</span>
          <span className="hidden sm:inline">A todo el país vía <span className="text-brand-cyan font-black">MRW</span></span>
          <span className="text-white/50 text-[10px] hidden md:inline">· Aplican condiciones</span>
        </div>
      </div>

      {/* Row 2 — Header: Logo + Search + Icons */}
      <div className="fixed top-8 md:top-9 w-full z-40 bg-white/70 backdrop-blur-lg border-b border-slate-100 antialiased">
        <div className="flex items-center gap-4 px-4 md:px-8 py-3 max-w-screen-2xl mx-auto">

          {/* Logo */}
          <Link to="/" className="block flex-shrink-0">
            <img
              alt="Tecnimedical Logo"
              className="h-10 md:h-14 w-auto object-contain"
              src="/logo.png"
            />
          </Link>

          {/* Search bar — desktop only */}
          <div className="hidden md:flex flex-1 items-center bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
            <span className="material-symbols-outlined text-slate-400 ml-4 text-[20px]">search</span>
            <input
              className="flex-1 bg-transparent border-none focus:ring-0 outline-none text-on-surface placeholder:text-slate-400 text-sm px-3 py-2.5"
              placeholder="Busca equipos médicos, sillas de ruedas, nebulizadores..."
              type="text"
            />
            <button className="bg-brand-blue hover:brightness-110 text-white px-5 py-2.5 text-xs font-black uppercase tracking-widest transition-all active:scale-95 m-1 rounded-md">
              Buscar
            </button>
          </div>

          {/* Location — desktop only */}
          <a
            href="https://www.google.com/maps/place/Tecnimedical.ve/@7.7986564,-72.2193905,1334m/data=!3m2!1e3!4b1!4m6!3m5!1s0x8e666de480c145df:0xc4200244066a6785!8m2!3d7.7986564!4d-72.2193905!16s%2Fg%2F11zk1s4yq3?entry=ttu&g_ep=EgoyMDI2MDQwNi4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 flex-shrink-0 group px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <span className="material-symbols-outlined text-brand-blue text-[22px]">location_on</span>
            <div className="flex flex-col leading-tight">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Tienda física</span>
              <span className="text-xs font-black text-on-surface group-hover:text-brand-blue transition-colors whitespace-nowrap">San Cristóbal, Táchira</span>
            </div>
          </a>

          {/* Ver Catálogo — desktop only */}
          {onOpenCatalog && (
            <button
              onClick={onOpenCatalog}
              className="hidden md:flex items-center gap-2 bg-brand-cyan hover:brightness-110 text-white px-5 py-2.5 text-xs font-black uppercase tracking-widest transition-all active:scale-95 rounded-lg whitespace-nowrap flex-shrink-0"
            >
              Ver Catálogo
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          )}

          {/* Icons */}
          <div className="flex items-center gap-1 ml-auto md:ml-0">
            <button className="hidden md:flex hover:bg-slate-100 transition-all p-2 rounded-full">
              <span className="material-symbols-outlined text-brand-blue">person</span>
            </button>
            <button className="hidden md:flex hover:bg-slate-100 transition-all p-2 rounded-full relative">
              <span className="material-symbols-outlined text-brand-blue">shopping_cart</span>
              <span className="absolute top-1 right-1 bg-secondary w-2 h-2 rounded-full"></span>
            </button>
            {/* Hamburger mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(prev => !prev)}
              className="md:hidden p-2 text-brand-blue"
              aria-label="Abrir menú"
            >
              <span className="material-symbols-outlined text-[28px]">
                {isMobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Row 3 — Category Nav: desktop only */}
      {/* top = announcement (2.25rem) + header row (5rem = py-3*2 + h-14) */}
      <nav className="hidden md:block fixed w-full z-30 bg-white/70 backdrop-blur-lg shadow-md border-b border-slate-100 antialiased tracking-tight"
        style={{ top: 'calc(2.25rem + 5rem)' }}
      >
        <div className="flex items-center justify-center gap-1 px-8 max-w-screen-2xl mx-auto">
          {/* Home */}
          <Link
            to="/"
            className={`px-3 py-2.5 text-sm font-semibold transition-colors flex items-center gap-1 ${
              isHome ? 'text-brand-blue' : 'text-slate-600 hover:text-brand-blue'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">home</span>
          </Link>
          <span className="text-slate-200 select-none">|</span>
          {NAV_LINKS.map(link => {
            const isActive = (link.slug === '__promociones__' ? location.pathname === '/promociones' : location.pathname === `/categoria/${link.slug}`);
            const isPromo = link.slug === '__promociones__';

            return (
              <motion.button
                key={link.slug}
                onClick={() => handleCategoryClick(link.slug)}
                whileHover={isPromo ? {
                  scale: 1.1,
                  rotate: [0, -2, 2, -2, 0],
                  transition: { duration: 0.3 }
                } : { scale: 1.05 }}
                className={`px-3 py-2.5 text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                  isActive
                    ? 'text-brand-green border-b-2 border-brand-green'
                    : isPromo
                      ? 'text-brand-green bg-brand-green/5 rounded-full'
                      : 'text-slate-600 hover:text-brand-green'
                }`}
              >
                {link.label}
              </motion.button>
            );
          })}
        </div>
      </nav>

      {/* Mobile menu dropdown */}
      {/* top = announcement (2rem) + header (4rem = py-3*2 + h-10 mobile) */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed w-full z-40 bg-white/90 backdrop-blur-xl border-t border-slate-100 px-4 py-4 flex flex-col gap-1 shadow-lg overflow-y-auto max-h-[80vh]"
          style={{ top: 'calc(2rem + 4rem)' }}
        >
          {/* Mobile search */}
          <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden mb-3">
            <span className="material-symbols-outlined text-slate-400 ml-3 text-[18px]">search</span>
            <input
              className="flex-1 bg-transparent border-none focus:ring-0 outline-none text-on-surface placeholder:text-slate-400 text-sm px-2 py-2"
              placeholder="Buscar productos..."
              type="text"
            />
            <button className="bg-brand-blue text-white px-3 py-2 text-xs font-black uppercase tracking-wider m-0.5 rounded-md">
              Buscar
            </button>
          </div>
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="py-3 px-2 text-slate-700 font-semibold border-b border-slate-100 hover:text-brand-blue transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">home</span>
            Inicio
          </Link>
          {NAV_LINKS.map(link => (
            <button
              key={link.slug}
              onClick={() => handleCategoryClick(link.slug)}
              className="py-3 px-2 text-left text-slate-700 font-semibold border-b border-slate-100 hover:text-brand-blue transition-colors"
            >
              {link.label}
            </button>
          ))}
          {onOpenCatalog && (
            <button
              onClick={() => { setIsMobileMenuOpen(false); onOpenCatalog(); }}
              className="mt-3 bg-brand-blue text-white py-3 font-black uppercase tracking-widest text-sm rounded-lg"
            >
              Ver Catálogo
            </button>
          )}
        </div>
      )}
    </>
  );
}
