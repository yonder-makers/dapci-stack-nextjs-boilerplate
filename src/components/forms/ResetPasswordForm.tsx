'use client';

import { resetPassword } from '@/actions/user.actions';
import { useNotifications } from '@/providers/notification.providers';
import { Button, Form, Input } from 'antd';
import { useState } from 'react';

export type FormFields = {
  password: string;
};

type ResetPasswordFormProps = {
  userId: string;
};

export function ResetPasswordForm(props: ResetPasswordFormProps) {
  const notifications = useNotifications();

  const [isLoading, setIsLoading] = useState(false);

  async function onFinish(values: FormFields) {
    setIsLoading(true);

    try {
      await resetPassword(props.userId, values.password);
      notifications.success('User password changed');
    } catch (error) {
      notifications.error('Error changing password');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form<FormFields>
      name="reset-password-form"
      layout="vertical"
      style={{ maxWidth: 300 }}
      initialValues={{ password: '' }}
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item<FormFields>
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please insert password' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item wrapperCol={{ span: 16 }}>
        <Button type="primary" loading={isLoading} htmlType="submit">
          Change
        </Button>
      </Form.Item>
    </Form>
  );
}
