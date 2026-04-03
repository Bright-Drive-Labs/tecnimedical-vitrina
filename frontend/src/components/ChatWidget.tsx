/**
 * ============================================================================
 * CHAT WIDGET — SÚPER AGENTE TECNIMEDICAL
 * ============================================================================
 * Componente: Widget flotante de chat IA para la vitrina de TecniMedical.
 * Motor: Bright Drive Agent Backend → /webhook → Gemini 2.5 Flash
 * Diseño: Mobile-first, glassmorphism, Framer Motion.
 *
 * Flujo de interacción:
 * 1. Botón flotante visible en toda la página (esquina inferior derecha).
 * 2. Click → panel de chat se abre con animación spring.
 * 3. Usuario escribe → se llama sendMessageToAgent() en api.ts.
 * 4. Respuesta del agente aparece con animación de "typing" (3 puntos).
 * 5. Si el agente detecta interés de compra, CTA de WhatsApp aparece.
 * ============================================================================
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendMessageToAgent } from '../services/api';
import { getClientId } from '../services/clientSession';

// ─── Tipos de datos ────────────────────────────────────────────────────────────

/** Estructura de un mensaje en la conversación. */
interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

// ─── Constantes ────────────────────────────────────────────────────────────────

/** Número de WhatsApp de TecniMedical (con código de país, sin espacios ni guiones). */
const WHATSAPP_NUMBER = '584147148895';

/** Mensaje inicial del agente cuando el usuario abre el chat. */
const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  text: '¡Hola! 👋 Soy el asistente virtual de **TecniMedical**. Estoy aquí para ayudarte a encontrar el equipo médico ideal para tus necesidades. ¿En qué te puedo ayudar hoy?',
  timestamp: new Date(),
};

// ─── Sub-componente: Burbuja de mensaje ───────────────────────────────────────

