import axios from 'axios';
export type CompanyRequest = {
  name: string;
};

export type CompanyResponse = {
  id: string;
  name: string;
};

export async function createCompany(name: string) {
  const body = { name } as CompanyRequest;
  const url = '/api/companies';
  const response = await axios.post<CompanyResponse>(url, body);

  return response.data;
}

export async function updateCompany(id: string, name: string) {
  const body = { name } as CompanyRequest;
  const url = `/api/companies/${id}`;
  const response = await axios.post<CompanyResponse>(url, body);

  return response.data;
}
