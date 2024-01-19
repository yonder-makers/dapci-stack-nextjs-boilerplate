import { TodoListRequest, TodoListResponse } from '@/lib/apis/todoList.api';
import { withApiAuth } from '@/lib/hocs';
import prisma from '@/lib/prisma';

export default withApiAuth<TodoListRequest, TodoListResponse>(
  'ADMIN',
  async (session, body, req, res) => {
    {
      if (req.method !== 'POST') {
        return res.status(405).json({ errorMessage: 'Method not allowed' });
      }

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
        return res
          .status(404)
          .json({ errorMessage: 'Todo list does not exist' });
      }

      const newTodoList = await prisma.todoList.update({
        where: {
          id: todoListId,
        },
        data: {
          name,
        },
      });

      return res
        .status(201)
        .json({ id: newTodoList.id, name: newTodoList.name });
    }
  },
);
