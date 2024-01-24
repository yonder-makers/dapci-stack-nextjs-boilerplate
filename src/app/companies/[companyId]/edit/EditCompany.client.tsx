'use client';

import {
  CompanyGeneralForm,
  FormFields,
} from '@/components/forms/CompanyGeneralForm';
import { Space, Breadcrumb, Typography, Card } from 'antd';
import { InferGetServerSidePropsType } from 'next';
import { getServerSideProps } from 'next/dist/build/templates/pages';
import Link from 'next/link';

type Props = {
  company: {
    id: string;
    name: string;
    numberOfUsers: number;
  };
};

export function EditCompany(props: Props) {
  const { company } = props;

  const breadCrumbItems = [
    { title: <Link href="/">Home</Link> },
    { title: <Link href="/companies">Companies</Link> },
    { title: `${company.name}` },
  ];

  return (
    <Space direction="vertical" size={16} className="w-full">
      <Breadcrumb items={breadCrumbItems} />
      <Typography.Title level={2}>Edit {company.name}</Typography.Title>
      <Card title="General info" size="small">
        <CompanyGeneralForm companyId={company.id} initialState={company} />
      </Card>
      <Card title="Members" size="small">
        <Link href={`/companies/${company.id}/users`}>
          Manage {company.numberOfUsers} members
        </Link>
      </Card>
    </Space>
  );
}
