import {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextApiRequest,
  NextApiResponse,
} from 'next';
import { ParsedUrlQuery } from 'querystring';
import { getUserSession } from './auth';
import { UserRoles, UserSession } from './types';

export type ErrorOutput = { errorMessage: string };
type OutputTypes = {} | ErrorOutput;

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
        userSession: session ?? null,
        params: context.params || null,
        ...output,
      },
    };
  };
}

function hasAccess(
  userSession: UserSession | undefined,
  role: UserRoles | 'ANONYMOUS',
  companyId?: string,
) {
  const userRole = userSession?.role || 'ANONYMOUS';
  const userCompanyId = userSession?.companyId || undefined;

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

export function withApiAuth<TInput, TOutput>(
  role: UserRoles | 'ANONYMOUS',
  fn: (
    user: UserSession,
    body: TInput,
    req: NextApiRequest,
    res: NextApiResponse<TOutput | ErrorOutput>,
  ) => Promise<any>,
) {
  return async function (
    req: NextApiRequest,
    res: NextApiResponse<TOutput | ErrorOutput>,
  ) {
    const session = await getUserSession({ req, res });
    const companyId = req.query.companyId as string | undefined;

    if (!hasAccess(session, role, companyId)) {
      return res.status(401).json({ errorMessage: 'Unauthorized' });
    }

    try {
      return await fn(session!, req.body, req, res);
    } catch (error) {
      const output = {
        errorMessage: (error as any)?.message ?? error ?? 'Unknown error',
      };

      return res.status(500).json(output);
    }
  };
}

export function withOptionalAuth<
  TParams extends ParsedUrlQuery = ParsedUrlQuery,
  TOutput extends OutputTypes = {},
>(fn: (user: UserSession | null, params: TParams) => Promise<TOutput>) {
  return async function (context: GetServerSidePropsContext<TParams>) {
    const session = await getUserSession(context);

    let output: TOutput = undefined as any;
    try {
      output = await fn(session ?? null, context.params as TParams);
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

    return {
      props: {
        user: session ?? null,
        params: context.params || null,
        ...output,
      },
    };
  };
}

export type WithAuthType = InferGetServerSidePropsType<
  ReturnType<typeof withAuth>
>;
