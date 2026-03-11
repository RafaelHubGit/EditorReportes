import { useState, useMemo } from "react";
import { Button, Row, Col, Typography, Space, theme } from "antd";
import { ColumnWidthOutlined, ColumnHeightOutlined } from "@ant-design/icons";
import { VistaPreviaComponent } from "./VistaPreviaComponent";
import { types } from "../types/types";
import { useReportStore } from "../store/useReportStore";
import { useApiKeyActions } from "../hooks/useApiKeyActions";
import { useDocumentState } from "../hooks/useDocumentState";
import { usePdfExport } from "../hooks/usePdfExport";
import { EditorTabs } from "./EditorTabs";

import { generateFinalHtml } from "../utils/reportEngine";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { DocumentTitle } from "./DocumentTitle";

const { Title, Text } = Typography;

export const EditorStudioComponent = () => {

  const navigate = useNavigate();
  const { token } = theme.useToken();
  const [isSplit, setIsSplit] = useState(false);
  
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
  const { handleExportPdf } = usePdfExport();

  const handleSave = async () => {
    Swal.fire({
      title: 'Guardando documento...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    if (operation === types.documentNew) {
      await addDocument(documentState);
      navigate(`${types.documentEdit}/${documentState.id}`);
    } else {
      await updateDocument(documentState);
    }
    
    Swal.close();
    setHasUnsavedChanges(false);
  };

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
          <DocumentTitle
            name={documentState.name}
            id={documentState.id}
            isEditing={isEditingTitle}
            onEditStart={() => setIsEditingTitle(true)}
            onEditEnd={() => setIsEditingTitle(false)}
            onNameChange={(name) => updateDocumentState({ name })}
          />
        </Col>

        <Col>
          <Space>
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
          />
        ) : (
          <Row gutter={16} style={{ height: '100%', margin: 0 }}>
            <Col span={14} style={{ height: '100%' }}>
              <EditorTabs
                documentState={documentState}
                updateDocumentState={updateDocumentState}
                mode="split"
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
    </div>
  );
};