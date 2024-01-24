'use client';

import {
  Space,
  Breadcrumb,
  Input,
  Typography,
  Flex,
  Button,
  Card,
  Table,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import Link from 'next/link';
import { useState, useMemo } from 'react';

export type User = {
  id: string;
  name: string;
  email: string;
};

type Props = {
  company: {
    id: string;
    name: string;
  };
  users: User[];
};

export function CompanyUsers(props: Props) {
  const company = props.company;
  const users = props.users;

  const [searchText, setSearchText] = useState('');

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      user.name.toLowerCase().includes(searchText.toLowerCase()),
    );
  }, [searchText, users]);

  const breadCrumbItems = [
    { title: <Link href="/">Home</Link> },
    { title: <Link href="/companies">Companies</Link> },
    {
      title: <Link href={`/companies/${company.id}/edit`}>{company.name}</Link>,
    },
    { title: 'Users' },
  ];

  return (
    <Space direction="vertical" size={16} className="w-full">
      <Breadcrumb items={breadCrumbItems} />
      <Typography.Title level={2}>Manage users</Typography.Title>

      <Flex justify="space-between" align="center" gap="large">
        <Input.Search
          onInput={(e) => setSearchText((e.target as any).value)}
          style={{ maxWidth: 300 }}
        />
        <Link href={`/companies/${company.id}/users/create`}>
          <Button type="primary">Create</Button>
        </Link>
      </Flex>
      <UsersList companyId={company.id} users={filteredUsers} />
    </Space>
  );
}

function getColumns(companyId: string) {
  const columns: ColumnsType<User> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: '',
      key: 'action',
      render: (_, record) => (
        <Link href={`/companies/${companyId}/users/${record.id}/edit`}>
          edit
        </Link>
      ),
    },
  ];

  return columns;
}

type UsersListProps = {
  companyId: string;
  users: User[];
};

function UsersList(props: UsersListProps) {
  const users = props.users;
  const columns = getColumns(props.companyId);

  return (
    <Card size="small">
      <Table size="small" rowKey="id" columns={columns} dataSource={users} />
    </Card>
  );
}
