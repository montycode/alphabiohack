"use client";

import { PST_TZ, dateKeyInTZ } from "@/lib/utils/timezone";
import { useEffect, useState } from "react";

interface TherapistDashboardData {
  kpis: {
    totalPatients: number;
    patientsToday: number;
    appointmentsToday: number;
    hoursToday: number;
  };
  kpisRange?: {
    appointments?: { value: number; deltaPercent: number };
    patients?: { value: number; deltaPercent: number };
  };
  range?: { from: string; to: string };
  appointments: Array<{
    id: string;
    date: string;
    time: string;
    name: string;
    service?: string;
    location?: string;
  }>;
  upcoming: {
    id: string;
    date: string;
    time: string;
    name: string;
    service?: string;
    location?: string;
  } | null;
  recentPatients: Array<{
    id: string;
    name: string;
    lastAppointment?: string | null;
    code?: string;
  }>;
  weeklyOverview?: Array<{ day: string; value: number }>;
  series?: {
    appointmentsDaily: Array<{ date: string; value: number }>;
    pendingDaily: Array<{ date: string; value: number }>;
    completedDaily: Array<{ date: string; value: number }>;
  };
  statusCounts?: Record<string, number>;
  invoices: Array<any>;
}

type RangeKey = "last7" | "today" | "thisWeek" | "last30" | "all";

function formatISODateOnly(date: Date): string {
  return dateKeyInTZ(date, PST_TZ);
}

function getRangeDates(range: RangeKey): { from?: string; to?: string } {
  const now = new Date();
  if (range === "today") {
    const from = formatISODateOnly(now);
    const to = formatISODateOnly(now);
    return { from, to };
  }
  if (range === "last7") {
    const fromDate = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);
    return { from: formatISODateOnly(fromDate), to: formatISODateOnly(now) };
  }
  if (range === "last30") {
    const fromDate = new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000);
    return { from: formatISODateOnly(fromDate), to: formatISODateOnly(now) };
  }
  if (range === "all") {
    return {};
  }
  // thisWeek: desde lunes de esta semana hasta hoy
  const day = now.getDay(); // 0=Sun..6=Sat
  const diffToMonday = (day + 6) % 7; // Sun->6, Mon->0, ...
  const monday = new Date(now);
  monday.setDate(now.getDate() - diffToMonday);
  return { from: formatISODateOnly(monday), to: formatISODateOnly(now) };
}

export function useTherapistDashboard(opts?: { range?: RangeKey }) {
  const [data, setData] = useState<TherapistDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const range = opts?.range ?? "last7";

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { from, to } = getRangeDates(range);
        const qs = new URLSearchParams();
        if (from) qs.set("from", from);
        if (to) qs.set("to", to);
        const url = `/api/dashboard/therapist${
          qs.toString() ? `?${qs.toString()}` : ""
        }`;
        const res = await fetch(url);
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.error || "Failed");
        setData(json.data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [range]);

  return { data, loading, error };
}
