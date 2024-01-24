import { formatRelativeDate } from '@/lib/utils';
import { TodoLists } from './TodoLists.client';
import prisma from '@/lib/prisma';
import { ensureCompanyRole } from '@/lib/auth';

export default async function ServerPage() {
  const session = await ensureCompanyRole();
  const companyId = session.companyId;

  const lists = await prisma.todoList.findMany({
    where: {
      companyId,
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
      _count: {
        select: {
          items: true,
        },
      },
    },
  });

  const flatLists = lists.map((l) => {
    return {
      id: l.id,
      name: l.name,
      createdAt: formatRelativeDate(l.createdAt),
      numberOfItems: l._count.items,
    };
  });

  return <TodoLists lists={flatLists} />;
}
