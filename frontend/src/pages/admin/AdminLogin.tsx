import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';

export default function AdminLogin() {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/admin`
        }
      });
      if (error) throw error;
    } catch (err) {
      console.error('Error logging in:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100"
      >
        <div className="text-center mb-8">
          <img src="/logo.png" alt="Tecnimedical" className="h-12 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-slate-800">Panel de Administración</h1>
          <p className="text-sm text-slate-500 mt-2">Inicia sesión para gestionar el catálogo</p>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white border border-slate-300 rounded-xl py-3 px-4 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
          {loading ? 'Conectando...' : 'Continuar con Google'}
        </button>
      </motion.div>
    </div>
  );
}
