import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useReportStore } from "../store/useReportStore";
import { types } from "../types/types";
import { initDocument } from "../store/initOrganization";
import type { IDocument } from "../interfaces/IGeneric";

export const useDocumentState = () => {
  const { operation = types.documentNew, documentId } = useParams();
  const getDocumentById = useReportStore(state => state.getDocumentById);
  
  const [documentState, setDocumentState] = useState<IDocument>(initDocument);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  // Cargar documento existente
  useEffect(() => {
    if (operation === types.documentEdit && documentId) {
      const existingDocument = getDocumentById(documentId);
      if (existingDocument) {
        setDocumentState(existingDocument);
      }
    }
  }, [documentId, operation, getDocumentById]);

  // Detectar cambios no guardados
  useEffect(() => {
    if (operation === types.documentEdit && documentId) {
      const storedDocument = getDocumentById(documentId);
      if (storedDocument) {
        const hasChanges = JSON.stringify(documentState) !== JSON.stringify(storedDocument);
        setHasUnsavedChanges(hasChanges);
      }
    } else if (operation === types.documentNew) {
      const hasChanges = JSON.stringify(documentState) !== JSON.stringify(initDocument);
      setHasUnsavedChanges(hasChanges);
    }
  }, [documentState, documentId, operation, getDocumentById]);

  const updateDocumentState = (updates: Partial<IDocument>) => {
    setDocumentState(prevState => ({
      ...prevState,
      ...updates
    }));
  };

  return {
    documentState,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    isEditingTitle,
    setIsEditingTitle,
    updateDocumentState,
    operation,
    documentId
  };
};