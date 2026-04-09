import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

const slides = [
  {
    id: 'hero',
    tagline: 'Especialistas en Equipos Médicos · Venezuela',
    title: 'La salud de tu familia, respaldada por expertos',
    description: '+400 productos certificados CE y FDA. Atendemos personas, fisioterapeutas, clínicas y hospitales en todo Venezuela — con asesoría personalizada y entrega a domicilio.',
    image: '/background.png',
    link: '/promociones',
    isHero: true,
  },
  {
    id: 'movilidad',
    tagline: 'Movilidad',
    title: 'Soluciones de Movilidad',
    description: 'Sillas de ruedas, andaderas, bastones y muletas.',
    image: '/Cat_Movilidad.png',
    link: '/categoria/movilidad',
  },
  {
    id: 'ortopedia',
    tagline: 'Ortopedia',
    title: 'Ortopedia y Línea Blanda',
    description: 'Línea blanda, colchones y cojines ortopédicos, y órtesis.',
    image: '/Cat_Ortopedia.png',
    link: '/categoria/ortopedia',
  },
  {
    id: 'equipos-insumos',
    tagline: 'Equipos e Insumos',
    title: 'Monitoreo y Nebulización',
    description: 'Monitoreo de signos vitales, nebulizadores y descartables médicos.',
    image: '/Cat_Equipos.png',
    link: '/categoria/equipos-insumos',
  },
  {
    id: 'fisioterapia',
    tagline: 'Fisioterapia',
    title: 'Equipos de Fisioterapia',
    description: 'Electroterapia, masajeadores, rehabilitación y terapia frío/calor.',
    image: '/Cat_Fisioterapia.png',
    link: '/categoria/fisioterapia',
  },
  {
    id: 'ayudas-sanitarias',
    tagline: 'Ayudas Sanitarias',
    title: 'Seguridad en el Baño',
    description: 'Sillas de ducha, sanitarios portátiles y elevadores de WC.',
    image: '/Cat_Sanitarias.png',
    link: '/categoria/ayudas-sanitarias',
  },
  {
    id: 'cuidado-personal',
    tagline: 'Cuidado Personal',
    title: 'Bienestar y Cuidado',
    description: 'Alivio del dolor, cuidado de la piel y medias de compresión.',
    image: '/Cat_Cuidado.png',
    link: '/categoria/cuidado-personal',
  },
  {
    id: 'accesorios-repuestos',
    tagline: 'Accesorios y Repuestos',
    title: 'Repuestos y Accesorios',
    description: 'Repuestos y accesorios para equipos médicos.',
    image: '/Cat_Accesorios.png',
    link: '/categoria/accesorios-repuestos',
  },
];

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
};

type HeroCarouselProps = {
  onOpenCatalog: () => void;
};

