import { randomUUID } from 'node:crypto';
import type { ServiceListing, ServiceListingFilters } from '@oficios/shared';
import { serviceListingRepository } from '../repositories/serviceListing.repository';
import { providerProfileService } from './providerProfile.service';
import { nextSequence } from '../repositories/counter.repository';
import { userRepository } from '../repositories/user.repository';

export const serviceListingService = {
  async create(
    providerUid: string,
    data: Pick<ServiceListing, 'oficio' | 'titulo' | 'descripcion' | 'zonaCobertura' | 'precioReferencia' | 'fotos'>,
  ): Promise<ServiceListing> {
    const eligibility = await providerProfileService.getEligibility(providerUid);
    if (!eligibility.eligible) {
      throw new Error('Account is not eligible to publish services yet');
    }
    const provider = await userRepository.get(providerUid);
    const now = new Date().toISOString();
    const listing: ServiceListing = {
      id: randomUUID(),
      folio: await nextSequence('serviceListings'),
      providerUid,
      providerName: provider?.displayName ?? 'Prestador sin nombre',
      telefono: provider?.phoneNumber ?? '',
      ...data,
      active: true,
      createdAt: now,
      updatedAt: now,
    };
    await serviceListingRepository.create(listing);
    return listing;
  },

  update(id: string, patch: Partial<ServiceListing>) {
    return serviceListingRepository.update(id, { ...patch, updatedAt: new Date().toISOString() });
  },

  listMine(providerUid: string) {
    return serviceListingRepository.listByProvider(providerUid);
  },

  search(filters: ServiceListingFilters) {
    return serviceListingRepository.search(filters);
  },

  getByFolio(folio: number) {
    return serviceListingRepository.getByFolio(folio);
  },
};
