import { withAuth } from '@/lib/hocs';
import { LoginForm } from '@/components/forms/Login.form';

export const getServerSideProps = withAuth(
  'ANONYMOUS',
  async function (session) {
    if (session) {
      return {
        redirect: '/my-profile',
      };
    }

    return {};
  },
);

export default function LoginPage() {
  return (
    <>
      <section className="bg-ct-blue-600 min-h-screen pt-20">
        <div className="container mx-auto flex h-full items-center justify-center px-6 py-12">
          <div className="bg-white px-8 py-10 md:w-8/12 lg:w-5/12">
            <LoginForm />
          </div>
        </div>
      </section>
    </>
  );
}
