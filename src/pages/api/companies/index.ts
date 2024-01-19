import { CompanyRequest, CompanyResponse } from '@/lib/apis/company.api';
import { withApiAuth } from '@/lib/hocs';
import prisma from '@/lib/prisma';
import { randomUUID } from 'crypto';

export default withApiAuth<CompanyRequest, CompanyResponse>(
  'SUPERADMIN',
  async (user, body, req, res) => {
    {
      if (req.method !== 'POST') {
        return res.status(405).json({ errorMessage: 'Method not allowed' });
      }

      const name = body.name?.trim() || '';

      if (name.length === 0) {
        return res.status(400).json({ errorMessage: 'Name is required' });
      }

      // todo: should compare with case insensitive
      const existing = await prisma.company.findFirst({
        where: {
          name,
        },
        select: {
          id: true,
        },
      });

      if (existing) {
        return res.status(409).json({ errorMessage: 'Company already exists' });
      }

      const newCompany = await prisma.company.create({
        data: {
          id: randomUUID(),
          name,
        },
      });

      return res.status(201).json({ id: newCompany.id, name: newCompany.name });
    }
  },
);
