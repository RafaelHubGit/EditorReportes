import { Modal, Form, Input, Button } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { useAuthStore } from '../store/useAuthStore';


interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export const ModalSignUpComponent = ({ open, setOpen }: Props) => {
  const [form] = Form.useForm();

  const register = useAuthStore( (state) => state.register );

  const handleOk = async () => {
    const values = await form.validateFields();

    if ( values?.errorFields?.length > 0 ) {
      return;
    }

    const user = {
      name: values.name,
      email: values.email,
      password: values.password
    };
    
    const resp = await register(user);
    

    if ( resp ) {
      form.resetFields();
      setOpen(false);
    }
    
  };

  const handleCancel = () => {
    form.resetFields();
    setOpen(false);
  };

  return (
    <Modal
      title="Registro"
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Cancelar
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Registrar
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        name="sign_up_form"
        initialValues={{ remember: true }}
      >
        <Form.Item
          name="name"
          label="Nombre"
          rules={[
            {
              required: true,
              message: 'Por favor, ingresa tu nombre.',
            },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="Tu nombre" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Correo Electrónico"
          rules={[
            {
              required: true,
              message: 'Por favor, ingresa tu correo electrónico.',
            },
            {
              type: 'email',
              message: 'El formato de correo electrónico no es válido.',
            },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="tu.email@ejemplo.com" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Contraseña"
          rules={[
            {
              required: true,
              message: 'Por favor, ingresa tu contraseña.',
            },
          ]}
          hasFeedback
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Contraseña" />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="Verificar Contraseña"
          dependencies={['password']} 
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Por favor, confirma tu contraseña.',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('¡Las dos contraseñas que ingresaste no coinciden!')
                );
              },
            }),
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Repetir contraseña" />
        </Form.Item>
      </Form>
    </Modal>
  );
};