"use client";

import { useCallback, useEffect, useState } from "react";

import { API_ENDPOINTS } from "@/constants";

export interface OverrideTimeSlotUI {
  id?: string;
  startTime: string;
  endTime: string;
  isActive?: boolean;
}

export interface DateOverrideUI {
  id?: string;
  locationId: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  isClosed: boolean;
  reason?: string | null;
  timeSlots?: OverrideTimeSlotUI[];
}

export function useOverrides(
  locationId?: string,
  fromISO?: string,
  toISO?: string
) {
  const [overrides, setOverrides] = useState<DateOverrideUI[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOverrides = useCallback(
    async (locId?: string, from?: string, to?: string) => {
      if (!locId) return [] as DateOverrideUI[];
      try {
        setLoading(true);
        setError(null);
        const qs = new URLSearchParams();
        qs.set("locationId", locId);
        if (from) qs.set("from", from);
        if (to) qs.set("to", to);
        const url = `${API_ENDPOINTS.OVERRIDES.BASE}?${qs.toString()}`;
        const res = await fetch(url, { cache: "no-store" });
        const json = await res.json();
        if (!res.ok || !json.success)
          throw new Error(json.error || "Error loading overrides");
        const data =
          Array.isArray(json.data) ? json.data
          : json.data ? [json.data]
          : [];
        setOverrides(
          data.map((o: any) => ({
            id: o.id,
            locationId: o.locationId,
            startDate: new Date(o.startDate).toISOString(),
            endDate: new Date(o.endDate).toISOString(),
            isClosed: o.isClosed,
            reason: o.reason ?? null,
            timeSlots: (o.timeSlots || []).map((s: any) => ({
              id: s.id,
              startTime: s.startTime,
              endTime: s.endTime,
              isActive: s.isActive,
            })),
          }))
        );
        return data;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
        return [] as DateOverrideUI[];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (locationId) {
      fetchOverrides(locationId, fromISO, toISO);
    }
  }, [locationId, fromISO, toISO, fetchOverrides]);

  const refetch = useCallback(
    () => fetchOverrides(locationId, fromISO, toISO),
    [locationId, fromISO, toISO, fetchOverrides]
  );

  return { overrides, loading, error, refetch, fetchOverrides };
}
