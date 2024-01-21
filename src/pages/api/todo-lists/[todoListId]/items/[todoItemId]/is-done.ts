import { TodoItemRequest, TodoItemResponse } from '@/lib/apis/todoItem.api';
import { withApiAuth } from '@/lib/hocs';
import prisma from '@/lib/prisma';

export default withApiAuth<{}, TodoItemResponse>(
  'ADMIN',
  async (session, body, req, res) => {
    {
      if (req.method !== 'POST' && req.method !== 'DELETE') {
        return res.status(405).json({ errorMessage: 'Method not allowed' });
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
          isDone: req.method === 'POST' ? true : false,
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
        assigneeIds: updatedTodoItem.assignees.map(
          (assignee) => assignee.userId,
        ),
      };

      return res.status(201).json(response);
    }
  },
);
