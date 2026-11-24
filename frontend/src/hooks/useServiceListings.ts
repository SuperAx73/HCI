import { useCallback, useEffect, useState } from 'react';
import type { ServiceListing, ServiceListingFilters } from '@oficios/shared';
import { api } from '../api/client';

export function useMyListings() {
  const [listings, setListings] = useState<ServiceListing[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setListings(await api.get<ServiceListing[]>('/listings/mine'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { listings, loading, refresh };
}

export function useSearchListings(filters: ServiceListingFilters) {
  const [listings, setListings] = useState<ServiceListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.oficio) params.set('oficio', filters.oficio);
    if (filters.zonaCobertura) params.set('zonaCobertura', filters.zonaCobertura);
    if (filters.q) params.set('q', filters.q);

    setLoading(true);
    api
      .get<ServiceListing[]>(`/listings/search?${params.toString()}`)
      .then(setListings)
      .finally(() => setLoading(false));
  }, [filters.oficio, filters.zonaCobertura, filters.q]);

  return { listings, loading };
}

export function useListingByFolio(folio: number | undefined) {
  const [listing, setListing] = useState<ServiceListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!folio) return;
    setLoading(true);
    setNotFound(false);
    api
      .get<ServiceListing>(`/listings/folio/${folio}`)
      .then(setListing)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [folio]);

  return { listing, loading, notFound };
}
