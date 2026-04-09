import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const categories = [
  {
    id: 'movilidad',
    label: 'Movilidad',
    driveFolder: '1gWT2aehbNFXcPWpoW5inipUUPp_cKGif',
    description: 'Sillas de ruedas, andaderas, bastones y muletas.',
    image: '/Cat_Movilidad.png',
  },
  {
    id: 'ortopedia',
    label: 'Ortopedia',
    driveFolder: '1PLev5o-M0QVl1QMxaB3qaBM56xr0yRA2',
    description: 'Línea blanda, colchones y cojines ortopédicos, y órtesis.',
    image: '/Cat_Ortopedia.png',
  },
  {
    id: 'equipos-insumos',
    label: 'Equipos e Insumos',
    driveFolder: '1ptvyu7cVLxCTaZ6GJ5bCVYHr_5rB0E3_',
    description: 'Monitoreo de signos vitales, nebulizadores y descartables médicos.',
    image: '/Cat_Equipos.png',
  },
  {
    id: 'fisioterapia',
    label: 'Fisioterapia',
    driveFolder: '1_GBb7XwTXmelpPBOZ9dfZRwTqzLiNqWM',
    description: 'Electroterapia, masajeadores, rehabilitación y terapia frío/calor.',
    image: '/Cat_Fisioterapia.png',
  },
  {
    id: 'ayudas-sanitarias',
    label: 'Ayudas Sanitarias',
    driveFolder: '159aQLMoBjZz3gavpZE9jUpIemklcM54o',
    description: 'Sillas de ducha, sanitarios portátiles y elevadores de WC.',
    image: '/Cat_Sanitarias.png',
  },
  {
    id: 'cuidado-personal',
    label: 'Cuidado Personal',
    driveFolder: '1On50xn71F_TMj1KspQgGmbc9hYT2veqQ',
    description: 'Alivio del dolor, cuidado de la piel y medias de compresión.',
    image: '/Cat_Cuidado.png',
  },
  {
    id: 'accesorios-repuestos',
    label: 'Accesorios y Repuestos',
    driveFolder: '1dgz8wObjlIn5M-FuzXTS7YdMwtH3uwqA',
    description: 'Repuestos y accesorios para equipos médicos.',
    image: '/Cat_Accesorios.png',
  },
];

