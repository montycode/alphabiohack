import { PST_TZ, combineDateAndTimeToUtc } from "@/lib/utils/timezone";

export type CalendarEventInput = {
  title: string;
  description?: string;
  location?: string;
  // Inicio/fin en PST base (fecha seleccionada y HH:mm)
  date: Date;
  startTimeHHmm: string;
  endTimeHHmm: string;
};

function toGoogleDateUTC(date: Date): string {
  // yyyymmddThhmmssZ
  const pad = (n: number) => n.toString().padStart(2, "0");
  const yyyy = date.getUTCFullYear();
  const MM = pad(date.getUTCMonth() + 1);
  const dd = pad(date.getUTCDate());
  const hh = pad(date.getUTCHours());
  const mm = pad(date.getUTCMinutes());
  const ss = pad(date.getUTCSeconds());
  return `${yyyy}${MM}${dd}T${hh}${mm}${ss}Z`;
}

export function buildGoogleCalendarUrl(
  input: CalendarEventInput,
  tz: string = PST_TZ
): string {
  const startUtc = combineDateAndTimeToUtc(input.date, input.startTimeHHmm, tz);
  const endUtc = combineDateAndTimeToUtc(input.date, input.endTimeHHmm, tz);
  const dates = `${toGoogleDateUTC(startUtc)}/${toGoogleDateUTC(endUtc)}`;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: input.title,
    dates,
    details: input.description || "",
    location: input.location || "",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function buildICS(
  input: CalendarEventInput & {
    uid: string;
    organizerEmail: string;
    attendeeEmail?: string;
  },
  tz: string = PST_TZ
): string {
  const startUtc = combineDateAndTimeToUtc(input.date, input.startTimeHHmm, tz);
  const endUtc = combineDateAndTimeToUtc(input.date, input.endTimeHHmm, tz);
  const dtstamp = toGoogleDateUTC(new Date());
  const dtstart = toGoogleDateUTC(startUtc);
  const dtend = toGoogleDateUTC(endUtc);
  const organizer = `ORGANIZER;CN=Location:mailto:${input.organizerEmail}`;
  const attendee =
    input.attendeeEmail ?
      `\nATTENDEE;RSVP=TRUE;CN=Professional;ROLE=REQ-PARTICIPANT:mailto:${input.attendeeEmail}`
    : "";
  const desc = (input.description || "").replace(/\n/g, "\\n");
  const loc = (input.location || "").replace(/\n/g, " ");
  return [
    "BEGIN:VCALENDAR",
    "PRODID:-//booking-saas//EN",
    "VERSION:2.0",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${input.uid}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${dtstart}`,
    `DTEND:${dtend}`,
    organizer,
    `SUMMARY:${input.title}`,
    `DESCRIPTION:${desc}`,
    `LOCATION:${loc}`,
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    "TRANSP:OPAQUE",
    attendee,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
