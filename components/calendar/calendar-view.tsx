"use client"

import { PST_TZ, dateKeyInTZ } from '@/lib/utils/timezone';
import React, { useMemo, useState } from 'react';

import { AppointmentsCalendar } from './appointments-calendar';
import type { CalendarEvent } from '@/lib/utils/calendar';
import { EventDetailsDialog } from './event-details-dialog';
import { EventList } from './event-list';
import { cn } from '@/lib/utils';

interface CalendarViewProps {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onEventEdit?: (event: CalendarEvent) => void;
  onEventCancel?: (event: CalendarEvent) => void;
  onAddEvent?: (date: Date) => void;
  className?: string;
}

export function CalendarView({
  events,
  onEventClick,
  onEventEdit,
  onEventCancel,
  onAddEvent,
  className
}: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filtrar eventos del día seleccionado
  const dayEvents = useMemo(() => {
    const dateKey = dateKeyInTZ(selectedDate, PST_TZ);
    return events.filter(event => {
      const eventDate = dateKeyInTZ(new Date(event.time), PST_TZ);
      return eventDate === dateKey;
    });
  }, [events, selectedDate]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
    onEventClick?.(event);
  };

  const handleEventEdit = (event: CalendarEvent) => {
    setIsDialogOpen(false);
    onEventEdit?.(event);
  };

  const handleEventCancel = (event: CalendarEvent) => {
    setIsDialogOpen(false);
    onEventCancel?.(event);
  };

  const handleAddEvent = (date: Date) => {
    setSelectedDate(date);
    onAddEvent?.(date);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Calendario */}
      <AppointmentsCalendar
        events={events}
        onDateSelect={handleDateSelect}
        onEventClick={handleEventClick}
        onAddEvent={handleAddEvent}
      />
      
      {/* Lista de eventos del día */}
      <EventList
        date={selectedDate}
        events={dayEvents}
        onEventClick={handleEventClick}
      />
      
      {/* Dialog de detalles */}
      <EventDetailsDialog
        event={selectedEvent}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onEdit={handleEventEdit}
        onCancel={handleEventCancel}
      />
    </div>
  );
}
