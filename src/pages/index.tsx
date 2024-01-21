import { withAuth } from '@/lib/hocs';
import prisma from '@/lib/prisma';
import { Card, List, Space, Typography } from 'antd';
import { InferGetServerSidePropsType } from 'next';

export const getServerSideProps = withAuth('ANONYMOUS', async function () {
  // list of todoLists
  const todoLists = await prisma.todoList.findMany({
    select: {
      id: true,
      name: true,
      company: {
        select: {
          id: true,
          name: true,
        },
      },
      _count: {
        select: {
          items: true,
        },
      },
    },
  });

  const flatList = todoLists.map<TodoList>((l) => {
    return {
      id: l.id,
      name: l.name,
      companyName: l.company.name,
      numberOfItems: l._count.items,
    };
  });

  return {
    todoLists: flatList,
  };
});

export default function Page(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Typography.Title level={2}>Welcome</Typography.Title>
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 1,
          lg: 2,
          xl: 3,
          xxl: 2,
        }}
        dataSource={props.todoLists}
        renderItem={(item) => (
          <List.Item>
            <TodoListContent todoList={item} />
          </List.Item>
        )}
      />
    </Space>
  );
}

type TodoList = {
  id: string;
  name: string;
  companyName: string;
  numberOfItems: number;
};

function TodoListContent({ todoList }: { todoList: TodoList }) {
  return (
    <Card title={todoList.name}>
      <p>Company: {todoList.companyName}</p>
      <p>Number of items: {todoList.numberOfItems}</p>
    </Card>
  );
}
