import React, { useEffect, useState } from "react";
import {
  Button,
  Dropdown,
  Input,
  Modal,
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
} from "@ant-design/icons";
import { EditorHtmlComponent } from "./EditorHtmlComponent";
import { EditorCssComponent } from "./EditorCssComponent";
import { EditorJsonComponent } from "./EditorJsonComponent";
import { VistaPreviaComponent } from "./VistaPreviaComponent";

const { Title } = Typography;

export const EditorStudioComponent: React.FC = () => {
  const { token } = theme.useToken();
  const [openModal, setOpenModal] = useState(false);
  const [isSplit, setIsSplit] = useState(false);
  const [activeTab, setActiveTab] = useState("html"); // NUEVO: estado para tab activo

  const [html, setHtml] = useState(" el html es este ");
  const [css, setCss] = useState(" el css es este");
  const [json, setJson] = useState("{}");
  const [htmlProcesed, setHtmlProcesed] = useState("");

  const documentTitle = "Untitled document";
  

  // ELIMINA todos los useEffect de console.log
  // ELIMINA itemsUnified y itemsEditorOnly

  // NUEVO: función para renderizar contenido activo
  const renderActiveContent = () => {
    switch (activeTab) {
      case "html":
        return (
          <div className="pane-scroll" style={{ height: "100%" }}>
            <EditorHtmlComponent 
              htmlCodeprop={html} 
              setHtmlCodeProp={setHtml} // CAMBIA: usa setHtml directamente
              setHtmlProcesedProp={setHtmlProcesed}
              jsonStringProp={json}
            />
          </div>
        );
      case "css":
        return (
          <div className="pane-scroll" style={{ height: "100%" }}>
            <EditorCssComponent 
              cssProp={css}
              setCssProp={setCss} // CAMBIA: usa setCss directamente
            />
          </div>
        );
      case "json":
        return <div className="pane-scroll" style={{ height: "100%" }}><EditorJsonComponent jsonProp={ json } setJsonProp={ setJson } /></div>;
      case "preview":
        return <div className="preview-scroll" style={{ height: "100%" }}><VistaPreviaComponent htmlProp={ htmlProcesed} cssProp={css} /></div>;
      default:
        return null;
    }
  };

  // REEMPLAZA solo los arrays itemsUnified y itemsEditorOnly:

// const itemsUnified: TabsProps["items"] = [
//   { 
//     label: "HTML", 
//     key: "html", 
//     forceRender: true,  // ← MANTIENE esto
//     children: (
//       <div className="pane-scroll" style={{ height: "500px" }}>  {/* ← AGREGA height fijo temporal */}
//         <EditorHtmlComponent 
//           htmlCodeprop={html} 
//           setHtmlCodeProp={setHtml}
//           setHtmlProcesedProp={setHtmlProcesed}
//           jsonStringProp={json}
//         />
//       </div>
//     ) 
//   },
//   { 
//     label: "CSS", 
//     key: "css", 
//     forceRender: true,  // ← MANTIENE esto
//     children: (
//       <div className="pane-scroll" style={{ height: "500px" }}>  {/* ← AGREGA height fijo temporal */}
//         <EditorCssComponent 
//           cssProp={css}
//           setCssProp={setCss}
//         />
//       </div>
//     ) 
//   },
//   { 
//     label: "JSON", 
//     key: "json", 
//     forceRender: true,  // ← AGREGA esto
//     children: (
//       <div className="pane-scroll" style={{ height: "500px" }}>  {/* ← AGREGA height fijo temporal */}
//         <EditorJsonComponent />
//       </div>
//     ) 
//   },
//   { 
//     label: "Vista Previa", 
//     key: "preview", 
//     forceRender: true,  // ← AGREGA esto
//     children: (
//       <div className="preview-scroll" style={{ height: "500px" }}>  {/* ← AGREGA height fijo temporal */}
//         <VistaPreviaComponent />
//       </div>
//     )
//   },
// ];

// const itemsEditorOnly: TabsProps["items"] = [
//   { 
//     label: "HTML", 
//     key: "html",
//     forceRender: true,  // ← MANTIENE esto
//     children: (
//       <div className="pane-scroll" style={{ height: "500px" }}>  {/* ← AGREGA height fijo temporal */}
//         <EditorHtmlComponent 
//           htmlCodeprop={html} 
//           setHtmlCodeProp={setHtml}
//           setHtmlProcesedProp={setHtmlProcesed}
//           jsonStringProp={json}
//         />
//       </div>
//     ) 
//   },
//   { 
//     label: "CSS", 
//     key: "css", 
//     forceRender: true,  // ← MANTIENE esto
//     children: (
//       <div className="pane-scroll" style={{ height: "500px" }}>  {/* ← AGREGA height fijo temporal */}
//         <EditorCssComponent 
//           cssProp={css}
//           setCssProp={setCss}
//         />
//       </div>
//     ) 
//   },
//   { 
//     label: "JSON", 
//     key: "json", 
//     forceRender: true,  // ← AGREGA esto
//     children: (
//       <div className="pane-scroll" style={{ height: "500px" }}>  {/* ← AGREGA height fijo temporal */}
//         <EditorJsonComponent />
//       </div>
//     ) 
//   },
// ];


  const itemsDrop: MenuProps["items"] = [
    { key: "export", label: "Exportar a PDF" },
    { key: "share", label: "Compartir (próximamente)" },
  ];

  const handleSave = () => {
    setOpenModal(false);
    // TODO: persist
  };

  return (
    <div className="studio-container">
      {/* Header - mantén igual */}
      <Row justify="space-between" align="middle" className="studio-header" style={{ paddingInline: 16, paddingBlock: 8 }}>
        <Col>
          <Space size="middle" align="center">
            <Title level={3} style={{ margin: 0 }}>
              {documentTitle}
            </Title>
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

            <Button type="primary" onClick={() => setOpenModal(true)}>
              Guardar
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Body - Versión que funciona */}
      <div className="studio-body" style={{ height: 'calc(100vh - 100px)' }}>
        {!isSplit ? (
          <Tabs 
            defaultActiveKey="html"
            items={[
              { 
                label: "HTML", 
                key: "html", 
                children: (
                  <div style={{ height: 'calc(100vh - 150px)' }}>
                    <EditorHtmlComponent 
                      htmlCodeprop={html} 
                      setHtmlCodeProp={setHtml}
                      setHtmlProcesedProp={setHtmlProcesed}
                      jsonStringProp={json}
                    />
                  </div>
                )
              },
              { 
                label: "CSS", 
                key: "css", 
                children: (
                  <div style={{ height: 'calc(100vh - 150px)' }}>
                    <EditorCssComponent 
                      cssProp={css}
                      setCssProp={setCss}
                    />
                  </div>
                )
              },
              { 
                label: "JSON", 
                key: "json", 
                children: (
                  <div style={{ height: 'calc(100vh - 150px)' }}>
                    <EditorJsonComponent jsonProp={ json } setJsonProp={ setJson } />
                  </div>
                )
              },
              { 
                label: "Vista Previa", 
                key: "preview", 
                children: (
                  <div style={{ height: 'calc(100vh - 150px)' }}>
                    <VistaPreviaComponent htmlProp={ htmlProcesed} cssProp={css} />
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
                      <div style={{ height: 'calc(100vh - 150px)' }}>
                        <EditorHtmlComponent 
                          htmlCodeprop={html} 
                          setHtmlCodeProp={setHtml}
                          setHtmlProcesedProp={setHtmlProcesed}
                          jsonStringProp={json}
                        />
                      </div>
                    )
                  },
                  { 
                    label: "CSS", 
                    key: "css", 
                    children: (
                      <div style={{ height: 'calc(100vh - 150px)' }}>
                        <EditorCssComponent 
                          cssProp={css}
                          setCssProp={setCss}
                        />
                      </div>
                    )
                  },
                  { 
                    label: "JSON", 
                    key: "json", 
                    children: (
                      <div style={{ height: 'calc(100vh - 150px)' }}>
                        <EditorJsonComponent jsonProp={ json } setJsonProp={ setJson } />
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
                <VistaPreviaComponent htmlProp={ htmlProcesed} cssProp={css} />
              </div>
            </Col>
          </Row>
        )}
      </div>

      {/* Modal - mantén igual */}
      <Modal
        title="Nombre del Reporte"
        open={openModal}
        onOk={handleSave}
        onCancel={() => setOpenModal(false)}
        okText="Aceptar"
        cancelText="Cancelar"
        width={800}
      >
        <Input placeholder="Nombre del reporte" defaultValue={documentTitle} />
      </Modal>
    </div>
  );
};
