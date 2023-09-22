export type UserRoles = 'SUPERADMIN' | 'ADMIN' | 'USER';

export type UserSession = {
  id: string;
  name: string;
  email: string;
  companyId?: string;
  role: UserRoles;
};
