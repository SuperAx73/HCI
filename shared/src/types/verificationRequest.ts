import type { VerificationStatus } from './providerProfile';

export interface VerificationRequest {
  id: string;
  uid: string;
  displayName: string;
  idPhotoUrl: string;
  selfiePhotoUrl: string;
  status: VerificationStatus;
  createdAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}
