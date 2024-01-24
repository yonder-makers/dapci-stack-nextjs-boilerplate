'use client';

import {
  Breadcrumb,
  Button,
  Card,
  Flex,
  Input,
  Space,
  Table,
  Typography,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import Link from 'next/link';
import { useMemo, useState } from 'react';

export type Company = {
  id: string;
  name: string;
  createdAt: string;
  numberOfUsers: number;
};

type Props = {
  companies: Company[];
};

export function Companies(props: Props) {
  const companies = props.companies;

  const [searchText, setSearchText] = useState('');

  const filteredCompanies = useMemo(() => {
    return companies.filter((company) =>
      company.name.toLowerCase().includes(searchText.toLowerCase()),
    );
  }, [searchText, companies]);

  const breadCrumbItems = [
    { title: <Link href="/">Home</Link> },
    { title: `Companies` },
  ];

  return (
    <Space direction="vertical" size={16} className="w-full">
      <Breadcrumb items={breadCrumbItems} />
      <Typography.Title level={2}>Manage companies</Typography.Title>

      <Flex justify="space-between" align="center" gap="large">
        <Input.Search
          onInput={(e) => setSearchText((e.target as any).value)}
          style={{ maxWidth: 300 }}
        />
        <Link href="/companies/create">
          <Button type="primary">Create</Button>
        </Link>
      </Flex>
      <CompaniesList companies={filteredCompanies} />
    </Space>
  );
}

const columns: ColumnsType<Company> = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => a.name.localeCompare(b.name),
  },
  {
    title: 'Users',
    dataIndex: 'numberOfUsers',
    key: 'numberOfUsers',
    sorter: true,
    render: (numberOfUsers, record) => (
      <Link href={`/companies/${record.id}/users`}>{numberOfUsers} users</Link>
    ),
  },
  {
    title: 'Created at',
    dataIndex: 'createdAt',
    key: 'createdAt',
  },
  {
    title: '',
    key: 'action',
    render: (_, record) => (
      <Link href={`/companies/${record.id}/edit`}>edit</Link>
    ),
  },
];

type CompaniesListProps = {
  companies: Company[];
};

function CompaniesList(props: CompaniesListProps) {
  const employees = props.companies;

  return (
    <Card size="small">
      <Table
        size="small"
        rowKey="id"
        columns={columns}
        dataSource={employees}
      />
    </Card>
  );
}
