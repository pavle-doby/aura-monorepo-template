import { z } from "zod";
import { createSelectSchema } from "drizzle-zod";
import { languageEnum, userPreferences } from "@repo/db-schema";

export const AuthPreferencesSchema = createSelectSchema(userPreferences).pick({
  language: true,
  theme: true,
});

export const AuthSignUpQuerySchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.email(),
  password: z.string().min(6),
  language: z.enum(languageEnum.enumValues),
  theme: z.enum(["light", "dark"]),
});

export const AuthLoginQuerySchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export const AuthRefreshQuerySchema = z.object({
  refreshToken: z.string().min(1),
});

export const AuthForgotPasswordQuerySchema = z.object({
  email: z.email(),
});

export const AuthResetPasswordQuerySchema = z.object({
  tokenHash: z.string().min(1),
  password: z.string().min(6),
});
