import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useDropzone } from 'react-dropzone';
import { getProductCategories } from '../../services/api';

const DEFAULT_CATEGORIES = ['Movilidad', 'Ortopedia', 'Equipos e Insumos', 'Fisioterapia', 'Ayudas Sanitarias', 'Cuidado Personal', 'Accesorios'];

const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [driveCategories, setDriveCategories] = useState<{name: string, id?: string}[]>(
    DEFAULT_CATEGORIES.map(c => ({ name: c }))
  );
  
  const [formData, setFormData] = useState({
    name: '',
    category: DEFAULT_CATEGORIES[0],
    subcategory: '',
    description: '',
    price: 0,
    stock_status: 'IN_STOCK',
    image_url: null as string | null,
    drive_id: null as string | null
  });

  useEffect(() => {
    async function loadCategories() {
      console.log('🔍 Intentando cargar categorías desde Drive...');
      try {
        const data = await getProductCategories();
        console.log('📦 Respuesta de la API de Categorías:', data);
        
        // Probamos ambas posibilidades por seguridad
        const folders = data.albums || data.folders || data.data;
        
        if (folders && Array.isArray(folders)) {
          setDriveCategories(folders);
          console.log(`✅ ${folders.length} categorías cargadas con éxito.`);
          
          if (!formData.category && folders.length > 0) {
            setFormData(prev => ({ ...prev, category: folders[0].name }));
          }
        } else {
          console.warn('⚠️ La API respondió pero no se encontró un array de carpetas válido:', data);
        }
      } catch (err) {
        console.error('❌ Error crítico cargando categorías de Drive:', err);
      }
    }
    loadCategories();
  }, []);

  const isEditing = !!id;

  useEffect(() => {
    if (isEditing) {
      async function fetchProduct() {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (data && !error) {
          setFormData({
            name: data.name,
            category: data.category,
            subcategory: data.subcategory || '',
            description: data.description || '',
            price: data.price || 0,
            stock_status: data.stock_status || 'IN_STOCK',
            image_url: data.image_url,
            drive_id: data.drive_id
          });
          if (data.image_url) setPreview(data.image_url);
          else if (data.drive_id) setPreview(`https://bright-drive-backend-agent-production.up.railway.app/api/image/${data.drive_id}`);
        }
      }
      fetchProduct();
    }
  }, [id, isEditing]);

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
      const tenantId = '63e2d67c-9b1a-4d3b-8f32-5a2e6f9c8d1b';
      let imageUrl = formData.image_url;

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

      const slug = isEditing ? undefined : `${slugify(formData.name)}-${Math.floor(Math.random() * 1000)}`;
      
      const payload: any = {
        ...formData,
        tenant_id: tenantId,
        image_url: imageUrl,
      };

      if (!isEditing) payload.slug = slug;
      if (imageFile) payload.drive_id = null; // Clear drive_id if new image uploaded

      const query = isEditing 
        ? supabase.from('products').update(payload).eq('id', id)
        : supabase.from('products').insert([payload]);

      const { error } = await query;
      if (error) throw error;

      alert(isEditing ? '¡Producto actualizado!' : '¡Producto creado!');
      // 4. SI HAY UNA IMAGEN NUEVA, sincronizar con Google Drive (Backup organizado)
      if (imageFile && imageUrl) {
        try {
          const { syncToDrive } = await import('../../services/api');
          await syncToDrive({
            imageUrl: imageUrl,
            category: formData.category,
            subcategory: formData.subcategory || 'General',
            name: formData.name
          });
          console.log('✅ Doble respaldo completado: Supabase + Google Drive');
        } catch (syncErr) {
          console.error('⚠️ Error en el respaldo de Drive (pero se guardó en Supabase):', syncErr);
        }
      }

      navigate('/admin');
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
  return (
    <div className="max-w-4xl mx-auto p-6 md:py-12">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight">
          {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
        </h1>
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
              <div className="relative w-full h-full group/preview">
                <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 flex flex-col items-center justify-center rounded-2xl transition-opacity gap-3">
                  <p className="text-white text-[10px] font-black uppercase tracking-widest">Hacer clic para cambiar</p>
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImageFile(null);
                      setPreview(null);
                      setFormData({...formData, image_url: null, drive_id: null});
                    }}
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                    title="Eliminar imagen"
                  >
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
              </div>
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
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Categoría</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all"
                  required
                >
                  {driveCategories.map(cat => (
                    <option key={cat.id || cat.name} value={cat.name}>{cat.name}</option>
                  ))}
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
            {loading ? 'Guardando...' : isEditing ? 'Actualizar Producto' : 'Crear Producto'}
          </button>
        </div>
      </form>
    </div>
  );
}
