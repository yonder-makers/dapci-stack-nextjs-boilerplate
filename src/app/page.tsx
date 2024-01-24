'use server';
import prisma from '@/lib/prisma';
import { HomePage, TodoList } from './HomePage.client';

export default async function ServerPage() {
  const todoLists = await prisma.todoList.findMany({
    select: {
      id: true,
      name: true,
      company: {
        select: {
          id: true,
          name: true,
        },
      },
      _count: {
        select: {
          items: true,
        },
      },
    },
  });

  const flatList = todoLists.map<TodoList>((l) => {
    return {
      id: l.id,
      name: l.name,
      companyName: l.company.name,
      numberOfItems: l._count.items,
    };
  });

  return <HomePage todoLists={flatList} />;
}