/** Renderiza un mensaje individual con animación de entrada. */
const MessageBubble = ({ message }: { message: Message }) => {
  const isUser = message.role === 'user';

  // Procesamos el texto para renderizar **negrita** de forma básica
  const renderText = (text: string) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) =>
      i % 2 === 1 ? <strong key={i}>{part}</strong> : part
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}
    >
      {/* Avatar del agente */}
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-brand-blue flex items-center justify-center mr-2 mt-1 shrink-0">
          <span className="material-symbols-outlined text-white text-[14px]">
            smart_toy
          </span>
        </div>
      )}

      {/* Burbuja de chat */}
      <div
        className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
          isUser
            ? 'bg-brand-blue text-white rounded-br-sm'
            : 'bg-white text-slate-800 border border-slate-100 rounded-bl-sm'
        }`}
      >
        {renderText(message.text)}
      </div>
    </motion.div>
  );
};

// ─── Sub-componente: Indicador de "escribiendo..." ────────────────────────────

/** Los 3 puntos animados que aparecen mientras el agente procesa. */
const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 8 }}
    className="flex justify-start mb-3"
  >
    <div className="w-7 h-7 rounded-full bg-brand-blue flex items-center justify-center mr-2 mt-1 shrink-0">
      <span className="material-symbols-outlined text-white text-[14px]">smart_toy</span>
    </div>
    <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1 shadow-sm">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 bg-slate-400 rounded-full"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
        />
      ))}
    </div>
  </motion.div>
);

// ─── Componente Principal ──────────────────────────────────────────────────────

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false); // Punto rojo de notificación

  /** Referencia al final de la lista de mensajes para hacer scroll automático. */
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /** ID de sesión persistente del usuario actual (generado automáticamente). */
  const clientId = getClientId();

  // ─── Efectos ────────────────────────────────────────────────────────────────

  /** Scroll automático al último mensaje cada vez que cambia la lista. */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  /** Cuando el panel se abre, quita el punto rojo de notificación. */
  useEffect(() => {
    if (isOpen) setHasNewMessage(false);
  }, [isOpen]);

  /** 
   * ESCUCHA GLOBAL: Permite abrir el chat desde cualquier parte de la web 
   * disparando el evento personalizado 'tecni-open-chat'.
   */
  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener('tecni-open-chat', handleOpenChat);
    return () => window.removeEventListener('tecni-open-chat', handleOpenChat);
  }, []);

  // ─── Handlers ───────────────────────────────────────────────────────────────

  /** Envía el mensaje del usuario al Súper Agente y procesa la respuesta. */
  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text || isLoading) return;

    // 1. Agregar mensaje del usuario a la conversación
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // 2. Llamar al backend → Súper Agente → Gemini
      const botReply = await sendMessageToAgent(text, clientId);

      // 3. Agregar respuesta del agente
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: botReply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      // 4. Fallback si el backend falla completamente
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          text: 'En este momento no puedo responder. Por favor, contáctanos directamente por WhatsApp.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  /** Maneja Enter en el input (sin Shift para no bloquear saltos de línea). */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  /** Construye la URL de WhatsApp con un mensaje contextual pre-llenado. */
  const getWhatsAppUrl = () => {
    const msg = encodeURIComponent(
      'Hola, estuve consultando sobre equipos médicos en su web y me gustaría más información.'
    );
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Panel principal del chat ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="
              fixed z-50
              bottom-24 right-4
              w-[calc(100vw-2rem)] max-w-[380px]
              bg-slate-50 shadow-2xl border border-slate-200
              flex flex-col overflow-hidden
              sm:right-6
            "
            style={{ height: 'min(560px, calc(100vh - 120px))' }}
          >
            {/* Header del chat */}
            <div className="bg-brand-blue px-5 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                {/* Indicador de estado online */}
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-[20px]">smart_toy</span>
                  </div>
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-brand-green rounded-full border-2 border-brand-blue" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm leading-tight">Asistente TecniMedical</p>
                  <p className="text-white/70 text-xs">En línea · Responde al instante</p>
                </div>
              </div>
              {/* Botón cerrar */}
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                aria-label="Cerrar chat"
              >
                <span className="material-symbols-outlined text-white text-xl">close</span>
              </button>
            </div>

            {/* Área de mensajes */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}

              {/* Indicador de escribiendo */}
              <AnimatePresence>
                {isLoading && <TypingIndicator />}
              </AnimatePresence>

              {/* Anchor para scroll automático */}
              <div ref={messagesEndRef} />
            </div>

            {/* CTA de WhatsApp (siempre visible en el panel) */}
            <div className="px-4 py-2 shrink-0">
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  flex items-center justify-center gap-2
                  w-full py-2.5 rounded-lg
                  bg-[#25D366] hover:bg-[#20bd5a] active:scale-[0.98]
                  text-white text-sm font-bold
                  transition-all duration-150 shadow-sm
                "
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Hablar por WhatsApp
              </a>
            </div>

            {/* Input de mensaje */}
            <div className="px-4 pb-4 pt-1 border-t border-slate-200 bg-white shrink-0">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Escribe tu consulta..."
                  disabled={isLoading}
                  className="
                    flex-1 bg-transparent border-none outline-none
                    text-sm text-slate-800 placeholder:text-slate-400
                    disabled:opacity-50
                  "
                  // En iOS esto evita el zoom al enfocar el input
                  style={{ fontSize: '16px' }}
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isLoading}
                  className="
                    w-8 h-8 bg-brand-blue rounded-lg
                    flex items-center justify-center
                    hover:brightness-110 active:scale-90
                    disabled:opacity-40 disabled:cursor-not-allowed
                    transition-all
                  "
                  aria-label="Enviar mensaje"
                >
                  <span className="material-symbols-outlined text-white text-[18px]">send</span>
                </button>
              </div>
              <p className="text-center text-[10px] text-slate-400 mt-2">
                Powered by Bright Drive Solution
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Botón flotante de apertura ── */}
      <motion.button
        onClick={() => setIsOpen((prev) => !prev)}
        className="
          fixed z-50 bottom-5 right-4
          w-14 h-14 rounded-full
          bg-brand-blue shadow-xl shadow-brand-blue/40
          flex items-center justify-center
          hover:brightness-110 active:scale-95
          transition-all duration-200
          sm:right-6
        "
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        aria-label="Abrir chat con asistente"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="material-symbols-outlined text-white text-2xl"
            >
              close
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="material-symbols-outlined text-white text-2xl"
            >
              chat
            </motion.span>
          )}
        </AnimatePresence>

        {/* Punto rojo de notificación (visible cuando el chat está cerrado) */}
        {!isOpen && hasNewMessage && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white"
          />
        )}

        {/* Pulso animado para llamar la atención */}
        {!isOpen && (
          <motion.div
            className="absolute inset-0 rounded-full bg-brand-blue"
            animate={{ scale: [1, 1.3, 1.3], opacity: [0.4, 0, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          />
        )}
      </motion.button>
    </>
  );
}
