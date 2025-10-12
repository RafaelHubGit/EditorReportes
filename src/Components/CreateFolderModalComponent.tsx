import { Form, Modal, Input } from 'antd';
import { useReportStore } from '../store/useReportStore';

export const CreateFolderModalComponent = () => {
    const setIsOpenCreateFolderModal = useReportStore(state => state.setIsOpenCreateFolderModal);
    const isOpenCreateFolderModal = useReportStore(state => state.isOpenCreateFolderModal);
    const addFolder = useReportStore(state => state.addFolder);
    const [form] = Form.useForm();

    const handleCreateFolder = async (values: { name: string; description?: string }) => {
        try {
            await addFolder({
                name: values.name,
                description: values.description || '',
                icon: '📁',
                color: '#339af0',
                idDocuments: [],
                dateCreated: new Date(),
                dateUpdated: new Date()
            });
            setIsOpenCreateFolderModal(false);
            form.resetFields();
        } catch (error) {
            console.error('Error creating folder:', error);
        }
    };

    return (
        <Modal
            title="Crear nueva carpeta"
            open={isOpenCreateFolderModal}
            onCancel={() => setIsOpenCreateFolderModal(false)}
            onOk={() => form.submit()}
            okText="Crear carpeta"
            cancelText="Cancelar"
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleCreateFolder}
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
            </Form>
        </Modal>
    );
};