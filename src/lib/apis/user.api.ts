import axios from 'axios';

export type UserRequest = {
  name: string;
  email: string;
  password?: string;
};

export type UserResponse = {
  id: string;
  name: string;
  email: string;
  companyId?: string;
};

export type ResetPasswordRequest = {
  password: string;
};

export type ResetPasswordResponse = {
  success: true;
};

export async function createUser(companyId: string, user: UserRequest) {
  const url = `/api/companies/${companyId}/users`;
  const body: UserRequest = {
    name: user.name,
    email: user.email,
    password: user.password,
  };

  const response = await axios.post<UserResponse>(url, body);

  return response.data;
}

export async function updateUser(
  companyId: string,
  id: string,
  user: UserRequest,
) {
  const url = `/api/companies/${companyId}/users/${id}`;

  const body: UserRequest = {
    name: user.name,
    email: user.email,
  };

  const response = await axios.post<UserResponse>(url, body);

  return response.data;
}

export async function resetPassword(
  companyId: string,
  userId: string,
  password: string,
) {
  const url = `/api/companies/${companyId}/users/${userId}/reset-password`;

  const body: ResetPasswordRequest = {
    password,
  };

  const response = await axios.post<ResetPasswordResponse>(url, body);

  return response.data;
}
