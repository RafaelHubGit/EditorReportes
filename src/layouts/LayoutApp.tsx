import React from "react";
import { Avatar, Col, Dropdown, Layout, MenuProps, Row } from "antd";
import { EditorStudioComponent } from "../Components/EditorStudioComponent";
import { MenuComponent } from '../Components/MenuComponent';

import { LogoutOutlined, UserOutlined } from '@ant-design/icons';



const LayoutApp: React.FC = () => {


  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <div>
          <UserOutlined style={{ marginRight:'10px' }} />
          rafael.nava.1403@gmail.com
        </div>
      ),
      disabled: true
    },
    // {
    //   key: '2',
    //   label: (
    //     <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
    //       2nd menu item (disabled)
    //     </a>
    //   ),
    //   icon: <SmileOutlined />,
    //   disabled: true,
    // },
    // {
    //   key: '3',
    //   label: (
    //     <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
    //       3rd menu item (disabled)
    //     </a>
    //   ),
    //   disabled: true,
    // },
    {
      key: '4',
      danger: true,
      icon: <LogoutOutlined />,
      label: 'Log out',
    },
  ];


  return (
    <Layout className="layout-app" >
      <MenuComponent />

      {/* Contenido Principal */}
      <Layout className="layout-app__content">
        
        <section
          style={{
            height: '65px'
          }}
        >
          <Row style={{ height: '100%' }}>
            <Col md={20}>
            </Col>
            <Col 
              md={4}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Dropdown
                menu={{ items }}
              >
                <Avatar size={44} icon={<UserOutlined />} />
              </Dropdown>
            </Col>
          </Row>
        </section>

        <div className="tabs-container">
          <EditorStudioComponent />
        </div>
      </Layout>
    </Layout>
  );
};

export default LayoutApp;