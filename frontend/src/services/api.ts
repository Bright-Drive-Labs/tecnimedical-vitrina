/**
 * Capa de abstracción de API para TecniMedical.
 * REGLA: Ningún componente hace fetch() directamente. Todo pasa por aquí.
 * Para cambiar entre mock y real: solo cambiar VITE_API_BASE_URL en .env.local
 */

import { mockLeadCapture, type LeadCaptureResponse } from './mocks/leadMock';

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
const TENANT_ID = import.meta.env.VITE_TENANT_ID as string;

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
 *  PENDIENTE: El endpoint POST /api/tecnimedical/leads aún no existe en el backend.
 *  Usa mock automáticamente hasta que VITE_API_BASE_URL apunte al backend real.
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
    const res = await fetch(`${BASE_URL}/api/tecnimedical/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  } catch {
    // Fallback al mock si el backend aún no tiene el endpoint
    return mockLeadCapture(payload);
  }
};

/** Retorna la URL directa de una imagen desde el proxy de Drive */
export const getImageUrl = (fileId: string): string =>
  `${BASE_URL}/api/image/${fileId}`;

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
