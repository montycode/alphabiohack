import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation"
import { LogoutButton } from "./logout-button";
import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";

export async function AuthButton() {
  const supabase = await createClient();
  const t = await getTranslations('Auth');

  // You can also use getUser() which will be slower.
  const { data } = await supabase.auth.getClaims();

  const user = data?.claims;
  return user ? (
    <div className="flex items-center gap-4">
      {t('welcomeBack', { email: user?.email })}
      <LogoutButton />
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/auth/login">{t('signIn')}</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/auth/sign-up">{t('signUp')}</Link>
      </Button>
    </div>
  );
}
