# Ideas para el Futuro — Tecnimedical Digital

Este documento contiene funcionalidades y módulos que fueron diseñados pero se mantendrán en reserva para futuras fases del proyecto.

## 1. Newsletter (Boletín de Noticias)
- **Propósito:** Captación de correos electrónicos para campañas de E-mail Marketing.
- **Diseño Original:** Un campo de entrada estilizado con botón de envío rápido (icono de avión de papel) y mensaje de "Recibe ofertas exclusivas".
- **Estado:** Código base desarrollado, pendiente de integración con servicio de mailing (Mailchimp, SendGrid o similares).

## 2. Autenticación de Usuarios
- Área de "Mi Cuenta" para rastrear pedidos y guardar productos favoritos.

## 3. Carrito de Compras Completo
- Transición de Vitrina Digital a E-commerce con pagos integrados (Stripe/PayPal/Zelle).

## 4. Badges de Descuento en Banners Hero
- **Propósito:** Comunicar descuentos activos directamente en los banners de la landing page para incentivar la acción de compra.
- **Diseño Original:** Etiquetas naranjas (`bg-[#e57b3e]`) con ícono de fuego y texto como `-65% OFF`, `-10% OFF`, `-40% OFF`, posicionadas sobre cada banner del hero.
- **Ubicación en código:** `frontend/src/App.tsx`, sección de banners hero (3 instancias a líneas ~72, ~104, ~134).
- **Estado:** Código eliminado temporalmente; reactivar cuando se tengan descuentos reales a comunicar.
