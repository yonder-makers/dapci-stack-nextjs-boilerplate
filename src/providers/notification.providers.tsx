import { message } from 'antd';
import { MessageInstance } from 'antd/es/message/interface';
import { createContext, useContext, useMemo } from 'react';

type NotificationsValue = MessageInstance;

const NotificationContext = createContext<NotificationsValue>(undefined as any);

export function NotificationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [api, contextHolder] = message.useMessage();

  const value = useMemo(() => {
    return api;
  }, [api]);

  return (
    <>
      {contextHolder}
      <NotificationContext.Provider value={value}>
        {children}
      </NotificationContext.Provider>
    </>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  return context;
}
