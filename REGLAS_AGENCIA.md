# REGLAS DE ORO: AGENCIA BRIGHT DRIVE SOLUTION

Este documento es el punto de partida obligatorio para todos los proyectos de la agencia (**Bright Drive Solution**, **TecniMedical**, **El Escuadrón**). Todo desarrollador (o IA como Travis/Antigravity) debe adherirse estrictamente a estas normas.

## 1. 📂 Contexto del Proyecto
Todo proyecto debe contar con un archivo `CONTEXTO.md` en su raíz. Es obligatorio leerlo y actualizarlo con cada cambio significativo. Este archivo contiene la visión, stack y detalles específicos del negocio.

## 2. 🛡️ Seguridad Extrema
- **Cero API Keys en Código:** Bajo ninguna circunstancia se deben dejar llaves de API, secrets o tokens hardcodeados en los archivos.
- **Variables de Entorno:** Se debe usar siempre un archivo `.env` (que debe estar en `.gitignore`) para manejar credenciales.
- **Protección de Servidores:** Implementar los estándares más altos de seguridad frontend para proteger nuestros backends y datos de clientes frente a ataques.

## 3. 📝 Documentación Total (Línea por Línea)
- **Comentarios Mandatorios:** Cada línea de código (o bloques lógicos si la línea es trivial) debe estar debidamente comentada explicando su propósito y lógica.
- **Claridad:** La documentación no es opcional; es parte del código entregable.

## 4. 🎨 Estética Premium (Impacto "WOW")
- **Diseño Moderno:** Uso de modern typography (Google Fonts), glassmorphism, micro-animaciones y gradientes.
- **Stitch:** Uso de la herramienta Stitch para mantener consistencia visual y generar variantes en tiempo récord.
- **Imágenes:** No usar placeholders genéricos. Generar o usar recursos visuales de alta calidad que representen el valor de la marca.

## 🚀 Stack Tecnológico Estándar
- **Frontend:** React + Vite + TypeScript.
- **Backend:** Fastify / Node.js.
- **Estilizado:** Tailwind CSS v4 / Framer Motion.
- **Infraestructura:** Vercel para el Frontend.

---
*Sebastian / Antigravity*
