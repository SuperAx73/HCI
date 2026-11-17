import type { Response } from 'express';
import type { AuthedRequest } from '../middleware/auth.middleware';
import { verificationRequestRepository } from '../repositories/verificationRequest.repository';
import { providerProfileService } from '../services/providerProfile.service';

export const adminController = {
  async listPendingVerifications(_req: AuthedRequest, res: Response) {
    const requests = await verificationRequestRepository.listPending();
    res.json(requests);
  },

  async reviewVerification(req: AuthedRequest, res: Response) {
    const { requestId } = req.params as { requestId: string };
    const { decision, rejectionReason } = req.body as {
      decision: 'approved' | 'rejected';
      rejectionReason?: string;
    };
    const eligibility = await providerProfileService.reviewVerification(
      requestId,
      req.uid!,
      decision,
      rejectionReason,
    );
    res.json(eligibility);
  },
};
