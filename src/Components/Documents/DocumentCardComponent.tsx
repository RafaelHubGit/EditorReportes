
import { Card, Dropdown, Button, Typography, Space, Tag } from "antd";
import { MoreOutlined, EditOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

export type DocumentMeta = {
    id: string;
    name: string;                 // title
    lastSavedAt: string | Date;   // last saved datetime
};

type Props = {
    doc: DocumentMeta;
    onEdit: (id: string) => void;
    onDuplicate: (id: string) => void;
    onMove: (id: string) => void;
    onDelete: (id: string) => void;
};

const formatDate = (d: string | Date) => {
    const date = typeof d === "string" ? new Date(d) : d;
    return new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
};


export const DocumentCardComponent = ({
    doc,
    onEdit,
    onDuplicate,
    onMove,
    onDelete,
}: Props) => {

    const menuItems = [
        { key: "duplicate", label: "Duplicate", onClick: () => onDuplicate(doc.id) },
        { key: "move", label: "Move", onClick: () => onMove(doc.id) },
        { key: "delete", label: <span style={{ color: "#cf1322" }}>Delete</span>, onClick: () => onDelete(doc.id) },
    ];


    return (
        <Card
        hoverable
        bordered
        style={{
            borderRadius: 14,
            boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
        }}
        bodyStyle={{ padding: 16 }}
        title={
            <Space align="center" size={10}>
            <Title level={5} style={{ margin: 0, lineHeight: 1.2 }}>
                {doc.name}
            </Title>
            <Tag color="default" style={{ marginInlineStart: 6 }}>
                ID: {doc.id.slice(0, 8)}…
            </Tag>
            </Space>
        }
        extra={
            <Space>
            <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => onEdit(doc.id)}
            >
                Edit
            </Button>

            <Dropdown
                trigger={["click"]}
                menu={{ items: menuItems.map(mi => ({ key: mi.key, label: mi.label, onClick: mi.onClick })) }}
            >
                <Button icon={<MoreOutlined />} />
            </Dropdown>
            </Space>
        }
        >
        <Space direction="vertical" size={4} style={{ width: "100%" }}>
            <Text type="secondary">Last saved</Text>
            <Text strong>{formatDate(doc.lastSavedAt)}</Text>
        </Space>
        </Card>
    );
}
