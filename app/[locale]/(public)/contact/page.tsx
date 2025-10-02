"use client";

import { ContactForm, ContactHeader, ContactInfo, UrgentHelp } from "@/components/contact";

import { Card } from "@/components/ui/card";

export default function ContactPage() {
  return (
    <div className="w-full">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Encabezado */}
          <ContactHeader />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Información de contacto - Lado izquierdo */}
            <ContactInfo />

            {/* Formulario de contacto - Lado derecho */}
            <Card className="p-8">
              <ContactForm />
            </Card>
          </div>

          {/* Ayuda urgente */}
          <UrgentHelp />
        </div>
      </div>
    </div>
  );
}