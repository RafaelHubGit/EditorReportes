import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { GraphQLService } from '../graphql/graphql.service';
import { CHANGE_PASSWORD } from '../graphql/operations/graphql.auth.operations';
import Swal from 'sweetalert2';

const { Title } = Typography;

export const ChangePasswordComponent = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      
      // Simulación de petición
      const result = await GraphQLService.mutate(CHANGE_PASSWORD, { oldPassword: values.oldPassword, newPassword: values.newPassword });

      if (result?.error) {
        Swal.fire({
          icon: 'error',
          title: 'Error al cambiar contraseña',
          text: 'La contraseña actual no coincide o es inválida.',
          confirmButtonColor: '#1890ff'
        });
        return;
      };
      
      message.success('Contraseña actualizada correctamente');
      form.resetFields();
    } catch (error) {
      message.error('Error al actualizar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ maxWidth: 400, margin: '20px auto', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <Title level={3} style={{ textAlign: 'center' }}>Cambiar Contraseña</Title>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
      >
        {/* Contraseña Actual */}
        <Form.Item
          label="Contraseña Actual"
          name="oldPassword"
          rules={[{ required: true, message: 'Ingresa tu contraseña actual' }]}
        >
          <Input.Password 
            prefix={<LockOutlined />} 
            placeholder="Contraseña actual" 
          />
        </Form.Item>

        {/* Nueva Contraseña */}
        <Form.Item
          label="Nueva Contraseña"
          name="newPassword"
          rules={[
            { required: true, message: 'Ingresa tu nueva contraseña' },
            { min: 6, message: 'Debe tener al menos 8 caracteres' }
          ]}
          hasFeedback
        >
          <Input.Password 
            prefix={<LockOutlined />} 
            placeholder="Nueva contraseña" 
          />
        </Form.Item>

        {/* Confirmar Nueva Contraseña */}
        <Form.Item
          label="Confirmar Nueva Contraseña"
          name="confirmPassword"
          dependencies={['newPassword']}
          hasFeedback
          rules={[
            { required: true, message: 'Confirma tu nueva contraseña' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Las contraseñas no coinciden'));
              },
            }),
          ]}
        >
          <Input.Password 
            prefix={<LockOutlined />} 
            placeholder="Repite la nueva contraseña" 
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Actualizar Contraseña
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
