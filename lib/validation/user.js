import * as z from "zod";
import { emailSchema, usernameSchema, fullNameSchema } from "./shared";

export const userSchema = z.object({
  email: emailSchema,
  username: usernameSchema,
  full_name: fullNameSchema,
  bio: z.string().max(100, "Bio maksimal 100 karakter").optional(),
  avatar_url: z.string().url().optional().or(z.literal("")),
});

export const profileSchema = z.object({
  username: usernameSchema,
  full_name: fullNameSchema,
  bio: z.string().max(100, "Bio maksimal 100 karakter").optional(),
  avatar_url: z.string().url().optional().or(z.literal("")),
});

export const updateUserSchema = userSchema.partial();
export const updateProfileSchema = profileSchema.partial();
