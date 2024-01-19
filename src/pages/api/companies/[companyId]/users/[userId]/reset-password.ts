import {
  ResetPasswordRequest,
  ResetPasswordResponse,
} from '@/lib/apis/user.api';
import { withApiAuth } from '@/lib/hocs';
import prisma from '@/lib/prisma';
import { hash } from 'bcryptjs';

function trimAndValidateBody(body: ResetPasswordRequest) {
  body.password = body.password?.trim() || '';

  if (body.password.length === 0) {
    return 'Password is required';
  }

  return undefined;
}

export default withApiAuth<ResetPasswordRequest, ResetPasswordResponse>(
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

      const hashedPassword = await hash(body.password, 12);

      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          password: hashedPassword,
        },
        select: {
          id: true,
        },
      });

      return res.status(201).json({ success: true });
    }
  },
);
