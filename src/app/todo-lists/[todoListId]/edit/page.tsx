import { ensureCompanyRole } from '@/lib/auth';
import { EditTodoList } from './EditTodoList.client';
import prisma from '@/lib/prisma';

type Props = {
  params: {
    todoListId: string;
  };
};

export default async function ServerPage(props: Props) {
  const user = await ensureCompanyRole();
  const todoListId = props.params.todoListId;

  const todoList = await prisma.todoList.findFirst({
    where: {
      id: todoListId,
      companyId: user.companyId,
    },
    select: {
      name: true,
    },
  });

  if (!todoList) {
    throw new Error('Todo list not found.');
  }

  return <EditTodoList todoListId={todoListId} initialValues={todoList} />;
}
