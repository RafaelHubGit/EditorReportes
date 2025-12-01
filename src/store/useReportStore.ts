// useReportStore.ts - Versión completa
import { create, type StateCreator } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';
import { pick } from 'lodash';
import type { IDocument, IFolder, ViewMode, SortOption } from "../interfaces/IGeneric";
import { CREATE_DOCUMENT, CREATE_FOLDER, DELETE_DOCUMENT, DELETE_FOLDER, documentFieldsInput, folderFieldsInput, GET_ALLDOCUMENTS, GET_FOLDERS, MOVE_DOCUMENT_TO_FOLDER, UPDATE_DOCUMENT, UPDATE_FOLDER } from "../graphql/operations/graphql.operations";
import { GraphQLService } from "../graphql/graphql.service";
import { pickFields } from "../utils/pickFields";

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
  getDocumentsByOwner: () => Promise<IDocument[]>;
  addDocument: (document: IDocument) => Promise<void>;
  updateDocument: (updates: Partial<IDocument>) => Promise<void>;
  delDocument: (idDocument: string) => Promise<void>;
  addDocuments: (document: IDocument) => void;
  getDocumentById: (id: string) => IDocument | null;
  setCurrentFolder: (folderId: string | null) => void;
  getDocumentsByFolder: (folderId?: string) => IDocument[];
  searchDocuments: (query: string) => IDocument[];

  // Folder Actions
  addFolder: (folder: Omit<IFolder, 'id'>) => Promise<void>;
  updateFolder: (folderId: string, updates: Partial<IFolder>) => Promise<void>;
  getFolders: () => Promise<IFolder[]>;
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
  setIsOpenMoveModal: (isOpen: boolean) => void;

  selectedMoveDocuments: string[];
  setSelectedMoveDocuments: (selectedDocuments: string[]) => void;

  isOpenCreateFolderModal: boolean;
  setIsOpenCreateFolderModal: (isOpen: boolean) => void;
}

const initDocument: IDocument = {
  id: '',
  name: 'Nuevo Documento',
  html: '<h1>Nuevo Reporte</h1>',
  htmlProcessed: '',
  css: '',
  sampleData: {},
  createdAt: new Date(),
  updatedAt: new Date()
};

// const defaultFolders: IFolder[] = [
//   {
//     id: "123",
//     name: "Marketing Templates",
//     // idDocuments: ["e4f50b2a-0c52-4cda-b729-9fbc3c7ff0df"],
//     icon: "🎨",
//     color: "#ff6b6b",
//     description: "Plantillas para campañas de marketing",
//     createdAt: new Date('2024-01-15'),
//     updatedAt: new Date('2024-03-20')
//   },
//   {
//     id: "abc",
//     name: "Invoices 2025",
//     // idDocuments: [],
//     icon: "🧾",
//     color: "#51cf66",
//     description: "Facturas y documentos fiscales",
//     createdAt: new Date('2024-01-10'),
//     updatedAt: new Date('2024-03-18')
//   },
//   {
//     id: "def",
//     name: "Proyectos Activos",
//     // idDocuments: [],
//     icon: "📂",
//     color: "#339af0",
//     description: "Proyectos en desarrollo",
//     isShared: true,
//     sharedWith: ["user2@example.com", "user3@example.com"],
//     createdAt: new Date('2024-02-01'),
//     updatedAt: new Date('2024-03-25')
//   }
// ];

// const sampleDocuments: IDocument[] = [
//   {
//     id: "e4f50b2a-0c52-4cda-b729-9fbc3c7ff0df",
//     name: "Q3 Invoice Template",
//     html: '<div>Invoice Template</div>',
//     css: 'body { margin: 0; }',
//     sampleData: {},
//     folderId: "123",
//     // type: 'invoice',
//     tags: ['factura', 'trimestral', 'template'],
//     createdAt: new Date('2024-03-15'),
//     updatedAt: new Date('2024-03-20')
//   },
//   {
//     id: uuidv4(),
//     name: "Monthly Sales Report",
//     html: '<div>Sales Report</div>',
//     css: 'body { margin: 0; }',
//     sampleData: {},
//     // type: 'report',
//     tags: ['ventas', 'mensual'],
//     createdAt: new Date('2024-03-18'),
//     updatedAt: new Date('2024-03-25')
//   },
//   {
//     id: uuidv4(),
//     name: "Marketing Campaign Q2",
//     html: '<div>Campaign Template</div>',
//     css: 'body { margin: 0; }',
//     sampleData: {},
//     // type: 'template',
//     tags: ['marketing', 'campaña'],
//     createdAt: new Date('2024-03-10'),
//     updatedAt: new Date('2024-03-22')
//   }
// ];