export default function CategoryCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const navigate = useNavigate();

  const goTo = (index: number) => {
    setActive((index + categories.length) % categories.length);
  };

  useEffect(() => {
    if (paused) return;
    intervalRef.current = setInterval(() => {
      setActive(prev => (prev + 1) % categories.length);
    }, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paused, active]);

  const current = categories[active];

  return (
    <section
      className="w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Header */}
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 pt-12 md:pt-24 pb-8">
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-3xl md:text-5xl font-extrabold text-on-surface tracking-tight">
            Categorías Especializadas
          </h2>
          <div className="h-1 w-20 bg-brand-green mt-4 shrink-0" />
        </div>
        <p className="text-xl text-on-surface-variant max-w-3xl font-medium">
          Contamos con más de{' '}
          <span className="text-brand-blue font-bold">400+ productos disponibles</span>{' '}
          con asesoría personalizada de expertos certificados para cada área clínica.
        </p>
      </div>

      {/* Main slide */}
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 mb-12">
        <div className="relative h-[500px] md:h-[720px] w-full mx-auto overflow-hidden shadow-2xl border border-slate-100 group rounded-xl">
          {/* Background images — fade transition */}
          <AnimatePresence initial={false}>
            <motion.img
              key={current.id}
              src={current.image}
              alt={current.label}
              className="absolute inset-0 w-full h-full object-cover object-center"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
          </AnimatePresence>

          {/* Premium Ambient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent hidden md:block" />

          {/* Text content */}
          <div className="absolute inset-0 flex items-end">
            <div className="w-full p-8 md:p-16 pb-[140px] md:pb-[160px] space-y-3 md:space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`text-${current.id}`}
                  className="max-w-2xl space-y-3 md:space-y-6"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-green text-white text-[9px] md:text-xs font-black uppercase tracking-[0.2em] rounded-sm">
                    <span className="w-1.5 h-1.5 bg-white animate-pulse rounded-full"></span>
                    {current.label}
                  </div>
                  <div className="space-y-1 md:space-y-2">
                    <h3 className="text-3xl md:text-7xl font-black text-white leading-[1] tracking-tighter drop-shadow-2xl">
                      {current.label}
                    </h3>
                    <p className="text-white/80 text-sm md:text-xl font-light leading-relaxed max-w-lg">
                      {current.description}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(`/categoria/${current.id}`)}
                    className="bg-white text-brand-blue hover:bg-brand-blue hover:text-white px-8 md:px-10 py-3 md:py-4 font-black uppercase tracking-[0.1em] text-[10px] md:text-sm transition-all active:scale-[0.95] flex items-center gap-3 shadow-2xl hover:shadow-brand-blue/30 group-button rounded-lg"
                  >
                    Explorar Colección
                    <span className="material-symbols-outlined text-[18px] md:text-[20px] transition-transform">arrow_forward</span>
                  </button>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Slide counter */}
          <div className="absolute top-8 right-8 flex items-center gap-3 md:gap-4 text-white select-none">
            <div className="h-[1px] w-8 md:w-16 bg-white/30 hidden md:block" />
            <div className="flex items-baseline gap-1">
              <span className="text-2xl md:text-4xl font-black tabular-nums">
                {String(active + 1).padStart(2, '0')}
              </span>
              <span className="text-white/30 text-base md:text-xl">/</span>
              <span className="text-white/50 text-base md:text-xl tabular-nums">
                {String(categories.length).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Progress Indicator Dots — Posicionado debajo del contador de slides */}
          <div className="absolute top-[85px] md:top-[120px] right-8 flex flex-col gap-2 md:gap-3 z-20">
            {categories.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`w-1 transition-all duration-500 rounded-full ${
                  i === active ? 'h-6 md:h-10 bg-brand-cyan shadow-lg shadow-brand-cyan/50' : 'h-2 md:h-3 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>

          {/* Arrows */}
          <button
            onClick={() => goTo(active - 1)}
            className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 bg-white/10 hover:bg-white/30 backdrop-blur-md border border-white/10 text-white flex items-center justify-center transition-all rounded-full group/arrow"
            aria-label="Anterior"
          >
            <span className="material-symbols-outlined text-2xl md:text-3xl group-hover/arrow:-translate-x-1 transition-transform">chevron_left</span>
          </button>
          <button
            onClick={() => goTo(active + 1)}
            className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 bg-white/10 hover:bg-white/30 backdrop-blur-md border border-white/10 text-white flex items-center justify-center transition-all rounded-full group/arrow"
            aria-label="Siguiente"
          >
            <span className="material-symbols-outlined text-2xl md:text-3xl group-hover/arrow:translate-x-1 transition-transform">chevron_right</span>
          </button>

          {/* Thumbnail strip — integrado dentro de la imagen */}
          <div className="absolute bottom-0 left-0 right-0 bg-white/5 backdrop-blur-sm border-t border-white/10 group/strip">
            
            {/* Horizontal Progress Bar — Barra fluorescente que se mueve */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-white/10 overflow-hidden">
               <motion.div 
                 key={active}
                 initial={{ x: "-100%" }}
                 animate={{ x: "0%" }}
                 transition={{ duration: 5, ease: "linear" }}
                 className="w-full h-full bg-brand-cyan shadow-[0_0_10px_#00E5FF]"
               />
            </div>

            <div className="flex justify-center items-center gap-1 md:gap-2 px-4 md:px-8 py-3 md:py-4 overflow-x-auto scrollbar-hide">
              {categories.map((cat, i) => (
                <button
                  key={cat.id}
                  onClick={() => goTo(i)}
                  className="relative flex-shrink-0 flex flex-col items-center gap-1.5 px-2 md:px-4 py-1 group transition-all"
                >
                  {/* Selector bar beneath each specific tab when active */}
                  {i === active && (
                    <motion.div 
                      layoutId="active-tab-bar"
                      className="absolute -top-[1px] left-0 right-0 h-[3px] bg-brand-cyan z-30 shadow-[0_0_15px_rgba(0,229,255,0.8)]"
                    />
                  )}
                  <div
                    className={`w-14 h-10 md:w-20 md:h-14 overflow-hidden transition-all duration-300 ${
                      i === active
                        ? 'opacity-100 ring-2 ring-brand-cyan ring-offset-1 ring-offset-transparent'
                        : 'opacity-40 hover:opacity-70'
                    }`}
                  >
                    <img src={cat.image} alt={cat.label} className="w-full h-full object-cover" />
                  </div>
                  <span
                    className={`text-[8px] md:text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-colors ${
                      i === active ? 'text-brand-cyan' : 'text-white/50 group-hover:text-white/80'
                    }`}
                  >
                    {cat.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
