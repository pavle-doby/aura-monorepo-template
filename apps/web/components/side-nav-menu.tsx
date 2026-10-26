"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@repo/ui-web";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, LogOutIcon, SettingsIcon } from "lucide-react";
import { useT } from "@repo/i18n/client";
import { useSignOut } from "@/hooks/use-sign-out";

const NAV_ITEMS = [{ label: "nav.home", icon: HomeIcon, href: "/" }] as const;

const FOOTER_ITEMS = [{ label: "nav.settings", icon: SettingsIcon, href: "/settings" }] as const;

export function SideNavMenu() {
  const { t } = useT();
  const pathname = usePathname();
  const signOut = useSignOut();

  function handleSignOut() {
    signOut();
  }

  return (
    <Sidebar collapsible="none" className="sticky top-0 h-svh border-r">
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {NAV_ITEMS.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton size="lg" asChild isActive={pathname === item.href}>
                  <Link href={item.href}>
                    <item.icon />
                    <span>{t(item.label)}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarGroup>
          <SidebarMenu>
            {FOOTER_ITEMS.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton size="lg" asChild isActive={pathname === item.href}>
                  <Link href={item.href}>
                    <item.icon />
                    <span>{t(item.label)}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" onClick={handleSignOut}>
                <LogOutIcon />
                <span>{t("nav.logOut")}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
