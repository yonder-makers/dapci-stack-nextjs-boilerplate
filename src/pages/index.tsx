import { withAuth } from '@/lib/hocs';
import prisma from '@/lib/prisma';
import { Typography } from 'antd';
import { InferGetServerSidePropsType } from 'next';

export const getServerSideProps = withAuth('ANONYMOUS', async function () {
  return {};
});

export default function Page(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  return <Typography.Title level={2}>Welcome</Typography.Title>;
}
