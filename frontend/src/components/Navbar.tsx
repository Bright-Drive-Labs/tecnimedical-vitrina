import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import Fuse from 'fuse.js';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<any>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/';

  // Load products for fuzzy search once
  useEffect(() => {
    async function loadAll() {
      const { data } = await supabase.from('products').select('name, slug, category').not('drive_id', 'is', null);
      if (data) setAllProducts(data);
    }
    loadAll();
  }, []);

  const fuse = new Fuse(allProducts, {
    keys: ['name', 'category'],
    threshold: 0.4,
  });

  useEffect(() => {
    if (searchQuery.length > 1) {
      const results = fuse.search(searchQuery).slice(0, 6).map(r => r.item);
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery, allProducts]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    navigate(`/buscar?q=${encodeURIComponent(searchQuery)}`);
    setSearchQuery('');
    setShowSuggestions(false);
    setIsMobileMenuOpen(false);
  };

  const handleSuggestionClick = (slug: string) => {
    navigate(`/producto/${slug}`);
    setSearchQuery('');
    setShowSuggestions(false);
    setIsMobileMenuOpen(false);
  };

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
      <div className="fixed top-0 w-full z-50 bg-brand-blue text-white text-[10px] md:text-sm font-bold tracking-wide">
        <div className="flex items-center justify-center gap-2 md:gap-4 px-4 py-2">
          <span className="text-base md:text-lg">🚚</span>
          <span className="uppercase tracking-widest whitespace-nowrap">
            Envíos <span className="text-brand-cyan">GRATIS</span> a todo el país vía <span className="text-brand-cyan font-black">MRW</span>
          </span>
          <span className="text-white/50 text-[9px] hidden md:inline ml-2 uppercase tracking-tighter">· Aplican condiciones</span>
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
          <form 
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 items-center bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-brand-blue/20 transition-all relative"
            ref={searchRef}
          >
            <span className="material-symbols-outlined text-slate-400 ml-4 text-[20px]">search</span>
            <input
              className="flex-1 bg-transparent border-none focus:ring-0 outline-none text-on-surface placeholder:text-slate-400 text-sm px-3 py-2.5"
              placeholder="Busca equipos médicos, sillas de ruedas, nebulizadores..."
              type="text"
              value={searchQuery}
              onFocus={() => setShowSuggestions(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
            />
            <button 
              type="submit"
              className="bg-brand-blue hover:brightness-110 text-white px-5 py-2.5 text-xs font-black uppercase tracking-widest transition-all active:scale-95 m-1 rounded-md flex items-center gap-2"
            >
              Buscar
            </button>

            {/* Suggestions Dropdown */}
            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-50"
                >
                  {suggestions.map((p) => (
                    <button
                      key={p.slug}
                      onClick={() => handleSuggestionClick(p.slug)}
                      className="w-full flex items-center justify-between px-6 py-3.5 hover:bg-slate-50 transition-colors text-left"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800">{p.name}</span>
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{p.category}</span>
                      </div>
                      <span className="material-symbols-outlined text-slate-300 text-sm">arrow_forward</span>
                    </button>
                  ))}
                  <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-center">
                    <button 
                      onClick={handleSearch}
                      className="text-[10px] font-black uppercase tracking-widest text-brand-blue hover:underline"
                    >
                      Ver todos los resultados
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          {/* Tiendas Físicas Shortcut — Desktop only */}
          <motion.button
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              const section = document.getElementById('tiendas-fisicas');
              if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="hidden lg:flex flex-shrink-0 items-center gap-2 px-2 bg-transparent transition-all group ml-2"
            title="Ver Tiendas Físicas"
          >
            <div className="w-9 h-9 flex items-center justify-center text-brand-green bg-brand-green/5 rounded-full group-hover:bg-brand-green/10 transition-all">
              <span className="material-symbols-outlined text-[24px]">storefront</span>
            </div>
            <div className="flex flex-col items-start leading-none pointer-events-none">
              <span className="text-[11px] font-black uppercase tracking-tighter text-brand-blue group-hover:text-brand-green transition-colors">Tiendas físicas</span>
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-0.5">San Cristóbal, Táchira</span>
            </div>
          </motion.button>

          {/* Social Icons / Mobile Toggle / Right Actions */}
          <div className="flex items-center gap-1 md:gap-3 ml-2 lg:ml-0">
            {/* Keeping it simple — no icons for now as per user request */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center text-slate-700 bg-slate-50 rounded-lg"
            >
              <span className="material-symbols-outlined">{isMobileMenuOpen ? 'close' : 'menu'}</span>
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
          <form 
            onSubmit={handleSearch}
            className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden mb-3"
          >
            <span className="material-symbols-outlined text-slate-400 ml-3 text-[18px]">search</span>
            <input
              className="flex-1 bg-transparent border-none focus:ring-0 outline-none text-on-surface placeholder:text-slate-400 text-sm px-2 py-2"
              placeholder="Buscar productos..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              type="submit"
              className="bg-brand-blue text-white px-3 py-2 text-xs font-black uppercase tracking-wider m-0.5 rounded-md"
            >
              Buscar
            </button>
          </form>
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
