"use client";

import { useTranslations } from "next-intl";

interface BusinessHoursProps {
  weekdays?: string;
  saturday?: string;
  sunday?: string;
  className?: string;
}

export function BusinessHours({
  weekdays = "9:00 AM - 6:00 PM",
  saturday = "9:00 AM - 2:00 PM",
  sunday,
  className,
}: BusinessHoursProps) {
  const t = useTranslations('Contact');

  return (
    <div className={`p-6 rounded-lg bg-card text-card-foreground ${className || ''}`}>
      <h3 className="font-semibold mb-3 text-foreground">{t('businessHours')}</h3>
      <div className="space-y-2 text-sm text-muted-foreground">
        <p><span className="font-medium text-foreground">{t('weekdays')}:</span> {weekdays}</p>
        <p><span className="font-medium text-foreground">{t('saturday')}:</span> {saturday}</p>
        <p><span className="font-medium text-foreground">{t('sunday')}:</span> {sunday || t('closed')}</p>
      </div>
    </div>
  );
}


