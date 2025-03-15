import React from "react";
import { Layout, Menu, Tabs } from "antd";
import { Link, Outlet } from "react-router-dom";
import TabPane from "antd/es/tabs/TabPane";
import { EditorHtmlComponent } from '../Components/EditorHtmlComponent';
import { EditorCssComponent } from '../Components/EditorCssComponent';
import { EditorJsonComponent } from '../Components/EditorJsonComponent';
import { VistaPreviaComponent } from '../Components/VistaPreviaComponent';

const { Header, Content, Sider } = Layout;

const LayoutApp: React.FC = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Barra Lateral */}
      <Sider collapsible>
        <div className="logo" style={{ color: "white", textAlign: "center", padding: "10px" }}>
          Reportes
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["editorHtml"]}>
          <Menu.Item key="editorHtml">
            <Link to="/app/editorHtml">Editor HTML</Link>
          </Menu.Item>
          <Menu.Item key="editorCss">
            <Link to="/app/editorCss">Editor CSS</Link>
          </Menu.Item>
          <Menu.Item key="editorJson">
            <Link to="/app/editorJson">Editor JSON</Link>
          </Menu.Item>
          <Menu.Item key="vistaPrevia">
            <Link to="/app/vistaPrevia">Vista Previa</Link>
          </Menu.Item>
        </Menu>
      </Sider>

      {/* Contenido Principal */}
      <Layout><div style={{ padding: "10px", background: "#fff", height: "100%" }}>
            <Tabs defaultActiveKey="html">
              <TabPane tab="HTML" key="html">
                <EditorHtmlComponent />
              </TabPane>
              <TabPane tab="CSS" key="css">
                <EditorCssComponent />
              </TabPane>
              <TabPane tab="JSON" key="json">
                <EditorJsonComponent />
              </TabPane>
              <TabPane tab="Vista Previa" key="vista">
                <VistaPreviaComponent />
              </TabPane>
            </Tabs>
          </div>
      </Layout>
    </Layout>
  );
};

export default LayoutApp;