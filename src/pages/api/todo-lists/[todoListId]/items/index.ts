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

      const companyId = session.companyId;
      const listId = req.query.todoListId as string;

      const todoList = await prisma.todoList.findFirst({
        where: {
          companyId,
          id: listId,
        },
        select: {
          id: true,
        },
      });

      if (!todoList) {
        return res
          .status(404)
          .json({ errorMessage: 'Todo list does not exist' });
      }

      const newTodoItem = await prisma.todoItem.create({
        data: {
          name: body.name,
          listId,
          assignees: {
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
        assigneeIds: newTodoItem.assignees.map((assignee) => assignee.userId),
      };

      return res.status(201).json(response);
    }
  },
);
