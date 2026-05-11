/**
 * Lógica inteligente para contacto por WhatsApp.
 * - En móvil: Abre la aplicación de WhatsApp directamente.
 * - En computadora: Redirige a la página de contacto interno para evitar forzar descarga de app.
 */
export const handleWhatsAppContact = (productName?: string) => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 1024;
  
  if (isMobile) {
    const WHATSAPP = '584147148895';
    const baseMsg = productName 
      ? `Hola Tecnimedical, me interesa información sobre: *${productName}*.`
      : 'Hola Tecnimedical, me interesa obtener más información sobre sus equipos médicos.';
    
    const msg = encodeURIComponent(baseMsg);
    window.open(`https://wa.me/${WHATSAPP}?text=${msg}`, '_blank');
  } else {
    // En computadora, redirigimos a la página de contacto interna
    const path = productName 
      ? `/contacto?product=${encodeURIComponent(productName)}`
      : '/contacto';
    window.location.href = path;
  }
};
