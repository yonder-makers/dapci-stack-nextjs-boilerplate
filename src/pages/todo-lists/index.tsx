import { withAuth } from '@/lib/hocs';
import prisma from '@/lib/prisma';
import { formatRelativeDate } from '@/lib/utils';
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

export const getServerSideProps = withAuth('ADMIN', async function (session) {
  const companyId = session!.companyId;

  const lists = await prisma.todoList.findMany({
    where: {
      companyId,
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
      _count: {
        select: {
          items: true,
        },
      },
    },
  });

  const flatLists = lists.map((l) => {
    return {
      id: l.id,
      name: l.name,
      createdAt: formatRelativeDate(l.createdAt),
      numberOfItems: l._count.items,
    };
  });

  return {
    lists: flatLists,
  };
});

export default function Page(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  const lists = props.lists;

  const [searchText, setSearchText] = useState('');

  const filteredLists = useMemo(() => {
    return lists.filter((list) =>
      list.name.toLowerCase().includes(searchText.toLowerCase()),
    );
  }, [searchText, lists]);

  const breadCrumbItems = [
    { title: <Link href="/">Home</Link> },
    { title: `Todo lists` },
  ];

  return (
    <Space direction="vertical" size={16} className="w-full">
      <Breadcrumb items={breadCrumbItems} />
      <Typography.Title level={2}>Manage todo lists</Typography.Title>

      <Flex justify="space-between" align="center" gap="large">
        <Input.Search
          onInput={(e) => setSearchText((e.target as any).value)}
          style={{ maxWidth: 300 }}
        />
        <Link href="/todo-lists/create">
          <Button type="primary">Create</Button>
        </Link>
      </Flex>
      <TodoListTable lists={filteredLists} />
    </Space>
  );
}

type TodoList = {
  id: string;
  name: string;
  createdAt: string;
  numberOfItems: number;
};

const columns: ColumnsType<TodoList> = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => a.name.localeCompare(b.name),
  },
  {
    title: 'Items',
    dataIndex: 'numberOfItems',
    key: 'numberOfItems',
    sorter: true,
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
      <Link href={`/todo-lists/${record.id}/edit`}>edit</Link>
    ),
  },
];

type TodoListTableProps = {
  lists: TodoList[];
};

function TodoListTable(props: TodoListTableProps) {
  const employees = props.lists;

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
