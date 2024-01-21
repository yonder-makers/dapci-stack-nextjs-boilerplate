import {
  TodoListDeletedResponse,
  TodoListRequest,
  TodoListResponse,
} from '@/lib/apis/todoList.api';
import { ErrorOutput, withApiAuth } from '@/lib/hocs';
import prisma from '@/lib/prisma';
import { UserSession } from '@/lib/types';
import { NextApiRequest, NextApiResponse } from 'next';

export default withApiAuth<
  TodoListRequest,
  TodoListResponse | TodoListDeletedResponse
>('ADMIN', async (session, body, req, res) => {
  if (req.method === 'POST') {
    return await doCreate(session, body, req, res);
  }

  if (req.method === 'DELETE') {
    return await doDelete(session, body, req, res);
  }

  return res.status(405).json({ errorMessage: 'Method not allowed' });
});

async function doCreate(
  session: UserSession,
  body: TodoListRequest,
  req: NextApiRequest,
  res: NextApiResponse<ErrorOutput | TodoListResponse>,
) {
  const name = body.name?.trim() || '';
  if (name.length === 0) {
    return res.status(400).json({ errorMessage: 'Name is required' });
  }

  const todoListId = req.query.todoListId as string;

  // todo: should compare with case insensitive
  const existing = await prisma.todoList.findFirst({
    where: {
      id: todoListId,
      companyId: session.companyId,
    },
    select: {
      id: true,
    },
  });

  if (!existing) {
    return res.status(404).json({ errorMessage: 'Todo list does not exist' });
  }

  const newTodoList = await prisma.todoList.update({
    where: {
      id: todoListId,
    },
    data: {
      name,
    },
  });

  return res.status(201).json({ id: newTodoList.id, name: newTodoList.name });
}

async function doDelete(
  session: UserSession,
  body: TodoListRequest,
  req: NextApiRequest,
  res: NextApiResponse<ErrorOutput | TodoListDeletedResponse>,
) {
  const todoListId = req.query.todoListId as string;

  const todoList = await prisma.todoList.findFirst({
    where: {
      id: todoListId,
      companyId: session.companyId,
    },
    select: {
      id: true,
    },
  });

  if (!todoList) {
    return res.status(404).json({ errorMessage: 'Todo list does not exist' });
  }

  // delete all items assignees first
  await prisma.todoItemAssignee.deleteMany({
    where: {
      todoItem: {
        listId: todoListId,
      },
    },
  });

  // delete all items first
  await prisma.todoItem.deleteMany({
    where: {
      listId: todoListId,
    },
  });

  await prisma.todoList.delete({
    where: {
      id: todoListId,
    },
  });

  return res.status(200).json({ id: todoListId });
}
