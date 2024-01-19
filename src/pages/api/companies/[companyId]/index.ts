import { CompanyRequest, CompanyResponse } from '@/lib/apis/company.api';
import { withApiAuth } from '@/lib/hocs';
import prisma from '@/lib/prisma';

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

      const companyId = req.query.companyId as string;

      // todo: should compare with case insensitive
      const existing = await prisma.company.findUnique({
        where: {
          id: companyId,
        },
        select: {
          id: true,
        },
      });

      if (!existing) {
        return res.status(404).json({ errorMessage: 'Company does not exist' });
      }

      const newCompany = await prisma.company.update({
        where: {
          id: companyId,
        },
        data: {
          name,
        },
      });

      return res.status(201).json({ id: newCompany.id, name: newCompany.name });
    }
  },
);
