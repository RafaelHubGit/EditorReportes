import React from "react";
import { Layout, Menu, Tabs, TabsProps } from "antd";
import { Link, Outlet } from "react-router-dom";
import { EditorHtmlComponent } from '../Components/EditorHtmlComponent';
import { EditorCssComponent } from '../Components/EditorCssComponent';
import { EditorJsonComponent } from '../Components/EditorJsonComponent';
import { VistaPreviaComponent } from '../Components/VistaPreviaComponent';
import { EditorStudioComponent } from "../Components/EditorStudioComponent";

const { Header, Content, Sider } = Layout;

const LayoutApp: React.FC = () => {

  const itemsTab: TabsProps['items'] = [
      {
        label: 'HTML',
        key: 'html',
        children: <EditorHtmlComponent />,
      },
      {
        label: 'CSS',
        key: 'css',
        children: <EditorCssComponent />,
      },
      {
        label: 'JSON',
        key: 'json',
        children: <EditorJsonComponent />,
      },
      {
        label: 'Vista Previa',
        key: 'vista',
        children: <VistaPreviaComponent />,
      },
    ];

  return (
    <Layout className="layout-app" >
      
      {/* Contenido Principal */}
      <Layout className="layout-app__content">
        <div className="tabs-container">
          <EditorStudioComponent />
          {/* <Tabs 
            defaultActiveKey="studio"
            items={[
              {
                key: 'studio',
                label: 'Workspace',
                children: <EditorStudioComponent />
              }
            ]}
          >
          </Tabs> */}
        </div>
      </Layout>
    </Layout>
  );
};

export default LayoutApp;