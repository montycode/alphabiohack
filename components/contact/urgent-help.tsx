/**
 * Componente Presentacional de Ayuda Urgente
 * 
 * Componente reutilizable para la sección de ayuda urgente.
 */

"use client";

import { Mail, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface UrgentHelpProps {
  className?: string;
}

export function UrgentHelp({ className }: UrgentHelpProps) {
  const t = useTranslations('Contact');

  const handleCallClick = () => {
    const phoneNumber = t('phoneNumber').replace(/\s/g, '');
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleEmailClick = () => {
    const emailAddress = t('emailAddress');
    window.location.href = `mailto:${emailAddress}`;
  };

  return (
    <div className={`mt-16 text-center ${className || ''}`}>
      <div className="p-8 rounded-lg bg-card text-card-foreground border border-border">
        <h3 className="text-xl font-semibold mb-4">
          {t('urgentHelp.title')}
        </h3>
        <p className="mb-6 text-muted-foreground">
          {t('urgentHelp.description')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="outline"
            className="flex items-center space-x-2 border-border text-foreground"
            onClick={handleCallClick}
          >
            <Phone className="h-4 w-4" />
            <span>{t('urgentHelp.callNow')}</span>
          </Button>
          <Button
            variant="outline"
            className="flex items-center space-x-2 border-border text-foreground"
            onClick={handleEmailClick}
          >
            <Mail className="h-4 w-4" />
            <span>{t('urgentHelp.sendEmail')}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
