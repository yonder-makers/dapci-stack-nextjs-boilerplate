'use client';
import { createUser, updateUser } from '@/actions/user.actions';
import { useNotifications } from '@/providers/notification.providers';
import { Button, Form, Input } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export type FormFields = {
  name: string;
  email: string;
  password?: string;
};

type PropsModes =
  | {
      companyId: string;
      mode: 'create';
    }
  | {
      userId: string;
      mode: 'edit';
    };

type UserGeneralFormProps = {
  initialState: FormFields;
} & PropsModes;

export function UserGeneralForm(props: UserGeneralFormProps) {
  const notifications = useNotifications();

  const [isLoading, setIsLoading] = useState(false);
  const [formState, setFormState] = useState(props.initialState);

  const router = useRouter();

  async function onFinish(e: React.FormEvent) {
    setIsLoading(true);

    try {
      if (props.mode === 'create') {
        const body = {
          ...formState,
          password: formState.password!,
        };

        const user = await createUser(props.companyId, body);
        notifications.success('User created');
        router.push(`/companies/${props.companyId}/users/${user.id}/edit`);
      } else {
        const body = {
          ...formState,
          password: formState.password!,
        };

        await updateUser(props.userId, body);
        notifications.success('User updated');
      }
    } catch (error) {
      console.error(error);
      notifications.error("Couldn't save user");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form
      name="user-general-form"
      layout="vertical"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={props.initialState}
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item<FormFields>
        label="Name"
        name="name"
        rules={[{ required: true, message: 'Please insert name' }]}
      >
        <Input
          value={formState.name}
          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
        />
      </Form.Item>
      <Form.Item<FormFields>
        label="Email"
        name="email"
        rules={[{ required: true, message: 'Please insert valid email' }]}
      >
        <Input
          value={formState.email}
          onChange={(e) =>
            setFormState({ ...formState, email: e.target.value })
          }
        />
      </Form.Item>
      {props.mode === 'edit' ? null : (
        <Form.Item<FormFields>
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please insert text' }]}
        >
          <Input.Password
            value={formState.password}
            onChange={(e) =>
              setFormState({ ...formState, password: e.target.value })
            }
          />
        </Form.Item>
      )}

      <Form.Item wrapperCol={{ span: 16 }}>
        <Button type="primary" loading={isLoading} htmlType="submit">
          Save
        </Button>
      </Form.Item>
    </Form>
  );
}
