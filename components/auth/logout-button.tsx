"use client";

import { Button } from "@/components/ui/button";
import { logoutUser } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export function LogoutButton() {
  const router = useRouter();
  const t = useTranslations('Auth');

  const logout = async () => {
    await logoutUser();
    router.push("/auth/login");
  };

  return <Button className="hover:bg-destructive hover:text-destructive-foreground cursor-pointer" onClick={logout}>{t('logout')}</Button>;
}
