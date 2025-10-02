/**
 * Componente Presentacional del Header de Contacto
 * 
 * Componente reutilizable para el encabezado de la página de contacto.
 */

"use client";

import { useTranslations } from "next-intl";

interface ContactHeaderProps {
  className?: string;
}

export function ContactHeader({ className }: ContactHeaderProps) {
  const t = useTranslations('Contact');

  return (
    <div className={`text-center mb-12 ${className || ''}`}>
      <p className="text-primary font-medium mb-2">{t('subtitle')}</p>
      <h1 className="text-4xl font-bold mb-4">
        {t('title')}
      </h1>
      <p className="max-w-2xl mx-auto text-muted-foreground">
        {t('description')}
      </p>
    </div>
  );
}
