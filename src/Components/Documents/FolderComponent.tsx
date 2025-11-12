// FolderComponent.tsx - Versión mejorada
import React, { useState } from "react";
import { Card, Button, Space, Typography, Dropdown, Tag, Modal, Form, Input, Select, type MenuProps } from "antd";
import {
    ShareAltOutlined, 
    EditOutlined, 
    DeleteOutlined, 
    MoreOutlined,
    UserOutlined 
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useReportStore } from "../../store/useReportStore";
import type { IFolder } from "../../interfaces/IGeneric";

const { Text } = Typography;
const { Option } = Select;

type Props = {
    folder: IFolder;
    isShared?: boolean;
    sharedWith?: string[];
    documentCount?: number;
    onEdit?: (folder: any) => void;
    onShare?: (id: string) => void;
    onDelete?: (id: string) => void;
};

export const FolderComponent = ({ 
    folder,
    isShared = false,
    sharedWith = [],
    documentCount = 0,
    onEdit,
    onShare,
    onDelete
}: Props) => {

    const navigate = useNavigate();

    const { id, name, icon = "📁", color = "#339af0", description } = folder;


    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isShareModalVisible, setIsShareModalVisible] = useState(false);
    const [form] = Form.useForm();
    const { updateFolder, shareFolder } = useReportStore();

    // const handleEdit = async (values: any) => {
    //     try {
    //         await updateFolder(id, values);
    //         setIsEditModalVisible(false);
    //         onEdit?.({ id, name, color, description, icon });
    //     } catch (error) {
    //         console.error('Error editing folder:', error);
    //     }
    // };

    const handleShare = async (values: { users: string[] }) => {
        try {
            await shareFolder(id, values.users);
            setIsShareModalVisible(false);
            onShare?.(id);
        } catch (error) {
            console.error('Error sharing folder:', error);
        }
    };

    const handleNavigate = (path: string) => {
        navigate(path);
    };

    const menuItems: MenuProps['items'] = [
        {
            key: 'edit',
            icon: <EditOutlined />,
            label: 'Editar',
            onClick: () => onEdit?.({ id, name, color, description, icon })
        },
        {
            key: 'share',
            icon: <ShareAltOutlined />,
            label: 'Compartir',
            onClick: () => setIsShareModalVisible(true)
        },
        {
            type: 'divider',
        },
        {
            key: 'delete',
            icon: <DeleteOutlined />,
            label: 'Eliminar',
            danger: true,
            onClick: () => onDelete?.(id)
        }
    ];

    return (
        <>
            <Card
                hoverable
                variant="outlined"
                style={{ 
                    borderRadius: 12, 
                    boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
                    borderLeft: `4px solid ${color}`,
                    position: 'relative',
                    maxHeight: '100px',
                    overflow: 'hidden'
                }}
                onClick={() => handleNavigate(`/app/folders/${id}`)}
                // bodyStyle={{ padding: 16 }}
                // actions={[
                // <Link to={`/app/folders/${id}`} key="open">
                //     <Button type="primary" icon={<ArrowRightOutlined />} size="small">
                //     Abrir
                //     </Button>
                // </Link>
                // ]}
            >
                {/* Header con menu de opciones */}
                <div 
                    style={{ position: 'absolute', top: 12, right: 12 }}
                    onClick={(e) => { // se pone para que al dar clic en el menu no redirija
                        e.stopPropagation();
                        e.preventDefault();
                    }}
                >
                    <Dropdown menu={{ items: menuItems }} trigger={['hover']}>
                        <Button 
                            type="text" 
                            icon={<MoreOutlined />} 
                            size="small"
                        />
                    </Dropdown>
                </div>

                {/* Contenido de la carpeta */}
                <Space 
                    direction="vertical" 
                    size={1} 
                    style={{ 
                        width: "100%", 
                        marginTop: 5 
                    }}
                >
                    <Space align="center" size={5}>
                        <span style={{ fontSize: 24 }}>{icon}</span>
                        <div 
                            style={{ 
                                flex: 1, 
                                minWidth: 0, 
                                overflow: 'hidden',
                                maxWidth: '80%'
                            }}
                        >
                            <Text strong 
                                style={{
                                    fontSize: 13
                                }} 
                                ellipsis
                            >
                                {name}
                            </Text>
                            {description && (
                                <Text type="secondary" 
                                    style={{ 
                                        fontSize: 11,
                                    overflow:'hidden',
                                    textOverflow:'ellipsis',
                                    whiteSpace:'nowrap'
                                    }} 
                                    
                                >
                                {description}
                                </Text>
                            )}
                        </div>
                    </Space>

                    {/* Tags y información */}
                    <Space size={8} style={{ width: '100%', justifyContent: 'space-between' }}>
                        <Space size={4}>
                        {/* {isShared && (
                            <Tag icon={<UserOutlined />} color="blue">
                            Compartida
                            </Tag>
                        )} */}
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            {documentCount} doc{documentCount !== 1 ? 's' : ''}
                        </Text>
                        </Space>
                    </Space>
                </Space>
            </Card>

            {/* Modal share */}
            <Modal
                title={`Compartir "${name}"`}
                open={isShareModalVisible}
                onCancel={() => setIsShareModalVisible(false)}
                onOk={() => form.submit()}
                okText="Compartir"
                cancelText="Cancelar"
            >
                <Form
                form={form}
                layout="vertical"
                onFinish={handleShare}
                >
                <Form.Item
                    name="users"
                    label="Agregar usuarios (emails)"
                    rules={[{ required: true, message: 'Agrega al menos un usuario' }]}
                >
                    <Select
                    mode="tags"
                    placeholder="Ingresa emails de usuarios"
                    style={{ width: '100%' }}
                    tokenSeparators={[',', ' ']}
                    />
                </Form.Item>
                <Text type="secondary">
                    Los usuarios recibirán acceso de solo lectura a esta carpeta y sus documentos.
                </Text>
                </Form>
            </Modal>
        </>
    );
};