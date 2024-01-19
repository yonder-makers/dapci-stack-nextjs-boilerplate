import { UserSession } from '@/lib/types';
import { NotificationsProvider } from '@/providers/notification.providers';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Button, Col, Layout, Row, theme } from 'antd';
import React, { useState } from 'react';
import { HeaderWelcomeMessage } from './HeaderWelcomeMessage';
import { SideMenu } from './SideMenu';

const { Sider, Content } = Layout;

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

  return (
    <NotificationsProvider>
      <Layout className="min-h-screen">
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="app-logo" />
          <SideMenu user={props.userSession} />
        </Sider>
        <Layout>
          <Layout.Header style={{ padding: 0, background: colorBgContainer }}>
            <Row justify="space-between">
              <Col span={2}>
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
