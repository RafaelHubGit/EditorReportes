import React from 'react';
import { Tabs, TabsProps } from 'antd';
import { EditorHtmlComponent } from './EditorHtmlComponent';
import { EditorCssComponent } from './EditorCssComponent';
import { EditorJsonComponent } from './EditorJsonComponent';
import { VistaPreviaComponent } from './VistaPreviaComponent';


export const EditorStudioComponent: React.FC = () => {
  const items: TabsProps['items'] = [
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
      key: 'preview',
      children: <VistaPreviaComponent />,
    },
  ];

  return (
    <div className="studio-container">
      {/* <div className="studio-header">
        <h2>Editor de Reportes</h2>
      </div> */}
      <Tabs defaultActiveKey="html" items={items} className="studio-tabs" />
    </div>
  );
};
