import { ensureCompanyRole } from '@/lib/auth';
import { CreateTodoList } from './CreateTodoList.client';

export default async function ServerPage() {
  await ensureCompanyRole();
  return <CreateTodoList />;
}
