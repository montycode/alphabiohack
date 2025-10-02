import { useMemo } from "react";
import { usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export type BreadcrumbCrumb = { label: string; href?: string };

export function useBreadcrumb(): BreadcrumbCrumb[] {
  const pathname = usePathname();
  const t = useTranslations("Breadcrumb");

  return useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbs: BreadcrumbCrumb[] = [
      {
        label: t("home"),
        href: "/",
      },
    ];

    let currentPath = "";
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      // Traducir el segmento o usar el segmento como está
      const translatedLabel = t(segment, { defaultValue: segment });

      breadcrumbs.push({
        label: translatedLabel,
        href: index === segments.length - 1 ? undefined : currentPath,
      });
    });

    return breadcrumbs;
  }, [pathname, t]);
}
