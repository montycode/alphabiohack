import { getLocale } from "next-intl/server";

export type AppLanguage = "es" | "en";

export async function getServerLanguage(): Promise<AppLanguage> {
  try {
    const locale = await getLocale();
    const normalized = normalizeLanguage(locale);
    return normalized;
  } catch {
    return "es";
  }
}

export function normalizeLanguage(
  input: string | null | undefined
): AppLanguage {
  const value = (input || "es").toLowerCase();
  if (value.startsWith("en")) return "en";
  return "es";
}
