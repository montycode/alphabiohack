"use client";

import { CalendarView, ViewToggle } from "@/components/calendar";
import React, { useMemo, useState } from 'react';

import { BookingsDataTable } from "@/components/bookings/bookings-data-table";
import type { CalendarEvent } from "@/lib/utils/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { convertBookingsToEvents } from "@/lib/utils/calendar";
import { useTranslations } from "next-intl";
import { useUserBookings } from "@/hooks/use-user-bookings";

export default function AppointmentsPage() {
  const { bookings, loading, error, isTherapist } = useUserBookings();
  const t = useTranslations("Bookings");
  const [currentView, setCurrentView] = useState<'list' | 'calendar'>('list');

  // Convertir bookings a eventos del calendario
  const calendarEvents = useMemo(() => {
    return convertBookingsToEvents(bookings);
  }, [bookings]);

  const handleEventClick = (event: CalendarEvent) => {
    console.log('Event clicked:', event);
  };

  const handleEventEdit = (event: CalendarEvent) => {
    console.log('Edit event:', event);
  };

  const handleEventCancel = (event: CalendarEvent) => {
    console.log('Cancel event:', event);
  };

  const handleAddEvent = (date: Date) => {
    console.log('Add event for date:', date);
  };

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="space-y-2">
          <Skeleton className="h-8 w-[250px] bg-muted" />
          <Skeleton className="h-4 w-[400px] bg-muted" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full bg-muted" />
          <Skeleton className="h-[400px] w-full bg-muted" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="text-center text-red-500">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {isTherapist ? t("appointments") : t("myAppointments")}
          </h1>
          <p className="text-muted-foreground">
            {isTherapist ? t("manageAppointments") : t("viewMyAppointments")}
          </p>
        </div>
        
        <ViewToggle
          currentView={currentView}
          onViewChange={setCurrentView}
        />
      </div>
      
      {currentView === 'list' ? (
        <BookingsDataTable data={bookings} />
      ) : (
        <CalendarView
          events={calendarEvents}
          onEventClick={handleEventClick}
          onEventEdit={handleEventEdit}
          onEventCancel={handleEventCancel}
          onAddEvent={handleAddEvent}
        />
      )}
    </div>
  );
}
