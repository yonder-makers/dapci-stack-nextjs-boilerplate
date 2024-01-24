'use client';

import { ResetPasswordForm } from '@/components/forms/ResetPasswordForm';
import { UserGeneralForm } from '@/components/forms/UserGeneralForm';
import { Breadcrumb, Card, Space, Typography } from 'antd';
import Link from 'next/link';

type Props = {
  company: {
    id: string;
    name: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
  };
};
export function EditUser(props: Props) {
  const company = props.company;
  const user = props.user;

  const breadCrumbItems = [
    { title: <Link href="/">Home</Link> },
    { title: <Link href="/companies">Companies</Link> },
    {
      title: <Link href={`/companies/${company.id}/edit`}>{company.name}</Link>,
    },
    { title: <Link href={`/companies/${company.id}/users`}>Users</Link> },
    {
      title: (
        <Link href={`/companies/${company.id}/users/${user.id}/edit`}>
          {user.name}
        </Link>
      ),
    },
    { title: 'Edit' },
  ];

  return (
    <Space direction="vertical" size={16} className="w-full">
      <Breadcrumb items={breadCrumbItems} />
      <Typography.Title level={2}>Edit user</Typography.Title>
      <Card title="General info" size="small">
        <UserGeneralForm
          mode="edit"
          userId={user.id}
          initialState={{
            name: user.name,
            email: user.email,
          }}
        />
      </Card>
      <Card title="Reset password" size="small">
        <ResetPasswordForm userId={user.id} />
      </Card>
    </Space>
  );
}
