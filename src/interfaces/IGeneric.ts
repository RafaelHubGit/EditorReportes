



// IGeneric.ts - Versión mejorada
export interface IDocument {
  id: string;
  name: string;
  html: string;
  htmlProcessed?: string;
  css: string;
  jsonSchema?: Record<string, any>;
  sampleData: Record<string, any>;
  folderId?: string | undefined | null;
  status?: 'draft' | 'published' | 'unpublished' | 'archived';
  tags?: string[];
  owner?: string;
  createdAt?: Date;
  updatedAt?: Date;
  userCreated?: string;
  userUpdated?: string;
}

export interface IFolder {
  id: string;
  name: string;
  description?: string;
  owner?: string;
  // idDocuments: string[];
  icon?: string;
  color?: string;
  isShared?: boolean;
  sharedWith?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export type ViewMode = 'grid' | 'list';
export type SortOption = 'name' | 'date' | 'type';