import './globals.css';

import { AppLayout } from '@/components/layout/AppLayout';
import { WithAuthType } from '@/lib/hocs';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps<WithAuthType>) {
  if ((Component as any).noLayout) {
    return <Component {...pageProps} />;
  }

  const user = pageProps.user || undefined;

  const errorMessage = (pageProps as any).errorMessage;
  if (errorMessage) {
    return (
      <AppLayout user={user}>
        <p>{errorMessage}</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout user={user}>
      <Component {...pageProps} />
    </AppLayout>
  );
}
