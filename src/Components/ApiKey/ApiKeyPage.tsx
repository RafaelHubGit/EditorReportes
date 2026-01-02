import React, { useState } from 'react';
import { 
  Card, 
  Typography, 
  Input, 
  Button, 
  Tag, 
  Space, 
  App, 
  Modal,
  message
} from 'antd';
import { 
  CopyOutlined, 
  ReloadOutlined, 
  KeyOutlined 
} from '@ant-design/icons';

const { Title, Text } = Typography;

interface Props {
    title: string;
    type: string;
    value: string;
    onRegenerate: () => void;
}

// --- Sub-Component: API Key Card ---
const ApiKeyCard = ({ title, type, value, onRegenerate }: Props) => {

  // Design Config based on type
  const isProd = type === 'prod';
  const accentColor = isProd ? '#722ed1' : '#1890ff'; // Purple for Prod, Blue for Dev
  const badgeColor = isProd ? 'purple' : 'blue';

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    message.success('API Key copied to clipboard!');
  };

  const confirmRegenerate = () => {
    Modal.confirm({
      title: 'Are you sure you want to regenerate this key?',
      icon: <ReloadOutlined style={{ color: 'red' }} />,
      content: 'The current key will stop working immediately. You will need to update all your applications.',
      okText: 'Yes, Regenerate',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        onRegenerate();
        message.success('New API Key generated successfully');
      },
    });
  };

  return (
    <Card
      style={{ 
        marginBottom: 24, 
        borderLeft: `5px solid ${accentColor}` // Replicates your "Folder" design
      }}
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <KeyOutlined style={{ color: accentColor }} />
            <Text strong style={{ fontSize: 16 }}>{title}</Text>
          </Space>
          {isProd && <Tag color={badgeColor}>LIVE</Tag>}
        </div>
      }
    >
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <Text type="secondary">
          {isProd 
            ? "Use this key for live production transactions." 
            : "Use this key for testing and development only."}
        </Text>

        <Space.Compact style={{ width: '100%' }}>
          <Input.Password
            value={value}
            readOnly
            size="large"
            bordered={true}
            style={{ fontFamily: 'monospace' }}
            visibilityToggle
          />
          <Button 
            size="large" 
            icon={<CopyOutlined />} 
            onClick={handleCopy}
          >
            Copy
          </Button>
        </Space.Compact>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            danger 
            icon={<ReloadOutlined />} 
            onClick={confirmRegenerate}
          >
            Regenerate Key
          </Button>
        </div>
      </Space>
    </Card>
  );
};

// --- Main Page Component ---
export const ApiKeyPage = () => {
  // Mock State
  const [devKey, setDevKey] = useState("pk_test_51MzQ8sL9s...");
  const [prodKey, setProdKey] = useState("sk_live_99NzQ1xL2x...");

  return (
    // <App> is required in Ant Design 5.x for message/modal hooks to work
    <div
        style={{
            overflow: 'auto'
        }}
    >
      <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Header Section */}
        <div style={{ marginBottom: 32 }}>
          <Title level={2} style={{ margin: 0 }}>API Keys</Title>
          <Text type="secondary">Manage your API keys for Development and Production environments.</Text>
        </div>

        {/* 1. Dev Key Card */}
        <ApiKeyCard 
          title="Development Key"
          type="dev"
          value={devKey}
          onRegenerate={() => setDevKey(`pk_test_${Math.random().toString(36).substr(2, 9)}`)}
        />

        {/* 2. Prod Key Card */}
        <ApiKeyCard 
          title="Production Key"
          type="prod"
          value={prodKey}
          onRegenerate={() => setProdKey(`sk_live_${Math.random().toString(36).substr(2, 9)}`)}
        />
        
      </div>
    </div>
  );
};