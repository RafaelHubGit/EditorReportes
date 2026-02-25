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
    headerHtml: apiData.htmlHeader || '',
    footerHtml: apiData.htmlFooter || '',

    // 3. Mapeo específico de pageConfig a printConfig
    printConfig: apiData.pageConfig ? {
      ...initDocument.printConfig,
      ...apiData.pageConfig,
      margin: apiData.pageConfig.margin ? {
        ...initDocument.printConfig.margin,
        ...apiData.pageConfig.margin
      } : initDocument.printConfig.margin
    } : initDocument.printConfig,
    
    // 4. Manejo de fechas (convertir strings de BD a objetos Date si es necesario)
    updatedAt: apiData.updatedAt ? new Date(apiData.updatedAt) : new Date(),
    createdAt: apiData.createdAt ? new Date(apiData.createdAt) : new Date(),

    // 5. Mapeo de campos que pueden tener nombres diferentes
    headerCss: apiData.cssHeader || '',
    footerCss: apiData.cssFooter || '',
    jsonSchema: apiData.jsonSchema || '{}',

    // 6. Asegurar que folderId sea string o null
    folderId: apiData.folderId || null,

    // 7. Manejo de arrays
    tags: Array.isArray(apiData.tags) ? apiData.tags : [],
  };
};

/**
 * Opcional: Transforma el documento del Front al formato que el Backend espera.
 * Útil si el backend requiere que sampleData sea un String.
 */
export const adaptDocumentToApi = (document: IDocument) => {
  return {
    ...document,
    sampleData: JSON.stringify(document.sampleData),
    pageConfig: document.printConfig
  };
};