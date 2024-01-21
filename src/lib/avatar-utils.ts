import { existsSync } from 'fs';

export function hasAvatar(userId: string) {
  // look into public/avatars folder to see if the file exists
  const path = `./public/avatars/${userId}.jpg`;
  return existsSync(path);
}

export function getAvatarUrlIfExist(userId: string) {
  const exists = hasAvatar(userId);
  if (exists) {
    return `./avatars/${userId}.jpg`;
  }

  return undefined;
}
