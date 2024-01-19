export type CompanyRequest = {
  name: string;
};

export type CompanyResponse = {
  id: string;
  name: string;
};

export async function createCompany(name: string) {
  const body = { name } as CompanyRequest;
  const request = await fetch('/api/companies', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const response = await request.json();

  return response as CompanyResponse;
}

export async function updateCompany(id: string, name: string) {
  const body = { name } as CompanyRequest;
  const request = await fetch(`/api/companies/${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const response = await request.json();

  return response as CompanyResponse;
}
