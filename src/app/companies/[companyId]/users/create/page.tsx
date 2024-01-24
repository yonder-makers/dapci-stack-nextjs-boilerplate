'use server';

import { ensurePermissionForCompany } from '@/lib/auth';
import { CreateUser } from './CreateUser.client';
import prisma from '@/lib/prisma';

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

  return <CreateUser company={company} />;
}
