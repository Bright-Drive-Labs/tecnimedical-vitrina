import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';

export default function AdminMenu() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Navbar de Administración */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm shrink-0">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img src="/logo.png" className="h-8" alt="Tecnimedical" />
            <span className="text-slate-300">|</span>
            <span className="text-xs font-black uppercase tracking-widest text-slate-500">Panel Central</span>
          </div>
          <button 
            onClick={handleLogout} 
            className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      </nav>

      {/* Contenido Principal */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 md:py-20 flex flex-col justify-center items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="text-xs font-black uppercase tracking-widest text-brand-blue bg-blue-50 px-4 py-2 rounded-full">
            Panel de Opciones
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 uppercase tracking-tight mt-4">
            ¿Qué módulo deseas abrir hoy?
          </h1>
          <p className="text-slate-500 text-sm mt-3 max-w-md mx-auto">
            Selecciona una herramienta para comenzar. Tu sesión de administrador te permite gestionar la vitrina digital o registrar datos clínicos.
          </p>
        </motion.div>

        {/* Tarjetas de Selección de Módulo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {/* Tarjeta 1: Gestión de Catálogo */}
          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/admin/catalogo')}
            className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:border-brand-blue/30 cursor-pointer transition-all duration-300 flex flex-col justify-between group h-72 relative overflow-hidden"
          >
            {/* Gradiente sutil de fondo en hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <div className="space-y-4 relative z-10">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-all duration-300">
                <span className="material-symbols-outlined text-3xl">inventory_2</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 uppercase tracking-tight group-hover:text-brand-blue transition-colors">
                  Gestión de Catálogo
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed mt-2">
                  Administra el inventario de la vitrina digital: añade nuevos productos, edita descripciones o actualiza su visibilidad pública.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-brand-blue uppercase tracking-wider relative z-10">
              Abrir Catálogo
              <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </div>
          </motion.div>

          {/* Tarjeta 2: Ficha de Despistaje */}
          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/admin/jornada')}
            className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:border-brand-green/30 cursor-pointer transition-all duration-300 flex flex-col justify-between group h-72 relative overflow-hidden"
          >
            {/* Gradiente sutil de fondo en hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <div className="space-y-4 relative z-10">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-brand-green group-hover:bg-brand-green group-hover:text-white transition-all duration-300">
                <span className="material-symbols-outlined text-3xl">clinical_notes</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 uppercase tracking-tight group-hover:text-brand-green transition-colors">
                  Ficha de Despistaje
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed mt-2">
                  Registra pacientes y signos vitales durante las jornadas de salud in-situ: Presión, Glicemia y cálculo automatizado del IMC.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-brand-green uppercase tracking-wider relative z-10">
              Iniciar Jornada
              <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer del Panel */}
      <footer className="py-6 border-t border-slate-200 text-center text-[10px] text-slate-400 bg-white shrink-0">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>© 2026 TecniMedical. Todos los derechos reservados.</p>
          <a href="/" className="font-bold hover:underline text-slate-500">Volver a la Vitrina Pública</a>
        </div>
      </footer>
    </div>
  );
}
