import { ResetPasswordForm } from '@/components/forms/ResetPasswordForm';
import { UserGeneralForm } from '@/components/forms/UserGeneralForm';
import { withAuth } from '@/lib/hocs';
import prisma from '@/lib/prisma';
import { Breadcrumb, Card, Space, Typography } from 'antd';
import { InferGetServerSidePropsType } from 'next';
import Link from 'next/link';

export const getServerSideProps = withAuth('USER', async function (session) {
  const user = await prisma.user.findUnique({
    where: {
      id: session!.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      companyId: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return { user };
});

export default function Page(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  const { user } = props;
  const breadCrumbItems = [
    { title: <Link href="/">Home</Link> },
    { title: 'My profile' },
  ];

  return (
    <Space direction="vertical" size={16} className="w-full">
      <Breadcrumb items={breadCrumbItems} />
      <Typography.Title level={2}>My profile</Typography.Title>
      <Card title="General info" size="small">
        <UserGeneralForm
          companyId={user.companyId!}
          initialState={{
            id: user.id,
            name: user.name,
            email: user.email,
          }}
        />
      </Card>
      <Card title="Reset password" size="small">
        <ResetPasswordForm companyId={user.companyId!} userId={user.id} />
      </Card>
    </Space>
  );
}
