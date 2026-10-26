import type { InferSelectModel } from "drizzle-orm";
import type { users, userPreferences } from "./schemas";

export type UserEntity = InferSelectModel<typeof users>;
export type UserPreferencesEntity = InferSelectModel<typeof userPreferences>;
