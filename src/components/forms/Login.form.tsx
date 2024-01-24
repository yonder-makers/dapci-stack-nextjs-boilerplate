'use client';
import { useNotifications } from '@/providers/notification.providers';
import { Button, Checkbox, Form, Input } from 'antd';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChangeEvent, useState } from 'react';

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

export const LoginForm = () => {
  const [form] = Form.useForm();

  const router = useRouter();
  const notifications = useNotifications();

  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl') || '/my-profile';

  async function onSubmit(values: FieldType) {
    try {
      setLoading(true);

      const res = await signIn('credentials', {
        redirect: false,
        email: values.username,
        password: values.password,
        callbackUrl,
      });

      setLoading(false);

      if (!res?.error) {
        router.refresh();
      } else {
        notifications.error(
          'Wrong credentials. Check your username or password.',
        );
      }
    } catch (error: any) {
      notifications.error('Something went wrong');
    } finally {
      setLoading(false);
      form.setFieldValue('password', '');
    }
  }

  return (
    <Form
      name="login-form"
      form={form}
      layout="vertical"
      style={{ maxWidth: 400, width: '90%' }}
      initialValues={{ remember: true }}
      onFinish={onSubmit}
      autoComplete="off"
    >
      <Form.Item<FieldType>
        label="Username"
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item<FieldType> name="remember" valuePropName="checked">
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 0, span: 16 }}>
        <Button type="primary" htmlType="submit" loading={loading}>
          Login
        </Button>
      </Form.Item>
    </Form>
  );
};
