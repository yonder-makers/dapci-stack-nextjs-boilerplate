import { UserRequest, UserResponse } from '@/lib/apis/user.api';
import { withApiAuth } from '@/lib/hocs';
import prisma from '@/lib/prisma';

function trimAndValidateBody(body: UserRequest) {
  body.name = body.name?.trim() || '';
  body.email = body.email?.trim() || '';
  body.password = body.password?.trim() || '';

  if (body.name.length === 0) {
    return 'Name is required';
  }

  if (body.email.length === 0) {
    return 'Email is required';
  }

  return undefined;
}

export default withApiAuth<UserRequest, UserResponse>(
  'ADMIN',
  async (user, body, req, res) => {
    {
      if (req.method !== 'POST') {
        return res.status(405).json({ errorMessage: 'Method not allowed' });
      }

      const validationError = trimAndValidateBody(body);
      if (validationError) {
        return res.status(400).json({ errorMessage: validationError });
      }

      const companyId = req.query.companyId as string;
      const userId = req.query.userId as string;

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

      const user = await prisma.user.findFirst({
        where: {
          id: userId,
          companyId: companyId,
        },
        select: {
          id: true,
        },
      });

      if (!user) {
        return res.status(404).json({ errorMessage: 'User does not exist' });
      }

      const updatedUser = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          name: body.name,
          email: body.email,
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });

      return res.status(201).json(updatedUser);
    }
  },
);
