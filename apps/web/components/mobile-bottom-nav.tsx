"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, SettingsIcon } from "lucide-react";
import { Button } from "@repo/ui-web/components/button";
import { useT } from "@repo/i18n/client";
import { ChBottomNav } from "@/components/ch-bottom-nav";

const NAV_LINKS = [
  { href: "/", icon: HomeIcon, labelKey: "nav.home" },
  { href: "/settings", icon: SettingsIcon, labelKey: "nav.settings" },
] as const;

export function MobileBottomNav() {
  const { t } = useT();
  const pathname = usePathname();

  return (
    <ChBottomNav>
      <div className="flex items-center justify-around">
        {NAV_LINKS.map(({ href, icon: Icon, labelKey }) => (
          <Button
            key={href}
            variant="ghost"
            size="icon-lg"
            className={pathname === href ? "text-primary" : "text-muted-foreground"}
            asChild
          >
            <Link href={href} aria-label={t(labelKey)}>
              <Icon className="size-5" />
            </Link>
          </Button>
        ))}
      </div>
    </ChBottomNav>
  );
}
