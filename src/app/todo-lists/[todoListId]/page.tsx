import { ensureCompanyRole } from '@/lib/auth';
import { TodoItem, TodoItems } from './TodoItems.client';
import prisma from '@/lib/prisma';

type Props = {
  params: {
    todoListId: string;
  };
};
export default async function ServerPage({ params }: Props) {
  const user = await ensureCompanyRole();
  const companyId = user.companyId;

  const todoList = await prisma.todoList.findFirst({
    where: {
      id: params.todoListId,
      companyId,
    },
    select: {
      id: true,
      name: true,
      items: {
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
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  });

  if (!todoList) {
    throw new Error('Todo list not found');
  }

  const flatItems = todoList.items.map<TodoItem>((item) => {
    return {
      id: item.id,
      name: item.name,
      isDone: item.isDone,
      assigneeIds: item.assignees.map((a) => a.userId),
    };
  });

  const companyUsers = await prisma.user.findMany({
    where: {
      companyId,
    },
    select: {
      id: true,
      name: true,
    },
  });

  const list = {
    id: todoList.id,
    name: todoList.name,
  };

  return (
    <TodoItems companyUsers={companyUsers} items={flatItems} todoList={list} />
  );
}
