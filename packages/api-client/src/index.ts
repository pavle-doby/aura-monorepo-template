// Re-export the Axios client instance for consumers who need it directly
export { apiClient, configureTokenProviders } from "./lib/apiClient";
export { ApiClientProvider } from "./api-client-provider";
// Consumers take React Query from here, so they share ApiClientProvider's copy (a second copy
// in the app throws "No QueryClient set").
export { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
export type { InfiniteData, QueryKey, UseInfiniteQueryResult } from "@tanstack/react-query";

// Generated types and hooks (run `pnpm generate:api` to populate these)
export * from "./generated/auraAPI.schemas";
export * from "./generated/auth/auth";
export * from "./generated/users/users";
