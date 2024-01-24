'use client';

import { Space, Typography, List, Card } from 'antd';

export type TodoList = {
  id: string;
  name: string;
  companyName: string;
  numberOfItems: number;
};

type Props = {
  todoLists: TodoList[];
};

export function HomePage(props: Props) {
  const { todoLists } = props;

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
        dataSource={todoLists}
        renderItem={(item) => (
          <List.Item>
            <TodoListContent todoList={item} />
          </List.Item>
        )}
      />
    </Space>
  );
}

function TodoListContent({ todoList }: { todoList: TodoList }) {
  return (
    <Card title={todoList.name}>
      <p>Company: {todoList.companyName}</p>
      <p>Number of items: {todoList.numberOfItems}</p>
    </Card>
  );
}
