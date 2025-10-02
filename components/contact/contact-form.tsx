/**
 * Componente Presentacional del Formulario de Contacto
 * 
 * Este componente solo se encarga de la presentación y usa el hook useContactForm
 * para manejar toda la lógica de negocio.
 */

"use client";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/form/form-field";
import { Loader2 } from "lucide-react";
import { useContactForm } from "@/hooks/use-contact-form";
import { useTranslations } from "next-intl";

interface ContactFormProps {
  className?: string;
}

export function ContactForm({ className }: ContactFormProps) {
  const t = useTranslations('Contact');
  const {
    formData,
    isLoading,
    handleInputChange,
    handleSubmit,
    isFormValid,
  } = useContactForm();

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className || ''}`}>
      <FormField
        id="name"
        name="name"
        label={t('form.name')}
        placeholder={t('form.namePlaceholder')}
        value={formData.name}
        onChange={handleInputChange}
        required
      />

      {/* Email */}
      <FormField
        id="email"
        name="email"
        label={t('form.email')}
        inputType="email"
        placeholder={t('form.emailPlaceholder')}
        value={formData.email}
        onChange={handleInputChange}
        required
      />

      {/* Teléfono */}
      <FormField
        id="phone"
        name="phone"
        label={t('form.phone')}
        inputType="tel"
        placeholder={t('form.phonePlaceholder')}
        value={formData.phone}
        onChange={handleInputChange}
      />

      {/* Servicios */}
      <FormField
        id="services"
        name="services"
        label={t('form.services')}
        placeholder={t('form.servicesPlaceholder')}
        value={formData.services}
        onChange={handleInputChange}
      />

      {/* Mensaje */}
      <FormField
        id="message"
        name="message"
        label={t('form.message')}
        placeholder={t('form.messagePlaceholder')}
        value={formData.message}
        onChange={handleInputChange}
        required
        type="textarea"
      />

      {/* Botón de envío */}
      <Button
        type="submit"
        disabled={isLoading || !isFormValid}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t('form.submitting')}
          </>
        ) : (
          t('form.submit')
        )}
      </Button>
    </form>
  );
}
