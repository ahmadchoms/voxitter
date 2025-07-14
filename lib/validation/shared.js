import * as z from "zod";

export const usernameSchema = z
  .string()
  .min(3, "Username minimal 3 karakter")
  .max(20, "Username maksimal 20 karakter")
  .regex(/^[a-zA-Z0-9_]+$/, {
    message: "Username hanya boleh mengandung huruf, angka, dan underscore",
  })
  .refine((val) => !val.startsWith("_") && !val.endsWith("_"), {
    message: "Username tidak boleh diawali atau diakhiri dengan underscore",
  })
  .refine((val) => !/_{2,}/.test(val), {
    message: "Username tidak boleh mengandung underscore berurutan",
  });

export const fullNameSchema = z
  .string()
  .min(2, "Nama lengkap minimal 2 karakter")
  .max(100, "Nama lengkap maksimal 100 karakter")
  .regex(/^[a-zA-Z\s]+$/, {
    message: "Nama lengkap hanya boleh mengandung huruf dan spasi",
  });

export const emailSchema = z
  .string()
  .min(1, "Email wajib diisi")
  .email("Format email tidak valid")
  .max(100, "Email terlalu panjang")
  .toLowerCase();

export const passwordSchema = z
  .string()
  .min(8, "Password minimal 8 karakter")
  .max(100, "Password maksimal 100 karakter")
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: "Password harus mengandung huruf besar, huruf kecil, dan angka",
  });
