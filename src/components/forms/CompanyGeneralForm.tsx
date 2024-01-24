import { createCompany, updateCompany } from '@/actions/company.actions';
import { useNotifications } from '@/providers/notification.providers';
import { Button, Form, Input } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export type FormFields = {
  name: string;
};

export function CompanyGeneralForm(props: {
  companyId?: string;
  initialState: FormFields;
}) {
  const [form] = Form.useForm();
  const notifications = useNotifications();

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  async function onFinish(values: FormFields) {
    setIsLoading(true);

    try {
      if (props.companyId === undefined) {
        const company = await createCompany(values);
        notifications.success('Company created');

        router.push(`/companies/${company.id}/edit`);
      } else {
        const company = await updateCompany(props.companyId, values);
        form.setFieldsValue(company);
        notifications.success('Company updated');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form
      name="company-general-form"
      form={form}
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
        <Input />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 0, span: 16 }}>
        <Button type="primary" loading={isLoading} htmlType="submit">
          Save
        </Button>
      </Form.Item>
    </Form>
  );
}
