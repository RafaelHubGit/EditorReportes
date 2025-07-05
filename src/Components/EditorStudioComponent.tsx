import React, { useState } from 'react';
import { Button, Dropdown, Input, MenuProps, Modal, Tabs, TabsProps } from 'antd';
import { EditorHtmlComponent } from './EditorHtmlComponent';
import { EditorCssComponent } from './EditorCssComponent';
import { EditorJsonComponent } from './EditorJsonComponent';
import { VistaPreviaComponent } from './VistaPreviaComponent';


export const EditorStudioComponent: React.FC = () => {

  const [openModal, setOpenModal] = useState(false);

  const items: TabsProps['items'] = [
    {
      label: 'HTML',
      key: 'html',
      children: <EditorHtmlComponent />
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

  const itemsDrop: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="">
          Exportar a PDF
        </a>
      ),
    },
    {
      key: '2',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="">
          2nd menu item
        </a>
      ),
    },
    {
      key: '3',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="">
          3rd menu item
        </a>
      ),
    },
  ];

  const handleSave = () => {
    setOpenModal(false);
  }

  return (
    <div className="studio-container">
      {/* <div className="studio-header">
        <h2>Editor de Reportes</h2>

      </div>  */}
      <Tabs 
        defaultActiveKey="html" 
        items={items} 
        className="studio-tabssss "
        tabBarExtraContent={{
          right: ((
            <div
              
            >
              <Dropdown menu={{ items: itemsDrop }} placement="bottomLeft">
                <Button>:)</Button>
              </Dropdown>
              <Button type="primary" onClick={ () => setOpenModal(true) }>
                Guardar
              </Button>
            </div>
          ))
        }}
      />

      <Modal
        title="Nombre del Reporte"
        open={openModal}
        onOk={ handleSave }
        onCancel={() => setOpenModal(false)}
        okText="Aceptar"
        cancelText="Cancelar"
        width={800}
      >
        <Input placeholder="Nombre del reporte" />
      </Modal>
    </div>
  );
};
