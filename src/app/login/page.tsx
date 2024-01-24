'use server';
import { getUserSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { LoginForm } from '@/components/forms/Login.form';
import { Flex } from 'antd';

export default async function ServerPage() {
  const user = await getUserSession();
  if (user) {
    redirect('/my-profile');
  }

  return (
    <Flex align="stretch" justify="center">
      <LoginForm />
      {/* <section className="bg-ct-blue-600 min-h-screen pt-20">
        <div className="container mx-auto flex h-full items-center justify-center px-6 py-12">
          <div className="bg-white px-8 py-10 md:w-8/12 lg:w-5/12">
          </div>
        </div>
      </section> */}
    </Flex>
  );
}
