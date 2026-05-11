import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Phone, Mail, MapPin, CheckCircle2, Loader2 } from 'lucide-react';
import { captureLead } from '../services/api';
import { useLocation } from 'react-router-dom';

export default function ContactPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialProduct = queryParams.get('product') || '';

  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    email: '',
    subject: initialProduct ? `Consulta: ${initialProduct}` : '',
    message: initialProduct ? `Hola, me interesa obtener más información sobre el producto: ${initialProduct}.` : ''
  });

  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('loading');

    try {
      // Usamos el servicio de captura de leads existente para registrar la consulta
      const result = await captureLead(
        formData.name, 
        `58${formData.whatsapp.replace(/\D/g, '')}`
      );

      if (result.success) {
        setState('success');
      } else {
        setState('error');
      }
    } catch (err) {
      console.error(err);
      setState('error');
    }
  };

  if (state === 'success') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-slate-100 max-w-lg text-center space-y-6"
        >
          <div className="w-20 h-20 bg-brand-green/10 flex items-center justify-center rounded-full mx-auto">
            <CheckCircle2 size={48} className="text-brand-green" />
          </div>
          <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight">¡Mensaje Enviado!</h1>
          <p className="text-slate-500 text-lg">
            Gracias por contactarnos, <span className="font-bold text-brand-blue">{formData.name.split(' ')[0]}</span>. 
            Uno de nuestros asesores especializados revisará tu solicitud y te contactará por WhatsApp a la brevedad.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full bg-brand-blue text-white py-4 font-black uppercase tracking-widest text-sm rounded-xl hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-brand-blue/20"
          >
            Volver al Inicio
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto px-4 md:px-8 py-12 md:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Info Column */}
        <div className="space-y-12">
          <div className="space-y-4">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block px-4 py-1.5 bg-brand-blue/5 text-brand-blue text-xs font-black uppercase tracking-widest rounded-full"
            >
              Asesoría Especializada
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black text-slate-800 leading-tight tracking-tight uppercase"
            >
              Estamos listos <br />
              <span className="text-brand-blue">para ayudarte</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-500 text-lg max-w-md leading-relaxed"
            >
              Completa el formulario y nuestro equipo técnico se pondrá en contacto contigo para brindarte toda la información que necesites.
            </motion.p>
          </div>

          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-white shadow-md border border-slate-100 flex items-center justify-center rounded-xl shrink-0 text-brand-blue">
                <Phone size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 uppercase text-sm tracking-widest mb-1">WhatsApp Directo</h3>
                <p className="text-slate-500">+58 414 714 8895</p>
                <p className="text-slate-400 text-xs mt-1">Lunes a Sábado · 8:00 AM - 6:00 PM</p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-white shadow-md border border-slate-100 flex items-center justify-center rounded-xl shrink-0 text-brand-green">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 uppercase text-sm tracking-widest mb-1">Tiendas Físicas</h3>
                <p className="text-slate-500">San Cristóbal, Estado Táchira.</p>
                <p className="text-slate-400 text-xs mt-1">Av. 19 de Abril · Edif. Tecnimedical</p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-white shadow-md border border-slate-100 flex items-center justify-center rounded-xl shrink-0 text-brand-cyan">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 uppercase text-sm tracking-widest mb-1">Correo Electrónico</h3>
                <p className="text-slate-500">contacto@tecnimedical.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Column */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-slate-50 relative"
        >
          <div className="absolute top-0 right-12 w-20 h-1.5 bg-brand-blue rounded-b-full" />
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Tu Nombre</label>
                <input 
                  required
                  type="text"
                  placeholder="Ej: Juan Pérez"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all text-slate-800"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">WhatsApp</label>
                <div className="flex">
                  <span className="bg-slate-100 border border-slate-200 border-r-0 rounded-l-xl px-4 py-3.5 text-slate-500 text-sm flex items-center">+58</span>
                  <input 
                    required
                    type="tel"
                    placeholder="414 000 0000"
                    value={formData.whatsapp}
                    onChange={e => setFormData({...formData, whatsapp: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-r-xl px-4 py-3.5 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all text-slate-800"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Asunto / Producto</label>
              <input 
                type="text"
                placeholder="Ej: Consulta sobre Silla de Ruedas"
                value={formData.subject}
                onChange={e => setFormData({...formData, subject: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all text-slate-800"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Tu Mensaje</label>
              <textarea 
                required
                rows={4}
                placeholder="¿En qué podemos ayudarte?"
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all text-slate-800 resize-none"
              />
            </div>

            <button
              disabled={state === 'loading'}
              className="w-full bg-brand-blue hover:bg-[#1a4b8a] text-white py-4 font-black uppercase tracking-widest text-sm rounded-xl transition-all shadow-xl shadow-brand-blue/20 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
            >
              {state === 'loading' ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Enviando Consulta...
                </>
              ) : (
                <>
                  Enviar Mensaje
                  <Send size={18} />
                </>
              )}
            </button>

            <p className="text-[10px] text-center text-slate-400 uppercase tracking-widest leading-relaxed">
              Al enviar aceptas que Tecnimedical procese tus datos <br /> para contactarte con fines informativos.
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
