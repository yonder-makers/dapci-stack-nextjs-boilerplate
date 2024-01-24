'use server';

import {
  ensureAuthenticated,
  ensurePermissionForCompany,
  ensureSuperAdminRole,
} from '@/lib/auth';
import prisma from '@/lib/prisma';
import { generateGuid } from '@/lib/utils';
import { hash } from 'bcryptjs';
import { promises as fsPromises } from 'fs';

type UserRequest = {
  name: string;
  email: string;
  password: string;
};

export type UserResponse = {
  id: string;
  name: string;
  email: string;
};

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

  if (body.password.length === 0) {
    return 'Password is required';
  }

  return undefined;
}

export async function createUser(companyId: string, body: UserRequest) {
  await ensurePermissionForCompany(companyId);

  const validationError = trimAndValidateBody(body);
  if (validationError) {
    throw new Error(validationError);
  }

  const existing = await prisma.user.findFirst({
    where: {
      email: body.email,
    },
    select: {
      id: true,
    },
  });

  if (existing) {
    throw new Error('User already exists');
  }

  const id = generateGuid();
  const hashedPassword = await hash(body.password!, 12);

  const newUser: UserResponse = await prisma.user.create({
    data: {
      id,
      name: body.name,
      email: body.email,
      password: hashedPassword,
      companyId,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  return newUser;
}

export async function updateUser(userId: string, body: UserRequest) {
  const existing = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      id: true,
      companyId: true,
    },
  });

  if (!existing) {
    throw new Error('User does not exist');
  }

  if (existing.companyId === null) {
    // this is a superadmin user. only admin role can change the password for another superadmin
    await ensureSuperAdminRole();
  } else {
    await ensurePermissionForCompany(existing.companyId);
  }

  // plugin dummy password to skip validation. it is not going to be used anyway
  body.password = 'lsdjfkhesdfjwlejr';
  const validationError = trimAndValidateBody(body);
  if (validationError) {
    throw new Error(validationError);
  }

  const updatedUser: UserResponse = await prisma.user.update({
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

  return updatedUser;
}

export async function resetPassword(userId: string, password: string) {
  const existing = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      id: true,
      companyId: true,
    },
  });

  if (!existing) {
    throw new Error('User does not exist');
  }

  if (existing.companyId === null) {
    // this is a superadmin user. only admin role can change the password for another superadmin
    await ensureSuperAdminRole();
  } else {
    await ensurePermissionForCompany(existing.companyId);
  }

  const hashedPassword = await hash(password, 12);

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

  return true;
}

export async function deleteMyAvatar() {
  const user = await ensureAuthenticated();

  await fsPromises.rm(`./public/avatars/${user.id}.jpg`);
  return {
    success: true,
  };
}
