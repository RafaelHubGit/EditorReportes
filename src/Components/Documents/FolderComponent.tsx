import React from "react";
import { Card, Button, Space, Typography } from "antd";
import { FolderOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Text } = Typography;

type Props = {
    id: string;
    name: string;
    to?: string; // defaults to /app/folders/:id
};

export const FolderComponent = ( { id, name, to } : Props) => {
    const linkTo = to ?? `/app/folders/${id}`;

    return (
        <Card
        hoverable
        bordered
        style={{ borderRadius: 12, boxShadow: "0 4px 14px rgba(0,0,0,0.08)" }}
        bodyStyle={{ padding: 16 }}
        >
        <Space align="center" size={12} style={{ width: "100%", justifyContent: "space-between" }}>
            <Space align="center" size={12}>
            <FolderOutlined style={{ fontSize: 24 }} />
            <Text strong>{name}</Text>
            </Space>

            <Link to={linkTo}>
            <Button type="primary" icon={<ArrowRightOutlined />}>
                Open
            </Button>
            </Link>
        </Space>
        </Card>
    );
}
