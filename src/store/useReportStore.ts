// useReportStore.ts - Versión completa
import { create, type StateCreator } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';
import type { IDocument, IFolder, ViewMode, SortOption } from "../interfaces/IGeneric";

interface ReportState {
  document: IDocument;
  documents: IDocument[];
  folders: IFolder[];
  currentFolderId: string | null;
  viewMode: ViewMode;
  searchQuery: string;
  sortBy: SortOption;
  selectedDocuments: string[];
  
  // Document Actions
  addDocument: (document: IDocument) => Promise<void>;
  updateDocument: (updates: Partial<IDocument>) => Promise<void>;
  delDocuments: (idDocument: string) => Promise<void>;
  addDocuments: (document: IDocument) => void;
  getDocumentById: (id: string) => IDocument | null;
  setCurrentFolder: (folderId: string | null) => void;
  getDocumentsByFolder: (folderId?: string) => IDocument[];
  searchDocuments: (query: string) => IDocument[];
  
  // Folder Actions
  addFolder: (folder: Omit<IFolder, 'id'>) => Promise<void>;
  updateFolder: (folderId: string, updates: Partial<IFolder>) => Promise<void>;
  deleteFolder: (folderId: string) => Promise<void>;
  moveDocumentToFolder: (documentId: string, folderId: string | null) => Promise<void>;
  
  // UI Actions
  setViewMode: (mode: ViewMode) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: SortOption) => void;
  toggleDocumentSelection: (documentId: string) => void;
  clearSelection: () => void;
  moveSelectedDocuments: (folderId: string | null) => Promise<void>;
  moveSingleDocument: (documentId: string, folderId: string | null) => Promise<void>;
  
  // Share Actions
  shareFolder: (folderId: string, users: string[]) => Promise<void>;
  unshareFolder: (folderId: string, userId: string) => Promise<void>;

  isOpenMoveModal: boolean;
  setIsOpenMoveModal: ( isOpen: boolean ) => void;

  selectedMoveDocuments: string[];
  setSelectedMoveDocuments: ( selectedDocuments: string[] ) => void;

  isOpenCreateFolderModal: boolean;
  setIsOpenCreateFolderModal: (isOpen: boolean) => void;
}

const initDocument: IDocument = {
  id: '',
  name: 'Nuevo Documento',
  html: '<h1>Nuevo Reporte</h1>',
  htmlProcessed: '',
  css: '',
  json: {},
  dateCreated: new Date(),
  dateUpdated: new Date(),
  type: 'report'
};

const defaultFolders: IFolder[] = [
  {
    id: "123",
    name: "Marketing Templates",
    idDocuments: ["e4f50b2a-0c52-4cda-b729-9fbc3c7ff0df"],
    icon: "🎨",
    color: "#ff6b6b",
    description: "Plantillas para campañas de marketing",
    dateCreated: new Date('2024-01-15'),
    dateUpdated: new Date('2024-03-20')
  },
  {
    id: "abc", 
    name: "Invoices 2025",
    idDocuments: [],
    icon: "🧾",
    color: "#51cf66",
    description: "Facturas y documentos fiscales",
    dateCreated: new Date('2024-01-10'),
    dateUpdated: new Date('2024-03-18')
  },
  {
    id: "def",
    name: "Proyectos Activos",
    idDocuments: [],
    icon: "📂",
    color: "#339af0",
    description: "Proyectos en desarrollo",
    isShared: true,
    sharedWith: ["user2@example.com", "user3@example.com"],
    dateCreated: new Date('2024-02-01'),
    dateUpdated: new Date('2024-03-25')
  }
];

const sampleDocuments: IDocument[] = [
  {
    id: "e4f50b2a-0c52-4cda-b729-9fbc3c7ff0df",
    name: "Q3 Invoice Template",
    html: '<div>Invoice Template</div>',
    css: 'body { margin: 0; }',
    json: {},
    idFolder: "123",
    type: 'invoice',
    tags: ['factura', 'trimestral', 'template'],
    dateCreated: new Date('2024-03-15'),
    dateUpdated: new Date('2024-03-20')
  },
  {
    id: uuidv4(),
    name: "Monthly Sales Report",
    html: '<div>Sales Report</div>',
    css: 'body { margin: 0; }',
    json: {},
    type: 'report',
    tags: ['ventas', 'mensual'],
    dateCreated: new Date('2024-03-18'),
    dateUpdated: new Date('2024-03-25')
  },
  {
    id: uuidv4(),
    name: "Marketing Campaign Q2",
    html: '<div>Campaign Template</div>',
    css: 'body { margin: 0; }',
    json: {},
    type: 'template',
    tags: ['marketing', 'campaña'],
    dateCreated: new Date('2024-03-10'),
    dateUpdated: new Date('2024-03-22')
  }
];

