import { TodoItemGeneralForm } from '@/components/forms/TodoItemGeneralForm';
import { withAuth } from '@/lib/hocs';
import prisma from '@/lib/prisma';
import {
  Avatar,
  Breadcrumb,
  Button,
  Card,
  Flex,
  Input,
  List,
  Modal,
  Space,
  Tag,
  Typography,
} from 'antd';
import { InferGetServerSidePropsType } from 'next';
import Link from 'next/link';
import { useMemo, useState } from 'react';

type PageParams = { todoListId: string };

export const getServerSideProps = withAuth(
  'ADMIN',
  async function (session, params: PageParams) {
    const companyId = session?.companyId!;

    const todoList = await prisma.todoList.findFirst({
      where: {
        id: params.todoListId,
        companyId,
      },
      select: {
        id: true,
        name: true,
        items: {
          select: {
            id: true,
            name: true,
            assignees: {
              select: {
                userId: true,
              },
            },
          },
        },
      },
    });

    if (!todoList) {
      throw new Error('Todo list not found');
    }

    const flatItems = todoList.items.map<TodoItem>((item) => {
      return {
        id: item.id,
        name: item.name,
        assigneeIds: item.assignees.map((a) => a.userId),
      };
    });

    const companyUsers = await prisma.user.findMany({
      where: {
        companyId,
      },
      select: {
        id: true,
        name: true,
      },
    });

    return {
      list: {
        id: todoList.id,
        name: todoList.name,
      },
      items: flatItems,
      companyUsers,
    };
  },
);

export default function Page(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  const todoList = props.list;
  const [todoItems, setTodoItems] = useState(props.items);

  const [searchText, setSearchText] = useState('');
  const [editingItemId, setEditingItemId] = useState<
    'new-item' | string | undefined
  >(undefined);

  const filteredItems = useMemo(() => {
    return todoItems.filter((user) =>
      user.name.toLowerCase().includes(searchText.toLowerCase()),
    );
  }, [searchText, todoItems]);

  const breadCrumbItems = [
    { title: <Link href="/">Home</Link> },
    { title: <Link href="/todo-lists">Todo lists</Link> },
    { title: todoList.name },
  ];

  return (
    <Space direction="vertical" size={16} className="w-full">
      <Breadcrumb items={breadCrumbItems} />
      <Typography.Title level={2}>Todo items</Typography.Title>

      <Flex justify="space-between" align="center" gap="large">
        <Input.Search
          onInput={(e) => setSearchText((e.target as any).value)}
          style={{ maxWidth: 300 }}
        />
        <Button type="primary" onClick={() => setEditingItemId('new-item')}>
          Create
        </Button>
      </Flex>
      <ItemsList
        listId={todoList.id}
        items={filteredItems}
        companyUsers={props.companyUsers}
        onEdit={(item) => setEditingItemId(item.id)}
      />
      <TodoItemModal
        items={todoItems}
        listId={todoList.id}
        openId={editingItemId}
        companyUsers={props.companyUsers}
        onClose={(item) => {
          setEditingItemId(undefined);

          if (item) {
            if (todoItems.find((i) => i.id === item.id)) {
              setTodoItems(todoItems.map((i) => (i.id === item.id ? item : i)));
              return;
            } else {
              setTodoItems([...todoItems, item]);
            }
          }
        }}
      />
    </Space>
  );
}

type TodoItem = {
  id: string;
  name: string;
  assigneeIds: string[];
};

type ItemsListProps = {
  listId: string;
  items: TodoItem[];
  companyUsers: { id: string; name: string }[];
  onEdit: (item: TodoItem) => void;
};

function ItemsList(props: ItemsListProps) {
  return (
    <Card size="small">
      <List
        itemLayout="horizontal"
        dataSource={props.items}
        renderItem={(item, index) => (
          <List.Item
            actions={[
              <Button key="edit" onClick={() => props.onEdit(item)} type="link">
                edit
              </Button>,
            ]}
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
                />
              }
              title={<a href="https://ant.design">{item.name}</a>}
              description={
                <AssigneeList
                  companyUsers={props.companyUsers}
                  assigneeIds={item.assigneeIds}
                />
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
}

type AssigneeListProps = {
  assigneeIds: string[];
  companyUsers: { id: string; name: string }[];
};
function AssigneeList(props: AssigneeListProps) {
  const assigneeIds = props.assigneeIds;
  if (assigneeIds.length === 0) {
    return <span>No assignees</span>;
  }

  return (
    <Flex wrap="wrap">
      {assigneeIds.map((id) => {
        return (
          <Tag key={id}>
            {props.companyUsers.find((u) => u.id === id)?.name}
          </Tag>
        );
      })}
    </Flex>
  );
}

type TodoItemModalProps = {
  listId: string;
  openId: 'new-item' | string | undefined;
  items: TodoItem[];
  companyUsers: { id: string; name: string }[];
  onClose: (item?: TodoItem) => void;
};

function TodoItemModal(props: TodoItemModalProps) {
  const isOpen = props.openId !== undefined;
  const isEdit = props.openId !== 'new-item';
  const editingItem = useMemo(() => {
    if (props.openId === undefined) {
      return undefined;
    }

    if (props.openId === 'new-item') {
      return undefined;
    }

    return props.items.find((item) => item.id === props.openId);
  }, [props.openId, props.items]);

  function close() {
    props.onClose();
  }

  return (
    <Modal
      open={isOpen}
      onCancel={close}
      onOk={close}
      destroyOnClose={true}
      footer={[
        <Button key="back" onClick={close}>
          Close
        </Button>,
      ]}
    >
      <div>
        <Typography.Title level={2}>
          {isEdit ? 'Edit' : 'Create'} todo item
        </Typography.Title>
        <TodoItemGeneralForm
          todoListId={props.listId}
          todoItemId={editingItem?.id}
          onSave={(item) => props.onClose(item)}
          companyUsers={props.companyUsers}
          initialState={editingItem || { name: '', assigneeIds: [] }}
        />
      </div>
    </Modal>
  );
}
