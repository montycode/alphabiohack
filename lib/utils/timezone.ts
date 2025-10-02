import { formatInTimeZone } from "date-fns-tz";

export const PST_TZ = "America/Los_Angeles";

export function formatInTZ(
  date: Date,
  pattern: string,
  tz: string = PST_TZ
): string {
  return formatInTimeZone(date, tz, pattern);
}

export function dateKeyInTZ(date: Date, tz: string = PST_TZ): string {
  return formatInTimeZone(date, tz, "yyyy-MM-dd");
}

export function timeKeyInTZ(date: Date, tz: string = PST_TZ): string {
  return formatInTimeZone(date, tz, "HH:mm");
}

export function dayOfWeekInTZ(date: Date, tz: string = PST_TZ): string {
  return formatInTimeZone(date, tz, "EEEE");
}

export function combineDateAndTimeToUtc(
  date: Date,
  timeHHmm: string,
  tz: string = PST_TZ
): Date {
  const localDateStr = formatInTimeZone(date, tz, "yyyy-MM-dd");
  const offset = formatInTimeZone(date, tz, "XXX"); // e.g. -08:00 / -07:00
  return new Date(`${localDateStr}T${timeHHmm}:00${offset}`);
}
