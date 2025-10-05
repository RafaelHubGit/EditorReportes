// DocumentPage.tsx - Versión completa
import { useState, useMemo } from 'react';
import { 
    Button, 
    Card, 
    Col, 
    Row, 
    Modal, 
    Input, 
    Form, 
    Space, 
    Select, 
    Dropdown, 
    Typography,
    Divider,
    Badge,
    Tooltip,
    type MenuProps
} from 'antd';
import { 
    PlusOutlined, 
    FolderAddOutlined, 
    SearchOutlined,
    AppstoreOutlined,
    UnorderedListOutlined,
    SortAscendingOutlined,
    MoreOutlined,
    UserOutlined,
    TeamOutlined
} from '@ant-design/icons';
import { DocumentCardComponent } from './DocumentCardComponent';
import { FolderComponent } from './FolderComponent';
import { useReportStore } from '../../store/useReportStore';
import { Navigate, useNavigate } from 'react-router-dom';
import { types } from '../../types/types';

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;

export const DocumentPage = () => {
    const navigate = useNavigate();

    const [isFolderModalVisible, setIsFolderModalVisible] = useState(false);
    const [isMoveModalVisible, setIsMoveModalVisible] = useState(false);
    const [form] = Form.useForm();
    
    const { 
        folders, 
        documents, 
        addFolder, 
        deleteFolder,
        viewMode,
        setViewMode,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        selectedDocuments,
        moveSelectedDocuments,
        clearSelection
    } = useReportStore();

    // Documentos filtrados y ordenados
    const filteredDocuments = useMemo(() => {
        let filtered = documents.filter(doc => !doc.idFolder);
        
        if (searchQuery) {
        filtered = filtered.filter(doc => 
            doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        }
        
        return [...filtered].sort((a, b) => {
        switch (sortBy) {
            case 'name':
            return a.name.localeCompare(b.name);
            case 'type':
            return (a.type || '').localeCompare(b.type || '');
            case 'date':
            default:
            return new Date(b.dateUpdated || 0).getTime() - new Date(a.dateUpdated || 0).getTime();
        }
        });
    }, [documents, searchQuery, sortBy]);

    const handleCreateFolder = async (values: { name: string; icon: string; color: string; description?: string }) => {
        try {
        // await addFolder({
        //     name: values.name,
        //     icon: values.icon,
        //     color: values.color,
        //     description: values.description,
        //     idDocuments: []
        // });
        setIsFolderModalVisible(false);
        form.resetFields();
        } catch (error) {
        console.error('Error creating folder:', error);
        }
    };

    const handleMoveDocuments = async (values: { folderId: string }) => {
        try {
        await moveSelectedDocuments(values.folderId || null);
        setIsMoveModalVisible(false);
        clearSelection();
        } catch (error) {
        console.error('Error moving documents:', error);
        }
    };

    const viewModeItems: MenuProps['items'] = [
        {
        key: 'grid',
        icon: <AppstoreOutlined />,
        label: 'Vista de cuadrícula',
        onClick: () => setViewMode('grid')
        },
        {
        key: 'list',
        icon: <UnorderedListOutlined />,
        label: 'Vista de lista',
        onClick: () => setViewMode('list')
        }
    ];

    const sortItems: MenuProps['items'] = [
        {
        key: 'date',
        label: 'Por fecha',
        onClick: () => setSortBy('date')
        },
        {
        key: 'name',
        label: 'Por nombre',
        onClick: () => setSortBy('name')
        },
        {
        key: 'type',
        label: 'Por tipo',
        onClick: () => setSortBy('type')
        }
    ];

    const folderIcons = ["📁", "📂", "🎨", "📊", "📝", "📄", "🧾", "📑"];
    const folderColors = ["#ff6b6b", "#51cf66", "#339af0", "#ff922b", "#cc5de8", "#20c997", "#fcc419"];

    return (
        <section style={{ padding: "50px 50px 10px 50px" }}>
            {/* Header */}
            <Row justify="space-between" align="middle" style={{ marginBottom: 30 }}>
                <Col>
                    <Title level={1} style={{ margin: 0 }}>Documentos</Title>
                    <Text type="secondary">
                        {selectedDocuments.length > 0 
                        ? `${selectedDocuments.length} documento(s) seleccionado(s)`
                        : `${filteredDocuments.length} documento(s) sin carpeta`
                        }
                    </Text>
                </Col>
                <Col>
                    <Space>
                        {selectedDocuments.length > 0 && (
                        <Button 
                            onClick={() => setIsMoveModalVisible(true)}
                            icon={<FolderAddOutlined />}
                        >
                            Mover ({selectedDocuments.length})
                        </Button>
                        )}
                        <Button 
                        type="default" 
                        icon={<FolderAddOutlined />}
                        onClick={() => setIsFolderModalVisible(true)}
                        >
                        Nueva Carpeta
                        </Button>
                        <Button type="primary" icon={<PlusOutlined />}>
                        Nuevo Documento
                        </Button>
                    </Space>
                </Col>
            </Row>

            {/* Toolbar */}
            <Card 
                size="small" 
                style={{ marginBottom: 24 }}
                // bodyStyle={{ padding: '12px 16px' }}
            >
                <Row justify="space-between" align="middle">
                    <Col>
                        <Space size="middle">
                        <Search
                            placeholder="Buscar documentos..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ width: 300 }}
                            allowClear
                        />
                        
                        <Dropdown menu={{ items: sortItems }} trigger={['click']}>
                            <Button icon={<SortAscendingOutlined />}>
                            Ordenar: {sortBy === 'date' ? 'Fecha' : sortBy === 'name' ? 'Nombre' : 'Tipo'}
                            </Button>
                        </Dropdown>
                        </Space>
                    </Col>
                    
                    <Col>
                        <Space>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            {filteredDocuments.length} items
                        </Text>
                        
                        <Dropdown menu={{ items: viewModeItems }} trigger={['click']}>
                            <Button icon={viewMode === 'grid' ? <AppstoreOutlined /> : <UnorderedListOutlined />}>
                            {viewMode === 'grid' ? 'Cuadrícula' : 'Lista'}
                            </Button>
                        </Dropdown>
                        </Space>
                    </Col>
                </Row>
            </Card>

            <div
                style={{
                    padding: 24,
                    backgroundColor: '#fff',
                    borderRadius: 12,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#ccc #f1f1f1',
                    overflowY: 'auto',
                    height: 'calc(100vh - 250px)',
                }}
            >
                {/* Folders Section */}
                <Title level={2} style={{ marginBottom: 16 }}>Carpetas</Title>
                <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
                    {folders.map((folder) => {
                    const folderDocs = documents.filter(doc => folder.idDocuments.includes(doc.id));
                    return (
                        <Col xs={24} sm={12} md={8} lg={6} key={folder.id}>
                            <FolderComponent 
                                id={folder.id} 
                                name={folder.name}
                                // icon={folder.icon}
                                color={folder.color || "#339af0"}
                                description={folder.description || ""}
                                isShared={folder.isShared || false}
                                sharedWith={folder.sharedWith || []}
                                documentCount={folderDocs.length}
                                onEdit={(id) => console.log("Editar folder", id)} // ← Agregar esta línea
                                onShare={(id) => console.log("Compartir folder", id)} // ← Agregar esta línea
                                onDelete={deleteFolder}
                            />
                        </Col>
                    );
                    })}
                    
                    {/* Empty Folder Card */}
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Card
                            hoverable
                            style={{ 
                                border: '2px dashed #d9d9d9',
                                borderRadius: 12,
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            // styles={{
                            //     padding: 16,
                            //     textAlign: 'center'
                            // }}
                            onClick={() => setIsFolderModalVisible(true)}
                        >
                            <FolderAddOutlined style={{ fontSize: 32, color: '#1890ff', marginBottom: 8 }} />
                            <Text type="secondary" strong>
                            Crear nueva carpeta
                            </Text>
                        </Card>
                    </Col>
                </Row>

                {/* Documents Section */}
                <Title level={2} style={{ marginBottom: 16 }}>
                    Documentos Recientes
                    {selectedDocuments.length > 0 && (
                    <Badge 
                        count={selectedDocuments.length} 
                        style={{ marginLeft: 8 }} 
                        showZero={false}
                    />
                    )}
                </Title>
                
                <Row gutter={[16, 16]}>
                    {filteredDocuments.length > 0 ? (
                    filteredDocuments.map((doc) => (
                        <Col xs={24} key={doc.id}>
                            <DocumentCardComponent
                                doc={doc}
                                viewMode={viewMode}
                                isSelected={selectedDocuments.includes(doc.id)}
                                onSelect={() => {}}
                                // onEdit={(id) =>  navigate(`app/editor/${types.documentEdit}/${id}`) }
                                onEdit={(id) => navigate(`/app/editor/edit/${id}`)}
                                onDuplicate={(id) => console.log("duplicate", id)}
                                onMove={(id) => console.log("move", id)}
                                onDelete={(id) => console.log("delete", id)}
                            />
                        </Col>
                    ))
                    ) : (
                    <Col xs={24}>
                        <Card>
                            <div style={{ textAlign: 'center', padding: 40 }}>
                                <SearchOutlined style={{ fontSize: 48, color: '#d9d9d9', marginBottom: 16 }} />
                                <Title level={3} type="secondary">
                                {searchQuery ? 'No se encontraron documentos' : 'No hay documentos'}
                                </Title>
                                <Text type="secondary">
                                {searchQuery 
                                    ? 'Intenta con otros términos de búsqueda'
                                    : 'Crea tu primer documento o agrega documentos a carpetas'
                                }
                                </Text>
                            </div>
                        </Card>
                    </Col>
                    )}
                </Row>

            </div>

            {/* Create Folder Modal */}
            <Modal
                title="Crear Nueva Carpeta"
                open={isFolderModalVisible}
                onCancel={() => {
                setIsFolderModalVisible(false);
                form.resetFields();
                }}
                onOk={() => form.submit()}
                okText="Crear Carpeta"
                cancelText="Cancelar"
            >
                <Form
                form={form}
                layout="vertical"
                onFinish={handleCreateFolder}
                initialValues={{ icon: "📁", color: "#339af0" }}
                >
                <Form.Item
                    name="name"
                    label="Nombre de la carpeta"
                    rules={[
                    { required: true, message: 'Por favor ingresa un nombre para la carpeta' },
                    { min: 1, message: 'El nombre debe tener al menos 1 carácter' }
                    ]}
                >
                    <Input placeholder="Ej: Proyectos 2024" />
                </Form.Item>
                
                <Form.Item
                    name="description"
                    label="Descripción (opcional)"
                >
                    <Input.TextArea 
                    placeholder="Describe el propósito de esta carpeta..."
                    rows={3}
                    />
                </Form.Item>
                
                <Form.Item
                    name="icon"
                    label="Icono"
                >
                    <Select placeholder="Selecciona un icono">
                        {folderIcons.map(icon => (
                            <Option key={icon} value={icon}>
                            <Space>
                                <span style={{ fontSize: 16 }}>{icon}</span>
                                <span>{icon}</span>
                            </Space>
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                
                <Form.Item
                    name="color"
                    label="Color"
                >
                    <Select placeholder="Selecciona un color">
                        {folderColors.map(color => (
                            <Option key={color} value={color}>
                            <Space>
                                <div 
                                style={{ 
                                    width: 16, 
                                    height: 16, 
                                    backgroundColor: color,
                                    borderRadius: 4
                                }} 
                                />
                                <span>{color}</span>
                            </Space>
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                </Form>
            </Modal>

            {/* Move Documents Modal */}
            <Modal
                title={`Mover ${selectedDocuments.length} documento(s)`}
                open={isMoveModalVisible}
                onCancel={() => setIsMoveModalVisible(false)}
                onOk={() => form.submit()}
                okText="Mover"
                cancelText="Cancelar"
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleMoveDocuments}
                >
                    <Form.Item
                        name="folderId"
                        label="Seleccionar carpeta destino"
                    >
                        <Select placeholder="Selecciona una carpeta (dejar vacío para mover a raíz)">
                            <Option value="">📁 Raíz de documentos</Option>
                                {folders.map(folder => (
                                    <Option key={folder.id} value={folder.id}>
                                        <Space>
                                            <span>{folder.icon}</span>
                                            <span>{folder.name}</span>
                                            <Text type="secondary">
                                            ({folder.idDocuments.length} docs)
                                            </Text>
                                        </Space>
                                    </Option>
                                ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </section>
    );
}