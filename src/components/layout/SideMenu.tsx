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
import { useRouter, usePathname } from 'next/navigation';
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

function AdminMenu({ user }: { user: CompanyUser }) {
  const pathname = usePathname();
  console.log('pathname', pathname);
  let selectedKey = 'Home';
  if (pathname?.includes('/profile')) {
    selectedKey = 'My profile';
  }
  if (pathname?.includes('/companies/[companyId]/users')) {
    selectedKey = 'Users';
  }
  if (pathname?.includes('/todo-lists')) {
    selectedKey = 'Todo lists';
  }

  return (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[selectedKey]}
      items={[
        item('Home', '/', <HomeOutlined />),
        item('My profile', '/profile', <UserOutlined />),
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
  return (
    <Menu
      theme="dark"
      mode="inline"
      defaultSelectedKeys={['My profile']}
      items={[
        item('My profile', '/profile', <UserOutlined />),
        item('Companies', '/companies', <BankOutlined />),
      ]}
    />
  );
}
