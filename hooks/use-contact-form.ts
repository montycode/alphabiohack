/**
 * Custom Hook para el formulario de contacto
 *
 * Este hook maneja toda la lógica de estado y operaciones del formulario de contacto,
 * separando la lógica de negocio de la presentación.
 */

import { useApiI18n } from "./use-api-i18n";
import { useAppToast } from "@/hooks/use-app-toast";
import { useState } from "react";
import { useTranslations } from "next-intl";

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  services: string;
  message: string;
}

export interface UseContactFormReturn {
  // Estado
  formData: ContactFormData;
  isLoading: boolean;

  // Acciones
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;

  // Utilidades
  isFormValid: boolean;
  hasUnsavedChanges: boolean;
}

export function useContactForm(): UseContactFormReturn {
  const { apiCall } = useApiI18n();
  const toast = useAppToast();
  const tReq = useTranslations("Requests");
  const tErrors = useTranslations("ApiErrors");

  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    services: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await apiCall<unknown>("/api/contact", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (result.success) {
        toast.success(
          result.successCode
            ? tReq(result.successCode)
            : tReq("contact.submit.success")
        );
        resetForm();
      } else {
        toast.error(tErrors(result.errorCode));
      }
    } catch {
      toast.error(tReq("contact.submit.error"));
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      services: "",
      message: "",
    });
  };

  // Validaciones computadas
  const isFormValid = Boolean(
    formData.name.trim() && formData.email.trim() && formData.message.trim()
  );

  const hasUnsavedChanges = Boolean(
    formData.name ||
      formData.email ||
      formData.phone ||
      formData.services ||
      formData.message
  );

  return {
    // Estado
    formData,
    isLoading,

    // Acciones
    handleInputChange,
    handleSubmit,
    resetForm,

    // Utilidades
    isFormValid,
    hasUnsavedChanges,
  };
}
