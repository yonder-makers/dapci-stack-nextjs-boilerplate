'use client';
import { createTodoList, updateTodoList } from '@/actions/todo-list.actions';
import { useNotifications } from '@/providers/notification.providers';
import { Button, Form, Input } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export type FormFields = {
  name: string;
};

export function TodoListGeneralForm(props: {
  todoListId?: string;
  initialState: FormFields;
}) {
  const [form] = Form.useForm();
  const notifications = useNotifications();

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  async function onFinish(values: FormFields) {
    setIsLoading(true);

    try {
      if (props.todoListId === undefined) {
        const todoList = await createTodoList(values);
        console.log('todoList: ', todoList);
        notifications.success('Todo list created');

        router.push(`/todo-lists/${todoList.id}/edit`);
      } else {
        const todoList = await updateTodoList(props.todoListId, values);
        form.setFieldsValue(todoList);
        notifications.success('Todo list updated');
      }
    } catch (error) {
      notifications.error("Couldn't save todo list");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form
      name="todo-list-general-form"
      form={form}
      layout="vertical"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={props.initialState}
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item<FormFields>
        label="Name"
        name="name"
        rules={[{ required: true, message: 'Please insert name' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 0, span: 16 }}>
        <Button type="primary" loading={isLoading} htmlType="submit">
          Save
        </Button>
      </Form.Item>
    </Form>
  );
}
