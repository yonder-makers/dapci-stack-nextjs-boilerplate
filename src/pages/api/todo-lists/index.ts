import { TodoListRequest, TodoListResponse } from '@/lib/apis/todoList.api';
import { withApiAuth } from '@/lib/hocs';
import prisma from '@/lib/prisma';
import { generateGuid } from '@/lib/utils';

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

      // todo: should compare with case insensitive
      const existing = await prisma.todoList.findFirst({
        where: {
          name,
          companyId: session.companyId,
        },
        select: {
          id: true,
        },
      });

      if (existing) {
        return res
          .status(409)
          .json({ errorMessage: 'Todo list already exists' });
      }

      const newTodoList = await prisma.todoList.create({
        data: {
          id: generateGuid(),
          name,
          companyId: session.companyId,
        },
      });

      return res
        .status(201)
        .json({ id: newTodoList.id, name: newTodoList.name });
    }
  },
);
