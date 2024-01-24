'use client';
import { TodoItemGeneralForm } from '@/components/forms/TodoItemGeneralForm';
import {} from '@prisma/client';
import { Modal, Button, Typography } from 'antd';
import { useMemo } from 'react';
import { TodoItem } from './TodoItems.client';

type TodoItemModalProps = {
  listId: string;
  openId: 'new-item' | string | undefined;
  items: TodoItem[];
  companyUsers: { id: string; name: string }[];
  onClose: (item?: TodoItem) => void;
};

export function TodoItemModal(props: TodoItemModalProps) {
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
          initialState={
            editingItem || { name: '', assigneeIds: [], isDone: false }
          }
        />
      </div>
    </Modal>
  );
}
