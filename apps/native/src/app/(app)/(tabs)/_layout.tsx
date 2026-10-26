import { Tabs } from "expo-router";
import { HouseIcon, SettingsIcon, type LucideIcon } from "lucide-react-native";
import { useTranslation } from "@repo/i18n/native";

const TABS = [
  { name: "index", icon: HouseIcon, labelKey: "nav.home" },
  { name: "settings", icon: SettingsIcon, labelKey: "nav.settings" },
] as const satisfies { name: string; icon: LucideIcon; labelKey: string }[];

export default function TabsLayout() {
  const { t } = useTranslation();

  return (
    <Tabs>
      {TABS.map(({ name, icon: Icon, labelKey }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title: t(labelKey),
            tabBarIcon: ({ color, size }) => <Icon color={color} size={size} />,
          }}
        />
      ))}
    </Tabs>
  );
}
