"use client";

import { useRouter } from "next/navigation";
import { useAuthSignOut } from "@repo/api-client";
import { clearAuthTokens } from "@/utils/token-storage";
import { LOGIN_ROUTE } from "@/utils/consts";

export function useSignOut() {
  const router = useRouter();
  const { mutate } = useAuthSignOut();

  function handleSignedOut() {
    clearAuthTokens();
    router.push(LOGIN_ROUTE);
  }

  function signOut() {
    mutate(undefined, { onSettled: handleSignedOut });
  }

  return signOut;
}
