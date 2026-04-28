import { useState } from 'react';
import {
    Drawer,
    List,
    Tag,
    Button,
    Typography,
    Space,
    Tooltip,
    Modal,
    Input,
    Popconfirm,
    Spin,
    Alert,
    Empty,
} from 'antd';
import {
    CheckCircleFilled,
    EditOutlined,
    EyeOutlined,
    DeleteOutlined,
    RocketOutlined,
    CopyOutlined,
    HistoryOutlined,
} from '@ant-design/icons';
import type { IDocument } from '../interfaces/IGeneric';
import { useTemplateVersions } from '../hooks/useTemplateVersions';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

dayjs.locale('es');

const { Text, Paragraph } = Typography;

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────
interface VersionHistoryPanelProps {
    /** parent_id del grupo de versiones */
    parentId: string | null | undefined;
    /** Callback cuando el usuario quiere ver/editar una versión */
    onOpenVersion?: (version: IDocument) => void;
    /** Callback para previsualizar PDF de una versión */
    onPreviewVersion?: (version: IDocument) => void;
    open: boolean;
    onClose: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Componente
// ─────────────────────────────────────────────────────────────────────────────
export const VersionHistoryPanel = ({
    parentId,
    onOpenVersion,
    onPreviewVersion,
    open,
    onClose,
}: VersionHistoryPanelProps) => {
    const {
        versions,
        loadingVersions,
        versionsError,
        publishing,
        creatingDraft,
        deletingVersion,
        hasDraft,
        publishTemplate,
        createDraft,
        deleteVersion,
    } = useTemplateVersions(parentId);

    // Modal "Publicar a Producción"
    const [publishModalOpen, setPublishModalOpen] = useState(false);
    const [publishComment, setPublishComment] = useState('');

    const handlePublish = async () => {
        if (!publishComment.trim()) return;
        await publishTemplate(publishComment.trim());
        setPublishComment('');
        setPublishModalOpen(false);
    };

    // ── Render ────────────────────────────────────────────────────────────────
    const renderVersionTag = (v: IDocument) => {
        if (v.is_production) return <Tag color="green" icon={<CheckCircleFilled />}>Producción</Tag>;
        if (v.is_draft)      return <Tag color="blue"  icon={<EditOutlined />}>Borrador</Tag>;
        return <Tag color="default">Histórica</Tag>;
    };

    const formatDate = (dateStr?: string | Date) => {
        if (!dateStr) return '—';
        return dayjs(dateStr).format('DD MMM YYYY, HH:mm');
    };

    return (
        <>
            <Drawer
                title={
                    <Space>
                        <HistoryOutlined />
                        <span>Historial de Versiones</span>
                    </Space>
                }
                width={480}
                open={open}
                onClose={onClose}
                extra={
                    <Tooltip
                        title={
                            !hasDraft
                                ? 'No hay borrador activo. Abre una versión y edítala para crear un borrador.'
                                : ''
                        }
                    >
                        <Button
                            type="primary"
                            icon={<RocketOutlined />}
                            disabled={!hasDraft}
                            loading={publishing}
                            onClick={() => setPublishModalOpen(true)}
                        >
                            Publicar a Producción
                        </Button>
                    </Tooltip>
                }
            >
                {loadingVersions && <Spin tip="Cargando versiones..." style={{ display: 'block', marginTop: 48 }} />}

                {versionsError && (
                    <Alert
                        type="error"
                        message="Error al cargar versiones"
                        description={versionsError.message}
                        showIcon
                        style={{ marginBottom: 16 }}
                    />
                )}

                {!loadingVersions && versions.length === 0 && (
                    <Empty description="Esta plantilla aún no tiene versiones registradas." />
                )}

                <List
                    itemLayout="vertical"
                    dataSource={versions}
                    renderItem={(version) => (
                        <List.Item
                            key={version.id}
                            style={{
                                background: version.is_production
                                    ? 'rgba(82, 196, 26, 0.05)'
                                    : version.is_draft
                                        ? 'rgba(24, 144, 255, 0.05)'
                                        : undefined,
                                borderRadius: 8,
                                padding: '12px 16px',
                                marginBottom: 8,
                                border: '1px solid #f0f0f0',
                            }}
                            actions={[
                                // Ver / Editar
                                <Tooltip title={version.is_production || (!version.is_draft) ? 'Ver código (solo lectura)' : 'Editar borrador'}>
                                    <Button
                                        size="small"
                                        icon={version.is_draft ? <EditOutlined /> : <EyeOutlined />}
                                        onClick={() => onOpenVersion?.(version)}
                                    >
                                        {version.is_draft ? 'Editar' : 'Ver código'}
                                    </Button>
                                </Tooltip>,

                                // Previsualizar PDF
                                <Tooltip title="Generar PDF de esta versión">
                                    <Button
                                        size="small"
                                        icon={<EyeOutlined />}
                                        onClick={() => onPreviewVersion?.(version)}
                                    >
                                        Previsualizar
                                    </Button>
                                </Tooltip>,

                                // Crear draft desde esta versión
                                !version.is_draft && !hasDraft && (
                                    <Tooltip title="Crear borrador desde esta versión">
                                        <Button
                                            size="small"
                                            icon={<CopyOutlined />}
                                            loading={creatingDraft}
                                            onClick={() => createDraft(version.id)}
                                        >
                                            Usar como base
                                        </Button>
                                    </Tooltip>
                                ),

                                // Eliminar (solo históricas y drafts)
                                !version.is_production && (
                                    <Popconfirm
                                        title="¿Eliminar esta versión?"
                                        description="Esta acción no se puede deshacer."
                                        okText="Sí, eliminar"
                                        cancelText="Cancelar"
                                        okButtonProps={{ danger: true }}
                                        onConfirm={() => deleteVersion(version.id)}
                                    >
                                        <Button
                                            size="small"
                                            danger
                                            icon={<DeleteOutlined />}
                                            loading={deletingVersion}
                                        >
                                            Eliminar
                                        </Button>
                                    </Popconfirm>
                                ),
                            ].filter(Boolean)}
                        >
                            <List.Item.Meta
                                title={
                                    <Space>
                                        {renderVersionTag(version)}
                                        <Text strong style={{ fontSize: 13 }}>
                                            {version.name}
                                        </Text>
                                    </Space>
                                }
                                description={
                                    <Space direction="vertical" size={2} style={{ width: '100%' }}>
                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                            {version.is_production
                                                ? `Publicado: ${formatDate(version.version_tag)}`
                                                : version.is_draft
                                                    ? `Modificado: ${formatDate(version.updatedAt)}`
                                                    : `Versión del: ${formatDate(version.version_tag)}`
                                            }
                                        </Text>
                                        {version.comment && (
                                            <Paragraph
                                                ellipsis={{ rows: 2, expandable: true, symbol: 'más' }}
                                                style={{ fontSize: 12, marginBottom: 0, color: '#595959' }}
                                            >
                                                💬 {version.comment}
                                            </Paragraph>
                                        )}
                                    </Space>
                                }
                            />
                        </List.Item>
                    )}
                />
            </Drawer>

            {/* Modal: Publicar a Producción */}
            <Modal
                title={
                    <Space>
                        <RocketOutlined style={{ color: '#52c41a' }} />
                        Publicar a Producción
                    </Space>
                }
                open={publishModalOpen}
                onCancel={() => { setPublishModalOpen(false); setPublishComment(''); }}
                onOk={handlePublish}
                okText="Publicar"
                okButtonProps={{ loading: publishing, disabled: !publishComment.trim() }}
                cancelText="Cancelar"
            >
                <Paragraph>
                    El borrador actual será publicado como la nueva versión en producción.
                    La versión anterior quedará guardada en el historial.
                </Paragraph>
                <Input.TextArea
                    placeholder="Describe los cambios de esta versión (obligatorio)..."
                    rows={4}
                    maxLength={500}
                    showCount
                    value={publishComment}
                    onChange={(e) => setPublishComment(e.target.value)}
                    autoFocus
                />
            </Modal>
        </>
    );
};
