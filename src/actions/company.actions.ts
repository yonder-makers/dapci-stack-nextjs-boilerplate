'use server';
import { ensureSuperAdminRole } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { generateGuid } from '@/lib/utils';

type CompanyRequest = {
  name: string;
};

export type CompanyResponse = {
  id: string;
  name: string;
};

function cleanAndValidateCompany(company: CompanyRequest) {
  company.name = (company.name || '').trim();

  if (company.name.length === 0) {
    throw new Error('Name is required');
  }
}

export async function createCompany(company: CompanyRequest) {
  await ensureSuperAdminRole();

  cleanAndValidateCompany(company);

  // check for existing company
  const existingCompany = await prisma.company.findFirst({
    where: {
      name: company.name,
    },
  });

  if (existingCompany) {
    throw new Error('Company already exists');
  }

  const id = generateGuid();
  const newCompany: CompanyResponse = await prisma.company.create({
    data: {
      id,
      name: company.name,
    },
  });

  return newCompany;
}

export async function updateCompany(
  companyId: string,
  company: CompanyRequest,
) {
  await ensureSuperAdminRole();

  cleanAndValidateCompany(company);

  // check for existing company with this name
  const existingCompany = await prisma.company.findFirst({
    where: {
      name: company.name,
    },
  });

  if (existingCompany && existingCompany.id !== companyId) {
    throw new Error('Company already exists');
  }

  const updatedCompany: CompanyResponse = await prisma.company.update({
    where: {
      id: companyId,
    },
    data: {
      name: company.name,
    },
  });

  return updatedCompany;
}
