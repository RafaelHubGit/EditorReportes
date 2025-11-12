import { Form, Modal, Input, ColorPicker, Grid } from 'antd';
import { useReportStore } from '../store/useReportStore';
import { useEffect } from 'react';
import type { IFolder } from '../interfaces/IGeneric';

const { useBreakpoint } = Grid;

interface Props {
    open: boolean;
    onCancel: () => void;
    editingFolder?: IFolder | null; // O tu tipo Folder específico
}

export const FolderModalComponent = ({ open, onCancel, editingFolder }: Props) => {
    const { addFolder, updateFolder } = useReportStore();
    const [form] = Form.useForm();
    const screens = useBreakpoint();

    const isEditing = Boolean(editingFolder);

    // Resetear el formulario cuando cambia el modo (edición/creación)
    useEffect(() => {
        if (open) {
            if (isEditing && editingFolder) {
                // Modo edición
                form.setFieldsValue({
                    name: editingFolder.name,
                    description: editingFolder.description,
                    color: editingFolder.color || '#339af0',
                    icon: editingFolder.icon || '📁'
                });
            } else {
                // Modo creación
                form.setFieldsValue({
                    name: '',
                    description: '',
                    color: '#339af0',
                    icon: '📁'
                });
            }
        }
    }, [open, isEditing, editingFolder, form]);

    const handleSubmit = async (values: { 
        name: string; 
        description?: string;
        color?: string;
        icon?: string;
    }) => {
        try {
            if (isEditing && editingFolder) {
                // Modo edición
                await updateFolder(editingFolder.id, {
                    name: values.name,
                    description: values.description || '',
                    icon: values.icon || '📁',
                    color: values.color || '#339af0',
                    updatedAt: new Date()
                });
            } else {
                // Modo creación
                await addFolder({
                    name: values.name,
                    description: values.description || '',
                    icon: values.icon || '📁',
                    color: values.color || '#339af0',
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
            }
            
            handleClose();
        } catch (error) {
            console.error(`Error ${isEditing ? 'editing' : 'creating'} folder:`, error);
        }
    };

    const handleClose = () => {
        form.resetFields();
        onCancel();
    };

    const handleColorSelect = (color: string) => {
        form.setFieldValue('color', color);
    };

    return (
        <Modal
            title={isEditing ? "Editar carpeta" : "Crear nueva carpeta"}
            open={open}
            onCancel={handleClose}
            onOk={() => form.submit()}
            okText={isEditing ? "Guardar cambios" : "Crear carpeta"}
            cancelText="Cancelar"
            width={600}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    name="name"
                    label="Nombre de la carpeta"
                    rules={[{ required: true, message: 'Por favor ingresa un nombre para la carpeta' }]}
                >
                    <Input placeholder="Ej: Proyectos 2024" />
                </Form.Item>
                
                <Form.Item
                    name="description"
                    label="Descripción (opcional)"
                >
                    <Input.TextArea 
                        placeholder="Describe el contenido de esta carpeta..."
                        rows={3}
                    />
                </Form.Item>

                <Form.Item
                    name="color"
                    label="Color de la carpeta"
                >
                    <ColorPicker
                        format="hex"
                        onChange={(color) => handleColorSelect(color.toHexString())}
                        presets={[
                            {
                                label: 'Colores recomendados',
                                colors: [
                                    '#339af0', '#51cf66', '#ffd43b', '#ff6b6b', 
                                    '#cc5de8', '#ff922b', '#20c997', '#748ffc',
                                    '#f783ac', '#5c7cfa', '#38d9a9', '#ffa94d'
                                ],
                            },
                        ]}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};