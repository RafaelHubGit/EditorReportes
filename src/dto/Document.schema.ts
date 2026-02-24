import { z } from 'zod';

// Esquema para la configuración de página basado en IPrintConfig y PageConfigInput
const PageConfigSchema = z.object({
  layout: z.object({
    format: z.string().optional(),
    unit: z.string().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
    orientation: z.boolean().optional(), // En el JSON del store es orientation
  }).optional(),
  margins: z.object({
    top: z.union([z.string(), z.number()]).optional(),
    right: z.union([z.string(), z.number()]).optional(),
    bottom: z.union([z.string(), z.number()]).optional(),
    left: z.union([z.string(), z.number()]).optional(),
  }).optional(),
  options: z.object({
    scale: z.number().optional(),
    printBackground: z.boolean().optional(),
    pageNumbers: z.boolean().optional(),
  }).optional(),
});

// El validador y transformador principal
export const DocumentDTO = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  html: z.string(),
  css: z.string().default(""),
  htmlHeader: z.string().optional(),
  cssHeader: z.string().optional(),
  htmlFooter: z.string().optional(),
  cssFooter: z.string().optional(),
  printConfig: PageConfigSchema,
  sampleData: z.record(z.string(), z.any()),
  jsonSchema: z.record(z.string(), z.any()).optional().nullable(),
  folderId: z.string().optional().nullable(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  tags: z.array(z.string()).optional(),
}).transform((data) => ({
  // Mapeo directo a los nombres que espera el Backend (TemplateInput)
  name: data.name,
  html: data.html,
  css: data.css,
  htmlHeader: data.htmlHeader,
  cssHeader: data.cssHeader,
  htmlFooter: data.htmlFooter,
  cssFooter: data.cssFooter,
  pageConfig: {
    format: data.printConfig.layout?.format,
    unit: data.printConfig.layout?.unit || "mm",
    width: data.printConfig.layout?.width,
    height: data.printConfig.layout?.height,
    landscape: data.printConfig.layout?.orientation, // Mapeo de orientation -> landscape
    margin: {
      top: String(data.printConfig.margins?.top ?? "0"),
      right: String(data.printConfig.margins?.right ?? "0"),
      bottom: String(data.printConfig.margins?.bottom ?? "0"),
      left: String(data.printConfig.margins?.left ?? "0"),
    }
  },
  sampleData: data.sampleData,
  // jsonSchema: data.jsonSchema || {}, 
  folderId: data.folderId,
  status: data.status,
  tags: data.tags
}));

// Tipo para TypeScript inferido de la transformación (lo que recibe Apollo)
export type TemplateInput = z.output<typeof DocumentDTO>;