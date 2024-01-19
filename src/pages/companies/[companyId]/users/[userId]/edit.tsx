import { ResetPasswordForm } from '@/components/forms/ResetPasswordForm';
import { UserGeneralForm } from '@/components/forms/UserGeneralForm';
import { withAuth } from '@/lib/hocs';
import prisma from '@/lib/prisma';
import { Breadcrumb, Card, Space, Typography } from 'antd';
import { InferGetServerSidePropsType } from 'next';
import Link from 'next/link';

type PageParams = { companyId: string; userId: string };

export const getServerSideProps = withAuth(
  'ADMIN',
  async function (session, params: PageParams) {
    const companyId = params.companyId;

    const company = await prisma.company.findUnique({
      where: {
        id: companyId,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!company) {
      throw new Error('Company not found');
    }

    const user = await prisma.user.findUnique({
      where: {
        id: params.userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return { company, user };
  },
);

export default function Page(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  const company = props.company;
  const user = props.user;

  const breadCrumbItems = [
    { title: <Link href="/">Home</Link> },
    { title: <Link href="/companies">Companies</Link> },
    {
      title: <Link href={`/companies/${company.id}/edit`}>{company.name}</Link>,
    },
    { title: <Link href={`/companies/${company.id}/users`}>Users</Link> },
    {
      title: (
        <Link href={`/companies/${company.id}/users/${user.id}/edit`}>
          {user.name}
        </Link>
      ),
    },
    { title: 'Edit' },
  ];

  return (
    <Space direction="vertical" size={16} className="w-full">
      <Breadcrumb items={breadCrumbItems} />
      <Typography.Title level={2}>Edit user</Typography.Title>
      <Card title="General info" size="small">
        <UserGeneralForm
          companyId={company.id}
          initialState={{
            id: user.id,
            name: user.name,
            email: user.email,
          }}
        />
      </Card>
      <Card title="Reset password" size="small">
        <ResetPasswordForm companyId={company.id} userId={user.id} />
      </Card>
    </Space>
  );
}
