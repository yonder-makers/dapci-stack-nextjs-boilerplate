import { withAuth } from '@/lib/hocs';
import prisma from '@/lib/prisma';
import { InferGetServerSidePropsType } from 'next';

export const getServerSideProps = withAuth('USER', async function () {
  return {};
});

export default function Page(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  return (
    <div>
      <div>Name: {props.user?.name} </div>
      <div>Email: {props.user?.email} </div>
      <div>Role: {props.user?.role} </div>
      <div>Company: {props.user?.companyId ?? 'None'} </div>
    </div>
  );
}
