import { PST_TZ, dateKeyInTZ } from "./timezone";

import { format } from "date-fns";

export interface BookingData {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  bookingSchedule: string;
  status: string;
  location: {
    title: string;
  };
  specialty?: {
    id: string;
    name: string;
  };
  service?: {
    id: string;
    description: string;
    cost: number;
    duration: number;
  };
  bookingNotes?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  type: "appointment" | "task" | "event";
  status?: "confirmed" | "pending" | "cancelled";
  color?: string;
  // Datos adicionales para appointments
  patientName?: string;
  patientEmail?: string;
  patientPhone?: string;
  location?: string;
  specialty?: string;
  service?: string;
  duration?: number;
  notes?: string;
}

export function convertBookingsToEvents(
  bookings: BookingData[]
): CalendarEvent[] {
  return bookings.map((booking) => {
    const patientName = `${booking.firstname} ${booking.lastname}`;
    const eventTime = new Date(booking.bookingSchedule);
    const timeString = eventTime.toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: PST_TZ,
    });

    // Usar el nombre completo del paciente + hora como título
    const eventTitle = `${patientName} - ${timeString}`;

    return {
      id: booking.id,
      title: eventTitle,
      time: booking.bookingSchedule,
      type: "appointment" as const,
      status: booking.status as "confirmed" | "pending" | "cancelled",
      patientName,
      patientEmail: booking.email,
      patientPhone: booking.phone,
      location: booking.location.title,
      specialty: booking.specialty?.name,
      service: booking.service?.description,
      duration: booking.service?.duration,
      notes: booking.bookingNotes,
    };
  });
}

export function getEventsForDate(
  events: CalendarEvent[],
  date: Date
): CalendarEvent[] {
  const dateKey = dateKeyInTZ(date);
  return events.filter((event) => {
    const eventDate = dateKeyInTZ(new Date(event.time));
    return eventDate === dateKey;
  });
}

export function getEventsForMonth(
  events: CalendarEvent[],
  date: Date
): CalendarEvent[] {
  const monthKey = format(date, "yyyy-MM");
  return events.filter((event) => {
    const eventMonth = format(new Date(event.time), "yyyy-MM");
    return eventMonth === monthKey;
  });
}
