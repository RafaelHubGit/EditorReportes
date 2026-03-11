import { Input, Space, Typography, Button } from "antd";
import { EditOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface Props {
  name: string;
  id?: string;
  isEditing: boolean;
  onEditStart: () => void;
  onEditEnd: () => void;
  onNameChange: (name: string) => void;
}

export const DocumentTitle = ({ 
  name, 
  id, 
  isEditing, 
  onEditStart, 
  onEditEnd, 
  onNameChange 
}: Props) => (
  <Space size={0} align="start" style={{ display: 'flex', flexDirection: 'column' }}>
    {isEditing ? (
      <Input
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        onPressEnter={onEditEnd}
        onBlur={onEditEnd}
        autoFocus
        style={{ fontSize: '24px', fontWeight: 'bold', width: '300px' }}
      />
    ) : (
      <Space>
        <Title level={3} style={{ margin: 0, cursor: 'pointer' }} onClick={onEditStart}>
          {name}
        </Title>
        <Button type="text" icon={<EditOutlined />} size="small" onClick={onEditStart} />
      </Space>
    )}
    <Text type="secondary" style={{ fontSize: '14px' }}>
      {id || "Sin ID"}
    </Text>
  </Space>
);