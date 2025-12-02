import { Button, Card, Divider, Form, Input, Typography } from 'antd'
import { MailOutlined, LockOutlined, GoogleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { ModalSignUpComponent } from './ModalSIgnInComponent';
import { useEffect, useState } from 'react';

const { Title, Text, Link } = Typography;



export const LoginCard = () => {

    const navigate = useNavigate();
    const login   = useAuthStore( (state) => state.login );
    const [form] = Form.useForm();

    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        form.setFieldsValue({
            email: 'prueba@hola.com',
            password: '123456'
        });
    }, []);

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

    const handleLogin = async () => {
        const values = await form.validateFields();

        if ( values?.errorFields?.length > 0 ) {
            return;
        }

        const user = {
            email: values.email,
            password: values.password
        };

        const resp = await login(user);

        if ( resp ) {
            form.resetFields();
            navigate('/app');
        }
    };

    const devLogin = () => {
        // login('dev-token');   
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

            <Form
                form={form}
                layout="vertical"
                name="login_form"
                initialValues={{ remember: true }}
            >
                <Form.Item
                    name="email"
                    rules={[
                        { required: true, message: 'Por favor, ingresa tu correo electrónico' },
                        { type: 'email', message: 'El formato de correo electrónico no es válido.' },
                    ]}
                    hasFeedback
                >
                    <Input
                        prefix={<MailOutlined />}
                        placeholder="Correo electrónico"
                        size="large"
                    />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[
                        { required: true, message: 'Por favor, ingresa tu contraseña' },
                    ]}
                    hasFeedback
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Contraseña"
                        size="large"
                    />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0 }}>
                    <Button 
                        type="primary" 
                        htmlType="submit" 
                        block size="large"
                        onClick={handleLogin}
                    >
                        Iniciar sesión
                    </Button>
                </Form.Item>
            </Form>


            {/* Google sign-in */}
            {/* <Divider plain style={{ margin: '24px 0' }}>
                o
            </Divider> */}

            {/* <Button
                block
                icon={<GoogleOutlined />}
                // style={{ height: 40, marginBottom: 24 }}
                size="large"
                onClick={devLogin}
            >
                Inicia sesión con Google
            </Button> */}

            {/* Footer links */}
            <div
                style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 12,
                }}
            >
                <Text>
                    ¿No tienes cuenta? <Link href="#" onClick={() => setIsModalVisible(true)}>Regístrate</Link>
                </Text>
                <Link href="#">¿Olvidaste tu contraseña?</Link>
            </div>

            <ModalSignUpComponent
                open={isModalVisible}
                setOpen={setIsModalVisible}
            />
        </Card>
    )
}
