import { createUser, updateUser } from '@/lib/apis/user.api';
import { useNotifications } from '@/providers/notification.providers';
import { Button, Form, Input } from 'antd';
import { useRouter } from 'next/router';
import { useState } from 'react';

export type FormFields = {
  id?: string;
  name: string;
  email: string;
  password?: string;
};

type UserGeneralFormProps = {
  companyId: string;
  initialState: FormFields;
};
export function UserGeneralForm(props: UserGeneralFormProps) {
  const { companyId } = props;
  const notifications = useNotifications();

  const [isLoading, setIsLoading] = useState(false);
  const [formState, setFormState] = useState(props.initialState);

  const isEdit = !!formState.id;

  const router = useRouter();

  async function onFinish(e: React.FormEvent) {
    setIsLoading(true);

    try {
      if (!isEdit) {
        const user = await createUser(companyId, formState);
        notifications.success('User created');
        router.push(`/companies/${companyId}/users/${user.id}/edit`);
      } else {
        await updateUser(companyId, props.initialState.id!, formState);
        notifications.success('User updated');
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }

  function onFinishFailed() {
    console.log('finish failed');
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
      onFinishFailed={onFinishFailed}
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
      {isEdit ? null : (
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
