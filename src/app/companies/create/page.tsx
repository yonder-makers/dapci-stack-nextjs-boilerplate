'use server';

import { ensureSuperAdminRole } from '@/lib/auth';
import { CreateCompany } from './CreateCompany.client';

export default async function ServerPage() {
  await ensureSuperAdminRole();

  return <CreateCompany />;
}
