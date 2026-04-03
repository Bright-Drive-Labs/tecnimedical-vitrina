# CONTRACT.md — TecniMedical
## Contrato de API: Frontend ↔ Bright Drive Agent Backend
> **Versión:** 1.0 | **Estado:** ACTIVO
> **Fecha:** Marzo 2026 | **Arquitecto:** Antigravity / Travis

---

## ⚠️ REGLA #1 DEL FRONTEND

**Lee este documento completo antes de escribir cualquier `fetch()` o componente que consuma datos.**
Este es el único punto de verdad para la comunicación entre la UI de TecniMedical y el Super Agente.

---

## 1. Variables de Entorno

Crear el archivo `frontend/.env.local` (NO commitear — está en `.gitignore`):

```env
# URL del backend Bright Drive Agent en Railway
VITE_API_BASE_URL=http://localhost:3000

# UUID del tenant TecniMedical en Supabase
# IMPORTANTE: El arquitecto (padre) proveerá este UUID después de ejecutar el INSERT en Supabase
# Placeholder hasta recibir el valor real:
VITE_TENANT_ID=PENDIENTE_PROVEER_POR_ARQUITECTO
```

Crear `frontend/.env.example` (SÍ commitear — es el template para el equipo):
```env
VITE_API_BASE_URL=https://tu-backend.railway.app
VITE_TENANT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

---

## 2. Backend — Información General

| Dato | Valor |
|---|---|
| **Framework** | Fastify (Node.js/TypeScript) |
| **URL Local** | `http://localhost:3000` |
| **URL Producción** | Proveer por el arquitecto después del deploy |
| **Repo Backend** | `bright-drive-backend-agent` en GitHub |
| **CORS** | Configurado para aceptar cualquier origen (`origin: '*'`) |
| **Health Check** | `GET /health` → `{ "ok": true }` |

---

## 3. Endpoint Principal — Chatbot IA (Súper Agente)

### `POST /webhook`

Este es el cerebro del producto. Cada mensaje del usuario en el chat de la web va aquí.

**Request Body:**
```typescript
interface WebhookRequest {
  message: string;      // Texto que escribió el usuario
  tenant_id: string;    // Desde import.meta.env.VITE_TENANT_ID
  client_id: string;    // UUID de sesión (ver sección 6)
}
```

**Ejemplo de Request:**
```json
{
  "message": "¿Tienen sillas de ruedas eléctricas disponibles?",
  "tenant_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "client_id": "yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy"
}
```

**Response:**
```typescript
interface WebhookResponse {
  status: string;                // "transaccion_finalizada"
  router_ms: number;             // Tiempo del clasificador de intención (ms)
  specialist_ms: number;         // Tiempo del agente especialista (ms)
  ai_intention_vector: string;   // "VENTA" | "SOPORTE" | "DUDA" | "OTRO"
  bot_reply: string;             // ← ESTO es lo que muestra en el chat al usuario
}
```

**La UI solo necesita mostrar `bot_reply`.** Los otros campos son para auditoría interna.

**Mock para Fase de Desarrollo:**
```typescript
// src/services/mocks/webhookMock.ts
export const mockAgentResponse = async (message: string): Promise<string> => {
  // Simula latencia de red
  await new Promise(resolve => setTimeout(resolve, 800));

  const responses: Record<string, string> = {
    default: "¡Hola! Soy el asistente virtual de TecniMedical. Estoy aquí para asesorarte sobre nuestros equipos médicos. ¿En qué puedo ayudarte hoy?",
    precio: "Con gusto te cotizo. Para darte el precio exacto necesito saber la cantidad y si es para uso clínico o domiciliario. ¿Puedes darme más detalles?",
    fisioterapia: "Contamos con una línea completa de equipos para fisioterapia: ultrasonido terapéutico, electroterapia, hidroterapia y más. ¿Cuál es el equipo específico que necesitas?",
  };

  const key = Object.keys(responses).find(k => message.toLowerCase().includes(k));
  return responses[key || 'default'];
};
```

