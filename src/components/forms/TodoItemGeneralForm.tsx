'use client';

import {
  TodoItemResponse,
  createTodoItem,
  updateTodoItem,
} from '@/actions/todo-item.actions';

import { useNotifications } from '@/providers/notification.providers';
import { Button, Checkbox, Form, Input, Select } from 'antd';
import { useMemo, useState } from 'react';

type FormFields = {
  name: string;
  isDone: boolean;
  assigneeIds: string[];
};

export function TodoItemGeneralForm(props: {
  todoListId: string;
  todoItemId?: string;
  initialState: FormFields;
  companyUsers: { id: string; name: string }[];
  onSave: (item: TodoItemResponse) => void;
}) {
  const [form] = Form.useForm();
  const notifications = useNotifications();

  const userOptions = useMemo(() => {
    return props.companyUsers.map((user) => {
      return {
        label: user.name,
        value: user.id,
      };
    });
  }, [props.companyUsers]);

  const [isLoading, setIsLoading] = useState(false);

  async function onFinish(values: FormFields) {
    setIsLoading(true);

    try {
      if (props.todoItemId === undefined) {
        const todoItem = await createTodoItem(props.todoListId, values);
        notifications.success('Todo item created');

        props.onSave(todoItem);
      } else {
        const todoItem = await updateTodoItem(props.todoItemId, values);
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

      <Form.Item<FormFields>
        label="Is done"
        name="isDone"
        valuePropName="checked"
      >
        <Checkbox />
      </Form.Item>

      <Form.Item<FormFields> label="Assignees" name="assigneeIds">
        <Select
          mode="multiple"
          allowClear
          placeholder="Please select"
          options={userOptions}
        />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 0, span: 16 }}>
        <Button type="primary" loading={isLoading} htmlType="submit">
          Save
        </Button>
      </Form.Item>
    </Form>
  );
}
