// DocumentCardComponent.tsx - Versión mejorada
import React from 'react';
import { Card, Button, Space, Typography, Dropdown, Tag, Checkbox, type MenuProps } from 'antd';
import { 
    EditOutlined, 
    CopyOutlined, 
    FolderOutlined, 
    DeleteOutlined, 
    MoreOutlined,
    FileTextOutlined,
    FilePdfOutlined,
    FileImageOutlined
} from '@ant-design/icons';
import { useReportStore } from '../../store/useReportStore';
import type { IDocument } from '../../interfaces/IGeneric';
import { Navigate, useNavigate } from 'react-router-dom';
import { types } from '../../types/types';


const { Text } = Typography;

interface DocumentCardProps {
    doc: IDocument;
    viewMode?: 'grid' | 'list';
    isSelected?: boolean;
    onSelect?: (id: string) => void;
    // onEdit: (id: string) => void;
    onDuplicate: (id: string) => void;
    // onMove: (id: string) => void;
    onDelete: (id: string) => void;
}

const getFileIcon = (type?: string) => {
    switch (type) {
        case 'invoice':
        return <FilePdfOutlined style={{ color: '#ff4d4f' }} />;
        case 'report':
        return <FileTextOutlined style={{ color: '#1890ff' }} />;
        case 'template':
        return <FileImageOutlined style={{ color: '#52c41a' }} />;
        default:
        return <FileTextOutlined style={{ color: '#666' }} />;
    }
};

const getTypeColor = (type?: string) => {
    switch (type) {
        case 'invoice':
        return 'red';
        case 'report':
        return 'blue';
        case 'template':
        return 'green';
        default:
        return 'default';
    }
};

export const DocumentCardComponent: React.FC<DocumentCardProps> = ({
    doc,
    viewMode = 'grid',
    isSelected = false,
    onSelect,
    // onEdit,
    onDuplicate,
    // onMove,
    onDelete
}) => {
    const navigate = useNavigate();
    const { toggleDocumentSelection } = useReportStore();
    const setIsOpenMoveModal = useReportStore( state => state.setIsOpenMoveModal );
    const setSelectedMoveDocuments = useReportStore( state => state.setSelectedMoveDocuments );

    const handleSelect = () => {
        onSelect?.(doc.id);
        toggleDocumentSelection(doc.id);
    };

    const handleEdit = () => {
        navigate(`/app/editor/${types.documentEdit}/${doc.id}`)
    };

    const handleMove = ( idDocument: string ) => {
        setSelectedMoveDocuments([idDocument]);
        setIsOpenMoveModal(true);
    };

    const menuItems: MenuProps['items'] = [
        {
            key: 'edit',
            icon: <EditOutlined />,
            label: 'Editar',
            onClick: () => handleEdit()
        },
        // {
        //     key: 'duplicate',
        //     icon: <CopyOutlined />,
        //     label: 'Duplicar',
        //     onClick: () => onDuplicate(doc.id)
        // },
        {
            key: 'move',
            icon: <FolderOutlined />,
            label: 'Mover a carpeta',
            onClick: () => handleMove(doc.id)
        },
        {
            type: 'divider',
        },
        {
            key: 'delete',
            icon: <DeleteOutlined />,
            label: 'Eliminar',
            danger: true,
            onClick: () => onDelete(doc.id)
        }
    ];

    if (viewMode === 'list') {
        return (
        <Card
            size="small"
            style={{ 
            marginBottom: 8,
            border: isSelected ? '2px solid #1890ff' : undefined,
            backgroundColor: isSelected ? '#f0f8ff' : undefined
            }}
            bodyStyle={{ padding: '12px 16px' }}
        >
            <Space size="middle" style={{ width: '100%', justifyContent: 'space-between' }}>
            <Space size="middle">
                <Checkbox 
                checked={isSelected} 
                onChange={handleSelect}
                />
                {getFileIcon(doc.type)}
                <Text strong>{doc.name}</Text>
                {doc.type && (
                <Tag color={getTypeColor(doc.type)}>
                    {doc.type}
                </Tag>
                )}
            </Space>
            
            <Space size="middle">
                <Text type="secondary" style={{ fontSize: 12 }}>
                {doc.dateUpdated?.toString()}
                </Text>
                
                <Dropdown menu={{ items: menuItems }} trigger={['click']}>
                <Button type="text" icon={<MoreOutlined />} size="small" />
                </Dropdown>
            </Space>
            </Space>
        </Card>
        );
    }

    // Grid View
    return (
        <Card
            hoverable
            style={{ 
                marginBottom: 16,
                // maxWidth: '300px',
                border: isSelected ? '2px solidrgb(255, 163, 24)' : undefined,
                backgroundColor: isSelected ? '#f0f8ff' : undefined
            }}
        >
            {/* Selection Checkbox */}
            <div style={{ position: 'absolute', top: 12, left: 12 }}>
                <Checkbox 
                checked={isSelected} 
                onChange={handleSelect}
                />
            </div>

            {/* Options Menu */}
            <div style={{ position: 'absolute', top: 8, right: 8 }}>
                <Dropdown menu={{ items: menuItems }} trigger={['click']}>
                <Button type="text" icon={<MoreOutlined />} size="small" />
                </Dropdown>
            </div>

            {/* Content */}
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
                <Space size={12} style={{ width: '100%', justifyContent: 'center' }}>
                {getFileIcon(doc.type)}
                </Space>
                
                <div>
                <Text strong style={{ display: 'block', textAlign: 'center' }} ellipsis>
                    {doc.name}
                </Text>
                <Text type="secondary" style={{ fontSize: 12, display: 'block', textAlign: 'center' }}>
                    {doc.dateUpdated?.toString() || ""}
                </Text>
                </div>

                {/* Tags */}
                {doc.tags && doc.tags.length > 0 && (
                <div style={{ textAlign: 'center' }}>
                    {doc.tags.slice(0, 2).map(tag => (
                    <Tag key={tag} style={{ margin: 2 }}>
                        {tag}
                    </Tag>
                    ))}
                    {doc.tags.length > 2 && (
                    <Tag >+{doc.tags.length - 2}</Tag>
                    )}
                </div>
                )}

                {/* Actions */}
                <Space style={{ width: '100%', justifyContent: 'center' }}>
                <Button 
                    type="primary" 
                    size="small" 
                    icon={<EditOutlined />}
                    onClick={() => handleEdit()}
                >
                    Editar
                </Button>
                </Space>
            </Space>
        </Card>
    );
};