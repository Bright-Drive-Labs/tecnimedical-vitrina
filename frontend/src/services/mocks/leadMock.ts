interface LeadCaptureRequest {
  name: string;
  whatsapp: string;
  tenant_id: string;
  source: string;
}

export interface LeadCaptureResponse {
  success: boolean;
  message: string;
  download_url?: string;
}

export const mockLeadCapture = async (data: LeadCaptureRequest): Promise<LeadCaptureResponse> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  console.log('[DEV] Lead capturado (mock):', data);
  return {
    success: true,
    message: '¡Perfecto! Tu catálogo está listo. Un asesor te contactará pronto por WhatsApp.',
    download_url: '/catalogo-tecnimedical-mock.pdf',
  };
};
