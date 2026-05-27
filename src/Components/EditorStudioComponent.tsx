import { useState, useMemo, useCallback, useEffect } from "react";
import { Button, Row, Col, Typography, Space, theme, Modal, Tag } from "antd";
import { ColumnWidthOutlined, ColumnHeightOutlined, HistoryOutlined } from "@ant-design/icons";
import { VistaPreviaComponent } from "./VistaPreviaComponent";
import { types } from "../types/types";
import { useReportStore } from "../store/useReportStore";
import { useApiKeyActions } from "../hooks/useApiKeyActions";
import { useDocumentState } from "../hooks/useDocumentState";
import { usePdfExport } from "../hooks/usePdfExport";
import { EditorTabs } from "./EditorTabs";
import { VersionHistoryPanel } from "./VersionHistoryPanel";
import { useTemplateVersions } from "../hooks/useTemplateVersions";

import { generateFinalHtml } from "../utils/reportEngine";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { DocumentTitle } from "./DocumentTitle";
import type { IDocument } from "../interfaces/IGeneric";

const { Title } = Typography;

export const EditorStudioComponent = () => {

  const navigate = useNavigate();
  const { token } = theme.useToken();
  const [isSplit, setIsSplit] = useState(false);
  const [versionPanelOpen, setVersionPanelOpen] = useState(false);

  // ── Modal: "crear borrador" cuando el usuario intenta editar una versión bloqueada ──
  const [createDraftModalOpen, setCreateDraftModalOpen] = useState(false);
  const [pendingDraftSourceId, setPendingDraftSourceId] = useState<string | null>(null);

  const { devApiKey } = useApiKeyActions({ 
    autoFetch: true,
    autoCreateMissing: false
  });

  const {
    documentState,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    isEditingTitle,
    setIsEditingTitle,
    updateDocumentState,
    operation,
    documentId
  } = useDocumentState();

  const updateDocument = useReportStore(state => state.updateDocument);
  const addDocument = useReportStore(state => state.addDocument);
  const addDocuments = useReportStore(state => state.addDocuments);
  const { handleExportPdf } = usePdfExport();

  // Hook de versiones (se activa cuando tenemos parent_id)
  const parentId = documentState.parent_id;
  const { createDraft } = useTemplateVersions(parentId);

  // ── Determinar si el documento actual es editable ─────────────────────────
  // Solo se puede editar si es un draft. Producción e históricas son read-only.
  const isReadOnly = !documentState.is_draft && operation !== types.documentNew;
  

  // ── Guardar ───────────────────────────────────────────────────────────────
  const handleSave = async () => {
    Swal.fire({
      title: 'Guardando documento...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    if (operation === types.documentNew) {
      await addDocument(documentState);
      navigate(`/app/editor/${types.documentEdit}/${documentState.id}`);
    } else {
      await updateDocument(documentState);
    }
    
    Swal.close();
    setHasUnsavedChanges(false);
  };

  // ── Intentar editar una versión bloqueada ─────────────────────────────────
  const handleAttemptEditLocked = useCallback(() => {
    if (!documentState.id) return;
    setPendingDraftSourceId(documentState.id);
    setCreateDraftModalOpen(true);
  }, [documentState.id]);

  const handleConfirmCreateDraft = async () => {
    if (!pendingDraftSourceId) return;
    try {
      Swal.fire({ title: 'Creando borrador...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      const newDraft = await createDraft(pendingDraftSourceId);
      Swal.close();
      setCreateDraftModalOpen(false);
      setPendingDraftSourceId(null);
      if (newDraft) {
        addDocuments(newDraft);
        navigate(`/app/editor/${types.documentEdit}/${newDraft.id}`);
      }
    } catch (err: any) {
      Swal.close();
      Swal.fire({ icon: 'error', title: 'Error', text: err?.message || 'No se pudo crear el borrador.' });
    }
  };

  // ── Abrir versión desde el panel de historial ─────────────────────────────
  const handleOpenVersion = useCallback((version: IDocument) => {
    addDocuments(version);
    navigate(`/app/editor/${types.documentEdit}/${version.id}`);
    setVersionPanelOpen(false);
  }, [navigate, addDocuments]);

  // ── Previsualizar PDF de una versión ──────────────────────────────────────
  const handlePreviewVersion = useCallback((version: IDocument) => {
    // Usa el id de la versión directamente (el backend lo resolverá)
    handleExportPdf(devApiKey?.apiKey || '', version.id);
  }, [devApiKey, handleExportPdf]);

  // ── HTML final para vista previa ──────────────────────────────────────────
  const finalReportHtml = useMemo(() => 
    generateFinalHtml({
      html: documentState.html || "",
      css: documentState.css || "",
      headerHtml: documentState.htmlHeader || "",
      headerCss: documentState.cssHeader || "",
      footerHtml: documentState.htmlFooter || "",
      footerCss: documentState.cssFooter || "",
      data: documentState.sampleData
    }), [documentState]
  );

  const isExportDisabled = hasUnsavedChanges || operation === types.documentNew;

  return (
    <div className="studio-container">
      <Row justify="space-between" align="middle" className="studio-header" style={{ paddingInline: 16, paddingBlock: 8 }}>
        <Col>
          <Space align="center">
            <DocumentTitle
              name={documentState.name}
              id={documentState.id}
              isEditing={isEditingTitle}
              readOnly={isReadOnly}
              onEditStart={() => setIsEditingTitle(true)}
              onEditEnd={() => setIsEditingTitle(false)}
              onNameChange={(name) => updateDocumentState({ name })}
            />

            {/* Indicador "Sin guardar" */}
            {operation === types.documentNew && !documentState.id && (
              <Tag color="orange" style={{ marginLeft: 8 }}>Sin guardar</Tag>
            )}
            {hasUnsavedChanges && operation === types.documentEdit && (
              <Tag color="orange" style={{ marginLeft: 8 }}>Sin guardar</Tag>
            )}

            {/* Tags de estado */}
            {documentState.is_draft && (
              <Tag color="blue" style={{ marginLeft: 4 }}>Borrador</Tag>
            )}
            {documentState.is_production && (
              <Tag color="green" style={{ marginLeft: 4 }}>Publicado en Producción</Tag>
            )}
            {documentState.is_qa && (
              <Tag color="orange" style={{ marginLeft: 4 }}>Publicado en QA</Tag>
            )}
          </Space>
        </Col>

        <Col>
          <Space>
            {/* Botón historial de versiones */}
            {parentId && (
              <Button
                icon={<HistoryOutlined />}
                onClick={() => setVersionPanelOpen(true)}
              >
                Versiones
              </Button>
            )}

            <Button
              type="primary"
              icon={isSplit ? <ColumnHeightOutlined /> : <ColumnWidthOutlined />}
              onClick={() => setIsSplit((v) => !v)}
            >
              {isSplit ? "Unificar vista" : "Dividir vista"}
            </Button>

            <Button
              type={isExportDisabled ? "default" : "primary"}
              onClick={() => handleExportPdf(devApiKey?.apiKey || '', documentState.id)}
              disabled={isExportDisabled}
              title={isExportDisabled ? "Debes guardar los cambios antes de exportar a PDF" : "Exportar a PDF"}
            >
              Exportar a PDF  
            </Button>

            <Button 
              type={isExportDisabled ? "primary" : "default"}
              onClick={handleSave}
              disabled={isReadOnly}
              title={isReadOnly ? "Esta versión es de solo lectura. Crea un borrador para editar." : ""}
            >
              Guardar
            </Button>
          </Space>
        </Col>
      </Row>

      <div className="studio-body" style={{ height: 'calc(100vh - 100px)' }}>
        {!isSplit ? (
          <EditorTabs
            documentState={documentState}
            updateDocumentState={updateDocumentState}
            mode="full"
            readOnly={isReadOnly}
            onAttemptEditLocked={handleAttemptEditLocked}
          />
        ) : (
          <Row gutter={16} style={{ height: '100%', margin: 0 }}>
            <Col span={14} style={{ height: '100%' }}>
              <EditorTabs
                documentState={documentState}
                updateDocumentState={updateDocumentState}
                mode="split"
                readOnly={isReadOnly}
                onAttemptEditLocked={handleAttemptEditLocked}
              />
            </Col>
            <Col span={10} style={{ height: '100%' }}>
              <div style={{ height: 'calc(100vh - 150px)' }}>
                <Title level={5} style={{ marginTop: 0, marginBottom: 12 }}>
                  Vista Previa
                </Title>
                <VistaPreviaComponent htmlProp={finalReportHtml} />
              </div>
            </Col>
          </Row>
        )}
      </div>

      {/* Panel de Historial de Versiones */}
      <VersionHistoryPanel
        parentId={parentId}
        open={versionPanelOpen}
        onClose={() => setVersionPanelOpen(false)}
        onOpenVersion={handleOpenVersion}
        onPreviewVersion={handlePreviewVersion}
        currentVersionId={documentState.id}
      />

      {/* Modal: Crear borrador al intentar editar versión bloqueada */}
      <Modal
        title="¿Crear borrador?"
        open={createDraftModalOpen}
        onCancel={() => { setCreateDraftModalOpen(false); setPendingDraftSourceId(null); }}
        onOk={handleConfirmCreateDraft}
        okText="Sí, crear borrador"
        cancelText="Cancelar"
      >
        <p>
          Se creará un <strong>borrador (Draft)</strong> basado en esta versión para que puedas realizar cambios.
          La versión de producción <strong>no se verá afectada</strong> hasta que decidas publicar el borrador.
        </p>
        <p>¿Deseas continuar?</p>
      </Modal>
    </div>
  );
};