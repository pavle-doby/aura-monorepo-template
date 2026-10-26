import { relations } from "drizzle-orm";
import { users } from "./users";
import { userPreferences } from "./user-preferences";

export const usersRelations = relations(users, ({ one }) => ({
  preferences: one(userPreferences, { fields: [users.id], references: [userPreferences.userId] }),
}));

export const userPreferencesRelations = relations(userPreferences, ({ one }) => ({
  user: one(users, { fields: [userPreferences.userId], references: [users.id] }),
}));
