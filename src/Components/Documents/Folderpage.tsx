import React from "react";
import { Button, Row, Col, Typography, Space, Empty, Divider, Input, Dropdown } from "antd";
import { ArrowLeftOutlined, PlusOutlined, MoreOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { DocumentCardComponent } from "./DocumentCardComponent";

const { Title } = Typography;

type Props = {
  // Optional props/state injection if you don't want to read from a store yet:
    folderName?: string;
    documents?: Array<{ id: string; name: string; lastSavedAt: string | Date }>;
    onAddDocument?: (folderId: string) => void;
    onEdit?: (id: string) => void;
    onDuplicate?: (id: string) => void;
    onMove?: (id: string) => void;
    onDelete?: (id: string) => void;
};

export const FolderPage = ({
    folderName,
    documents = [],
    onAddDocument,
    onEdit = (id) => console.log("edit", id),
    onDuplicate = (id) => console.log("duplicate", id),
    onMove = (id) => console.log("move", id),
    onDelete = (id) => console.log("delete", id),
}: Props) => {
    const navigate = useNavigate();
    const { folderId } = useParams<{ folderId: string }>();

    // TEMP name if not provided (replace with store lookup)
    const name = folderName ?? `Folder ${folderId?.slice(0, 6)}`;

    const handleAdd = () => {
        if (folderId && onAddDocument) onAddDocument(folderId);
        // else route to your "new document" page with folderId in state/query
    };

    return (
        <div style={{ padding: 24 }}>
        {/* Header */}
        <Space align="center" style={{ width: "100%", justifyContent: "space-between" }}>
            <Space align="center" size={12}>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
                Back
            </Button>
            <Title level={3} style={{ margin: 0 }}>
                {name}
            </Title>
            </Space>

            <Space>
            {/* Optional: quick actions menu placeholder */}
            <Dropdown
                trigger={["click"]}
                menu={{
                items: [
                    { key: "rename", label: "Rename (soon)" },
                    { key: "share", label: "Share (soon)" },
                ],
                }}
            >
                <Button icon={<MoreOutlined />} />
            </Dropdown>

            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                Add Document
            </Button>
            </Space>
        </Space>

        {/* Toolbar */}
        <Space style={{ width: "100%", marginTop: 16, marginBottom: 8 }}>
            <Input.Search placeholder="Search documents…" allowClear style={{ width: 320 }} />
        </Space>

        <Divider style={{ margin: "12px 0 20px" }} />

        {/* Documents Grid */}
        {documents.length === 0 ? (
            <Empty description="No documents in this folder yet">
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                Create your first document
            </Button>
            </Empty>
        ) : (
            <Row gutter={[16, 16]}>
            {documents.map((d) => (
                <Col key={d.id} xs={24} sm={12} md={8} lg={6} xl={6}>
                <DocumentCardComponent
                    doc={d}
                    onEdit={onEdit}
                    onDuplicate={onDuplicate}
                    onMove={onMove}
                    onDelete={onDelete}
                />
                </Col>
            ))}
            </Row>
        )}
        </div>
    );
};
