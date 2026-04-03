import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const NAV_LINKS = [
  { label: 'Movilidad', slug: 'movilidad' },
  { label: 'Colchones y Cojines', slug: 'colchones' },
  { label: 'Monitoreo', slug: 'monitoreo' },
  { label: 'Nebulizadores', slug: 'nebulizadores' },
  { label: 'Ayudas Sanitarias', slug: 'ayudas-sanitarias' },
  { label: 'Promociones', slug: '__promociones__' },
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
      {/* Announcement Bar */}
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

      {/* TopNavBar */}
      <nav className="fixed top-8 md:top-9 w-full z-40 bg-white/95 backdrop-blur-lg shadow-md border-b border-slate-100 antialiased tracking-tight">
        <div className="flex justify-between items-center px-4 md:px-8 py-3 md:py-4 max-w-screen-2xl mx-auto">

          {/* Logo — siempre lleva al home */}
          <Link to="/" className="block flex-shrink-0">
            <img
              alt="Tecnimedical Logo"
              className="h-12 md:h-16 w-auto object-contain"
              src="/logo.png"
            />
          </Link>

          {/* Links desktop */}
          <div className="hidden md:flex items-center gap-1">
            {/* Home */}
            <Link
              to="/"
              className={`px-3 py-1.5 text-sm font-semibold transition-colors flex items-center gap-1 ${
                isHome ? 'text-brand-blue' : 'text-slate-600 hover:text-brand-blue'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">home</span>
            </Link>
            {/* Separator */}
            <span className="text-slate-200 select-none">|</span>
            {/* Category links */}
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
                  className={`px-3 py-1.5 text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
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

          {/* Acciones */}
          <div className="flex items-center gap-1 md:gap-3">
            <button className="hidden md:flex hover:bg-white/50 transition-all p-2 rounded-full">
              <span className="material-symbols-outlined text-brand-blue">person</span>
            </button>
            <button className="hidden md:flex hover:bg-white/50 transition-all p-2 rounded-full relative">
              <span className="material-symbols-outlined text-brand-blue">shopping_cart</span>
              <span className="absolute top-0 right-0 bg-secondary w-2 h-2 rounded-full"></span>
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

        {/* Menú mobile */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/90 backdrop-blur-xl border-t border-slate-100 px-4 py-4 flex flex-col gap-1">
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
                className="mt-3 bg-brand-blue text-white py-3 font-black uppercase tracking-widest text-sm"
              >
                Ver Catálogo
              </button>
            )}
          </div>
        )}
      </nav>
    </>
  );
}
