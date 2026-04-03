import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Send, Loader2 } from 'lucide-react';
import { captureLead } from '../services/api';

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FormState = 'idle' | 'loading' | 'success' | 'error';

export default function LeadCaptureModal({ isOpen, onClose }: LeadCaptureModalProps) {
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [state, setState] = useState<FormState>('idle');
  const [firstName, setFirstName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !whatsapp.trim()) return;

    setState('loading');
    setFirstName(name.trim().split(' ')[0]);

    const result = await captureLead(name.trim(), `58${whatsapp.replace(/\D/g, '')}`);

    if (result.success) {
      setState('success');
    } else {
      setState('error');
    }
  };

  const handleClose = () => {
    onClose();
    // Reset after animation completes
    setTimeout(() => {
      setState('idle');
      setName('');
      setWhatsapp('');
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              className="bg-white w-full max-w-md pointer-events-auto relative overflow-hidden shadow-2xl"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              {/* Top accent bar */}
              <div className="h-1.5 w-full bg-gradient-to-r from-brand-blue via-brand-cyan to-brand-green" />

              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors z-10"
                aria-label="Cerrar"
              >
                <X size={20} />
              </button>

              <div className="p-8">
                <AnimatePresence mode="wait">
                  {state !== 'success' ? (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {/* Header */}
                      <div className="mb-6 pr-6">
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-brand-green/10 text-brand-green text-xs font-bold uppercase tracking-wide mb-4">
                          <span className="w-1.5 h-1.5 bg-brand-green animate-pulse rounded-full" />
                          Catálogo Gratuito
                        </span>
                        <h2 className="text-2xl font-extrabold text-on-surface leading-tight font-headline mb-2">
                          Accede al catálogo completo
                        </h2>
                        <p className="text-on-surface-variant text-base">
                          +400 productos con fichas técnicas. Recíbelo directo en tu WhatsApp.
                        </p>
                      </div>

                      {/* Form */}
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-on-surface mb-1.5">
                            Nombre completo
                          </label>
                          <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Ej: Dr. Carlos Pérez"
                            required
                            disabled={state === 'loading'}
                            className="w-full border border-outline-variant px-4 py-3 text-on-surface placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-colors disabled:opacity-50"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-on-surface mb-1.5">
                            WhatsApp
                          </label>
                          <div className="flex">
                            <span className="flex items-center px-4 bg-slate-50 border border-r-0 border-outline-variant text-slate-500 text-sm font-medium select-none">
                              +58
                            </span>
                            <input
                              type="tel"
                              value={whatsapp}
                              onChange={e => setWhatsapp(e.target.value)}
                              placeholder="414 000 0000"
                              required
                              disabled={state === 'loading'}
                              className="flex-1 border border-outline-variant px-4 py-3 text-on-surface placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-colors disabled:opacity-50"
                            />
                          </div>
                        </div>

                        {state === 'error' && (
                          <p className="text-sm text-error bg-error-container px-4 py-2">
                            No pudimos procesar tu solicitud. Intenta de nuevo.
                          </p>
                        )}

                        <button
                          type="submit"
                          disabled={state === 'loading' || !name.trim() || !whatsapp.trim()}
                          className="w-full bg-brand-blue hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-4 font-black uppercase tracking-widest text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                        >
                          {state === 'loading' ? (
                            <>
                              <Loader2 size={18} className="animate-spin" />
                              Enviando...
                            </>
                          ) : (
                            <>
                              Recibir Catálogo en WhatsApp
                              <Send size={16} />
                            </>
                          )}
                        </button>

                        <p className="text-center text-xs text-slate-400">
                          Tu información es confidencial. Sin spam.
                        </p>
                      </form>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="success"
                      className="py-8 text-center space-y-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="w-16 h-16 bg-brand-green/10 flex items-center justify-center mx-auto">
                        <CheckCircle2 size={40} className="text-brand-green" />
                      </div>
                      <h3 className="text-xl font-extrabold text-on-surface font-headline">
                        ¡Listo, {firstName}!
                      </h3>
                      <p className="text-on-surface-variant">
                        Un asesor te enviará el catálogo completo a tu WhatsApp en los próximos minutos.
                      </p>
                      <button
                        onClick={handleClose}
                        className="mt-4 bg-brand-green text-white px-8 py-3 font-bold text-sm uppercase tracking-widest hover:brightness-110 transition-all active:scale-[0.98]"
                      >
                        Ver productos
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
