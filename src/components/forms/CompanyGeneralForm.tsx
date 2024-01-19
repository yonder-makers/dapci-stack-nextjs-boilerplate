import { createCompany, updateCompany } from '@/lib/apis/company.api';
import { useNotifications } from '@/providers/notification.providers';
import { Button, Form, Input } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type FormFields = {
  id?: string;
  name: string;
};

export function CompanyGeneralForm(props: { initialState: FormFields }) {
  const notifications = useNotifications();

  const [isLoading, setIsLoading] = useState(false);
  const [formState, setFormState] = useState<FormFields>(props.initialState);

  const router = useRouter();

  async function onFinish(e: React.FormEvent) {
    setIsLoading(true);

    try {
      if (formState.id === undefined) {
        const company = await createCompany(formState.name);
        notifications.success('Company created');

        router.push(`/companies/${company.id}/edit`);
      } else {
        const company = await updateCompany(formState.id, formState.name);
        setFormState(company);
        notifications.success('Company updated');
      }
    } finally {
      setIsLoading(false);
    }
  }

  function onFinishFailed() {
    console.log('finish failed');
  }

  return (
    <Form
      name="company-general-form"
      layout="vertical"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={formState}
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

      <Form.Item wrapperCol={{ offset: 0, span: 16 }}>
        <Button type="primary" loading={isLoading} htmlType="submit">
          Save
        </Button>
      </Form.Item>
    </Form>
  );
}
