'use client';

import { UserGeneralForm } from '@/components/forms/UserGeneralForm';
import { Space, Breadcrumb, Typography, Card } from 'antd';
import Link from 'next/link';

type Props = {
  company: {
    id: string;
    name: string;
  };
};
export function CreateUser(props: Props) {
  const company = props.company;

  const breadCrumbItems = [
    { title: <Link href="/">Home</Link> },
    { title: <Link href="/companies">Companies</Link> },
    {
      title: <Link href={`/companies/${company.id}/edit`}>{company.name}</Link>,
    },
    { title: <Link href={`/companies/${company.id}/users`}>Users</Link> },
    { title: 'Create' },
  ];

  return (
    <Space direction="vertical" size={16} className="w-full">
      <Breadcrumb items={breadCrumbItems} />
      <Typography.Title level={2}>Create user</Typography.Title>
      <Card title="General info" size="small">
        <UserGeneralForm
          mode="create"
          companyId={company.id}
          initialState={{
            name: '',
            email: '',
          }}
        />
      </Card>
    </Space>
  );
}
