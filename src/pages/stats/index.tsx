import { withAuth } from '@/lib/hocs';
import prisma from '@/lib/prisma';
import { InferGetServerSidePropsType } from 'next';

export const getServerSideProps = withAuth('ANONYMOUS', async function () {
  const users = await prisma.user.count();
  const companies = await prisma.company.count();

  console.log('cesva')

  return {
    users: users,
    companies: companies,
  };
});

export default function Page(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  console.log('ce')
  return (
    <div>
      <div>Users: {props.users} </div>
      <div>Companies: {props.companies} </div>
    </div>
  );
}