---

## 4. Endpoints de Galería (Google Drive Headless CMS)

Las imágenes de productos se sirven desde carpetas de Google Drive via proxy del backend.

### 4.1 — `GET /api/gallery/albums/:folderId`

Obtiene las categorías de productos (subcarpetas de Drive).

**Response:**
```typescript
interface Album {
  id: string;        // ID de la carpeta en Google Drive
  name: string;      // Nombre de la categoría (ej: "Fisioterapia")
  coverId: string;   // ID del archivo de portada en Drive
}
interface AlbumsResponse {
  success: boolean;
  albums: Album[];
}
```

**Mock para Desarrollo:**
```typescript
export const MOCK_PRODUCT_CATEGORIES: Album[] = [
  { id: "folder_fisio", name: "Equipos de Fisioterapia", coverId: "cover_fisio" },
  { id: "folder_diag", name: "Diagnóstico Clínico", coverId: "cover_diag" },
  { id: "folder_rehab", name: "Movilidad y Rehabilitación", coverId: "cover_rehab" },
  { id: "folder_hosp", name: "Equipamiento Hospitalario", coverId: "cover_hosp" },
];
```

### 4.2 — `GET /api/gallery/:folderId`

Obtiene los archivos (productos) dentro de una categoría.

**Response:**
```typescript
interface DriveImage {
  id: string;      // ID del archivo en Drive (usar en endpoint de imagen)
  name: string;    // Nombre del archivo / producto
}
interface GalleryResponse {
  success: boolean;
  images: DriveImage[];
}
```

### 4.3 — `GET /api/image/:fileId` ← URL directa para `<img>`

No retorna JSON. Retorna bytes de imagen con headers correctos y caché de 24h.

```typescript
// Uso en componente React:
const getImageUrl = (fileId: string): string =>
  `${import.meta.env.VITE_API_BASE_URL}/api/image/${fileId}`;

// En JSX:
<img src={getImageUrl(product.id)} alt={product.name} loading="lazy" />

// Para mocks de desarrollo usar:
// https://placehold.co/400x300/1A4F8B/FFFFFF?text=TecniMedical
```

---

## 5. Endpoint de Captura de Leads [PENDIENTE BACKEND]

> ⚠️ **Estado:** Este endpoint aún no existe. El arquitecto lo creará en la Fase 3 (Integración).
> El frontend DEBE tener el formulario construido y funcionando con el mock — solo el `fetch()` cambiará.

### `POST /api/tecnimedical/leads`

Captura nombre y WhatsApp del usuario a cambio del catálogo de productos.

**Request:**
```typescript
interface LeadCaptureRequest {
  name: string;        // Nombre completo del cliente
  whatsapp: string;    // Número con código de país: "58424XXXXXXX"
  tenant_id: string;   // Desde VITE_TENANT_ID
  source: string;      // "catalogo_download" | "chatbot_cta" | "hero_form"
}
```

**Response:**
```typescript
interface LeadCaptureResponse {
  success: boolean;
  message: string;      // Mensaje amigable para mostrar al usuario
  download_url?: string; // URL del catálogo PDF (si aplica)
}
```

**Mock para Desarrollo:**
```typescript
export const mockLeadCapture = async (data: LeadCaptureRequest): Promise<LeadCaptureResponse> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  console.log('[DEV] Lead capturado (mock):', data);
  return {
    success: true,
    message: "¡Perfecto! Tu catálogo está listo. Un asesor te contactará pronto por WhatsApp.",
    download_url: "/catalogo-tecnimedical-mock.pdf"
  };
};
```

---

## 6. Generación de client_id en el Frontend

Identificador de sesión del usuario. Se genera automáticamente, no lo ingresa el usuario.

