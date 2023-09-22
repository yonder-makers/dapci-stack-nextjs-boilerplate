import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { getUserSession } from './auth';
import { UserRoles, UserSession } from './types';

type OutputTypes = {} | { errorMessage: string };

export function withAuth<
  TParams extends ParsedUrlQuery = ParsedUrlQuery,
  TOutput extends OutputTypes = {},
>(
  role: UserRoles | 'ANONYMOUS',
  fn: (user: UserSession | undefined, params: TParams) => Promise<TOutput>,
) {
  return async function (context: GetServerSidePropsContext<TParams>) {
    const session = await getUserSession(context);
    const companyId = context.params?.companyId as string | undefined;

    let output: TOutput = undefined as any;
    if (!hasAccess(session, role, companyId)) {
      return {
        redirect: {
          permanent: false,
          destination: '/login',
        },
      };
    } else {
      try {
        output = await fn(session, context.params as TParams);
        if ((output as any)?.redirect) {
          return {
            redirect: {
              permanent: false,
              destination: (output as any)?.redirect,
            },
          };
        }
      } catch (error) {
        output = {
          errorMessage: (error as any)?.message ?? error ?? 'Unknown error',
        } as TOutput;
      }
    }

    return {
      props: {
        user: session ?? null,
        params: context.params || null,
        ...output,
      },
    };
  };
}

function hasAccess(
  user: UserSession | undefined,
  role: UserRoles | 'ANONYMOUS',
  companyId?: string,
) {
  const userRole = user?.role || 'ANONYMOUS';
  const userCompanyId = user?.companyId || undefined;

  if (userRole === 'SUPERADMIN') return true;

  if (role === 'ANONYMOUS') {
    return true;
  }

  if (userRole === 'ADMIN' && (role === 'ADMIN' || role === 'USER')) {
    if (!companyId) {
      return true;
    }

    return userCompanyId === companyId;
  }

  if (userRole === 'USER' && role === 'USER') {
    if (!companyId) {
      return true;
    }

    return userCompanyId === companyId;
  }

  return false;
}

export type WithAuthType = InferGetServerSidePropsType<
  ReturnType<typeof withAuth>
>;