const reportStore: StateCreator<ReportState, [["zustand/immer", never]]> = (set, get) => ({
  document: initDocument,
  documents: [],
  folders: [],
  currentFolderId: null,
  viewMode: 'grid',
  searchQuery: '',
  sortBy: 'date',
  selectedDocuments: [],

  isOpenMoveModal: false,
  selectedMoveDocuments: [],

  isOpenCreateFolderModal: false,


  getDocumentsByOwner: async () => {
    try {
      const result = await GraphQLService.query(GET_ALLDOCUMENTS);

      const documents = result.data?.allTemplates;

      set((state) => {
        state.documents = documents || [];
      });

      return documents;
    } catch (error) {
      console.error('Error al obtener documentos:', error);
      return [];
    }
  },

  // Document Methods (manteniendo las existentes y agregando nuevas)
  addDocument: async (document: IDocument) => {
    try {

     

      const documentInput = pickFields(document, documentFieldsInput);
      const result = await GraphQLService.mutate(CREATE_DOCUMENT, { input: documentInput }); //TODO: Mejorar el try catch para que funcione en este caso

      

      const created = result.data?.createTemplate;

      

      set((state) => {
        
        const docWithId = {
          ...document,
          id: created?.id,
          folderId: document.folderId || undefined,
          createdAt: created?.createdAt,
          updatedAt: created?.updatedAt
        };

        

        state.document = docWithId;
        state.documents = [...state.documents, docWithId];

        
        
        // const exists = state.documents.some((d: IDocument) => d.id === docWithId.id);
        // if (!exists) state.documents.unshift(docWithId);
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

      const documentInput = pickFields(updates, documentFieldsInput);
      const result = await GraphQLService.mutate(UPDATE_DOCUMENT, { id: updates.id, input: documentInput });

      const updated = result.data?.updateTemplate;
      set((state) => {
        state.document = {
          ...state.document,
          ...updated,
          updatedAt: new Date()
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

  delDocument: async (idDocument: string) => {
    try {
      const response = await GraphQLService.mutate(DELETE_DOCUMENT, { id: idDocument });

      if (response.data?.deleteTemplate) {
        set((state) => {
          state.documents = state.documents.filter((d: IDocument) => d.id !== idDocument);
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
        return;
      }

      await Swal.fire({
        icon: 'error',
        title: 'Error al eliminar',
        text: 'No se pudo eliminar el documento',
        confirmButtonText: 'Entendido'
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

    filteredDocs = documents.filter(doc => doc.folderId);

    // Aplicar ordenamiento
    filteredDocs = [...filteredDocs].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
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
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const folderInput = pickFields(newFolder, folderFieldsInput);

      const result = await GraphQLService.mutate(CREATE_FOLDER, { input: folderInput });

      const createdFolder = result.data.createFolder;

      set((state) => {
        state.folders.unshift(createdFolder);
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


      const folderInput = pickFields(updates, folderFieldsInput);

      const result = await GraphQLService.mutate(UPDATE_FOLDER, { id: folderId, input: folderInput });

      set((state) => {
        const folderIndex = state.folders.findIndex(f => f.id === folderId);
        if (folderIndex >= 0) {
          Object.assign(state.folders[folderIndex]!, updates, {
            updatedAt: new Date() // Cambiar dateUpdated por updatedAt
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

  getFolders: async () => {
    try {
      const folders_api: IFolder[] = await GraphQLService.query(GET_FOLDERS).then((res: any) => res.data.folders);

      set((state) => {
        state.folders = folders_api;
      });

      return folders_api;
    } catch (error) {
      console.error('Error en getFolders:', error);
      throw error;
    }
  },

  deleteFolder: async (folderId: string) => {
    try {

      const response = await GraphQLService.mutate(DELETE_FOLDER, { id: folderId });

      if (!response.data?.deleteFolder) {
        throw new Error('Error al eliminar la carpeta');
      }

      const { folders } = get();
      const folderToDelete = folders.find(f => f.id === folderId);

      if (!folderToDelete) return;

      const result = await Swal.fire({
        icon: 'warning',
        title: '¿Eliminar carpeta?',
        text: `La carpeta "${folderToDelete.name}" será eliminada, el contenido de la carpeta se moverá a la carpeta raíz`,
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

      const result = await GraphQLService.mutate(MOVE_DOCUMENT_TO_FOLDER, { documentId, folderId });

      

      if (!result.data.moveDocumentToFolder) {
        throw new Error('Error al mover el documento');
      }

      set((state) => {
        // Actualizar el folderId en el documento
        const docIndex = state.documents.findIndex(d => d.id === documentId);
        if (docIndex >= 0) {
          state.documents[docIndex]!.folderId = folderId || undefined;
          state.documents[docIndex]!.updatedAt = new Date();
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

      if (!documentId) {
        throw new Error('No se proporcionó un ID de documento');
      }

      const result = await GraphQLService.mutate(MOVE_DOCUMENT_TO_FOLDER, { templateId: documentId, folderId });

      if (!result.data) {
        throw new Error(result.data.error);
      }

      set((state) => {
        // Actualizar el folderId en el documento
        const docIndex = state.documents.findIndex(d => d.id === documentId);
        if (docIndex >= 0) {
          state.documents[docIndex]!.folderId = folderId || undefined;
          state.documents[docIndex]!.updatedAt = new Date();
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
          state.folders[folderIndex]!.updatedAt = new Date();
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

          state.folders[folderIndex]!.updatedAt = new Date();
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


  setIsOpenMoveModal: (isOpen: boolean) => set((state) => { state.isOpenMoveModal = isOpen }),

  setSelectedMoveDocuments: (selectedDocuments: string[]) => set((state) => { state.selectedMoveDocuments = [...selectedDocuments] }),

  setIsOpenCreateFolderModal: (isOpen: boolean) => set((state) => { state.isOpenCreateFolderModal = isOpen }),
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