'use client';

import { deleteTodoList } from '@/actions/todo-list.actions';
import { useNotifications } from '@/providers/notification.providers';
import {
  Breadcrumb,
  Button,
  Card,
  Flex,
  Input,
  Popconfirm,
  Space,
  Table,
  Typography,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import Link from 'next/link';
import { useMemo, useState } from 'react';

type TodoList = {
  id: string;
  name: string;
  createdAt: string;
  numberOfItems: number;
};

type TodoListProps = {
  lists: TodoList[];
};

export function TodoLists(props: TodoListProps) {
  const notifications = useNotifications();

  const [lists, setLists] = useState(props.lists);
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

  async function deleteItem(item: TodoList) {
    try {
      const response = await deleteTodoList(item.id);
      setLists(lists.filter((list) => list.id !== response.id));
      notifications.success(`Todo list "${item.name}" has been deleted.`);
    } catch (error) {
      notifications.error("Couldn't delete todo list");
    }
  }

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
      <TodoListTable lists={filteredLists} onDeleteItem={deleteItem} />
    </Space>
  );
}

function getColumns(onDeleteItem: (item: TodoList) => void) {
  const columns: ColumnsType<TodoList> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, record) => (
        <Link href={`/todo-lists/${record.id}`}>{text}</Link>
      ),
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
        <Flex justify="end" align="center">
          <Link href={`/todo-lists/${record.id}/edit`}>edit</Link>
          <Popconfirm
            title="Are you sure to delete this todo list?"
            onConfirm={() => {
              onDeleteItem(record);
            }}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              delete
            </Button>
          </Popconfirm>
        </Flex>
      ),
    },
  ];
  return columns;
}

type TodoListTableProps = {
  lists: TodoList[];
  onDeleteItem: (item: TodoList) => void;
};

function TodoListTable(props: TodoListTableProps) {
  const employees = props.lists;

  return (
    <Card size="small">
      <Table
        size="small"
        rowKey="id"
        columns={getColumns(props.onDeleteItem)}
        dataSource={employees}
      />
    </Card>
  );
}
