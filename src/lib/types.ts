export type UserRoles = 'SUPERADMIN' | 'ADMIN' | 'USER';

export type UserSession = CompanyUser | SuperUser;

export type CompanyUser = {
  id: string;
  name: string;
  email: string;
  companyId: string;
  role: 'ADMIN' | 'USER';
};

export type SuperUser = {
  id: string;
  name: string;
  email: string;
  role: 'SUPERADMIN';
};

export class NotAuthenticatedError extends Error {
  constructor() {
    super('Access denied. You must be logged in.', {
      cause: 'NOT_AUTHENTICATED',
    });
  }
}
