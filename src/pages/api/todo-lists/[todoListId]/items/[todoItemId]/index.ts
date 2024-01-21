import {
  TodoItemDeletedResponse,
  TodoItemRequest,
  TodoItemResponse,
} from '@/lib/apis/todoItem.api';
import { ErrorOutput, withApiAuth } from '@/lib/hocs';
import prisma from '@/lib/prisma';
import { UserSession } from '@/lib/types';
import { NextApiRequest, NextApiResponse } from 'next';

export default withApiAuth<
  TodoItemRequest,
  TodoItemResponse | TodoItemDeletedResponse
>('ADMIN', async (session, body, req, res) => {
  {
    if (req.method === 'POST') {
      return doEdit(session, body, req, res);
    }

    if (req.method === 'DELETE') {
      return doDelete(session, body, req, res);
    }

    return res.status(405).json({ errorMessage: 'Method not allowed' });
  }
});

function trimAndValidateBody(body: TodoItemRequest) {
  body.name = body.name?.trim() || '';

  if (body.name.length === 0) {
    return 'Name is required';
  }

  return undefined;
}

async function doEdit(
  session: UserSession,
  body: TodoItemRequest,
  req: NextApiRequest,
  res: NextApiResponse<TodoItemResponse | ErrorOutput>,
) {
  const validationError = trimAndValidateBody(body);
  if (validationError) {
    return res.status(400).json({ errorMessage: validationError });
  }

  const companyId = session.companyId!;
  const todoItemId = req.query.todoItemId as string;

  const todoListItem = await prisma.todoItem.findFirst({
    where: {
      id: todoItemId,
      list: {
        companyId: companyId,
      },
    },
    select: {
      id: true,
    },
  });

  if (!todoListItem) {
    return res.status(404).json({ errorMessage: 'Todo item does not exist' });
  }

  const updatedTodoItem = await prisma.todoItem.update({
    where: {
      id: todoItemId,
    },
    data: {
      name: body.name,
      isDone: body.isDone,
      assignees: {
        deleteMany: {},
        createMany: {
          data: body.assigneeIds.map((userId) => ({
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
    id: updatedTodoItem.id,
    name: updatedTodoItem.name,
    isDone: updatedTodoItem.isDone,
    assigneeIds: updatedTodoItem.assignees.map((assignee) => assignee.userId),
  };

  return res.status(201).json(response);
}

async function doDelete(
  session: UserSession,
  body: TodoItemRequest,
  req: NextApiRequest,
  res: NextApiResponse<TodoItemDeletedResponse | ErrorOutput>,
) {
  const companyId = session.companyId!;
  const todoItemId = req.query.todoItemId as string;

  const todoListItem = await prisma.todoItem.findFirst({
    where: {
      id: todoItemId,
      list: {
        companyId: companyId,
      },
    },
    select: {
      id: true,
    },
  });

  if (!todoListItem) {
    return res.status(404).json({ errorMessage: 'Todo item does not exist' });
  }

  // first lets delete all assignees
  await prisma.todoItemAssignee.deleteMany({
    where: {
      todoItemId: todoItemId,
    },
  });

  const deletedTodoItem = await prisma.todoItem.delete({
    where: {
      id: todoItemId,
    },
    select: {
      id: true,
    },
  });

  const response: TodoItemDeletedResponse = {
    id: deletedTodoItem.id,
  };

  return res.status(201).json(response);
}
