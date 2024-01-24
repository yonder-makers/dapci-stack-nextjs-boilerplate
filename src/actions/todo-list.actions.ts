'use server';
import { ensureCompanyRole } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { generateGuid } from '@/lib/utils';

type TodoList = {
  name: string;
};

function validateTodoList(todoList: TodoList) {
  todoList.name = (todoList.name || '').trim();

  if (todoList.name.length === 0) {
    throw new Error('Name is required');
  }
}

export async function createTodoList(todoList: TodoList) {
  const user = await ensureCompanyRole();
  const companyId = user.companyId;

  validateTodoList(todoList);

  // todo: should compare with case insensitive
  const existing = await prisma.todoList.findFirst({
    where: {
      name: todoList.name,
      companyId,
    },
    select: {
      id: true,
    },
  });

  if (existing) {
    throw new Error('Todo list already exists');
  }

  const id = generateGuid();
  const newTodoList = await prisma.todoList.create({
    data: {
      id,
      name: todoList.name,
      companyId,
    },
    select: {
      id: true,
      name: true,
    },
  });

  return newTodoList;
}

export async function updateTodoList(id: string, todoList: TodoList) {
  const user = await ensureCompanyRole();
  const companyId = user.companyId;

  validateTodoList(todoList);

  const existing = await prisma.todoList.findFirst({
    where: {
      id,
      companyId,
    },
    select: {
      id: true,
    },
  });

  if (!existing) {
    throw new Error('Todo list does not exist');
  }

  const updatedTodoList = await prisma.todoList.update({
    where: {
      id,
    },
    data: {
      name: todoList.name,
    },
    select: {
      id: true,
      name: true,
    },
  });

  return updatedTodoList;
}

export async function deleteTodoList(id: string) {
  const user = await ensureCompanyRole();
  const companyId = user.companyId;

  const existing = await prisma.todoList.findFirst({
    where: {
      id,
      companyId,
    },
    select: {
      id: true,
    },
  });

  if (!existing) {
    throw new Error('Todo list does not exist');
  }

  // delete all items assignees first
  await prisma.todoItemAssignee.deleteMany({
    where: {
      todoItem: {
        listId: id,
      },
    },
  });

  // delete all items first
  await prisma.todoItem.deleteMany({
    where: {
      listId: id,
    },
  });

  // delete the todo list
  const deletedList = await prisma.todoList.delete({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });

  return deletedList;
}
