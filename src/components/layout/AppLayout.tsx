'use client';
import { UserSession } from '@/lib/types';
import { NotificationsProvider } from '@/providers/notification.providers';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Button, Col, Layout, Row, theme } from 'antd';
import React, { useState } from 'react';
import { HeaderWelcomeMessage } from './HeaderWelcomeMessage';
import { SideMenu } from './SideMenu';

const { Sider, Content } = Layout;

const SHOW_SIDEMENU_IF_ANONYMOUS = false;

type AppLayoutProps = {
  children: React.ReactNode;
  userSession?: UserSession;
};
export function AppLayout(props: AppLayoutProps) {
  const { children } = props;
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const showSideMenu = SHOW_SIDEMENU_IF_ANONYMOUS || props.userSession;

  return (
    <NotificationsProvider>
      <Layout className="min-h-screen">
        {showSideMenu ? (
          <Sider trigger={null} collapsible collapsed={collapsed}>
            <div className="app-logo" />
            <SideMenu user={props.userSession} />
          </Sider>
        ) : null}
        <Layout>
          <Layout.Header style={{ padding: 0, background: colorBgContainer }}>
            <Row justify="space-between">
              <Col span={2}>
                {showSideMenu ? (
                  <Button
                    type="text"
                    icon={
                      collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
                    }
                    onClick={() => setCollapsed(!collapsed)}
                    style={{
                      fontSize: '16px',
                      width: 64,
                      height: 64,
                    }}
                  />
                ) : null}
              </Col>
              <Col span={14} className="pe-4 text-right">
                <HeaderWelcomeMessage user={props.userSession} />
              </Col>
            </Row>
          </Layout.Header>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
              // background: colorBgContainer,
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </NotificationsProvider>
  );
}
