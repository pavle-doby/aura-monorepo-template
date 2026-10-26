import { Stack } from "expo-router";
import { PreferencesSync } from "@/providers/preferences-sync";

// Detail screens (pushed over the tabs) are added to this stack.
export default function AppLayout() {
  return (
    <>
      <PreferencesSync />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}
