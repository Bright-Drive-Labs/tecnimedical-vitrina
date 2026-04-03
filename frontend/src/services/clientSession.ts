/**
 * clientSession.ts — Gestión de sesión del usuario en el cliente.
 *
 * Genera y persiste un UUID único por sesión de navegador.
 * Este ID le permite al Súper Agente (backend) mantener el hilo
 * de la conversación del usuario a lo largo de múltiples mensajes.
 *
 * Usa sessionStorage:
 * - Persiste entre recargas de página.
 * - Se limpia automáticamente al cerrar el tab/navegador.
 * - No requiere cookies ni permisos del usuario.
 */

import { v4 as uuidv4 } from 'uuid';

const SESSION_KEY = 'bda_client_id';

/**
 * Obtiene el client_id de la sesión actual.
 * Si no existe, genera uno nuevo y lo guarda en sessionStorage.
 *
 * @returns UUID de sesión del usuario (string de 36 caracteres)
 */
export const getClientId = (): string => {
  const stored = sessionStorage.getItem(SESSION_KEY);
  if (stored) return stored;

  const newId = uuidv4();
  sessionStorage.setItem(SESSION_KEY, newId);
  return newId;
};
