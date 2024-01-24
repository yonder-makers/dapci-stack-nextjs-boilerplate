import prisma from '@/lib/prisma';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { compare } from 'bcryptjs';
import { getServerSession, type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { UserRoles, UserSession } from './types';

export const authOptions: NextAuthOptions = {
  // This is a temporary fix for prisma client.
  // @see https://github.com/prisma/prisma/issues/16117
  adapter: PrismaAdapter(prisma as any),
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Sign in',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'example@example.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !(await compare(credentials.password, user.password!))) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          companyId: user.companyId,
        };
      },
    }),
  ],
  callbacks: {
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role,
          companyId: token.companyId,
        },
      };
    },
    jwt: ({ token, user }) => {
      if (user) {
        const u = user as unknown as any;
        return {
          ...token,
          role: u.role,
          id: u.id,
          companyId: u.companyId,
        };
      }
      return token;
    },
  },
};

export async function getUserSession(context?: any) {
  const session = context
    ? await getServerSession(context.req, context.res, authOptions)
    : await getServerSession(authOptions);
  if (session?.user === undefined) {
    return undefined;
  }

  const user = session.user as any;

  return {
    id: user.id,
    companyId: user.companyId,
    role: user.role,
    email: user.email,
    name: user.name,
  } as UserSession;
}

export function hasAdminPermissions(session?: UserSession) {
  return session?.role === 'ADMIN';
}

export async function ensureAuthenticated() {
  const user = await getUserSession();
  if (!user) {
    throw new Error('Access denied. You must be logged in.');
  }

  return user;
}

export async function ensureCompanyRole() {
  const user = await getUserSession();
  if (!user) {
    throw new Error('Access denied. You must be logged in.');
  }

  switch (user.role) {
    case 'SUPERADMIN':
      throw new Error('Access denied. You must be a member of a company.');
    case 'ADMIN':
    case 'USER':
      return user;
    default:
      throw new Error('Access denied');
  }
}

export async function ensureSuperAdminRole() {
  const user = await getUserSession();
  if (!user) {
    throw new Error('Access denied. You must be logged in.');
  }

  switch (user.role) {
    case 'SUPERADMIN':
      return user;
    case 'ADMIN':
    case 'USER':
      throw new Error(
        'Access denied. You must be a super admin user to do this action.',
      );
    default:
      throw new Error('Access denied');
  }
}

export async function ensurePermissionForCompany(companyId: string) {
  const user = await getUserSession();
  if (!user) {
    throw new Error('Access denied. You must be logged in.');
  }

  switch (user.role) {
    case 'USER':
      if (user.companyId !== companyId) {
        throw new Error('Access denied');
      }
      break;
    case 'ADMIN':
      if (user.companyId !== companyId) {
        throw new Error('Access denied');
      }
      break;
    case 'SUPERADMIN':
      // super admin has access to all companies
      break;
    default:
      throw new Error('Access denied');
  }

  return user;
}
