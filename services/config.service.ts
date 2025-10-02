export interface EmailConfig {
  from: string;
  bcc?: string | string[];
  replyTo?: string;
}

export function getDefaultEmailConfig(): EmailConfig {
  return {
    from:
      process.env.BOOKING_FROM_EMAIL ||
      "MyAlphaPulse <noreply@myalphapulse.com>",
    bcc: process.env.BOOKING_EMAIL_BCC,
    replyTo: process.env.BOOKING_REPLY_TO,
  };
}

export function getTimeZoneOrDefault(locationTz?: string): string {
  return locationTz && locationTz.trim() ? locationTz : "America/Los_Angeles";
}
