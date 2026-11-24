import { useCallback, useEffect, useState } from 'react';
import type { Review, ReviewInput } from '@oficios/shared';
import { api } from '../api/client';

export function useReviews(listingId: string | undefined) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!listingId) return;
    setLoading(true);
    try {
      setReviews(await api.get<Review[]>(`/listings/${listingId}/reviews`));
    } finally {
      setLoading(false);
    }
  }, [listingId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function submit(input: ReviewInput) {
    await api.post(`/listings/${listingId}/reviews`, input);
    await refresh();
  }

  return { reviews, loading, submit };
}
