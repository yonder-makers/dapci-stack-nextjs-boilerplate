'use server';
import { ensurePermissionForCompany } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { CompanyUsers, User } from './CompanyUsers.client';

type Props = {
  params: {
    companyId: string;
  };
};
export default async function ServerPage(props: Props) {
  await ensurePermissionForCompany(props.params.companyId);
  const company = await prisma.company.findUnique({
    select: {
      id: true,
      name: true,
    },
    where: {
      id: props.params.companyId,
    },
  });

  if (!company) {
    throw new Error('Company not found');
  }

  const users: User[] = await prisma.user.findMany({
    where: {
      companyId: props.params.companyId,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  return <CompanyUsers company={company} users={users} />;
}
