import type { Response } from 'express';
import type { AuthedRequest } from '../middleware/auth.middleware';
import { authService } from '../services/auth.service';
import { userRepository } from '../repositories/user.repository';
import { auth as firebaseAuth } from '../config/firebase';

export const authController = {
  /**
   * Self-heals accounts created directly in Firebase Auth (e.g. a test user
   * added from the console) that never went through POST /auth/register
   * and therefore have no Firestore users/{uid} document yet.
   */
  async me(req: AuthedRequest, res: Response) {
    let user = await userRepository.get(req.uid!);
    if (!user) {
      const firebaseUser = await firebaseAuth.getUser(req.uid!);
      user = await authService.ensureUserDoc(
        req.uid!,
        firebaseUser.email ?? '',
        firebaseUser.displayName ?? firebaseUser.email ?? 'Usuario',
      );
    }
    res.json({ ...user, isAdmin: req.isAdmin ?? false });
  },

  async register(req: AuthedRequest, res: Response) {
    const { email, displayName } = req.body as { email: string; displayName: string };
    const user = await authService.ensureUserDoc(req.uid!, email, displayName);
    res.status(201).json(user);
  },

  async verifyPhone(req: AuthedRequest, res: Response) {
    const { phoneNumber } = req.body as { phoneNumber: string };
    await authService.setPhoneVerified(req.uid!, phoneNumber);
    res.status(204).end();
  },

  async switchRole(req: AuthedRequest, res: Response) {
    const { role } = req.body as { role: 'client' | 'provider' };
    try {
      const user = await authService.switchActiveRole(req.uid!, role);
      res.json(user);
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  },
};
