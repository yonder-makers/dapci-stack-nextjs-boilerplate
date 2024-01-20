import {
  TodoItemResponse,
  createTodoItem,
  updateTodoItem,
} from '@/lib/apis/todoItem.api';
import { useNotifications } from '@/providers/notification.providers';
import { Button, Form, Input } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type FormFields = {
  name: string;
};

export function TodoItemGeneralForm(props: {
  todoListId: string;
  todoItemId?: string;
  initialState: FormFields;
  onSave: (item: TodoItemResponse) => void;
}) {
  const [form] = Form.useForm();
  const notifications = useNotifications();

  const [isLoading, setIsLoading] = useState(false);

  async function onFinish(values: FormFields) {
    setIsLoading(true);

    try {
      if (props.todoItemId === undefined) {
        const todoItem = await createTodoItem(props.todoListId, values);
        notifications.success('Todo item created');

        props.onSave(todoItem);
      } else {
        const todoItem = await updateTodoItem(
          props.todoListId,
          props.todoItemId,
          values,
        );
        form.setFieldsValue(todoItem);
        notifications.success('Todo item updated');
        props.onSave(todoItem);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form
      name="todo-item-general-form"
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
