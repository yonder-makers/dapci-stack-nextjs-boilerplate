import { CompanyGeneralForm } from '@/components/forms/CompanyGeneralForm';
import { withAuth } from '@/lib/hocs';
import prisma from '@/lib/prisma';
import { Breadcrumb, Card, Space, Typography } from 'antd';
import { InferGetServerSidePropsType } from 'next';
import Link from 'next/link';

type PageParams = { companyId: string };

export const getServerSideProps = withAuth(
  'SUPERADMIN',
  async function (session, params: PageParams) {
    const { companyId: companyId } = params;

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
        id: companyId,
      },
    });

    if (!company) {
      throw new Error('Company not found');
    }

    return {
      company: {
        id: company.id,
        name: company.name,
        numberOfUsers: company._count.users,
      },
    };
  },
);

export default function Page(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  const { company } = props;

  const breadCrumbItems = [
    { title: <Link href="/">Home</Link> },
    { title: <Link href="/companies">Companies</Link> },
    { title: `${company.name}` },
  ];

  return (
    <Space direction="vertical" size={16} className="w-full">
      <Breadcrumb items={breadCrumbItems} />
      <Typography.Title level={2}>Edit {company.name}</Typography.Title>
      <Card title="General info" size="small">
        <CompanyGeneralForm companyId={company.id} initialState={company} />
      </Card>
      <Card title="Members" size="small">
        <Link href={`/companies/${company.id}/users`}>
          Manage {company.numberOfUsers} members
        </Link>
      </Card>
    </Space>
  );
}
