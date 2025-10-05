



// IGeneric.ts - Versión mejorada
export interface IDocument {
  id: string;
  name: string;
  html: string;
  htmlProcessed?: string;
  css: string;
  json: Record<string, any>;
  idFolder?: string;
  dateCreated?: Date;
  dateUpdated?: Date;
  userCreated?: string;
  userUpdated?: string;
  tags?: string[];
  type?: 'report' | 'invoice' | 'template' | 'custom';
}

export interface IFolder {
  id: string;
  name: string;
  idDocuments: string[];
  icon?: string;
  color?: string;
  description?: string;
  isShared?: boolean;
  sharedWith?: string[];
  dateCreated?: Date;
  dateUpdated?: Date;
}

export type ViewMode = 'grid' | 'list';
export type SortOption = 'name' | 'date' | 'type';