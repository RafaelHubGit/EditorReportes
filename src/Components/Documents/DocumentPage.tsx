import { Button, Card, Col, Row } from 'antd';
import Title from 'antd/es/typography/Title';
import { DocumentCardComponent } from './DocumentCardComponent';
import { FolderComponent } from './FolderComponent';
import { FolderPage } from './Folderpage';



export const DocumentPage = () => {
    return (
        <section
            style={{
                padding: 80
            }}
        >
                        
            <Row justify="space-between" align="middle" style={{ marginBottom: 30 }}>
                <Col>
                    <Title level={1} style={{ margin: 0 }}>Documentos</Title>
                </Col>
                <Col>
                    <Button type="primary">Nuevo Documento</Button>
                </Col>
            </Row>


            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={8} lg={6}>
                    <FolderComponent id="123" name="Marketing Templates" />
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                    <FolderComponent id="abc" name="Invoices 2025" />
                </Col>
            </Row>

            <DocumentCardComponent
                doc={{
                    id: "e4f50b2a-0c52-4cda-b729-9fbc3c7ff0df",
                    name: "Q3 Invoice Template",
                    lastSavedAt: new Date(),
                }}
                onEdit={(id) => console.log("edit", id)}
                onDuplicate={(id) => console.log("duplicate", id)}
                onMove={(id) => console.log("move", id)}
                onDelete={(id) => console.log("delete", id)}
            />


        </section>
    );
}
