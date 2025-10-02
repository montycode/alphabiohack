import "./globals.css";

import { Locale, NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { Suspense } from "react";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner"
import { UserProvider } from "@/contexts/user-context";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

const inter = Inter({ subsets: ["latin"] });
type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "HomePage",
  });

  return {
    title: t("title"),
    description: t("subtitle"),
    //add favicon
    icons: {
      icon: '/images/favicon.png'
    }
    
  };
}

export default async function RootLayout({ children, params }: Props) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased`}
        suppressHydrationWarning
      >
        <NextIntlClientProvider>
          <Suspense fallback={null}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <UserProvider>
                {children}
              </UserProvider>
            </ThemeProvider>
          </Suspense>
          <Toaster position="top-right" expand={true} richColors  />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
