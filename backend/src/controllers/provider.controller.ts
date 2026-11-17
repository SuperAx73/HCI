import type { Response } from 'express';
import type { AuthedRequest } from '../middleware/auth.middleware';
import { providerProfileService } from '../services/providerProfile.service';
import { providerProfileRepository } from '../repositories/providerProfile.repository';

export const providerController = {
  async getProfile(req: AuthedRequest, res: Response) {
    const profile = await providerProfileRepository.get(req.uid!);
    res.json(profile);
  },

  async upsertProfile(req: AuthedRequest, res: Response) {
    const profile = await providerProfileService.upsertProfile(req.uid!, req.body);
    res.json(profile);
  },

  async submitVerification(req: AuthedRequest, res: Response) {
    const { displayName, idPhotoUrl, selfiePhotoUrl } = req.body as {
      displayName: string;
      idPhotoUrl: string;
      selfiePhotoUrl: string;
    };
    const request = await providerProfileService.submitVerification(
      req.uid!,
      displayName,
      idPhotoUrl,
      selfiePhotoUrl,
    );
    res.status(201).json(request);
  },

  async getEligibility(req: AuthedRequest, res: Response) {
    const uid = req.params.uid ?? req.uid!;
    const eligibility = await providerProfileService.getEligibility(uid);
    res.json(eligibility);
  },
};
