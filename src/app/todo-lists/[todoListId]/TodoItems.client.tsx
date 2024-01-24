'use client';
import {
  deleteTodoItem,
  updateTodoItemIsDone,
} from '@/actions/todo-item.actions';
import {
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Flex,
  Input,
  List,
  Popconfirm,
  Space,
  Tag,
  Typography,
} from 'antd';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { TodoItemModal } from './TodoItemModal.client';

export type TodoItem = {
  id: string;
  name: string;
  isDone: boolean;
  assigneeIds: string[];
};

type TodoItemsProps = {
  todoList: { id: string; name: string };
  items: TodoItem[];
  companyUsers: { id: string; name: string }[];
};
export function TodoItems(props: TodoItemsProps) {
  const todoList = props.todoList;
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

  function updateItem(item: TodoItem) {
    if (todoItems.find((i) => i.id === item.id)) {
      setTodoItems(todoItems.map((i) => (i.id === item.id ? item : i)));
      return;
    } else {
      setTodoItems([...todoItems, item]);
    }
  }

  function deleteItem(id: string) {
    setTodoItems(todoItems.filter((i) => i.id !== id));
  }

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
        onStartEditing={(item) => setEditingItemId(item.id)}
        onItemUpdated={updateItem}
        onItemDeleted={deleteItem}
      />
      <TodoItemModal
        items={todoItems}
        listId={todoList.id}
        openId={editingItemId}
        companyUsers={props.companyUsers}
        onClose={(item) => {
          setEditingItemId(undefined);
          if (item) {
            updateItem(item);
          }
        }}
      />
    </Space>
  );
}

type ItemsListProps = {
  listId: string;
  items: TodoItem[];
  companyUsers: { id: string; name: string }[];
  onStartEditing: (item: TodoItem) => void;
  onItemUpdated: (item: TodoItem) => void;
  onItemDeleted: (id: string) => void;
};

function ItemsList(props: ItemsListProps) {
  async function onCheckChange(item: TodoItem) {
    const newItem = await updateTodoItemIsDone(item.id, !item.isDone);
    props.onItemUpdated(newItem);
  }

  async function onDeleteItem(item: TodoItem) {
    const newItem = await deleteTodoItem(item.id);
    props.onItemDeleted(newItem.id);
  }

  return (
    <Card size="small">
      <List
        itemLayout="horizontal"
        dataSource={props.items}
        renderItem={(item, index) => (
          <List.Item
            actions={[
              <Button
                key="edit"
                onClick={() => props.onStartEditing(item)}
                type="link"
              >
                edit
              </Button>,
              <Popconfirm
                key="delete"
                title="Delete the item"
                description="Are you sure to delete this item?"
                onConfirm={() => onDeleteItem(item)}
                okText="Yes"
                cancelText="No"
              >
                <Button type="link" danger>
                  delete
                </Button>
              </Popconfirm>,
            ]}
          >
            <List.Item.Meta
              avatar={
                <Checkbox
                  checked={item.isDone}
                  onChange={() => onCheckChange(item)}
                ></Checkbox>
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
