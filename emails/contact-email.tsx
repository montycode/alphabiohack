import * as React from "react";

interface ContactEmailProps {
  name: string;
  email: string;
  phone?: string;
  services?: string;
  message: string;
  language?: "en" | "es";
}

export function ContactEmail({
  name,
  email,
  phone,
  services,
  message,
  language = "es",
}: Readonly<ContactEmailProps>) {
  const isSpanish = language === "es";

  const translations = {
    es: {
      subject: "Nueva consulta de contacto - MyAlphaPulse",
      title: "Nueva Consulta de Contacto",
      greeting: "Hola equipo,",
      newInquiry: "Has recibido una nueva consulta de contacto:",
      contactInfo: "Información de Contacto",
      name: "Nombre",
      email: "Correo Electrónico",
      phone: "Teléfono",
      services: "Servicios de Interés",
      message: "Mensaje",
      responseTime: "Por favor, responde a esta consulta dentro de 24 horas.",
      footer:
        "Este mensaje fue enviado desde el formulario de contacto de MyAlphaPulse.",
      timestamp: "Enviado el",
    },
    en: {
      subject: "New Contact Inquiry - MyAlphaPulse",
      title: "New Contact Inquiry",
      greeting: "Hello team,",
      newInquiry: "You have received a new contact inquiry:",
      contactInfo: "Contact Information",
      name: "Name",
      email: "Email",
      phone: "Phone",
      services: "Services of Interest",
      message: "Message",
      responseTime: "Please respond to this inquiry within 24 hours.",
      footer: "This message was sent from the MyAlphaPulse contact form.",
      timestamp: "Sent on",
    },
  };

  const t = translations[language];
  const currentDate = new Date().toLocaleDateString(
    isSpanish ? "es-MX" : "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
        backgroundColor: "#ffffff",
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: "#1e40af",
          padding: "30px 20px",
          textAlign: "center",
          borderTopLeftRadius: "8px",
          borderTopRightRadius: "8px",
        }}
      >
        <h1
          style={{
            color: "#ffffff",
            margin: "0",
            fontSize: "24px",
            fontWeight: "bold",
          }}
        >
          {t.title}
        </h1>
      </div>

      {/* Content */}
      <div style={{ padding: "30px 20px", backgroundColor: "#ffffff" }}>
        <p
          style={{
            fontSize: "16px",
            color: "#374151",
            marginBottom: "20px",
          }}
        >
          {t.greeting}
        </p>

        <p
          style={{
            fontSize: "16px",
            color: "#374151",
            marginBottom: "30px",
          }}
        >
          {t.newInquiry}
        </p>

        {/* Contact Information Card */}
        <div
          style={{
            backgroundColor: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            padding: "20px",
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              color: "#1e40af",
              fontSize: "18px",
              fontWeight: "bold",
              margin: "0 0 15px 0",
            }}
          >
            {t.contactInfo}
          </h2>

          <div style={{ marginBottom: "10px" }}>
            <strong style={{ color: "#374151" }}>{t.name}:</strong>
            <span style={{ color: "#374151", marginLeft: "8px" }}>{name}</span>
          </div>

          <div style={{ marginBottom: "10px" }}>
            <strong style={{ color: "#374151" }}>{t.email}:</strong>
            <span style={{ color: "#1e40af", marginLeft: "8px" }}>
              <a
                href={`mailto:${email}`}
                style={{ color: "#1e40af", textDecoration: "none" }}
              >
                {email}
              </a>
            </span>
          </div>

          {phone && (
            <div style={{ marginBottom: "10px" }}>
              <strong style={{ color: "#374151" }}>{t.phone}:</strong>
              <span style={{ color: "#374151", marginLeft: "8px" }}>
                {phone}
              </span>
            </div>
          )}

          {services && (
            <div style={{ marginBottom: "10px" }}>
              <strong style={{ color: "#374151" }}>{t.services}:</strong>
              <span style={{ color: "#374151", marginLeft: "8px" }}>
                {services}
              </span>
            </div>
          )}
        </div>

        {/* Message */}
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            padding: "20px",
            marginBottom: "20px",
          }}
        >
          <h3
            style={{
              color: "#1e40af",
              fontSize: "16px",
              fontWeight: "bold",
              margin: "0 0 10px 0",
            }}
          >
            {t.message}:
          </h3>
          <p
            style={{
              color: "#374151",
              fontSize: "14px",
              lineHeight: "1.6",
              margin: "0",
              whiteSpace: "pre-wrap",
            }}
          >
            {message}
          </p>
        </div>

        {/* Response Time Notice */}
        <div
          style={{
            backgroundColor: "#fef3c7",
            border: "1px solid #f59e0b",
            borderRadius: "8px",
            padding: "15px",
            marginBottom: "20px",
          }}
        >
          <p
            style={{
              color: "#92400e",
              fontSize: "14px",
              margin: "0",
              fontWeight: "500",
            }}
          >
            ⏰ {t.responseTime}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          backgroundColor: "#f8fafc",
          padding: "20px",
          textAlign: "center",
          borderBottomLeftRadius: "8px",
          borderBottomRightRadius: "8px",
          borderTop: "1px solid #e2e8f0",
        }}
      >
        <p
          style={{
            color: "#6b7280",
            fontSize: "12px",
            margin: "0 0 5px 0",
          }}
        >
          {t.footer}
        </p>
        <p
          style={{
            color: "#9ca3af",
            fontSize: "11px",
            margin: "0",
          }}
        >
          {t.timestamp}: {currentDate}
        </p>
      </div>
    </div>
  );
}
