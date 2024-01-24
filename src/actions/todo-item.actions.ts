'use server';

import { ensureCompanyRole } from '@/lib/auth';

import prisma from '@/lib/prisma';
import { generateGuid } from '@/lib/utils';

type TodoItemRequest = {
  name: string;
  isDone: boolean;
  assigneeIds: string[];
};

export type TodoItemResponse = {
  id: string;
  name: string;
  isDone: boolean;
  assigneeIds: string[];
};

function validateTodoItem(todoList: TodoItemRequest) {
  todoList.name = (todoList.name || '').trim();

  if (todoList.name.length === 0) {
    throw new Error('Name is required');
  }
}

export async function createTodoItem(
  todoListId: string,
  todoItem: TodoItemRequest,
) {
  const user = await ensureCompanyRole();
  const companyId = user.companyId;

  validateTodoItem(todoItem);

  const todoList = await prisma.todoList.findFirst({
    where: {
      id: todoListId,
      companyId,
    },
    select: {
      id: true,
    },
  });

  if (!todoList) {
    throw new Error('Todo list does not exist');
  }

  const id = generateGuid();
  const newTodoItem = await prisma.todoItem.create({
    data: {
      id,
      name: todoItem.name,
      listId: todoListId,
      isDone: todoItem.isDone,
      assignees: {
        createMany: {
          data: todoItem.assigneeIds.map((userId) => ({
            userId,
          })),
        },
      },
    },
    select: {
      id: true,
      name: true,
      isDone: true,
      assignees: {
        select: {
          userId: true,
        },
      },
    },
  });

  const response: TodoItemResponse = {
    id: newTodoItem.id,
    name: newTodoItem.name,
    isDone: newTodoItem.isDone,
    assigneeIds: newTodoItem.assignees.map((assignee) => assignee.userId),
  };

  return response;
}

export async function updateTodoItem(
  itemId: string,
  todoItem: TodoItemRequest,
) {
  const user = await ensureCompanyRole();
  const companyId = user.companyId;

  validateTodoItem(todoItem);

  const existingTodoItem = await prisma.todoItem.findFirst({
    where: {
      id: itemId,
      list: {
        companyId,
      },
    },
    select: {
      id: true,
    },
  });

  if (!existingTodoItem) {
    throw new Error('Todo item does not exist');
  }

  const newTodoItem = await prisma.todoItem.update({
    where: {
      id: itemId,
    },
    data: {
      name: todoItem.name,
      isDone: todoItem.isDone,
      assignees: {
        deleteMany: {},
        createMany: {
          data: todoItem.assigneeIds.map((userId) => ({
            userId,
          })),
        },
      },
    },
    select: {
      id: true,
      name: true,
      isDone: true,
      assignees: {
        select: {
          userId: true,
        },
      },
    },
  });

  const response: TodoItemResponse = {
    id: newTodoItem.id,
    name: newTodoItem.name,
    isDone: newTodoItem.isDone,
    assigneeIds: newTodoItem.assignees.map((assignee) => assignee.userId),
  };

  return response;
}

export async function updateTodoItemIsDone(itemId: string, isDone: boolean) {
  const user = await ensureCompanyRole();
  const companyId = user.companyId;

  const todoItem = await prisma.todoItem.findFirst({
    where: {
      id: itemId,
      list: {
        companyId,
      },
    },
    select: {
      id: true,
    },
  });

  if (!todoItem) {
    throw new Error('Todo item does not exist');
  }

  const newTodoItem = await prisma.todoItem.update({
    where: {
      id: itemId,
    },
    data: {
      isDone,
    },
    select: {
      id: true,
      name: true,
      isDone: true,
      assignees: {
        select: {
          userId: true,
        },
      },
    },
  });

  const response: TodoItemResponse = {
    id: newTodoItem.id,
    name: newTodoItem.name,
    isDone: newTodoItem.isDone,
    assigneeIds: newTodoItem.assignees.map((assignee) => assignee.userId),
  };

  return response;
}

export async function deleteTodoItem(itemId: string) {
  const user = await ensureCompanyRole();
  const companyId = user.companyId;

  const todoItem = await prisma.todoItem.findFirst({
    where: {
      id: itemId,
      list: {
        companyId,
      },
    },
    select: {
      id: true,
    },
  });

  if (!todoItem) {
    throw new Error('Todo item does not exist');
  }

  await prisma.todoItemAssignee.deleteMany({
    where: {
      todoItemId: itemId,
    },
  });

  await prisma.todoItem.delete({
    where: {
      id: itemId,
    },
  });

  return { id: itemId };
}
