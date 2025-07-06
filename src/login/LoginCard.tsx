import { Button, Card, Divider, Form, Input, Typography } from 'antd'
import { MailOutlined, LockOutlined, GoogleOutlined } from '@ant-design/icons';

const { Title, Text, Link } = Typography;



export const LoginCard = () => {

    const [form] = Form.useForm();

    const handleFinish = (values: any) => {
        // Replace with your auth logic
        console.log('Login form values:', values);
    };

    return (
        <Card
            bordered={false}
            style={{ width: 360, maxWidth: '100%' }}
            bodyStyle={{ padding: 32 }}
        >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 24 }}>
            {/* Tiny icon — swap for your own asset if you wish */}
            <span
                style={{
                    width: 32,
                    height: 32,
                    backgroundColor: '#4F90FF',
                    borderRadius: 8,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                }}
            >
                <span style={{ fontSize: 20, color: '#fff' }}>≡</span>
            </span>
            <Title level={4} style={{ margin: 0 }}>
                Generador de<br />Documentos PDF
            </Title>
        </div>

        {/* Form */}
        <Form
            form={form}
            layout="vertical"
            requiredMark={false}
            onFinish={handleFinish}
        >
            <Form.Item
            label="Correo"
            name="email"
            rules={[
                { required: true, message: 'Por favor ingresa tu correo' },
                { type: 'email', message: 'Correo inválido' },
            ]}
            >
            <Input
                prefix={<MailOutlined style={{ color: 'rgba(0,0,0,0.45)' }} />}
                placeholder="ejemplo@correo.com"
            />
            </Form.Item>

            <Form.Item
            label="Contraseña"
            name="password"
            rules={[{ required: true, message: 'Ingresa tu contraseña' }]}
            >
            <Input.Password
                prefix={<LockOutlined style={{ color: 'rgba(0,0,0,0.45)' }} />}
                placeholder="Contraseña"
            />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
            <Button type="primary" htmlType="submit" block size="large">
                Iniciar sesión
            </Button>
            </Form.Item>
        </Form>

        {/* Google sign-in */}
        <Divider plain style={{ margin: '24px 0' }}>
            o
        </Divider>

        <Button
            block
            icon={<GoogleOutlined />}
            style={{ height: 40, marginBottom: 24 }}
        >
            Inicia sesión con Google
        </Button>

        {/* Footer links */}
        <div
            style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 12,
            }}
        >
            <Text>
                ¿No tienes cuenta? <Link href="#">Regístrate</Link>
            </Text>
            <Link href="#">¿Olvidaste tu contraseña?</Link>
        </div>
        </Card>
    )
}
