import { UserSession } from '@/lib/types';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

type SideMenuProps = {
  user?: UserSession;
};
export function SideMenu(props: SideMenuProps) {
  const role = props.user?.role;

  switch (role) {
    case 'SUPERADMIN':
      return <SuperAdminMenu />;
    case 'ADMIN':
      return <AdminMenu user={props.user!} />;
    case 'USER':
      return <NormalUserMenu />;
    default:
      return <NotAuthenticatedMenu />;
  }
}

function item(text: string, url: string, logo?: React.ReactNode) {
  return {
    key: text,
    icon: logo ?? <UploadOutlined />,
    label: <Link href={url}>{text}</Link>,
  };
}

function NotAuthenticatedMenu() {
  return (
    <Menu
      theme="dark"
      mode="inline"
      defaultSelectedKeys={[]}
      items={[item('Login', '/login', <UserOutlined />)]}
    />
  );
}

function NormalUserMenu() {
  return (
    <Menu
      theme="dark"
      mode="inline"
      defaultSelectedKeys={['My profile']}
      items={[item('My profile', '/profile', <UserOutlined />)]}
    />
  );
}

function AdminMenu({ user }: { user: UserSession }) {
  const router = useRouter();
  let selectedKey = 'My profile';
  if (router.pathname.includes('/companies/[companyId]/users')) {
    selectedKey = 'Users';
  }
  if (router.pathname.includes('/todo-lists')) {
    selectedKey = 'Todo lists';
  }

  return (
    <Menu
      theme="dark"
      mode="inline"
      defaultSelectedKeys={[selectedKey]}
      items={[
        item('My profile', '/profile', <UserOutlined />),
        item('Users', `/companies/${user.companyId}/users`, <UserOutlined />),
        item('Todo lists', '/todo-lists', <UserOutlined />),
      ]}
    />
  );
}

function SuperAdminMenu() {
  return (
    <Menu
      theme="dark"
      mode="inline"
      defaultSelectedKeys={['My profile']}
      items={[
        item('My profile', '/profile', <UserOutlined />),
        item('Companies', '/companies', <UserOutlined />),
      ]}
    />
  );
}
