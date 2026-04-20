/**
 * InstagramReelSection — Testimonios con Reel de Instagram
 * ============================================================================
 * Layout CVS-style: columna izquierda (título + quote grande) | reel central
 * (9:16) | columna derecha (mosaico de quotes con alturas variadas).
 *
 * Para actualizar contenido: editar REEL_DATA y BRAND_MESSAGES abajo.
 * Migración futura a oEmbed oficial cuando el token de Meta esté listo.
 * ============================================================================
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const IG_ICON = (
  <svg viewBox="0 0 24 24" className="fill-current" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

/* ─── DATOS EDITABLES ─────────────────────────────────────────────────────── */
const REEL_DATA = {
  reelUrl:  'https://www.instagram.com/reel/DTQ0YY4iTAL/',
  embedUrl: 'https://www.instagram.com/reel/DTQ0YY4iTAL/embed/',
  videoUrl: '/reel.mp4',
  likes: '70',
  perfil: '@tecnimedical.ve',
};

type CardType =
  | { col: 'left' | 'right'; type: 'quote'; nombre: string; ciudad: string; stars: number; texto: string; subtexto?: never }
  | { col: 'left' | 'right'; type: 'brand'; texto: string; subtexto: string; nombre?: never; ciudad?: never; stars?: never };

const MOSAIC_CARDS: CardType[] = [
  /* ── Columna izquierda: 1 quote grande ── */
  {
    col: 'left',
    type: 'quote',
    nombre: 'Ana P.',
    ciudad: 'San Cristóbal',
    stars: 5,
    texto:
      'Llevo años con problemas de circulación y estas medias son lo mejor que he probado. Desde el primer día siento las piernas mucho más ligeras. ¡Ya pedí el segundo par!',
  },

  /* ── Columna derecha: 2 quotes ── */
  {
    col: 'right',
    type: 'quote',
    nombre: 'Carmen R.',
    ciudad: 'San Antonio',
    stars: 5,
    texto: 'Trabajo todo el día de pie y estas medias cambiaron mi vida. Llegaron rápido y bien empacadas.',
  },
  {
    col: 'right',
    type: 'quote',
    nombre: 'Marcos V.',
    ciudad: 'Rubio',
    stars: 5,
    texto: 'Compré para mi esposa en el embarazo. El doctor las aprobó de inmediato. 100% recomendadas.',
  },
];
/* ─────────────────────────────────────────────────────────────────────────── */

function fadeIn(delay = 0, x = 0): any {
  return {
    initial: { opacity: 0, x, y: x === 0 ? 20 : 0 },
    whileInView: { opacity: 1, x: 0, y: 0 },
    viewport: { once: true, amount: 0.25 },
    transition: { duration: 0.55, delay, ease: 'easeOut' },
  };
}

