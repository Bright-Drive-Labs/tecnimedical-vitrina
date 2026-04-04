import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Slide {
  id: number;
  image: string;
  badge: string;
  title: string;
  subtitle?: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image: '/Inst1.png',
    badge: 'Movilidad Elite',
    title: 'Sillas de Ruedas: Ergonomía y Libertad',
    subtitle: 'Big Sale 65% OFF',
  },
  {
    id: 2,
    image: '/Inst2.png',
    badge: 'Soporte Térmico',
    title: 'Fomenteras Eléctricas',
    subtitle: '10% OFF',
  },
  {
    id: 3,
    image: '/Inst4.png',
    badge: 'Movilidad Segura',
    title: 'Andaderas: Estabilidad Total',
    subtitle: '40% OFF',
  },
  {
    id: 4,
    image: '/Inst3.png',
    badge: 'Asesoría Experta',
    title: 'Soporte Técnico Especializado',
  },
];

export default function BannerCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Auto-play effect
  useEffect(() => {
    if (isHovering) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isHovering]);

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsAnimating(false), 400);
  };

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsAnimating(false), 400);
  };

  const currentSlide = slides[activeIndex];

  return (
    <section className="max-w-screen-2xl mx-auto px-4 md:px-8 pt-16 md:pt-32 pb-8 md:pb-16">
      {/* Main Carousel Container */}
      <div
        className="relative h-[400px] md:h-[560px] overflow-hidden group"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Background Image with Fade Transition */}
        <AnimatePresence>
          <motion.img
            key={`bg-${activeIndex}`}
            src={currentSlide.image}
            alt={currentSlide.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

        {/* Content Text with Staggered Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`text-${activeIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="absolute inset-0 flex flex-col justify-center p-8 md:p-16 max-w-md"
          >
            <span className="inline-block px-3 py-1 bg-[#ff5252] text-white text-xs font-bold uppercase tracking-wider w-fit mb-4">
              {currentSlide.subtitle || currentSlide.badge}
            </span>
            <div className="space-y-2 mb-6">
              <p className="text-brand-green font-bold text-lg">{currentSlide.badge}</p>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
                {currentSlide.title}
              </h2>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-brand-green hover:bg-brand-green/90 text-white px-8 py-3 font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-brand-green/20 w-fit"
            >
              Explorar Ofertas
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </motion.button>
          </motion.div>
        </AnimatePresence>

        {/* Slide Counter */}
        <div className="absolute bottom-6 right-8 text-white font-black text-lg tracking-tight">
          <span>{String(activeIndex + 1).padStart(2, '0')}</span>
          <span className="text-white/60 mx-2">—</span>
          <span>{String(slides.length).padStart(2, '0')}</span>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          disabled={isAnimating}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-all disabled:opacity-50 backdrop-blur-sm"
          aria-label="Previous slide"
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </button>

        <button
          onClick={handleNext}
          disabled={isAnimating}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-all disabled:opacity-50 backdrop-blur-sm"
          aria-label="Next slide"
        >
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>

      {/* Thumbnail Strip */}
      <div className="flex gap-2 md:gap-3 px-0 py-4 overflow-x-auto scrollbar-hide">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            onClick={() => {
              if (!isAnimating) {
                setIsAnimating(true);
                setActiveIndex(i);
                setTimeout(() => setIsAnimating(false), 400);
              }
            }}
            className={`relative h-16 w-24 md:h-20 md:w-32 flex-shrink-0 overflow-hidden transition-all duration-300 rounded-lg ${
              i === activeIndex
                ? 'ring-2 ring-brand-blue shadow-lg'
                : 'opacity-60 hover:opacity-80'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            {i === activeIndex && (
              <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/20 to-transparent" />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
