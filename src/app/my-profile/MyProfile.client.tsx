'use client';
import { ResetPasswordForm } from '@/components/forms/ResetPasswordForm';
import { UserAvatarUpload } from '@/components/forms/UserAvatarUpload';
import {
  FormFields,
  UserGeneralForm,
} from '@/components/forms/UserGeneralForm';
import { Breadcrumb, Card, Space, Typography } from 'antd';
import Link from 'next/link';

export type MyProfileFields = FormFields;

type Props = {
  initialValues: MyProfileFields;
  userId: string;
  avatarUrl?: string;
};
export default function MyProfile(props: Props) {
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
          mode="edit"
          userId={props.userId}
          initialState={props.initialValues}
        />
      </Card>
      <Card title="Reset password" size="small">
        <ResetPasswordForm userId={props.userId} />
      </Card>
      <Card title="Profile picture" size="small">
        <UserAvatarUpload avatarUrl={props.avatarUrl || undefined} />
      </Card>
    </Space>
  );
}
