/**
 * Capa de abstracción de API para TecniMedical.
 * REGLA: Ningún componente hace fetch() directamente. Todo pasa por aquí.
 * Para cambiar entre mock y real: solo cambiar VITE_API_BASE_URL en .env.local
 */

import { mockLeadCapture, type LeadCaptureResponse } from './mocks/leadMock';

const rawBaseUrl = (import.meta.env.VITE_API_BASE_URL as string) || 
                   (import.meta.env.VITE_API_BASE as string) || 
                   'https://bright-drive-backend-agent-production.up.railway.app';

// Limpiamos la URL: eliminamos /api al final y barras diagonales finales
const BASE_URL = rawBaseUrl.replace(/\/api\/?$/, '').replace(/\/+$/, '');

console.log('🌐 API Service Initialized. Base URL:', BASE_URL);

const TENANT_ID = (import.meta.env.VITE_TENANT_ID as string) || '63e2d67c-9b1a-4d3b-8f32-5a2e6f9c8d1b';

/** Envía un mensaje al Súper Agente y retorna la respuesta del bot */
export const sendMessageToAgent = async (
  message: string,
  clientId: string
): Promise<string> => {
  try {
    const res = await fetch(`${BASE_URL}/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, tenant_id: TENANT_ID, client_id: clientId }),
    });
    const data = await res.json();
    return data.bot_reply ?? 'Disculpa, tuve un problema técnico. ¿Puedes repetir tu pregunta?';
  } catch {
    return 'En este momento no puedo responder. Por favor, contáctanos por WhatsApp.';
  }
};

/** Captura un lead (nombre + WhatsApp) a cambio del catálogo.
 *  Ruta genérica /api/leads — el tenant_id en el body identifica a Tecnimedical.
 *  Estándar: MULTITENANT_REFACTOR_MASTER.md — ninguna ruta puede ser cliente-específica.
 *  Usa mock automáticamente hasta que VITE_API_BASE_URL apunte al backend real en Railway.
 */
export const captureLead = async (
  name: string,
  whatsapp: string
): Promise<LeadCaptureResponse> => {
  const payload = { name, whatsapp, tenant_id: TENANT_ID, source: 'catalogo_download' };

  if (!BASE_URL || TENANT_ID === 'PENDIENTE_PROVEER_POR_ARQUITECTO') {
    return mockLeadCapture(payload);
  }

  try {
    // ✅ Ruta estándar multi-tenant — el tenant_id en el body identifica al cliente
    const res = await fetch(`${BASE_URL}/api/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  } catch {
    // Fallback al mock si el backend aún no tiene el endpoint activo
    return mockLeadCapture(payload);
  }
};

/** Retorna la URL directa de una imagen desde el proxy de Drive */
export const getImageUrl = (idOrUrl: string) => {
  if (!idOrUrl) return '/logo.png';
  // If it's a full URL (starts with http), return it directly
  if (idOrUrl.startsWith('http')) return idOrUrl;
  
  return `${BASE_URL}/api/image/${idOrUrl}`;
};

/** Obtiene las categorías de productos desde Drive */
export const getProductCategories = async () => {
  const res = await fetch(
    `${BASE_URL}/api/gallery/albums/${import.meta.env.VITE_DRIVE_FOLDER_ID}`
  );
  return res.json();
};

/** Obtiene los productos dentro de una categoría */
export const getProductsByCategory = async (folderId: string) => {
  try {
    const res = await fetch(`${BASE_URL}/api/gallery/${folderId}`);
    const data = await res.json();
    return data.images ?? [];
  } catch {
    return [];
  }
};
/** Elimina un producto usando el backend con service_role (bypasa RLS) */
export const deleteProduct = async (id: string): Promise<void> => {
  const res = await fetch(`${BASE_URL}/api/admin/products/${id}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || `Error ${res.status} al eliminar producto`);
  }
};

/** Sincroniza una imagen de Supabase a la estructura organizada de Drive */
export const syncToDrive = async (params: {
  imageUrl: string;
  category: string;
  subcategory: string;
  name: string;
}): Promise<{ success: boolean; driveFileId?: string; error?: string }> => {
  const res = await fetch(`${BASE_URL}/api/admin/sync-to-drive`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...params,
      parentFolderId: import.meta.env.VITE_DRIVE_FOLDER_ID
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Error ${res.status} en sync-to-drive`);
  return data;
};
