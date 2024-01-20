import { TodoItemRequest, TodoItemResponse } from '@/lib/apis/todoItem.api';
import { withApiAuth } from '@/lib/hocs';
import prisma from '@/lib/prisma';

function trimAndValidateBody(body: TodoItemRequest) {
  body.name = body.name?.trim() || '';

  if (body.name.length === 0) {
    return 'Name is required';
  }

  return undefined;
}

export default withApiAuth<TodoItemRequest, TodoItemResponse>(
  'ADMIN',
  async (session, body, req, res) => {
    {
      if (req.method !== 'POST') {
        return res.status(405).json({ errorMessage: 'Method not allowed' });
      }

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
        return res
          .status(404)
          .json({ errorMessage: 'Todo item does not exist' });
      }

      const updatedTodoItem = await prisma.todoItem.update({
        where: {
          id: todoItemId,
        },
        data: {
          name: body.name,
        },
        select: {
          id: true,
          name: true,
        },
      });

      return res.status(201).json(updatedTodoItem);
    }
  },
);
