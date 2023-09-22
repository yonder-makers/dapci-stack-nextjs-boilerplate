import { UserSession } from '@/lib/types';
import { Space, Button } from 'antd';
import Link from 'next/link';
// import { signOut } from "next-auth/react";

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
      {/* <Button onClick={() => signOut()}>Logout</Button> */}
    </Space>
  );
}
