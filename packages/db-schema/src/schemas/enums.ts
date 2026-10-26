import { pgEnum } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);
export const themeEnum = pgEnum("theme", ["light", "dark", "system"]);
export const languageEnum = pgEnum("language", ["en", "sr"]);
