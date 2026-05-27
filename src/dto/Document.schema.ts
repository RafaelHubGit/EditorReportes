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
  margin: z.object({
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

// Esquema base (sin transform) para poder hacer .partial()
const DocumentBaseSchema = z.object({
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
});

// Transformador reutilizable
const transformToApi = (data: any) => ({
  name: data.name,
  html: data.html,
  css: data.css,
  htmlHeader: data.htmlHeader,
  cssHeader: data.cssHeader,
  htmlFooter: data.htmlFooter,
  cssFooter: data.cssFooter,
  pageConfig: {
    format: data.printConfig?.layout?.format,
    unit: data.printConfig?.layout?.unit || "mm",
    width: data.printConfig?.layout?.width,
    height: data.printConfig?.layout?.height,
    landscape: data.printConfig?.layout?.orientation,
    margin: {
      top: String(data.printConfig?.margin?.top ?? "0"),
      right: String(data.printConfig?.margin?.right ?? "0"),
      bottom: String(data.printConfig?.margin?.bottom ?? "0"),
      left: String(data.printConfig?.margin?.left ?? "0"),
    }
  },
  sampleData: data.sampleData,
  folderId: data.folderId,
  status: data.status,
  tags: data.tags,
});

// Validador y transformador para creacion (todos los campos requeridos)
export const DocumentDTO = DocumentBaseSchema.transform(transformToApi);

// Validador y transformador para actualizacion (todos los campos opcionales)
export const DocumentUpdateDTO = DocumentBaseSchema.partial().transform((data) => {
  const result: Record<string, any> = {};
  if (data.name !== undefined) result.name = data.name;
  if (data.html !== undefined) result.html = data.html;
  if (data.css !== undefined) result.css = data.css;
  if (data.htmlHeader !== undefined) result.htmlHeader = data.htmlHeader;
  if (data.cssHeader !== undefined) result.cssHeader = data.cssHeader;
  if (data.htmlFooter !== undefined) result.htmlFooter = data.htmlFooter;
  if (data.cssFooter !== undefined) result.cssFooter = data.cssFooter;
  if (data.printConfig !== undefined) {
    result.pageConfig = {
      format: data.printConfig.layout?.format,
      unit: data.printConfig.layout?.unit || "mm",
      width: data.printConfig.layout?.width,
      height: data.printConfig.layout?.height,
      landscape: data.printConfig.layout?.orientation,
      margin: {
        top: String(data.printConfig.margin?.top ?? "0"),
        right: String(data.printConfig.margin?.right ?? "0"),
        bottom: String(data.printConfig.margin?.bottom ?? "0"),
        left: String(data.printConfig.margin?.left ?? "0"),
      }
    };
  }
  if (data.sampleData !== undefined) result.sampleData = data.sampleData;
  if (data.folderId !== undefined) result.folderId = data.folderId;
  if (data.status !== undefined) result.status = data.status;
  if (data.tags !== undefined) result.tags = data.tags;
  return result;
});

// Tipo para TypeScript inferido de la transformación (lo que recibe Apollo)
export type TemplateInput = z.output<typeof DocumentDTO>;