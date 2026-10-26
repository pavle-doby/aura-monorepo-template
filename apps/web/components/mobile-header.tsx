"use client";

import { LogOutIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@repo/ui-web/components/button";
import { useT } from "@repo/i18n/client";
import { useSignOut } from "@/hooks/use-sign-out";

const TITLE_BY_PATH = {
  "/settings": "nav.settings",
} as const;

export function MobileHeader() {
  const { t } = useT();
  const pathname = usePathname();
  const signOut = useSignOut();

  const titleKey =
    Object.entries(TITLE_BY_PATH).find(([path]) => pathname.startsWith(path))?.[1] ?? "nav.home";

  function handleSignOut() {
    signOut();
  }

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b bg-background px-4 md:hidden">
      <span className="text-lg font-bold">{t(titleKey)}</span>
      <Button variant="ghost" size="icon" aria-label={t("nav.logOut")} onClick={handleSignOut}>
        <LogOutIcon className="size-5" />
      </Button>
    </header>
  );
}
