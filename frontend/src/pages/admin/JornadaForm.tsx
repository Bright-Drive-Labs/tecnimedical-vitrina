import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';

// ─── Funciones Auxiliares de Sanitización y Clasificación ──────────────────────────

/** Remueve tags HTML y scripts para mitigar inyecciones XSS */
const sanitizeInput = (text: string): string => {
  return text.replace(/<[^>]*>?/gm, '').trim();
};

/** Clasifica la Presión Arterial (AHA guidelines) */
const classifyBloodPressure = (sys: number, dia: number) => {
  if (sys < 120 && dia < 80) return { label: 'Normal', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', level: 'normal' };
  if (sys >= 120 && sys <= 129 && dia < 80) return { label: 'Elevada', color: 'text-amber-600 bg-amber-50 border-amber-200', level: 'elevated' };
  if ((sys >= 130 && sys <= 139) || (dia >= 80 && dia <= 89)) return { label: 'HTA Estadio 1', color: 'text-orange-600 bg-orange-50 border-orange-200', level: 'hta1' };
  if (sys >= 140 || dia >= 90) return { label: 'HTA Estadio 2', color: 'text-red-600 bg-red-50 border-red-200', level: 'hta2' };
  return { label: 'Sin evaluar', color: 'text-slate-400 bg-slate-50 border-slate-200', level: 'none' };
};

/** Clasifica la Glicemia Capilar */
const classifyGlucose = (glucose: number, state: 'ayunas' | 'postprandial') => {
  if (state === 'ayunas') {
    if (glucose < 100) return { label: 'Normal', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', level: 'normal' };
    return { label: 'Alerta / Sospecha', color: 'text-red-600 bg-red-50 border-red-200', level: 'alert' };
  } else {
    if (glucose < 140) return { label: 'Normal', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', level: 'normal' };
    return { label: 'Alerta / Sospecha', color: 'text-red-600 bg-red-50 border-red-200', level: 'alert' };
  }
};

/** Clasifica el IMC */
const classifyIMC = (imc: number) => {
  if (imc < 18.5) return { label: 'Bajo Peso', color: 'text-blue-600 bg-blue-50 border-blue-200' };
  if (imc >= 18.5 && imc <= 24.9) return { label: 'Normal', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
  if (imc >= 25.0 && imc <= 29.9) return { label: 'Sobrepeso', color: 'text-amber-600 bg-amber-50 border-amber-200' };
  return { label: 'Obesidad', color: 'text-red-600 bg-red-50 border-red-200' };
};

// ─── Componente Principal ─────────────────────────────────────────────────────────

export default function JornadaForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [savedData, setSavedData] = useState<any>(null);

  // Estados del Formulario
  const [form, setForm] = useState({
    patient_name: '',
    patient_dni: '',
    patient_age: '',
    patient_gender: 'M',
    patient_phone: '',
    patient_email: '',
    history_hypertension: false,
    history_hypertension_treatment: false,
    history_diabetes: false,
    history_diabetes_treatment: false,
    history_obesity: false,
    history_none: false,
    systolic_bp: '',
    diastolic_bp: '',
    blood_glucose: '',
    glucose_state: 'ayunas' as 'ayunas' | 'postprandial',
    weight_kg: '',
    height_m: '',
    recommendation: 'control' as 'control' | 'seguimiento' | 'urgencia',
    notes: ''
  });

  // Cálculos dinámicos (IMC)
  const imc = useMemo(() => {
    const w = parseFloat(form.weight_kg);
    const h = parseFloat(form.height_m);
    if (!w || !h || h <= 0) return 0;
    // Fórmula oficial: Peso / Talla^2
    const calc = w / (h * h);
    return Math.round(calc * 100) / 100;
  }, [form.weight_kg, form.height_m]);

  // Clasificaciones en tiempo real
  const bpClassification = useMemo(() => {
    const sys = parseInt(form.systolic_bp);
    const dia = parseInt(form.diastolic_bp);
    if (!sys || !dia) return { label: 'Sin evaluar', color: 'text-slate-400 bg-slate-50 border-slate-200', level: 'none' };
    return classifyBloodPressure(sys, dia);
  }, [form.systolic_bp, form.diastolic_bp]);

  const glucoseClassification = useMemo(() => {
    const glu = parseInt(form.blood_glucose);
    if (!glu) return { label: 'Sin evaluar', color: 'text-slate-400 bg-slate-50 border-slate-200', level: 'none' };
    return classifyGlucose(glu, form.glucose_state);
  }, [form.blood_glucose, form.glucose_state]);

  const imcClassification = useMemo(() => {
    if (!imc) return { label: 'Sin evaluar', color: 'text-slate-400 bg-slate-50 border-slate-200' };
    return classifyIMC(imc);
  }, [imc]);

  // Autodetectar la conducta clínica recomendada en base a los resultados
  useEffect(() => {
    const sys = parseInt(form.systolic_bp) || 0;
    const dia = parseInt(form.diastolic_bp) || 0;
    const glu = parseInt(form.blood_glucose) || 0;

    // Alerta Crítica/Urgencia inmediata
    if (sys >= 180 || dia >= 120 || (glu > 250)) {
      setForm(prev => ({ ...prev, recommendation: 'urgencia' }));
      return;
    }

    // Seguimiento Médico si hay valores alterados
    const bpIsAlter = bpClassification.level !== 'normal' && bpClassification.level !== 'none';
    const glucoseIsAlter = glucoseClassification.level !== 'normal' && glucoseClassification.level !== 'none';
    const imcIsAlter = imc > 0 && (imc < 18.5 || imc >= 25.0);

    if (bpIsAlter || glucoseIsAlter || imcIsAlter || form.history_hypertension || form.history_diabetes || form.history_obesity) {
      setForm(prev => ({ ...prev, recommendation: 'seguimiento' }));
    } else {
      setForm(prev => ({ ...prev, recommendation: 'control' }));
    }
  }, [bpClassification.level, glucoseClassification.level, imc, form.history_hypertension, form.history_diabetes, form.history_obesity]);

  // Resetea tratamiento si desmarca antecedentes
  useEffect(() => {
    if (!form.history_hypertension) {
      setForm(prev => ({ ...prev, history_hypertension_treatment: false }));
    }
  }, [form.history_hypertension]);

  useEffect(() => {
    if (!form.history_diabetes) {
      setForm(prev => ({ ...prev, history_diabetes_treatment: false }));
    }
  }, [form.history_diabetes]);

  useEffect(() => {
    if (form.history_none) {
      setForm(prev => ({
        ...prev,
        history_hypertension: false,
        history_hypertension_treatment: false,
        history_diabetes: false,
        history_diabetes_treatment: false,
        history_obesity: false
      }));
    }
  }, [form.history_none]);

  useEffect(() => {
    if (form.history_hypertension || form.history_diabetes || form.history_obesity) {
      setForm(prev => ({ ...prev, history_none: false }));
    }
  }, [form.history_hypertension, form.history_diabetes, form.history_obesity]);

  // Helpers para checkear de forma simplificada
  const isHistorySelected = () => {
    return form.history_hypertension || form.history_diabetes || form.history_obesity || form.history_none;
  };

  const isStepValid = () => {
    if (step === 1) {
      return form.patient_name.trim() !== '' && form.patient_dni.trim() !== '' && form.patient_age !== '' && form.patient_phone.trim() !== '';
    }
    if (step === 2) {
      return isHistorySelected();
    }
    if (step === 3) {
      return form.systolic_bp !== '' && form.diastolic_bp !== '' && form.blood_glucose !== '' && form.weight_kg !== '' && form.height_m !== '';
    }
    return true;
  };

  // Envío del Formulario al Backend (JWT Protegido)
  const handleSubmit = async () => {
    setLoading(true);
    try {
      // 1. Obtener la sesión activa para mandar el Token JWT en el Header
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('Sesión expirada. Por favor inicia sesión de nuevo.');
        navigate('/admin/login');
        return;
      }

      // 2. Sanitización estricta anti-XSS de inputs antes de enviar
      const payload = {
        patient_name: sanitizeInput(form.patient_name),
        patient_dni: sanitizeInput(form.patient_dni),
        patient_age: form.patient_age ? parseInt(form.patient_age) : null,
        patient_gender: form.patient_gender,
        patient_phone: sanitizeInput(form.patient_phone),
        patient_email: sanitizeInput(form.patient_email),
        history_hypertension: form.history_hypertension,
        history_hypertension_treatment: form.history_hypertension_treatment,
        history_diabetes: form.history_diabetes,
        history_diabetes_treatment: form.history_diabetes_treatment,
        history_obesity: form.history_obesity,
        history_none: form.history_none,
        systolic_bp: parseInt(form.systolic_bp),
        diastolic_bp: parseInt(form.diastolic_bp),
        blood_glucose: parseInt(form.blood_glucose),
        glucose_state: form.glucose_state,
        weight_kg: parseFloat(form.weight_kg),
        height_m: parseFloat(form.height_m),
        imc: imc,
        recommendation: form.recommendation,
        notes: sanitizeInput(form.notes)
      };

      // 3. Petición HTTP al Backend
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://bright-drive-backend-agent-production.up.railway.app';
      const response = await fetch(`${apiBaseUrl}/api/clinical-checkups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(payload)
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.error || 'Fallo al guardar en base de datos');
      }

      setSavedData(resData.data);
      setIsSuccessModalOpen(true);
    } catch (err: any) {
      alert(`Error al registrar ficha: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Genera URL de WhatsApp para enviar el reporte formateado al paciente
  const getWhatsAppShareUrl = () => {
    if (!savedData) return '';
    const phone = savedData.patient_phone.replace(/\D/g, '');
    
    // Clasificaciones legibles
    const bpText = `${savedData.systolic_bp}/${savedData.diastolic_bp} mmHg (${classifyBloodPressure(savedData.systolic_bp, savedData.diastolic_bp).label})`;
    const glText = `${savedData.blood_glucose} mg/dL (${classifyGlucose(savedData.blood_glucose, savedData.glucose_state).label} - ${savedData.glucose_state})`;
    const imcText = `${savedData.imc} (${classifyIMC(savedData.imc).label})`;

    let recText = '';
    if (savedData.recommendation === 'control') recText = 'Control Anual (Mantener hábitos saludables)';
    if (savedData.recommendation === 'seguimiento') recText = 'Seguimiento Médico (Se sugiere acudir a consulta externa)';
    if (savedData.recommendation === 'urgencia') recText = 'Alerta Inmediata (Asistir a sala de urgencias)';

    const message = `*JORNADA DE SALUD PREVENTIVA - TECNIMEDICAL*\n\n` +
      `Estimado(a) *${savedData.patient_name}*, aquí tienes los resultados de tu evaluación:\n\n` +
      `• *Presión Arterial:* ${bpText}\n` +
      `• *Glicemia Capilar:* ${glText}\n` +
      `• *IMC:* ${imcText}\n\n` +
      `*Conducta Sugerida:* ${recText}\n\n` +
      `_Prevenir es vivir mejor. Prioriza tu salud hoy._\n` +
      `*www.tecnimedicalve.com*`;

    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  const resetForm = () => {
    setForm({
      patient_name: '',
      patient_dni: '',
      patient_age: '',
      patient_gender: 'M',
      patient_phone: '',
      patient_email: '',
      history_hypertension: false,
      history_hypertension_treatment: false,
      history_diabetes: false,
      history_diabetes_treatment: false,
      history_obesity: false,
      history_none: false,
      systolic_bp: '',
      diastolic_bp: '',
      blood_glucose: '',
      glucose_state: 'ayunas',
      weight_kg: '',
      height_m: '',
      recommendation: 'control',
      notes: ''
    });
    setStep(1);
    setIsSuccessModalOpen(false);
    setSavedData(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm shrink-0">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img src="/logo.png" className="h-8" alt="Tecnimedical" />
            <span className="text-slate-300">|</span>
            <span className="text-xs font-black uppercase tracking-widest text-slate-500">Jornada Preventiva</span>
          </div>
          <button 
            onClick={() => navigate('/admin')} 
            className="text-[10px] font-bold uppercase tracking-widest text-brand-blue hover:underline"
          >
            Volver al Menú
          </button>
        </div>
      </nav>

      {/* Formulario con Stepper */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-8 flex flex-col justify-center">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-sm">
          {/* Encabezado */}
          <div className="mb-8">
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Ficha de Despistaje</h2>
            <p className="text-slate-500 text-xs mt-1">Registra los datos vitales de los asistentes a la jornada</p>
            
            {/* Indicador visual de pasos */}
            <div className="flex items-center gap-3 mt-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${i <= step ? 'bg-brand-blue' : 'bg-transparent'}`} 
                  />
                </div>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* PASO 1: Datos del Paciente */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-5"
              >
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-400 mb-4">1. Datos del Paciente</h3>
                
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2 uppercase">Nombre Completo *</label>
                  <input 
                    type="text"
                    value={form.patient_name}
                    onChange={(e) => setForm(prev => ({ ...prev, patient_name: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all"
                    placeholder="Ej. Juan Pérez"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-2 uppercase">Cédula / ID *</label>
                    <input 
                      type="text"
                      value={form.patient_dni}
                      onChange={(e) => setForm(prev => ({ ...prev, patient_dni: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all"
                      placeholder="V-12345678"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-2 uppercase">Edad *</label>
                    <input 
                      type="number"
                      value={form.patient_age}
                      onChange={(e) => setForm(prev => ({ ...prev, patient_age: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all"
                      placeholder="Años"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-2 uppercase">Sexo *</label>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setForm(prev => ({ ...prev, patient_gender: 'M' }))}
                        className={`flex-1 py-3 border rounded-xl text-sm font-bold transition-all ${form.patient_gender === 'M' ? 'bg-brand-blue text-white border-brand-blue shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600'}`}
                      >
                        Masc
                      </button>
                      <button 
                        onClick={() => setForm(prev => ({ ...prev, patient_gender: 'F' }))}
                        className={`flex-1 py-3 border rounded-xl text-sm font-bold transition-all ${form.patient_gender === 'F' ? 'bg-brand-blue text-white border-brand-blue shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600'}`}
                      >
                        Fem
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-2 uppercase">Teléfono (WhatsApp) *</label>
                    <input 
                      type="tel"
                      value={form.patient_phone}
                      onChange={(e) => setForm(prev => ({ ...prev, patient_phone: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all"
                      placeholder="Ej. +584141234567"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2 uppercase">Correo Electrónico</label>
                  <input 
                    type="email"
                    value={form.patient_email}
                    onChange={(e) => setForm(prev => ({ ...prev, patient_email: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all"
                    placeholder="paciente@correo.com"
                  />
                </div>
              </motion.div>
            )}

            {/* PASO 2: Antecedentes */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-400 mb-4">2. Antecedentes y Morbilidad</h3>
                <p className="text-xs text-slate-400">¿Tiene diagnóstico previo de alguna de estas patologías?</p>
                
                <div className="space-y-4">
                  {/* Hipertensión */}
                  <div className="border border-slate-200 rounded-2xl p-4 flex flex-col gap-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={form.history_hypertension}
                        onChange={(e) => setForm(prev => ({ ...prev, history_hypertension: e.target.checked }))}
                        className="w-4 h-4 text-brand-blue border-slate-300 rounded focus:ring-brand-blue/20"
                      />
                      <span className="text-sm font-bold text-slate-700">Hipertensión Arterial</span>
                    </label>

                    {form.history_hypertension && (
                      <motion.div 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="pl-7 flex items-center gap-3 border-t border-slate-100 pt-3"
                      >
                        <span className="text-xs text-slate-500 font-semibold">¿Toma tratamiento medicado?</span>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setForm(prev => ({ ...prev, history_hypertension_treatment: true }))}
                            className={`px-3 py-1 text-xs font-bold border rounded-lg transition-all ${form.history_hypertension_treatment ? 'bg-slate-800 text-white border-slate-800' : 'bg-slate-50 border-slate-200 text-slate-600'}`}
                          >
                            Sí
                          </button>
                          <button 
                            onClick={() => setForm(prev => ({ ...prev, history_hypertension_treatment: false }))}
                            className={`px-3 py-1 text-xs font-bold border rounded-lg transition-all ${!form.history_hypertension_treatment ? 'bg-slate-800 text-white border-slate-800' : 'bg-slate-50 border-slate-200 text-slate-600'}`}
                          >
                            No
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Diabetes */}
                  <div className="border border-slate-200 rounded-2xl p-4 flex flex-col gap-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={form.history_diabetes}
                        onChange={(e) => setForm(prev => ({ ...prev, history_diabetes: e.target.checked }))}
                        className="w-4 h-4 text-brand-blue border-slate-300 rounded focus:ring-brand-blue/20"
                      />
                      <span className="text-sm font-bold text-slate-700">Diabetes Melitus</span>
                    </label>

                    {form.history_diabetes && (
                      <motion.div 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="pl-7 flex items-center gap-3 border-t border-slate-100 pt-3"
                      >
                        <span className="text-xs text-slate-500 font-semibold">¿Toma tratamiento medicado?</span>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setForm(prev => ({ ...prev, history_diabetes_treatment: true }))}
                            className={`px-3 py-1 text-xs font-bold border rounded-lg transition-all ${form.history_diabetes_treatment ? 'bg-slate-800 text-white border-slate-800' : 'bg-slate-50 border-slate-200 text-slate-600'}`}
                          >
                            Sí
                          </button>
                          <button 
                            onClick={() => setForm(prev => ({ ...prev, history_diabetes_treatment: false }))}
                            className={`px-3 py-1 text-xs font-bold border rounded-lg transition-all ${!form.history_diabetes_treatment ? 'bg-slate-800 text-white border-slate-800' : 'bg-slate-50 border-slate-200 text-slate-600'}`}
                          >
                            No
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Obesidad */}
                  <label className="border border-slate-200 rounded-2xl p-4 flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={form.history_obesity}
                      onChange={(e) => setForm(prev => ({ ...prev, history_obesity: e.target.checked }))}
                      className="w-4 h-4 text-brand-blue border-slate-300 rounded focus:ring-brand-blue/20"
                    />
                    <span className="text-sm font-bold text-slate-700">Obesidad</span>
                  </label>

                  {/* Ninguno */}
                  <label className="border border-slate-200 rounded-2xl p-4 flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={form.history_none}
                      onChange={(e) => setForm(prev => ({ ...prev, history_none: e.target.checked }))}
                      className="w-4 h-4 text-brand-blue border-slate-300 rounded focus:ring-brand-blue/20"
                    />
                    <span className="text-sm font-bold text-slate-700">Ninguna (Asiste por control/prevención)</span>
                  </label>
                </div>
              </motion.div>
            )}

            {/* PASO 3: Evaluación Clínica */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-400 mb-4">3. Evaluación Clínica</h3>

                {/* Sección Presión Arterial */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-xs font-black text-slate-700 uppercase">Presión Arterial (mmHg) *</label>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 border rounded-md ${bpClassification.color}`}>
                      {bpClassification.label}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      type="number"
                      value={form.systolic_bp}
                      onChange={(e) => setForm(prev => ({ ...prev, systolic_bp: e.target.value }))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                      placeholder="Sistólica (Ej. 120)"
                    />
                    <input 
                      type="number"
                      value={form.diastolic_bp}
                      onChange={(e) => setForm(prev => ({ ...prev, diastolic_bp: e.target.value }))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                      placeholder="Diastólica (Ej. 80)"
                    />
                  </div>
                </div>

                {/* Sección Glicemia */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-xs font-black text-slate-700 uppercase">Glicemia Capilar (mg/dL) *</label>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 border rounded-md ${glucoseClassification.color}`}>
                      {glucoseClassification.label}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <input 
                      type="number"
                      value={form.blood_glucose}
                      onChange={(e) => setForm(prev => ({ ...prev, blood_glucose: e.target.value }))}
                      className="col-span-2 w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                      placeholder="Valor (Ej. 90)"
                    />
                    <select
                      value={form.glucose_state}
                      onChange={(e) => setForm(prev => ({ ...prev, glucose_state: e.target.value as any }))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-2 py-3 text-xs font-bold text-slate-700 focus:outline-none"
                    >
                      <option value="ayunas">Ayunas</option>
                      <option value="postprandial">Postprandial</option>
                    </select>
                  </div>
                </div>

                {/* Sección Antropometría / IMC */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-xs font-black text-slate-700 uppercase">Peso y Talla *</label>
                    <div className="flex gap-2">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 border rounded-md bg-slate-100 text-slate-600">
                        IMC: {imc || '--'}
                      </span>
                      {imc > 0 && (
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 border rounded-md ${imcClassification.color}`}>
                          {imcClassification.label}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      type="number"
                      step="0.1"
                      value={form.weight_kg}
                      onChange={(e) => setForm(prev => ({ ...prev, weight_kg: e.target.value }))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                      placeholder="Peso en Kg (Ej. 70.5)"
                    />
                    <input 
                      type="number"
                      step="0.01"
                      value={form.height_m}
                      onChange={(e) => setForm(prev => ({ ...prev, height_m: e.target.value }))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                      placeholder="Talla en Metros (Ej. 1.70)"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* PASO 4: Conducta y Recomendación */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-400 mb-4">4. Conducta y Recomendación</h3>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2 uppercase">Conducta sugerida *</label>
                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={() => setForm(prev => ({ ...prev, recommendation: 'control' }))}
                      className={`p-4 border rounded-2xl flex items-center justify-between text-left transition-all ${form.recommendation === 'control' ? 'border-emerald-500 bg-emerald-50/50' : 'bg-slate-50 border-slate-200'}`}
                    >
                      <div>
                        <p className="text-sm font-black text-emerald-800 uppercase">Control Normal</p>
                        <p className="text-[10px] text-slate-500 leading-relaxed mt-1">Continuar con hábitos saludables y chequeo anual preventivo.</p>
                      </div>
                      {form.recommendation === 'control' && <span className="material-symbols-outlined text-emerald-500">check_circle</span>}
                    </button>

                    <button 
                      onClick={() => setForm(prev => ({ ...prev, recommendation: 'seguimiento' }))}
                      className={`p-4 border rounded-2xl flex items-center justify-between text-left transition-all ${form.recommendation === 'seguimiento' ? 'border-amber-500 bg-amber-50/50' : 'bg-slate-50 border-slate-200'}`}
                    >
                      <div>
                        <p className="text-sm font-black text-amber-800 uppercase">Seguimiento Médico</p>
                        <p className="text-[10px] text-slate-500 leading-relaxed mt-1">Se sugiere acudir a consulta externa por valores fuera de rango o tratamiento desactualizado.</p>
                      </div>
                      {form.recommendation === 'seguimiento' && <span className="material-symbols-outlined text-amber-500">check_circle</span>}
                    </button>

                    <button 
                      onClick={() => setForm(prev => ({ ...prev, recommendation: 'urgencia' }))}
                      className={`p-4 border rounded-2xl flex items-center justify-between text-left transition-all ${form.recommendation === 'urgencia' ? 'border-red-500 bg-red-50/50' : 'bg-slate-50 border-slate-200'}`}
                    >
                      <div>
                        <p className="text-sm font-black text-red-800 uppercase">Alerta Inmediata (Urgencias)</p>
                        <p className="text-[10px] text-slate-500 leading-relaxed mt-1">Remisión a sala de urgencias por cifras críticas (Sistólica ≥ 180, Diastólica ≥ 120 o Glicemia &gt; 250 mg/dL).</p>
                      </div>
                      {form.recommendation === 'urgencia' && <span className="material-symbols-outlined text-red-500">check_circle</span>}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2 uppercase">Notas / Observaciones del Evaluador</label>
                  <textarea
                    rows={3}
                    value={form.notes}
                    onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                    placeholder="Escribe comentarios clínicos adicionales..."
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Botones de Navegación del Stepper */}
          <div className="flex gap-4 mt-8 border-t border-slate-100 pt-6">
            {step > 1 && (
              <button 
                onClick={() => setStep(prev => prev - 1)}
                className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-600 transition-colors"
                disabled={loading}
              >
                Atrás
              </button>
            )}
            
            {step < 4 ? (
              <button 
                onClick={() => isStepValid() && setStep(prev => prev + 1)}
                disabled={!isStepValid() || loading}
                className="flex-1 py-3 bg-brand-blue hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-xs font-bold uppercase tracking-wider text-white transition-all shadow-md"
              >
                Siguiente
              </button>
            ) : (
              <button 
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 py-3 bg-brand-green hover:brightness-110 disabled:opacity-40 rounded-xl text-xs font-bold uppercase tracking-wider text-white transition-all shadow-md flex items-center justify-center gap-2"
              >
                {loading ? 'Guardando...' : 'Finalizar Registro'}
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Modal de Éxito y WhatsApp */}
      <AnimatePresence>
        {isSuccessModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={resetForm}
              className="absolute inset-0 bg-black"
            />
            
            {/* Card Modal */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full relative z-10 border border-slate-100 shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-emerald-50 text-brand-green rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-4xl">check_circle</span>
              </div>
              
              <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Registro Guardado</h3>
              <p className="text-slate-500 text-xs mt-2">La ficha clínica del paciente ha sido registrada con éxito en Supabase.</p>

              {/* Botón WhatsApp */}
              <div className="mt-8 space-y-3">
                <a 
                  href={getWhatsAppShareUrl()} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Enviar Resultados por WhatsApp
                </a>

                <button 
                  onClick={resetForm}
                  className="w-full py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-black uppercase tracking-wider rounded-xl transition-all"
                >
                  Nuevo Registro de Paciente
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-4 text-center text-[10px] text-slate-400 bg-white border-t border-slate-200 shrink-0">
        © 2026 TecniMedical. Todos los derechos reservados.
      </footer>
    </div>
  );
}
