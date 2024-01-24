'use client';
import {
  FormFields,
  TodoListGeneralForm,
} from '@/components/forms/TodoListGeneralForm';
import { Breadcrumb, Card, Space, Typography } from 'antd';
import Link from 'next/link';

type Props = {
  todoListId: string;
  initialValues: FormFields;
};

export function EditTodoList(props: Props) {
  const breadCrumbItems = [
    { title: <Link href="/">Home</Link> },
    { title: <Link href="/todo-lists">Todo lists</Link> },
    {
      title: (
        <Link href={`/todo-lists/${props.todoListId}`}>
          {props.initialValues.name}
        </Link>
      ),
    },
    { title: `Edit` },
  ];

  return (
    <Space direction="vertical" size={16} className="w-full">
      <Breadcrumb items={breadCrumbItems} />
      <Typography.Title level={2}>
        Edit {props.initialValues.name}
      </Typography.Title>
      <Card title="General info" size="small">
        <TodoListGeneralForm
          todoListId={props.todoListId}
          initialState={props.initialValues}
        />
      </Card>
    </Space>
  );
}
