import { useGetUserSelf } from "@repo/api-client";
import { useTranslation } from "@repo/i18n/native";
import { Text } from "@repo/ui-native/components/text";
import { PlaceholderScreen } from "@/components/placeholder-screen";

export default function HomeScreen() {
  const { t } = useTranslation();
  const { data: user } = useGetUserSelf();

  return (
    <PlaceholderScreen
      title={user ? t("home.greeting", { firstName: user.firstName ?? user.username }) : ""}
    >
      {user && (
        <Text className="text-muted-foreground">{t("home.signedInAs", { email: user.email })}</Text>
      )}
      <Text className="text-center text-muted-foreground">{t("home.starter")}</Text>
    </PlaceholderScreen>
  );
}
