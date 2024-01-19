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
      <div>Name: {props.userSession?.name} </div>
      <div>Email: {props.userSession?.email} </div>
      <div>Role: {props.userSession?.role} </div>
      <div>Company: {props.userSession?.companyId ?? 'None'} </div>
    </div>
  );
}
