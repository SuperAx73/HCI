export type VerificationStatus = 'none' | 'pending' | 'approved' | 'rejected';

export interface VerificationInfo {
  status: VerificationStatus;
  idPhotoUrl?: string;
  selfiePhotoUrl?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface ProviderProfile {
  uid: string;
  oficio: string;
  zonaCobertura: string;
  precioReferencia: number;
  descripcion: string;
  fotosTrabajos: string[];
  verification: VerificationInfo;
  /** computed: every required field above is filled in */
  profileComplete: boolean;
  updatedAt: string;
}

export const PROVIDER_PROFILE_REQUIRED_FIELDS: Array<keyof ProviderProfile> = [
  'oficio',
  'zonaCobertura',
  'precioReferencia',
  'descripcion',
];
