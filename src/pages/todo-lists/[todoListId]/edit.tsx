import { TodoListGeneralForm } from '@/components/forms/TodoListGeneralForm';
import { withAuth } from '@/lib/hocs';
import prisma from '@/lib/prisma';
import { Breadcrumb, Card, Space, Typography } from 'antd';
import { InferGetServerSidePropsType } from 'next';
import Link from 'next/link';

type PageParams = { todoListId: string };

export const getServerSideProps = withAuth(
  'ADMIN',
  async function (session, params: PageParams) {
    const companyId = session!.companyId;

    const todoList = await prisma.todoList.findFirst({
      where: {
        id: params.todoListId,
        companyId,
      },
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            items: true,
          },
        },
      },
    });

    if (!todoList) {
      throw new Error('Todo list not found');
    }

    return {
      todoList: {
        id: todoList.id,
        name: todoList.name,
        numberOfItems: todoList._count.items,
      },
    };
  },
);

export default function Page(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  const { todoList } = props;

  const breadCrumbItems = [
    { title: <Link href="/">Home</Link> },
    { title: <Link href="/todo-lists">Todo lists</Link> },
    { title: <Link href={`/todo-lists/${todoList.id}`}>{todoList.name}</Link> },
    { title: `Edit` },
  ];

  return (
    <Space direction="vertical" size={16} className="w-full">
      <Breadcrumb items={breadCrumbItems} />
      <Typography.Title level={2}>Edit {todoList.name}</Typography.Title>
      <Card title="General info" size="small">
        <TodoListGeneralForm todoListId={todoList.id} initialState={todoList} />
      </Card>
      <Card title="Todo items" size="small">
        <Link href={`/todo-lists/${todoList.id}`}>
          Manage {todoList.numberOfItems} items
        </Link>
      </Card>
    </Space>
  );
}
