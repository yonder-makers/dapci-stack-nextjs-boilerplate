'use server';
import { ensureSuperAdminRole } from '@/lib/auth';
import { Companies, Company } from './Companies.client';
import prisma from '@/lib/prisma';
import { formatRelativeDate } from '@/lib/utils';

export default async function ServerPage() {
  const user = await ensureSuperAdminRole();

  const companies = await prisma.company.findMany({
    select: {
      id: true,
      name: true,
      createdAt: true,
      _count: {
        select: {
          users: true,
        },
      },
    },
  });

  const flatList = companies.map<Company>((company) => ({
    id: company.id,
    name: company.name,
    createdAt: formatRelativeDate(company.createdAt),
    numberOfUsers: company._count.users,
  }));

  return <Companies companies={flatList} />;
}
