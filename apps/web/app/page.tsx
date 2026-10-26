import { NavigationLayoutProvider } from "@/components/navigation-layout-provider";
import { WelcomeCard } from "./components/welcome-card";

export default function HomePage() {
  return (
    <NavigationLayoutProvider>
      <div className="flex flex-1 flex-col items-center p-4 md:p-6">
        <WelcomeCard />
      </div>
    </NavigationLayoutProvider>
  );
}
