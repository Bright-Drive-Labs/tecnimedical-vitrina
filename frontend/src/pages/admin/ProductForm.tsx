import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useDropzone } from 'react-dropzone';

const CATEGORIES = ['Movilidad', 'Ortopedia', 'Equipos e Insumos', 'Fisioterapia', 'Ayudas Sanitarias', 'Cuidado Personal', 'Accesorios'];

const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

export default function ProductForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'Movilidad',
    subcategory: '',
    description: '',
    price: 0,
    stock_status: 'IN_STOCK'
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: { 'image/*': [] },
    multiple: false 
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Get user and tenant (from existing user metadata or tenant logic)
      // For now, we assume the user is authenticated and we'll use the hardcoded tenant for Tecnimedical
      const tenantId = '63e2d67c-9b1a-4d3b-8f32-5a2e6f9c8d1b';
      
      let imageUrl = null;

      // 2. Upload image if exists
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${tenantId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);
          
        imageUrl = publicUrl;
      }

      // 3. Insert product
      const slug = `${slugify(formData.name)}-${Math.floor(Math.random() * 1000)}`;
      
      const { error } = await supabase
        .from('products')
        .insert([{
          ...formData,
          slug,
          tenant_id: tenantId,
          image_url: imageUrl,
          drive_id: null // Explicitly null if using new URL
        }]);

      if (error) throw error;

      alert('¡Producto creado con éxito!');
      navigate('/admin');
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Nuevo Producto</h1>
        <button onClick={() => navigate('/admin')} className="text-slate-400 hover:text-slate-800 font-bold uppercase tracking-widest text-xs transition-colors">Volver</button>
      </header>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left Col: Image Upload */}
        <div className="space-y-6">
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Imagen del Producto</label>
          <div 
            {...getRootProps()} 
            className={`aspect-square rounded-3xl border-2 border-dashed flex flex-col items-center justify-center p-4 cursor-pointer transition-all ${isDragActive ? 'border-brand-blue bg-blue-50' : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300'}`}
          >
            <input {...getInputProps()} />
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-full object-contain" />
            ) : (
              <div className="text-center p-10">
                <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">add_photo_alternate</span>
                <p className="text-sm text-slate-500 font-medium">Arrastra una imagen o haz clic aquí</p>
                <p className="text-[10px] text-slate-400 mt-2 uppercase font-bold tracking-tighter">PNG, JPG hasta 5MB</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Fields */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Nombre</label>
              <input 
                required
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                placeholder="Ej. Silla de Ruedas Estándar"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Categoría</label>
                <select 
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Subcategoría</label>
                <input 
                  type="text" 
                  value={formData.subcategory}
                  onChange={e => setFormData({...formData, subcategory: e.target.value})}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2"
                  placeholder="Ej. Manual"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Descripción</label>
              <textarea 
                required
                rows={5}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2"
                placeholder="Describe los beneficios y características..."
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Estado de Stock</label>
              <select 
                value={formData.stock_status}
                onChange={e => setFormData({...formData, stock_status: e.target.value})}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2"
              >
                <option value="IN_STOCK">En Stock</option>
                <option value="CONSULT">Consultar disponibilidad</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-blue text-white rounded-xl py-4 text-xs font-black uppercase tracking-widest hover:bg-[#1a4b8a] transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Crear Producto'}
          </button>
        </div>
      </form>
    </div>
  );
}
