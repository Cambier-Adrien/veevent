import { useState, useEffect, useCallback } from "react";
import { placeService } from "@/services/place-service";
import { SinglePlace } from "@/types";

interface UsePlaceReturn {
  place: SinglePlace | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const usePlace = (slug: string): UsePlaceReturn => {
  const [place, setPlace] = useState<SinglePlace | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPlace = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await placeService.getPlaceBySlug(slug);
      setPlace(data);
    } catch (err) {
      setError(err as Error);
      setPlace(null);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchPlace();
  }, [fetchPlace]);

  const refetch = useCallback(() => {
    fetchPlace();
  }, [fetchPlace]);

  return { place, loading, error, refetch };
};
