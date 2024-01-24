'use server';

import { ensureAuthenticated } from '@/lib/auth';
import MyProfile, { MyProfileFields } from './MyProfile.client';
import { getAvatarUrlIfExist } from '@/lib/avatar-utils';
import prisma from '@/lib/prisma';

export default async function ServerPage() {
  const user = await ensureAuthenticated();
  const avatarUrl = getAvatarUrlIfExist(user.id);

  const dbUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      companyId: true,
      role: true,
    },
  });

  if (!dbUser) {
    throw new Error('User not found');
  }

  return (
    <MyProfile userId={user.id} avatarUrl={avatarUrl} initialValues={dbUser} />
  );
}
