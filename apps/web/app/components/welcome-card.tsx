"use client";

import { useGetUserSelf } from "@repo/api-client";
import { useT } from "@repo/i18n/client";
import { useErrorHandlingQuery } from "@repo/shared";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui-web/components/card";
import { Skeleton } from "@repo/ui-web/components/skeleton";
import { toast } from "@repo/ui-web/components/sonner";

export function WelcomeCard() {
  const { t } = useT();
  const { data: user, isPending, error } = useGetUserSelf();
  useErrorHandlingQuery({
    t: t as (key: string) => string,
    error,
    showToastError: ({ title, description }) => toast.error(title, { description }),
  });

  if (isPending || !user) {
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{t("home.greeting", { firstName: user.firstName ?? user.username })}</CardTitle>
        <CardDescription>{t("home.signedInAs", { email: user.email })}</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">{t("home.starter")}</CardContent>
    </Card>
  );
}
