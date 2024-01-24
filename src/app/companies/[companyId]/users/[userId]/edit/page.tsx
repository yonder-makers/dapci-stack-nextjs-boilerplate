'use server';

import { ensurePermissionForCompany } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { EditUser } from './EditUser.client';

type Props = {
  params: {
    companyId: string;
    userId: string;
  };
};

export default async function ServerPage({ params }: Props) {
  console.log('Edit user: ', params.userId);
  await ensurePermissionForCompany(params.companyId);

  const user = await prisma.user.findFirst({
    where: {
      id: params.userId,
      companyId: params.companyId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      company: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const company = user.company!;

  return <EditUser company={company} user={user} />;
}
