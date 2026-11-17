import type { AppUser } from '@oficios/shared';
import { userRepository } from '../repositories/user.repository';

export const authService = {
  async ensureUserDoc(uid: string, email: string, displayName: string): Promise<AppUser> {
    const existing = await userRepository.get(uid);
    if (existing) return existing;

    const user: AppUser = {
      uid,
      email,
      displayName,
      phoneVerified: false,
      roles: { client: true, provider: false },
      activeRole: 'client',
      createdAt: new Date().toISOString(),
    };
    await userRepository.create(user);
    return user;
  },

  async setPhoneVerified(uid: string, phoneNumber: string): Promise<void> {
    await userRepository.update(uid, { phoneNumber, phoneVerified: true });
  },

  async switchActiveRole(uid: string, role: 'client' | 'provider'): Promise<AppUser> {
    const user = await userRepository.get(uid);
    if (!user) throw new Error('User not found');
    if (role === 'provider' && !user.roles.provider) {
      throw new Error('Provider role is not enabled for this account yet');
    }
    await userRepository.update(uid, { activeRole: role });
    return { ...user, activeRole: role };
  },
};
