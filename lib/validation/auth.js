import * as z from "zod";
import {
  usernameSchema,
  fullNameSchema,
  emailSchema,
  passwordSchema,
} from "./shared";

export const signUpSchema = z
  .object({
    username: usernameSchema,
    fullname: fullNameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak sesuai",
    path: ["confirmPassword"],
  });

export const signInSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(6, "Password minimal 6 karakter")
    .max(100, "Password maksimal 100 karakter"),
});
