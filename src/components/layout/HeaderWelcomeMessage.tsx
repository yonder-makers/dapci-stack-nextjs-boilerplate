import { UserSession } from '@/lib/types';
import { Button, Space } from 'antd';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

export function HeaderWelcomeMessage(props: { user?: UserSession }) {
  if (!props.user) {
    return (
      <Space>
        Welcome!
        <Link href="/login" className="text-ct-dark-600">
          Login
        </Link>
      </Space>
    );
  }

  return (
    <Space>
      Welcome, {props.user.name}!
      <Button onClick={() => signOut()}>Logout</Button>
    </Space>
  );
}
