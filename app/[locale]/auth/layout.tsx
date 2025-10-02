import { MedicalHeader } from "@/components/layout/header"
import type { Metadata } from "next";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Authenticate",
  description: "Login or register to your account",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col bg-secondary">
      <MedicalHeader />
      <main className="flex-1 flex items-center justify-center">
        {children}
      </main>
    </div>
  );
}
