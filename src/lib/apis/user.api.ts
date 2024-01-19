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

export async function createUser(companyId: string, user: UserRequest) {
  const url = `/api/companies/${companyId}/users`;
  const body: UserRequest = {
    name: user.name,
    email: user.email,
    password: user.password,
  };

  const request = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const response = await request.json();

  return response as UserResponse;
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

  const request = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const response = await request.json();

  return response as UserResponse;
}
