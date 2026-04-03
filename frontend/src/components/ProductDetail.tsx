import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, MessageSquare, Info, ShieldCheck, Truck } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  ref: string;
  description: string;
  specs?: Record<string, string>;
  benefits?: string[];
}

interface ProductDetailProps {
  product: Product | null;
  onClose: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onClose }) => {
  if (!product) return null;

  const demoSpecs = {
    "Modelo": product.ref,
    "Certificación": "CE / FDA",
    "Garantía": "2 Años",
    "Disponibilidad": "Inmediata",
  };

  const demoBenefits = [
    "Capacitación técnica incluida",
    "Soporte posventa especializado",
    "Envío gratuito en San Cristóbal",
    "Repuestos originales garantizados"
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
        />

        {/* Modal Content - RECTANGULAR AS PER POLICY */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.25)] flex flex-col md:flex-row border border-outline-variant/30"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 z-10 p-2 bg-white/80 backdrop-blur-md hover:bg-white transition-colors border border-outline-variant/20"
          >
            <X size={24} className="text-brand-blue" />
          </button>

          {/* Image Section */}
          <div className="md:w-1/2 bg-surface-container-low relative overflow-hidden group">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/10 to-transparent"></div>
            
            {/* Context Badge */}
            <div className="absolute top-8 left-8 flex flex-col gap-2">
              <span className="bg-brand-blue text-white text-[10px] font-bold px-3 py-1.5 uppercase tracking-widest">
                Referencia: {product.ref}
              </span>
              <span className="bg-white/90 text-on-surface text-[10px] font-bold px-3 py-1.5 uppercase tracking-widest border border-outline-variant/20">
                {product.category}
              </span>
            </div>
          </div>

          {/* Details Section */}
          <div className="md:w-1/2 p-8 md:p-12 overflow-y-auto bg-white">
            <h2 className="text-4xl font-extrabold text-primary mb-4 leading-tight tracking-tighter">{product.name}</h2>
            <p className="text-on-surface-variant text-lg mb-8 leading-relaxed font-light">
              {product.description}
            </p>

            {/* Technical Specs Table */}
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-4 text-brand-blue border-b border-brand-blue/20 pb-2">
                <Info size={20} />
                <h3 className="font-bold text-sm uppercase tracking-widest">Ficha Técnica</h3>
              </div>
              <div className="grid grid-cols-2 gap-px bg-outline-variant/20 overflow-hidden border border-outline-variant/20">
                {Object.entries(demoSpecs).map(([key, value]) => (
                  <React.Fragment key={key}>
                    <div className="bg-surface-container-lowest p-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">{key}</div>
                    <div className="bg-white p-4 text-sm font-bold text-on-surface">{value}</div>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Benefits List */}
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-4 text-brand-green border-b border-brand-green/20 pb-2">
                <ShieldCheck size={20} />
                <h3 className="font-bold text-sm uppercase tracking-widest">Garantía Tecnimedical</h3>
              </div>
              <ul className="space-y-4">
                {demoBenefits.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-3 text-on-surface-variant">
                    <CheckCircle2 size={18} className="text-brand-green flex-shrink-0" />
                    <span className="text-sm font-medium">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CRITICAL Conversion CTA */}
            <div className="sticky bottom-0 bg-white/90 backdrop-blur-md pt-6 border-t border-outline-variant/20">
              <button 
                className="bg-brand-green hover:brightness-110 text-white w-full h-16 text-sm font-black uppercase tracking-[0.2em] shadow-xl shadow-brand-green/20 flex items-center justify-center gap-3 transition-all active:scale-95"
                onClick={() => {
                  window.open(`https://wa.me/584147148895?text=Hola, estoy interesado en el producto: ${product.name} (Ref: ${product.ref})`, '_blank');
                }}
              >
                <MessageSquare size={20} />
                Consultar con Asesor
              </button>
              <div className="flex items-center justify-center gap-6 mt-6">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-on-surface-variant tracking-widest">
                  <Truck size={14} className="text-brand-blue" /> Envío Nacional
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-on-surface-variant tracking-widest">
                  <ShieldCheck size={14} className="text-brand-blue" /> Soporte 24/7
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProductDetail;
