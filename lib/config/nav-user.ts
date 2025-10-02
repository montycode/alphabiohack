import {
  BadgeCheck,
  Bell,
  CreditCard,
  LogOut,
  LucideIcon,
  Sparkles,
} from "lucide-react";

export interface NavUserMenuItem {
  label: string;
  icon: LucideIcon;
  action?: () => void;
  url?: string;
  separator?: boolean;
}

export interface NavUserConfig {
  upgradeItem: NavUserMenuItem;
  accountItems: NavUserMenuItem[];
  logoutItem: NavUserMenuItem;
}

export const getNavUserConfig = (
  t: (key: string) => string,
  logoutAction: () => void
): NavUserConfig => {
  return {
    upgradeItem: {
      label: t("upgradeToPro"),
      icon: Sparkles,
      url: "/upgrade",
    },
    accountItems: [
      {
        label: t("account"),
        icon: BadgeCheck,
        url: "/",
      },
      {
        label: t("billing"),
        icon: CreditCard,
        url: "/",
      },
      {
        label: t("notifications"),
        icon: Bell,
        url: "/",
      },
    ],
    logoutItem: {
      label: t("logout"),
      icon: LogOut,
      action: logoutAction,
    },
  };
};
