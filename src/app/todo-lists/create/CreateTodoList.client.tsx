'use client';
import { TodoListGeneralForm } from '@/components/forms/TodoListGeneralForm';
import { Breadcrumb, Card, Space, Typography } from 'antd';
import Link from 'next/link';

export function CreateTodoList() {
  const breadCrumbItems = [
    { title: <Link href="/">Home</Link> },
    { title: <Link href="/todo-lists">Todo lists</Link> },
    { title: 'Create' },
  ];

  return (
    <Space direction="vertical" size={16} className="w-full">
      <Breadcrumb items={breadCrumbItems} />
      <Typography.Title level={2}>Create todo list</Typography.Title>
      <Card title="General info" size="small">
        <TodoListGeneralForm initialState={{ name: '' }} />
      </Card>
    </Space>
  );
}
