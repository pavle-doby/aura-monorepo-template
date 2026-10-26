import z from "zod";
import { registry } from "./registry";
import {
  PaginationSchema,
  AuthPreferencesSchema,
  UserPreferencesSchema as UserPreferencesSchemaBase,
  UserSchema as UserSchemaBase,
} from "@repo/contract";

export const UserSchema = registry.register("User", UserSchemaBase);
export const UserPreferencesSchema = registry.register(
  "UserPreferences",
  UserPreferencesSchemaBase
);

export const AuthWithTokensSchema = registry.register(
  "AuthWithTokens",
  z.object({
    user: UserSchemaBase,
    preferences: AuthPreferencesSchema,
    accessToken: z.string(),
    refreshToken: z.string(),
  })
);

export const AuthTokensSchema = registry.register(
  "AuthTokens",
  z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
  })
);

export const PaginatedUsersSchema = registry.register(
  "Users",
  z.object({
    data: z.array(UserSchema),
    pagination: PaginationSchema,
  })
);
