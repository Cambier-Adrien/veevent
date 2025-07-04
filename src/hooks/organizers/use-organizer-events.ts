"use client";
import { useState, useEffect, useCallback } from "react";
import { userService } from "@/services/user-service";
import { Event, EventsResponse } from "@/types";

// Fonction pour extraire l'ID depuis le lien HATEOAS
const extractIdFromSelfLink = (event: Event): string => {
  const href = event._links.self.href;
  const id = href.split("/").pop();
  return id || "";
};

export function useOrganizerEvents(
  userId: number | null, 
  currentEventId?: string, 
  limit?: number
) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  const fetchEvents = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data: EventsResponse = await userService.getUserEventsById(userId);
      
      // Ajouter l'ID extrait du lien HATEOAS à chaque événement
      let eventsWithId = (data._embedded?.eventSummaryResponses || []).map(event => ({
        ...event,
        id: parseInt(extractIdFromSelfLink(event)) || event.id
      }));

      // Filtrer l'événement actuel si spécifié
      if (currentEventId) {
        eventsWithId = eventsWithId.filter(event => 
          event.id?.toString() !== currentEventId
        );
      }

      // Appliquer la limite si spécifiée
      if (limit) {
        eventsWithId = eventsWithId.slice(0, limit);
      }
      
      setEvents(eventsWithId);
      setPagination(data.page || null);
    } catch (err) {
      setError(err as Error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [userId, currentEventId, limit]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const refetch = useCallback(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { 
    events, 
    loading, 
    error, 
    refetch, 
    pagination,
    hasNextPage: pagination ? pagination.number < pagination.totalPages - 1 : false,
    hasPreviousPage: pagination ? pagination.number > 0 : false
  };
}
