import { Menu, Tooltip, type MenuProps } from "antd"
import {
    AppstoreOutlined,
    FileTextOutlined,
    SettingOutlined,
} from '@ant-design/icons';
import Sider from "antd/es/layout/Sider";
import { useState } from "react";
import { Link } from 'react-router-dom';
import { types } from "../types/types";
import { useAuthStore } from "../store/useAuthStore";



export const MenuComponent = () => {

    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);

    const [collapsed, setCollapsed] = useState(false);
    const menuItems:  MenuProps['items'] = [
        {
            key: 'user',
            icon: <AppstoreOutlined />,
            label: user?.name,
            children: [
                {
                    key: 'nu1',
                    label: "Mi cuenta"
                },
                {
                    key: 'nu2',
                    label: 'Planes y Pagos'
                },
                {
                    key: 'nu3',
                    label: 'Mi estatus'
                },
                {
                    key: 'nu4',
                    label: 'Cerrar sesión',
                    onClick: () => logout()
                }
            ]
        },
        {
            key: 'documents',
            label: <Link to="/app/documents">Documentos</Link>
        },
        // {
        //     key: 'snippets',
        //     label: 'Fragmentos segunda version'
        // },
        // {
        //     key: 'team',
        //     label: 'Equipo de trabajo 2da version'
        // },
        {
            key: 'apyKey',
            label: <Link to="/app/api-key">API Key</Link>,
        },
        {
            key: 'studio',
            icon: <AppstoreOutlined />,
            label: <Link to={`/app/editor?op=${types.documentNew}`}>Nuevo Documento</Link>,
        },
        {
            key: `divider1`,
            type: 'divider'
        },
        // {
        //     key: 'reportes',
        //     icon: <FileTextOutlined />,
        //     label: <Link to="/app/reportes">Mis Documentos</Link>,
        //     children: [
        //         {
        //             key: 'd1',
        //             label: (
        //                 <Tooltip title="Documento  de la jefa de joselito que es no mms que pedul muajaja 1">
        //                     <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '150px', display: 'block' }}>
        //                         Documento  de la jefa de joselito que es no mms que pedul muajaja 1
        //                     </span>
        //                 </Tooltip>
        //             )
        //         },
        //         {
        //             key: 'd2',
        //             label: 'Documento 2'
        //         }
        //     ]
        // },
        {
            key: 'documentation',
            label: 'Documentación'
        },
        // {
        //     key: 'ajustes',
        //     icon: <SettingOutlined />,
        //     label: <Link to="/app/configuracion">Configuración</Link>,
        // },
    ];

    return (
        <Sider
            width={220}
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            className="custom-sider"
            theme="light"
        >
            {/* <div className="logo">
            {collapsed ? '' : 'Reportes'}
            </div> */}
            <Menu
                theme="light"
                mode="inline"
                defaultSelectedKeys={['studio']}
                items={menuItems}
            />
        </Sider>

    )
}