const reportStore: StateCreator<ReportState, [["zustand/immer", never]]> = (set, get) => ({
  document: initDocument,
  documents: sampleDocuments,
  folders: defaultFolders,
  currentFolderId: null,
  viewMode: 'grid',
  searchQuery: '',
  sortBy: 'date',
  selectedDocuments: [],

  isOpenMoveModal: false,
  selectedMoveDocuments: [],

  isOpenCreateFolderModal: false,
  
  

  // Document Methods (manteniendo las existentes y agregando nuevas)
  addDocument: async (document: IDocument) => {
    try {
      set((state) => {
        const docWithId = {
          ...document,
          id: document.id || uuidv4(),
          dateCreated: new Date(),
          dateUpdated: new Date()
        };
        
        state.document = docWithId;
        const exists = state.documents.some((d: IDocument) => d.id === docWithId.id);
        if (!exists) state.documents.unshift(docWithId);
      });

      await Swal.fire({
        icon: 'success',
        title: '¡Documento creado!',
        text: `"${document.name}" se ha guardado correctamente`,
        timer: 3000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });

    } catch (error) {
      console.error('Error en addDocument:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error al crear documento',
        text: 'No se pudo crear el documento',
        confirmButtonText: 'Entendido'
      });
      throw error;
    }
  },

  updateDocument: async (updates: Partial<IDocument>) => {
    try {
      set((state) => {
        state.document = { 
          ...state.document, 
          ...updates, 
          dateUpdated: new Date() 
        };
        
        const docIndex = state.documents.findIndex((d: IDocument) => d.id === state.document.id);
        if (docIndex >= 0) {
          state.documents[docIndex] = state.document;
        }
      });

      await Swal.fire({
        icon: 'success',
        title: '¡Documento actualizado!',
        text: `Los cambios se han guardado correctamente`,
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });

    } catch (error) {
      console.error('Error en updateDocument:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error al guardar',
        text: 'No se pudieron guardar los cambios',
        confirmButtonText: 'Entendido'
      });
      throw error;
    }
  },

  delDocuments: async (idDocument: string) => {
    try {
      const { documents } = get();
      const documentToDelete = documents.find(d => d.id === idDocument);
      
      const result = await Swal.fire({
        icon: 'warning',
        title: '¿Eliminar documento?',
        text: `Esta acción no se puede deshacer`,
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
      });

      if (!result.isConfirmed) return;

      set((state) => {
        state.documents = state.documents.filter((d: IDocument) => d.id !== idDocument);
        state.folders.forEach(folder => {
          folder.idDocuments = folder.idDocuments.filter(docId => docId !== idDocument);
        });
        state.selectedDocuments = state.selectedDocuments.filter(id => id !== idDocument);
      });

      await Swal.fire({
        icon: 'success',
        title: '¡Eliminado!',
        text: `Documento eliminado correctamente`,
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });

    } catch (error) {
      console.error('Error en delDocuments:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error al eliminar',
        text: 'No se pudo eliminar el documento',
        confirmButtonText: 'Entendido'
      });
      throw error;
    }
  },

  getDocumentById: (id: string) => {
    const { documents } = get();
    return documents.find(doc => doc.id === id) || null;
  },

  addDocuments: (document: IDocument) =>
    set((state) => {
      const exists = state.documents.some((d: IDocument) => d.id === document.id);
      if (!exists) state.documents.unshift(document);
    }),

  setCurrentFolder: (folderId: string | null) => 
    set((state) => {
      state.currentFolderId = folderId;
    }),

  getDocumentsByFolder: (folderId?: string) => {
    const { documents, folders, currentFolderId, searchQuery, sortBy } = get();
    const targetFolderId = folderId || currentFolderId;
    
    let filteredDocs = documents;
    
    // Filtrar por folder
    if (targetFolderId) {
      const folder = folders.find(f => f.id === targetFolderId);
      if (folder) {
        filteredDocs = documents.filter(doc => folder.idDocuments.includes(doc.id));
      }
    } else {
      // Documentos sin folder
      filteredDocs = documents.filter(doc => !doc.idFolder);
    }
    
    // Aplicar búsqueda
    if (searchQuery) {
      filteredDocs = filteredDocs.filter(doc => 
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Aplicar ordenamiento
    filteredDocs = [...filteredDocs].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'type':
          return (a.type || '').localeCompare(b.type || '');
        case 'date':
        default:
          return new Date(b.dateUpdated || 0).getTime() - new Date(a.dateUpdated || 0).getTime();
      }
    });
    
    return filteredDocs;
  },

  searchDocuments: (query: string) => {
    const { documents } = get();
    return documents.filter(doc => 
      doc.name.toLowerCase().includes(query.toLowerCase()) ||
      doc.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
  },

  // Folder Methods
  // En useReportStore.ts - cambiar la firma de addFolder
addFolder: async (folderData: Omit<IFolder, 'id'>) => {
  try {
    const newFolder: IFolder = {
      ...folderData,
      id: uuidv4(),
      dateCreated: new Date(),
      dateUpdated: new Date()
    };

    set((state) => {
      state.folders.unshift(newFolder);
    });

    await Swal.fire({
      icon: 'success',
      title: '¡Carpeta creada!',
      text: `"${folderData.name}" se ha creado correctamente`,
      timer: 3000,
      showConfirmButton: false,
      toast: true,
      position: 'top-end'
    });

    // Cambiar esto: no retornar el id o cambiar la interfaz
    // return newFolder.id; // ← Eliminar esta línea
  } catch (error) {
    console.error('Error en addFolder:', error);
    await Swal.fire({
      icon: 'error',
      title: 'Error al crear carpeta',
      text: 'No se pudo crear la carpeta',
      confirmButtonText: 'Entendido'
    });
    throw error;
  }
},

  // En useReportStore.ts - corregir updateFolder
updateFolder: async (folderId: string, updates: Partial<IFolder>) => {
  try {
    set((state) => {
      const folderIndex = state.folders.findIndex(f => f.id === folderId);
      if (folderIndex >= 0) {
        // Usar Object.assign para evitar problemas de tipos
        Object.assign(state.folders[folderIndex]!, updates, {
          dateUpdated: new Date()
        });
      }
    });

    await Swal.fire({
      icon: 'success',
      title: '¡Carpeta actualizada!',
      text: `Los cambios se han guardado correctamente`,
      timer: 2000,
      showConfirmButton: false,
      toast: true,
      position: 'top-end'
    });

  } catch (error) {
    console.error('Error en updateFolder:', error);
    await Swal.fire({
      icon: 'error',
      title: 'Error al guardar',
      text: 'No se pudieron guardar los cambios',
      confirmButtonText: 'Entendido'
    });
    throw error;
  }
},

  deleteFolder: async (folderId: string) => {
    try {
      const { folders } = get();
      const folderToDelete = folders.find(f => f.id === folderId);
      
      if (!folderToDelete) return;

      const result = await Swal.fire({
        icon: 'warning',
        title: '¿Eliminar carpeta?',
        text: `La carpeta "${folderToDelete.name}" y su contenido se eliminarán`,
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
      });

      if (!result.isConfirmed) return;

      set((state) => {
        state.folders = state.folders.filter(f => f.id !== folderId);
      });

      await Swal.fire({
        icon: 'success',
        title: '¡Eliminada!',
        text: `Carpeta eliminada correctamente`,
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });

    } catch (error) {
      console.error('Error en deleteFolder:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error al eliminar',
        text: 'No se pudo eliminar la carpeta',
        confirmButtonText: 'Entendido'
      });
      throw error;
    }
  },

  moveDocumentToFolder: async (documentId: string, folderId: string | null) => {
    try {
      set((state) => {
        // Remover de todas las folders primero
        state.folders.forEach(folder => {
          folder.idDocuments = folder.idDocuments.filter(id => id !== documentId);
        });
        
        // Agregar a la nueva folder si se especifica
        if (folderId) {
          const targetFolder = state.folders.find(f => f.id === folderId);
          if (targetFolder && !targetFolder.idDocuments.includes(documentId)) {
            targetFolder.idDocuments.push(documentId);
          }
        }
        
        // Actualizar el idFolder en el documento
        const docIndex = state.documents.findIndex(d => d.id === documentId);
        if (docIndex >= 0) {
          state.documents[docIndex]!.idFolder = folderId || "";
        }
      });

      await Swal.fire({
        icon: 'success',
        title: '¡Documento movido!',
        text: `El documento se ha movido correctamente`,
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });

    } catch (error) {
      console.error('Error en moveDocumentToFolder:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error al mover documento',
        text: 'No se pudo mover el documento',
        confirmButtonText: 'Entendido'
      });
      throw error;
    }
  },

  // UI Methods
  setViewMode: (mode: ViewMode) => 
    set((state) => {
      state.viewMode = mode;
    }),

  setSearchQuery: (query: string) => 
    set((state) => {
      state.searchQuery = query;
    }),

  setSortBy: (sort: SortOption) => 
    set((state) => {
      state.sortBy = sort;
    }),

  toggleDocumentSelection: (documentId: string) =>
    set((state) => {
      if (state.selectedDocuments.includes(documentId)) {
        state.selectedDocuments = state.selectedDocuments.filter(id => id !== documentId);
      } else {
        state.selectedDocuments.push(documentId);
      }
    }),

  clearSelection: () =>
    set((state) => {
      state.selectedDocuments = [];
    }),

  moveSelectedDocuments: async (folderId: string | null) => {
    const { selectedDocuments, moveDocumentToFolder } = get();
    
    try {
      for (const docId of selectedDocuments) {
        await moveDocumentToFolder(docId, folderId);
      }
      
      set((state) => {
        state.selectedDocuments = [];
      });
      
    } catch (error) {
      console.error('Error moving documents:', error);
      throw error;
    }
  },

  moveSingleDocument: async (documentId: string, folderId: string | null) => {
    try {
      set((state) => {
        // Remove from all folders first
        state.folders.forEach(folder => {
          folder.idDocuments = folder.idDocuments.filter(id => id !== documentId);
        });
        
        // Add to the new folder if specified
        if (folderId) {
          const targetFolder = state.folders.find(f => f.id === folderId);
          if (targetFolder && !targetFolder.idDocuments.includes(documentId)) {
            targetFolder.idDocuments.push(documentId);
          }
        }
        
        // Update the idFolder in the document
        const docIndex = state.documents.findIndex(d => d.id === documentId);
        if (docIndex >= 0) {
          state.documents[docIndex]!.idFolder = folderId || "";
        }
      });
  
      await Swal.fire({
        icon: 'success',
        title: '¡Documento movido!',
        text: `El documento se ha movido correctamente`,
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
  
    } catch (error) {
      console.error('Error moving document:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error al mover documento',
        text: 'No se pudo mover el documento',
        confirmButtonText: 'Entendido'
      });
      throw error;
    }
  },

  // Share Methods
  shareFolder: async (folderId: string, users: string[]) => {
    try {
      set((state) => {
        const folderIndex = state.folders.findIndex(f => f.id === folderId);
        if (folderIndex >= 0) {
          state.folders[folderIndex]!.isShared = true;
          state.folders[folderIndex]!.sharedWith = [
            ...(state.folders[folderIndex]!.sharedWith || []),
            ...users
          ];
          state.folders[folderIndex]!.dateUpdated = new Date();
        }
      });

      await Swal.fire({
        icon: 'success',
        title: '¡Carpeta compartida!',
        text: `La carpeta se ha compartido con ${users.length} usuario(s)`,
        timer: 3000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });

    } catch (error) {
      console.error('Error en shareFolder:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error al compartir',
        text: 'No se pudo compartir la carpeta',
        confirmButtonText: 'Entendido'
      });
      throw error;
    }
  },

  unshareFolder: async (folderId: string, userId: string) => {
    try {
      set((state) => {
        const folderIndex = state.folders.findIndex(f => f.id === folderId);
        if (folderIndex >= 0) {
          state.folders[folderIndex]!.sharedWith = 
            state.folders[folderIndex]!.sharedWith?.filter(user => user !== userId) || [];
          
          if (state.folders[folderIndex]!.sharedWith?.length === 0) {
            state.folders[folderIndex]!.isShared = false;
          }
          
          state.folders[folderIndex]!.dateUpdated = new Date();
        }
      });

      await Swal.fire({
        icon: 'success',
        title: '¡Compartición removida!',
        text: `El usuario ya no tiene acceso a la carpeta`,
        timer: 3000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });

    } catch (error) {
      console.error('Error en unshareFolder:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error al remover acceso',
        text: 'No se pudo remover el acceso del usuario',
        confirmButtonText: 'Entendido'
      });
      throw error;
    }
  },

  
  setIsOpenMoveModal: ( isOpen: boolean ) => set((state) => { state.isOpenMoveModal = isOpen }),
  
  setSelectedMoveDocuments: ( selectedDocuments: string[] ) => set((state) => { state.selectedMoveDocuments = [...selectedDocuments] }),

  setIsOpenCreateFolderModal: ( isOpen: boolean ) => set((state) => { state.isOpenCreateFolderModal = isOpen }),
});

export const useReportStore = create<ReportState>()(
  devtools(
    persist(
      immer(reportStore),
      { 
        name: 'report-store',
        storage: {
          getItem: (name) => {
            const item = localStorage.getItem(name);
            return item ? JSON.parse(item) : null;
          },
          setItem: (name, value) => {
            localStorage.setItem(name, JSON.stringify(value));
          },
          removeItem: (name) => {
            localStorage.removeItem(name);
          }
        }
      }
    )
  )
);