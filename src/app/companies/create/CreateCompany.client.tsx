'use client';

import { CompanyGeneralForm } from '@/components/forms/CompanyGeneralForm';
import { Space, Breadcrumb, Typography, Card } from 'antd';
import Link from 'next/link';

export function CreateCompany() {
  const breadCrumbItems = [
    { title: <Link href="/">Home</Link> },
    { title: <Link href="/companies">Companies</Link> },
    { title: 'Create' },
  ];

  return (
    <Space direction="vertical" size={16} className="w-full">
      <Breadcrumb items={breadCrumbItems} />
      <Typography.Title level={2}>Create company</Typography.Title>
      <Card title="General info" size="small">
        <CompanyGeneralForm initialState={{ name: '' }} />
      </Card>
    </Space>
  );
}
