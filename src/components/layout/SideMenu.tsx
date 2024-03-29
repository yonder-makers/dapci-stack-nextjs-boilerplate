'use client';
import { CompanyUser, UserSession } from '@/lib/types';
import {
  UploadOutlined,
  UserOutlined,
  HomeOutlined,
  UserSwitchOutlined,
  OrderedListOutlined,
  BankOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';
import Link from 'next/link';
import {
  useRouter,
  usePathname,
  useSelectedLayoutSegments,
} from 'next/navigation';
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
      items={[item('My profile', '/my-profile', <UserOutlined />)]}
    />
  );
}

function AdminMenu({ user }: { user: CompanyUser }) {
  const segments = useSelectedLayoutSegments();

  let selectedKey = 'Home';
  if (segments[0] === 'my-profile') {
    selectedKey = 'My profile';
  }
  if (segments[0] === 'companies') {
    if (segments[2] === 'users') {
      selectedKey = 'Users';
    }
  }
  if (segments[0] === 'todo-lists') {
    selectedKey = 'Todo lists';
  }

  return (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[selectedKey]}
      items={[
        item('Home', '/', <HomeOutlined />),
        item('My profile', '/my-profile', <UserOutlined />),
        item(
          'Users',
          `/companies/${user.companyId}/users`,
          <UserSwitchOutlined />,
        ),
        item('Todo lists', '/todo-lists', <OrderedListOutlined />),
      ]}
    />
  );
}

function SuperAdminMenu() {
  const pathname = usePathname();
  let selectedKey = 'Home';
  if (pathname?.includes('/my-profile')) {
    selectedKey = 'My profile';
  }
  if (pathname?.includes('/companies')) {
    selectedKey = 'Companies';
  }

  return (
    <Menu
      theme="dark"
      mode="inline"
      defaultSelectedKeys={[selectedKey]}
      items={[
        item('Home', '/', <HomeOutlined />),
        item('My profile', '/my-profile', <UserOutlined />),
        item('Companies', '/companies', <BankOutlined />),
      ]}
    />
  );
}
