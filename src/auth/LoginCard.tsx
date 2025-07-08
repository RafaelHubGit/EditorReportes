import { Button, Card, Divider, Form, Input, Typography } from 'antd'
import { MailOutlined, LockOutlined, GoogleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const { Title, Text, Link } = Typography;



export const LoginCard = () => {

    const navigate = useNavigate();
    const login   = useAuthStore.getState().login; //For moment
    const [form] = Form.useForm();

    const handleFinish = async (values: { email: string; password: string }) => {
        // const res = await api.login(values);           // your API call
        // if (res.ok) {
        //     useAuthStore.getState().login(res.token);    // <— update Zustand
        //     navigate('/app/editor');
        // } else {
        //     message.error('Credenciales incorrectas');
        // }
        navigate('/app');
    };

    const devLogin = () => {
        login('dev-token');   
        console.log("deberia pasar aca ")         // stores token + sets isAuth = true
        navigate('/app');              // jump to the protected branch
    };

    return (
        <Card
            variant="borderless"
            style={{ width: 360, maxWidth: '100%' }}
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
                Generador de<br />Documentos
            </Title>
        </div>

        {/* Form */}
        {/* <Form
            form={form}
            layout="vertical"
            requiredMark={false}
            onFinish={handleFinish}
        > */}
            {/* <Form.Item
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
            </Form.Item> */}

            <Form.Item style={{ marginBottom: 0 }}>
                <Button 
                    type="primary" 
                    htmlType="submit" 
                    block size="large"
                    onClick={devLogin}
                >
                    Iniciar sesión
                </Button>
            </Form.Item>
        {/* </Form> */}

        {/* Google sign-in */}
        <Divider plain style={{ margin: '24px 0' }}>
            o
        </Divider>

        <Button
            block
            icon={<GoogleOutlined />}
            // style={{ height: 40, marginBottom: 24 }}
            size="large"
            onClick={devLogin}
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
