import { withAuth } from '@/lib/hocs';
import prisma from '@/lib/prisma';
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
import { InferGetServerSidePropsType } from 'next';
import Link from 'next/link';
import { useMemo, useState } from 'react';

type PageParams = { companyId: string };

export const getServerSideProps = withAuth(
  'ADMIN',
  async function (user, params: PageParams) {
    const companyId = params.companyId;

    const company = await prisma.company.findUnique({
      where: {
        id: companyId,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!company) {
      throw new Error('Company not found');
    }

    const users = await prisma.user.findMany({
      where: {
        companyId: companyId,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return { company, users };
  },
);

export default function Page(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
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
      <UsersList users={filteredUsers} />
    </Space>
  );
}

type User = {
  id: string;
  name: string;
  email: string;
};

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
      <Link href={`/companies/${record.id}/edit`}>edit</Link>
    ),
  },
];

type UsersListProps = {
  users: User[];
};

function UsersList(props: UsersListProps) {
  const users = props.users;

  return (
    <Card size="small">
      <Table size="small" rowKey="id" columns={columns} dataSource={users} />
    </Card>
  );
}
