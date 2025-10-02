"use client"

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation"
import { LogoutButton } from "./logout-button";
import { useTranslations } from "next-intl";
import { useUser } from "@/contexts/user-context";

export function AuthButton() {
  const { loading, isAuthenticated } = useUser();
  const t = useTranslations("Auth");
  const tNav = useTranslations("Navigation");

  if (loading) {
    return (
      <div className="flex space-x-2">
        <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
        <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
      </div>
    );
  }

  return isAuthenticated ? (
    <div className="flex space-x-2">
      <Button variant="outline"  className="bg-transparent">
        <Link href="/dashboard">
          {tNav("dashboard")}
        </Link>
      </Button>
      <LogoutButton />
    </div>
  ) : (
    <div className="flex space-x-2">
      <Button variant="outline" className="bg-transparent">
        <Link href="/auth/login">
          {t("login")}
        </Link>
      </Button>
      <Button variant="default">
        <Link href="/auth/sign-up">
          {t("signUp")}
        </Link>
      </Button>
    </div>
  );
}