export default function HeroCarousel({ onOpenCatalog }: HeroCarouselProps) {
  const [[page, direction], setPage] = useState([0, 0]);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse tracking for "living shadow"
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const activeIndex = ((page % slides.length) + slides.length) % slides.length;
  const current = slides[activeIndex];

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    // Map to pixel shift for shadow
    mouseX.set((x - 0.5) * 15); 
    mouseY.set((y - 0.5) * 15);
  };

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  useEffect(() => {
    if (paused) return;
    intervalRef.current = setInterval(() => {
      paginate(1);
    }, 6000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paused, page]);

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[500px] md:min-h-[700px] flex items-center bg-slate-900"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background Images Layer */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={page}
            src={current.image}
            alt={current.title}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </AnimatePresence>
        <div className="absolute inset-0 hero-bg-overlay transition-opacity duration-1000"></div>
      </div>

      {/* Slide Content */}
      <div className="relative max-w-screen-2xl mx-auto px-4 md:px-8 w-full z-20 pointer-events-none">
        <div className="max-w-4xl py-10 md:py-12 pointer-events-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex flex-col gap-6"
            >
              <div className="inline-flex self-start items-center gap-2 px-4 py-1.5 bg-brand-green text-white text-xs md:text-sm font-black tracking-[0.15em] uppercase rounded-sm shadow-xl">
                <span className="w-2 h-2 bg-white animate-pulse rounded-full"></span>
                {current.tagline}
              </div>
              <div className="space-y-4 md:space-y-6">
                <Link to={current.link} className="block group">
                  <motion.h1 
                    style={{ textShadow: useTransform([mouseX, mouseY], ([x, y]) => `${x as number}px ${y as number + 4}px 25px rgba(0, 102, 178, 0.6)`) }}
                    className="text-4xl sm:text-6xl lg:text-8xl font-black text-white leading-[1] tracking-tighter cursor-pointer transition-all duration-300"
                  >
                    {current.title}
                  </motion.h1>
                </Link>
                <motion.p 
                  style={{ textShadow: useTransform([mouseX, mouseY], ([x, y]) => `${(x as number)*0.5}px ${(y as number + 2)*0.5}px 15px rgba(0, 102, 178, 0.5)`) }}
                  className="text-base sm:text-xl text-white/95 max-w-xl leading-relaxed font-bold"
                >
                  {current.description}
                </motion.p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Trust Indicators - Always visible */}
          <div className="flex flex-wrap items-center gap-x-8 md:gap-x-12 gap-y-4 pt-10">
            <div className="flex items-center gap-3 group">
              <span className="material-symbols-outlined text-brand-green text-[28px] drop-shadow-lg">inventory_2</span>
              <div className="flex flex-col">
                <motion.span 
                  style={{ textShadow: useTransform([mouseX, mouseY], ([x, y]) => `${(x as number)*0.2}px ${(y as number)*0.2}px 8px rgba(0, 102, 178, 0.45)`) }}
                  className="text-xl font-black text-white leading-none"
                >
                  400+
                </motion.span>
                <motion.span 
                  style={{ textShadow: useTransform([mouseX, mouseY], ([x, y]) => `${(x as number)*0.1}px ${(y as number)*0.1}px 4px rgba(0, 102, 178, 0.3)`) }}
                  className="text-[10px] text-white/70 font-bold uppercase tracking-widest"
                >
                  Productos certificados
                </motion.span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-brand-green text-[28px] drop-shadow-lg">storefront</span>
              <div className="flex flex-col">
                <motion.span 
                  style={{ textShadow: useTransform([mouseX, mouseY], ([x, y]) => `${(x as number)*0.2}px ${(y as number)*0.2}px 8px rgba(0, 102, 178, 0.45)`) }}
                  className="text-xl font-black text-white leading-none"
                >
                  Tienda física
                </motion.span>
                <motion.span 
                  style={{ textShadow: useTransform([mouseX, mouseY], ([x, y]) => `${(x as number)*0.1}px ${(y as number)*0.1}px 4px rgba(0, 102, 178, 0.3)`) }}
                  className="text-[10px] text-white/70 font-bold uppercase tracking-widest"
                >
                  San Cristóbal, Táchira
                </motion.span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-brand-green text-[28px] drop-shadow-lg">local_shipping</span>
              <div className="flex flex-col">
                <motion.span 
                  style={{ textShadow: useTransform([mouseX, mouseY], ([x, y]) => `${(x as number)*0.2}px ${(y as number)*0.2}px 8px rgba(0, 102, 178, 0.45)`) }}
                  className="text-xl font-black text-white leading-none"
                >
                  Nacional
                </motion.span>
                <motion.span 
                  style={{ textShadow: useTransform([mouseX, mouseY], ([x, y]) => `${(x as number)*0.1}px ${(y as number)*0.1}px 4px rgba(0, 102, 178, 0.3)`) }}
                  className="text-[10px] text-white/70 font-bold uppercase tracking-widest"
                >
                  Envío a todo Venezuela
                </motion.span>
              </div>
            </div>
          </div>

          {/* CTA mobile — visible solo en móvil, dentro del hero */}
          <div className="md:hidden pt-4 pointer-events-auto">
            <button
              onClick={onOpenCatalog}
              className="w-full bg-brand-blue text-white py-4 font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 rounded-lg shadow-lg"
            >
              Ver Catálogo (+400 productos)
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      {/* Nav Arrows */}
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-brand-blue backdrop-blur-md transition-all active:scale-95 group"
        onClick={() => paginate(-1)}
      >
        <span className="material-symbols-outlined text-3xl group-hover:-translate-x-1 transition-transform">chevron_left</span>
      </button>
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-brand-blue backdrop-blur-md transition-all active:scale-95 group"
        onClick={() => paginate(1)}
      >
        <span className="material-symbols-outlined text-3xl group-hover:translate-x-1 transition-transform">chevron_right</span>
      </button>

    </section>
  );
}
