import { randomUUID } from 'node:crypto';
import type { ProviderProfile, VerificationRequest } from '@oficios/shared';
import { providerProfileRepository } from '../repositories/providerProfile.repository';
import { verificationRequestRepository } from '../repositories/verificationRequest.repository';
import { userRepository } from '../repositories/user.repository';
import { evaluateProviderEligibility, type EligibilityResult } from './providerEligibility.service';

export const providerProfileService = {
  async upsertProfile(
    uid: string,
    data: Pick<ProviderProfile, 'oficio' | 'zonaCobertura' | 'precioReferencia' | 'descripcion' | 'fotosTrabajos'>,
  ): Promise<ProviderProfile> {
    const existing = await providerProfileRepository.get(uid);
    const profile: ProviderProfile = {
      uid,
      ...data,
      verification: existing?.verification ?? { status: 'none' },
      profileComplete: false,
      updatedAt: new Date().toISOString(),
    };
    profile.profileComplete = evaluateProviderEligibility(profile).profileComplete;
    await providerProfileRepository.upsert(profile);
    return profile;
  },

  async submitVerification(
    uid: string,
    displayName: string,
    idPhotoUrl: string,
    selfiePhotoUrl: string,
  ): Promise<VerificationRequest> {
    const request: VerificationRequest = {
      id: randomUUID(),
      uid,
      displayName,
      idPhotoUrl,
      selfiePhotoUrl,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    await verificationRequestRepository.create(request);
    await providerProfileRepository.upsert({
      uid,
      verification: { status: 'pending', idPhotoUrl, selfiePhotoUrl },
    } as ProviderProfile);
    return request;
  },

  async getEligibility(uid: string): Promise<EligibilityResult> {
    const profile = await providerProfileRepository.get(uid);
    return evaluateProviderEligibility(profile);
  },

  /** Called by the admin panel. Re-evaluates eligibility and flips roles.provider accordingly. */
  async reviewVerification(
    requestId: string,
    reviewerUid: string,
    decision: 'approved' | 'rejected',
    rejectionReason?: string,
  ): Promise<EligibilityResult> {
    const request = await verificationRequestRepository.get(requestId);
    if (!request) throw new Error('Verification request not found');

    const reviewedAt = new Date().toISOString();
    await verificationRequestRepository.update(requestId, {
      status: decision,
      reviewedBy: reviewerUid,
      reviewedAt,
      rejectionReason,
    });
    await providerProfileRepository.upsert({
      uid: request.uid,
      verification: {
        status: decision,
        idPhotoUrl: request.idPhotoUrl,
        selfiePhotoUrl: request.selfiePhotoUrl,
        reviewedBy: reviewerUid,
        reviewedAt,
        rejectionReason,
      },
    } as any);

    const profile = await providerProfileRepository.get(request.uid);
    const eligibility = evaluateProviderEligibility(profile);
    await userRepository.update(request.uid, {
      roles: { client: true, provider: eligibility.eligible },
    } as any);
    return eligibility;
  },
};
