import { CompanyGeneralForm } from '@/components/forms/CompanyGeneralForm';
import { withAuth } from '@/lib/hocs';
import { Breadcrumb, Card, Space, Typography } from 'antd';
import { InferGetServerSidePropsType } from 'next';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { UserGeneralForm } from '@/components/forms/UserGeneralForm';

type PageParams = { companyId: string };

export const getServerSideProps = withAuth(
  'ADMIN',
  async function (user, params: PageParams) {
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

    return { company };
  },
);

export default function Page(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  const company = props.company;

  const breadCrumbItems = [
    { title: <Link href="/">Home</Link> },
    { title: <Link href="/companies">Companies</Link> },
    {
      title: <Link href={`/companies/${company.id}/edit`}>{company.name}</Link>,
    },
    { title: <Link href={`/companies/${company.id}/users`}>Users</Link> },
    { title: 'Create' },
  ];

  return (
    <Space direction="vertical" size={16} className="w-full">
      <Breadcrumb items={breadCrumbItems} />
      <Typography.Title level={2}>Create user</Typography.Title>
      <Card title="General info" size="small">
        <UserGeneralForm
          companyId={company.id}
          initialState={{
            name: '',
            email: '',
          }}
        />
      </Card>
    </Space>
  );
}
