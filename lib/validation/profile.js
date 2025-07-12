import * as z from "zod";

export const profileSchema = z.object({
  full_name: z
    .string()
    .min(2, "Nama lengkap minimal 2 karakter")
    .max(100, "Nama lengkap maksimal 100 karakter"),
  username: z
    .string()
    .min(3, "Username minimal 3 karakter")
    .max(30, "Username maksimal 30 karakter")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username hanya boleh mengandung huruf, angka, dan underscore"
    ),
  bio: z
    .string()
    .max(160, "Bio maksimal 160 karakter")
    .optional()
    .or(z.literal("")),
});
