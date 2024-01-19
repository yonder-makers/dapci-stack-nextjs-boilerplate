import { createTodoList, updateTodoList } from '@/lib/apis/todoList.api';
import { useNotifications } from '@/providers/notification.providers';
import { Button, Form, Input } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type FormFields = {
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
        const todoList = await createTodoList(values.name);
        notifications.success('Todo list created');

        router.push(`/todo-lists/${todoList.id}/edit`);
      } else {
        const todoList = await updateTodoList(props.todoListId, values.name);
        form.setFieldsValue(todoList);
        notifications.success('Todo list updated');
      }
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