/** Card de testimonio — cuadrada, texto grande */
function QuoteCard({ card, delay, fromX }: { card: CardType & { type: 'quote' }; delay: number; fromX: number }) {
  return (
    <motion.div {...fadeIn(delay, fromX)}
      className={`bg-white rounded-2xl p-4 flex flex-col gap-2 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300 flex-1`}
    >
      <span className="text-5xl font-black text-brand-cyan leading-none select-none">"</span>
      <p className="text-slate-700 text-base md:text-lg font-bold leading-snug flex-1">{card.texto}"</p>
      <div className="flex gap-0.5">
        {Array.from({ length: card.stars! }).map((_, i) => (
          <span key={i} className="text-yellow-400 text-base">★</span>
        ))}
      </div>
      <div className="flex items-center gap-2 pt-3 border-t border-sky-100">
        <div className="w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center shrink-0">
          <span className="text-white text-xs font-black">{card.nombre!.charAt(0)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-800 truncate">{card.nombre}</p>
          <p className="text-xs text-slate-400">{card.ciudad}</p>
        </div>
        <span className="text-[9px] font-black uppercase tracking-widest text-brand-green bg-brand-green/10 px-2 py-0.5 rounded-full whitespace-nowrap">
          Verificado
        </span>
      </div>
    </motion.div>
  );
}

/** Card de marca — rectángulo azul oscuro, como el banner inferior de producto */
function BrandCard({ card, delay }: { card: CardType & { type: 'brand' }; delay: number }) {
  return (
    <motion.div {...fadeIn(delay, 30)}
      className="bg-brand-blue rounded-2xl p-5 flex flex-col gap-3"
    >
      <p className="text-white font-black text-lg md:text-xl leading-snug">{card.texto}</p>
      <div className="flex flex-wrap gap-1.5">
        {card.subtexto!.split(' · ').map((tag: string, i: number) => (
          <span key={i} className="text-[10px] font-bold uppercase tracking-wide bg-white/15 text-white/90 px-2.5 py-1 rounded-full">
            {tag}
          </span>
        ))}
      </div>
      <a
        href="https://wa.me/584167170413?text=Hola%2C%20quiero%20asesoría%20para%20elegir%20mis%20medias%20de%20compresión"
        target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-brand-green hover:brightness-110 text-white font-bold text-xs px-4 py-2 rounded-lg transition-all w-fit mt-1"
      >
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.554 4.118 1.525 5.845L.057 23.571l5.888-1.542A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.647-.504-5.163-1.382l-.371-.22-3.495.916.933-3.405-.242-.389A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
        Pedir asesoría gratis
      </a>
    </motion.div>
  );
}

/** Thumbnail del reel — imagen con botón play que abre el modal */
function ReelThumbnail({ onClick, size }: { onClick: () => void; size: { w: number; h: number } }) {
  return (
    <button
      onClick={onClick}
      className="relative group cursor-pointer focus:outline-none"
      style={{ width: size.w, height: size.h }}
      aria-label="Reproducir reel de TecniMedical"
    >
      {/* Imagen de fondo — thumbnail del producto */}
      <div
        className="w-full h-full rounded-2xl overflow-hidden shadow-xl group-hover:shadow-2xl transition-shadow duration-300"
        style={{ background: 'linear-gradient(160deg, #1A4F8B 0%, #00AEEF 60%, #2EB27E 100%)' }}
      >
        <img
          src="/reel-thumbnail.jpg"
          alt="Medias de compresión TecniMedical"
          className="w-full h-full object-cover"
          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      </div>

      {/* Botón play — esquina inferior izquierda, estilo CVS */}
      <div className="absolute bottom-4 left-4">
        <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-brand-blue ml-0.5">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>

    </button>
  );
}

/** Modal de preview del reel — thumbnail a pantalla completa + CTA a Instagram */
function ReelModal({ onClose }: { onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.88, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.88, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 340, damping: 30 }}
          className="relative"
          onClick={e => e.stopPropagation()}
        >
          {/* X — pegada a la esquina superior derecha */}
          <button
            onClick={onClose}
            className="absolute -top-3 -right-3 z-10 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
            aria-label="Cerrar"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-slate-700">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>

          {/* Video con overlay — click abre Instagram */}
          <div className="relative group cursor-pointer" style={{ width: 340, height: 604 }}
            onClick={() => window.open(REEL_DATA.reelUrl, '_blank', 'noopener,noreferrer')}
          >
            <video
              src={REEL_DATA.videoUrl}
              poster="/reel-thumbnail.jpg"
              autoPlay
              loop
              playsInline
              style={{ width: 340, height: 604, display: 'block', background: '#000', objectFit: 'cover' }}
            />
            {/* Hover overlay — indica que click va a Instagram */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center gap-2">
                <span className="w-8 h-8 text-white">{IG_ICON}</span>
                <span className="text-white font-bold text-sm">Ver en Instagram</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/** Componente principal */
export default function InstagramReelSection() {
  const [modalOpen, setModalOpen] = useState(false);

  const leftCards  = MOSAIC_CARDS.filter(c => c.col === 'left');
  const rightCards = MOSAIC_CARDS.filter(c => c.col === 'right');

  return (
    <>
      {/* Modal del reel */}
      {modalOpen && <ReelModal onClose={() => setModalOpen(false)} />}

      <section className="max-w-screen-2xl mx-auto px-4 md:px-8 py-12 md:py-20">

        {/* ── LAYOUT DESKTOP: 3 columnas ── */}
        <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] gap-4 items-start">

          {/* Columna izquierda — misma altura que el reel */}
          <div className="flex flex-col gap-3" style={{ height: 568 }}>
            <div className="flex flex-col gap-1.5">
              <div className="inline-flex items-center gap-2 bg-brand-green/10 text-brand-green px-3 py-1 rounded-full w-fit">
                <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest">Clientes reales</span>
              </div>
              <h2 className="text-2xl lg:text-3xl font-black text-brand-blue leading-tight">
                La media correcta<br />
                <span className="text-brand-green">cambia todo.</span>
              </h2>
              <p className="text-slate-500 text-sm font-bold leading-relaxed text-justify">
                Medias de compresión diabéticas, deportivas, de maternidad y terapéuticas. Nuestros asesores te guían sin costo para encontrar la talla y presión exacta para tu caso.
              </p>
            </div>

            {leftCards.map((c, i) =>
              c.type === 'quote'
                ? <QuoteCard key={i} card={c as any} delay={0.15} fromX={-30} />
                : <BrandCard key={i} card={c as any} delay={0.15} />
            )}

            <a
              href="https://wa.me/584167170413?text=Hola%2C%20quiero%20asesoría%20para%20elegir%20mis%20medias%20de%20compresión"
              target="_blank" rel="noopener noreferrer"
              className="flex-1 bg-brand-blue rounded-2xl p-4 flex flex-col justify-between hover:brightness-110 transition-all group"
            >
              <p className="text-white font-black text-base leading-snug">
                ¿Tienes problemas de circulación o necesitas medias para tu caso específico?
              </p>
              <div className="flex items-center gap-3 mt-3">
                <span className="inline-flex items-center gap-2 bg-brand-green text-white font-bold text-sm px-4 py-2 rounded-lg">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.554 4.118 1.525 5.845L.057 23.571l5.888-1.542A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.647-.504-5.163-1.382l-.371-.22-3.495.916.933-3.405-.242-.389A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                  Pedir asesoría gratis
                </span>
                <span className="text-white/50 text-xs">Sin compromiso</span>
              </div>
            </a>
          </div>

          {/* Columna central */}
          <div style={{ height: 568 }}>
            <ReelThumbnail onClick={() => setModalOpen(true)} size={{ w: 320, h: 568 }} />
          </div>

          {/* Columna derecha */}
          <div className="flex flex-col gap-3" style={{ height: 568 }}>
            {rightCards.map((c, i) =>
              c.type === 'quote'
                ? <QuoteCard key={i} card={c as any} delay={0.1 + i * 0.1} fromX={30} />
                : <BrandCard key={i} card={c as any} delay={0.1 + i * 0.1} />
            )}
          </div>
        </div>

        {/* ── LAYOUT MÓVIL ── */}
        <div className="md:hidden flex flex-col gap-5">
          <div className="text-center flex flex-col items-center gap-3">
            <div className="inline-flex items-center gap-2 bg-brand-green/10 text-brand-green px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">Clientes reales</span>
            </div>
            <h2 className="text-3xl font-black text-brand-blue leading-tight">
              La media correcta <span className="text-brand-green">cambia todo.</span>
            </h2>
            <p className="text-slate-500 text-sm font-light">Diabéticas, deportivas, maternidad y terapéuticas. Asesoría sin costo.</p>
          </div>

          <div className="flex justify-center">
            <ReelThumbnail onClick={() => setModalOpen(true)} size={{ w: 300, h: 533 }} />
          </div>

          <div className="flex flex-col gap-3">
            {MOSAIC_CARDS.map((c, i) =>
              c.type === 'quote'
                ? <QuoteCard key={i} card={c as any} delay={i * 0.08} fromX={0} />
                : <BrandCard key={i} card={c as any} delay={i * 0.08} />
            )}
          </div>

          <div className="flex justify-center">
            <a 
              href="https://www.instagram.com/tecnimedical.ve?igsh=NnBlZTQzOGR3NmRq" 
              target="_blank" 
              rel="noopener noreferrer"
              referrerPolicy="no-referrer"
              className="inline-flex items-center gap-2 border-2 border-brand-cyan text-brand-cyan hover:bg-brand-cyan hover:text-white font-bold px-5 py-2.5 rounded-full transition-all text-sm"
            >
              <span className="w-4 h-4">{IG_ICON}</span>
              Ver más en Instagram
            </a>
          </div>
        </div>

      </section>
    </>
  );
}
