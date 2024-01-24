'use server';
import { ensurePermissionForCompany, ensureSuperAdminRole } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { EditCompany } from './EditCompany.client';

type Props = {
  params: {
    companyId: string;
  };
};

export default async function ServerPage({ params }: Props) {
  await ensurePermissionForCompany(params.companyId);

  const company = await prisma.company.findUnique({
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          users: true,
        },
      },
    },
    where: {
      id: params.companyId,
    },
  });

  if (!company) {
    throw new Error('Company not found');
  }

  const flatCompany = {
    id: company.id,
    name: company.name,
    numberOfUsers: company._count.users,
  };

  return <EditCompany company={flatCompany} />;
}
