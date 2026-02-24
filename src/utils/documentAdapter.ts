import type { IDocument } from "../interfaces/IGeneric";
import { initDocument } from "../store/initOrganization";

/**
 * Transforma los datos que vienen de la API/Base de Datos al formato IDocument
 * que la aplicación (frontend) entiende y necesita.
 */
export const adaptApiToDocument = (apiData: any): IDocument => {
  if (!apiData) return initDocument;

  return {
    ...initDocument, // Valores por defecto (asegura campos como printConfig)
    ...apiData,      // Sobrescribe con lo que viene del servidor
    
    // --- TRANSFORMACIONES ESPECÍFICAS ---
    
    // 1. Asegurar que sampleData sea un Objeto (si viene como string JSON)
    sampleData: typeof apiData.sampleData === 'string' 
      ? JSON.parse(apiData.sampleData) 
      : apiData.sampleData || {},

    // 2. Garantizar que los campos de texto no sean null (evita errores en editores)
    html: apiData.html || '',
    css: apiData.css || '',
    headerHtml: apiData.headerHtml || '',
    footerHtml: apiData.footerHtml || '',
    
    // 3. Manejo de fechas (convertir strings de BD a objetos Date si es necesario)
    updatedAt: apiData.updatedAt ? new Date(apiData.updatedAt) : new Date(),
    createdAt: apiData.createdAt ? new Date(apiData.createdAt) : new Date(),

    // 4. Campos exclusivos del Front (que no existen en la BD)

  };
};

/**
 * Opcional: Transforma el documento del Front al formato que el Backend espera.
 * Útil si el backend requiere que sampleData sea un String.
 */
export const adaptDocumentToApi = (document: IDocument) => {
  return {
    ...document,
    sampleData: JSON.stringify(document.sampleData)
  };
};