```typescript
// src/services/clientSession.ts
import { v4 as uuidv4 } from 'uuid';

/**
 * Obtiene o crea un UUID de sesión para identificar al cliente en el Super Agente.
 * Se almacena en sessionStorage: persiste durante la visita, se borra al cerrar el tab.
 * Esto permite al backend mantener el historial de conversación dentro de la misma sesión.
 */
export const getClientId = (): string => {
  const STORAGE_KEY = 'bda_client_id';
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (stored) return stored;
  const newId = uuidv4();
  sessionStorage.setItem(STORAGE_KEY, newId);
  return newId;
};
```

Instalar uuid: `npm install uuid && npm install -D @types/uuid`

---

## 7. Capa de Servicios — Archivo Central

Todo el código que habla con el backend vive en `src/services/api.ts`:

```typescript
// src/services/api.ts
/**
 * Capa de abstracción de API para TecniMedical.
 * REGLA: Ningún componente hace fetch() directamente. Todo pasa por aquí.
 * Para cambiar entre mock y real: solo cambiar VITE_API_BASE_URL en .env.local
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const TENANT_ID = import.meta.env.VITE_TENANT_ID;

/** Envía un mensaje al Súper Agente y retorna la respuesta del bot */
export const sendMessageToAgent = async (
  message: string,
  clientId: string
): Promise<string> => {
  try {
    const res = await fetch(`${BASE_URL}/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, tenant_id: TENANT_ID, client_id: clientId })
    });
    const data = await res.json();
    return data.bot_reply ?? "Disculpa, tuve un problema técnico. ¿Puedes repetir tu pregunta?";
  } catch {
    return "En este momento no puedo responder. Por favor, contáctanos por WhatsApp.";
  }
};

/** Retorna la URL directa de una imagen desde el proxy de Drive */
export const getImageUrl = (fileId: string): string =>
  `${BASE_URL}/api/image/${fileId}`;

/** Obtiene las categorías de productos desde Drive */
export const getProductCategories = async () => {
  const res = await fetch(`${BASE_URL}/api/gallery/albums/${import.meta.env.VITE_DRIVE_FOLDER_ID}`);
  return res.json();
};

/** Obtiene los productos dentro de una categoría */
export const getProductsByCategory = async (folderId: string) => {
  const res = await fetch(`${BASE_URL}/api/gallery/${folderId}`);
  return res.json();
};
```

---

## 8. Estructura de Módulos del Frontend

| Módulo | Componente(s) | Conecta con |
|---|---|---|
| **Hero + Lead Gen** | `HeroSection`, `LeadCaptureModal` | `POST /api/tecnimedical/leads` [PENDIENTE] |
| **AI Chat Assistant** | `ChatWidget`, `ChatBubble`, `ChatInput` | `POST /webhook` |
| **Product Grid** | `ProductGrid`, `ProductCard`, `ProductDetail` | `GET /api/gallery/*` + `GET /api/image/:id` |
| **WhatsApp CTA** | `WhatsAppButton` | Enlace directo (no necesita backend) |

---

## 9. WhatsApp CTA — Formato de URL

No requiere backend. El botón de WhatsApp se construye así:

```typescript
// Número de TecniMedical (reemplazar con el real)
const WHATSAPP_NUMBER = "584XX XXXXXXX"; // Sin espacios ni guiones
const BASE_WA_URL = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}`;

// CTA genérico
const getWhatsAppUrl = (message: string): string =>
  `${BASE_WA_URL}?text=${encodeURIComponent(message)}`;

// CTA desde chatbot (pre-carga el contexto de la conversación)
const getAgentHandoffUrl = (productName?: string): string => {
  const msg = productName
    ? `Hola, estuve consultando sobre ${productName} en su web y me gustaría más información.`
    : `Hola, me gustaría recibir asesoría sobre sus equipos médicos.`;
  return getWhatsAppUrl(msg);
};
```

---

## 10. Historial de Versiones

| Versión | Fecha | Cambio |
|---|---|---|
| 1.0 | Marzo 2026 | Documento inicial — endpoints core, mocks y estructura de servicios |

