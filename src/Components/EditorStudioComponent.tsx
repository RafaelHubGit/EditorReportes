import { useEffect, useState } from "react";
import {
  Button,
  Dropdown,
  Input,
  Row,
  Col,
  Tabs,
  Typography,
  Space,
  theme,
  type MenuProps,
} from "antd";
import {
  ColumnWidthOutlined,
  ColumnHeightOutlined,
  MoreOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { EditorHtmlComponent } from "./EditorHtmlComponent";
import { EditorCssComponent } from "./EditorCssComponent";
import { EditorJsonComponent } from "./EditorJsonComponent";
import { VistaPreviaComponent } from "./VistaPreviaComponent";
import { types } from "../types/types";
import { useNavigate, useParams } from "react-router-dom";
import { useReportStore } from "../store/useReportStore";
import type { IDocument } from "../interfaces/IGeneric";
import { initDocument } from "../store/initOrganization";

const { Title, Text } = Typography;

type Props = {

}

export const EditorStudioComponent = ({ }: Props) => {

  const navigate = useNavigate();
  const { operation = types.documentNew, documentId } = useParams();

  const updateDocument = useReportStore(state => state.updateDocument);
  const addDocument = useReportStore(state => state.addDocument);
  const getDocumentById = useReportStore(state => state.getDocumentById);

  const { token } = theme.useToken();
  const [isSplit, setIsSplit] = useState(false);

  const [documentState, setDocumentState] = useState<IDocument>(initDocument);

  const [isEditingTitle, setIsEditingTitle] = useState(false);

  // const documentTitle = documentState.name;


  useEffect(() => {
    if (operation === types.documentEdit && documentId) {
      const existingDocument = getDocumentById(documentId);
      if (existingDocument) {
        setDocumentState(existingDocument);
      }
    }
  }, [documentId]);

  const updateDocumentState = (updates: Partial<IDocument>) => {
    setDocumentState(prevState => ({
      ...prevState,
      ...updates
    }));
  };


  const handleSave = () => {
    if (operation == types.documentNew) {
      addDocument(documentState);
      // navigate(`/editor/${types.documentEdit}/${documentState.id}`);
      navigate(`${types.documentEdit}/${documentState.id}`);
    } else {
      updateDocument(documentState);
    }
  }

  const itemsDrop: MenuProps["items"] = [
    { key: "export", label: "Exportar a PDF" },
    { key: "share", label: "Compartir (próximamente)" },
  ];

  return (
    <div className="studio-container">
      <Row justify="space-between" align="middle" className="studio-header" style={{ paddingInline: 16, paddingBlock: 8 }}>
        <Col>
          <Space size={0} align="start" style={{ display: 'Flex', flexDirection: 'column' }}>
            {isEditingTitle ? (
              <Input
                value={documentState.name}
                onChange={(e) => updateDocumentState({ name: e.target.value })}
                onPressEnter={() => setIsEditingTitle(false)}
                onBlur={() => setIsEditingTitle(false)}
                autoFocus
                style={{ fontSize: '24px', fontWeight: 'bold', width: '300px' }}
              />
            ) : (
              <Space>
                <Title
                  level={3}
                  style={{ margin: 0, cursor: 'pointer' }}
                  onClick={() => setIsEditingTitle(true)}
                >
                  {documentState.name}
                </Title>
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  size="small"
                  onClick={() => setIsEditingTitle(true)}
                />
              </Space>
            )}
            <Text type="secondary" style={{ fontSize: '14px' }}>
              {documentState.id || "Sin ID"}
            </Text>
          </Space>
        </Col>

        <Col>
          <Space>
            <Button
              icon={isSplit ? <ColumnHeightOutlined /> : <ColumnWidthOutlined />}
              onClick={() => setIsSplit((v) => !v)}
            >
              {isSplit ? "Unificar vista" : "Dividir vista"}
            </Button>

            <Dropdown menu={{ items: itemsDrop }} placement="bottomRight">
              <Button icon={<MoreOutlined />} />
            </Dropdown>

            <Button type="primary" onClick={handleSave}>
              Guardar
            </Button>
          </Space>
        </Col>
      </Row>

      <div className="studio-body" style={{ height: 'calc(100vh - 100px)' }}>
        {!isSplit ? (
          <Tabs
            defaultActiveKey="html"
            items={[
              {
                label: "HTML",
                key: "html",
                children: (
                  <div style={{ height: 'calc(100vh - 210px)' }}>
                    <EditorHtmlComponent
                      htmlCodeprop={documentState.html}
                      setHtmlCodeProp={(html) => updateDocumentState({ html })}
                      setHtmlProcesedProp={(htmlProcessed) => updateDocumentState({ htmlProcessed })}
                      jsonStringProp={documentState.sampleData}
                    />
                  </div>
                )
              },
              {
                label: "CSS",
                key: "css",
                children: (
                  <div style={{ height: 'calc(100vh - 210px)' }}>
                    <EditorCssComponent
                      cssProp={documentState.css}
                      setCssProp={(css) => updateDocumentState({ css })}
                    />
                  </div>
                )
              },
              {
                label: "JSON",
                key: "json",
                children: (
                  <div style={{ height: 'calc(100vh - 210px)' }}>
                    <EditorJsonComponent
                      jsonProp={JSON.stringify(documentState.sampleData)}
                      setJsonProp={(json) => updateDocumentState({ sampleData: JSON.parse(json) })}
                    />
                  </div>
                )
              },
              {
                label: "Vista Previa",
                key: "preview",
                children: (
                  <div style={{ height: 'calc(100vh - 150px)' }}>
                    <VistaPreviaComponent
                      htmlProp={documentState.htmlProcessed ?? ""}
                      cssProp={documentState.css ?? ""}
                    />
                  </div>
                )
              },
            ]}
          />
        ) : (
          <Row gutter={16} style={{ height: '100%', margin: 0 }}>
            <Col span={14} style={{ height: '100%' }}>
              <Tabs
                defaultActiveKey="html"
                items={[
                  {
                    label: "HTML",
                    key: "html",
                    children: (
                      <div style={{ height: 'calc(100vh - 210px)' }}>
                        <EditorHtmlComponent
                          htmlCodeprop={documentState.html}
                          setHtmlCodeProp={(html) => updateDocumentState({ html })}
                          setHtmlProcesedProp={(htmlProcessed) => updateDocumentState({ htmlProcessed })}
                          jsonStringProp={documentState.sampleData}
                        />
                      </div>
                    )
                  },
                  {
                    label: "CSS",
                    key: "css",
                    children: (
                      <div style={{ height: 'calc(100vh - 210px)' }}>
                        <EditorCssComponent
                          cssProp={documentState.css}
                          setCssProp={(css) => updateDocumentState({ css })}
                        />
                      </div>
                    )
                  },
                  {
                    label: "JSON",
                    key: "json",
                    children: (
                      <div style={{ height: 'calc(100vh - 210px)' }}>
                        <EditorJsonComponent
                          jsonProp={JSON.stringify(documentState.sampleData)}
                          setJsonProp={(json) => updateDocumentState({ sampleData: JSON.parse(json) })}
                        />
                      </div>
                    )
                  },
                ]}
              />
            </Col>
            <Col span={10} style={{ height: '100%' }}>
              <div style={{ height: 'calc(100vh - 150px)' }}>
                <Title level={5} style={{ marginTop: 0, marginBottom: 12 }}>
                  Vista Previa
                </Title>
                <VistaPreviaComponent
                  htmlProp={documentState.htmlProcessed ?? ""}
                  cssProp={documentState.css ?? ""}
                />
              </div>
            </Col>
          </Row>
        )}
      </div>
    </div>
  );
};