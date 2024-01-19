import { CompanyGeneralForm } from '@/components/forms/CompanyGeneralForm';
import { withAuth } from '@/lib/hocs';
import { Breadcrumb, Card, Space, Typography } from 'antd';
import { InferGetServerSidePropsType } from 'next';
import Link from 'next/link';

export const getServerSideProps = withAuth('SUPERADMIN', async function () {
  return {};
});

export default function Page(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  const breadCrumbItems = [
    { title: <Link href="/">Home</Link> },
    { title: <Link href="/companies">Companies</Link> },
    { title: 'Create' },
  ];

  return (
    <Space direction="vertical" size={16} className="w-full">
      <Breadcrumb items={breadCrumbItems} />
      <Typography.Title level={2}>Create company</Typography.Title>
      <Card>
        <CompanyGeneralForm initialState={{ name: '' }} />
      </Card>
    </Space>
  );
}
