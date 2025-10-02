"use client";

import { CalendarPlus, ChevronDown, Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { buildGoogleCalendarUrl, buildICS } from "@/lib/utils/calendar-links";

import { Button } from "@/components/ui/button";
import React from "react";
import { useTranslations } from "next-intl";

export type AddToCalendarProps = {
  title: string;
  description?: string;
  location?: string;
  // Base date y horas en HH:mm (PST según utilidades internas)
  date: Date;
  startTimeHHmm: string;
  endTimeHHmm: string;
  organizerEmail?: string;
  filename?: string;
  className?: string;
};

export function AddToCalendarButton({
  title,
  description = "",
  location = "",
  date,
  startTimeHHmm,
  endTimeHHmm,
  organizerEmail,
  filename,
  className = "",
}: AddToCalendarProps) {
  const t = useTranslations("Booking");

  const googleUrl = React.useMemo(() => {
    return buildGoogleCalendarUrl({
      title,
      description,
      location,
      date,
      startTimeHHmm,
      endTimeHHmm,
    });
  }, [title, description, location, date, startTimeHHmm, endTimeHHmm]);

  const onGoogle = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(googleUrl, "_blank", "noopener,noreferrer");
  };

  const onDownloadICS = (e: React.MouseEvent) => {
    e.preventDefault();
    const ics = buildICS({
      uid: `evt-${Date.now()}@booking-saas`,
      organizerEmail: organizerEmail || process.env.NEXT_PUBLIC_BOOKING_FROM_EMAIL || "no-reply@booking-saas.com",
      title,
      description,
      location,
      date,
      startTimeHHmm,
      endTimeHHmm,
    });
    downloadBlob(`${slugify(filename || title || "event")}.ics`, ics);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={`inline-flex items-center gap-2 rounded-md px-3 py-2 shadow-sm ring-1 ring-slate-200 hover:shadow-md ${className}`}
          aria-label={t("addToGoogleCalendar", { default: "Add to calendar" })}
          variant="outline"
        >
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-sm bg-gradient-to-br from-blue-500 to-blue-700 text-white">
            <CalendarPlus size={16} />
          </span>
          <span className="text-sm font-medium">{t("addToGoogleCalendar", { default: "Add to calendar" })}</span>
          <ChevronDown size={16} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56">
        <DropdownMenuItem onClick={onGoogle}>
          <div className="flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <rect x="3" y="5" width="18" height="14" rx="2" fill="#1a73e8" />
              <rect x="4.5" y="6.5" width="3" height="3" rx="0.5" fill="#34a853" />
              <rect x="8.5" y="6.5" width="3" height="3" rx="0.5" fill="#fbbc05" />
              <rect x="12.5" y="6.5" width="3" height="3" rx="0.5" fill="#ea4335" />
            </svg>
            <span>{t("addToGoogleCalendar", { default: "Google Calendar" })}</span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={onDownloadICS}>
          <div className="flex items-center gap-2">
            <Download size={16} />
            <span>{t("downloadICS", { default: "Download .ics" })}</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function downloadBlob(filename: string, content: string, mime = "text/calendar;charset=utf-8") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

function slugify(text: string) {
  return text
    .toString()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
