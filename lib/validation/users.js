import * as z from "zod";

export const signUpSchema = z
  .object({
    username: z
      .string()
      .min(1, "Username wajib diisi")
      .min(3, "Username minimal 3 karakter")
      .max(20, "Username maksimal 20 karakter")
      .regex(/^[a-zA-Z0-9_]+$/, {
        message: "Username hanya boleh mengandung huruf, angka, dan underscore",
      })
      .refine(
        (val) => !val.startsWith("_") && !val.endsWith("_"),
        "Username tidak boleh diawali atau diakhiri dengan underscore"
      )
      .refine(
        (val) => !/_{2,}/.test(val),
        "Username tidak boleh mengandung underscore berurutan"
      ),
    fullname: z
      .string()
      .min(1, "Nama lengkap wajib diisi")
      .min(2, "Nama lengkap minimal 2 karakter")
      .max(50, "Nama lengkap maksimal 50 karakter")
      .regex(/^[a-zA-Z\s]+$/, {
        message: "Nama lengkap hanya boleh mengandung huruf dan spasi",
      })
      .refine(
        (val) => val.trim().length > 0,
        "Nama lengkap tidak boleh kosong"
      ),
    email: z
      .string()
      .min(1, "Email wajib diisi")
      .email("Format email tidak valid")
      .max(100, "Email terlalu panjang")
      .toLowerCase(),
    password: z
      .string()
      .min(1, "Password wajib diisi")
      .min(8, "Password minimal 8 karakter")
      .max(100, "Password maksimal 100 karakter")
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message:
          "Password harus mengandung huruf besar, huruf kecil, dan angka",
      }),
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak sesuai",
    path: ["confirmPassword"],
  });

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid")
    .max(100, "Email terlalu panjang"),
  password: z
    .string()
    .min(1, "Password wajib diisi")
    .min(6, "Password minimal 6 karakter")
    .max(100, "Password maksimal 100 karakter"),
});

export const userSchema = z.object({
  email: z.string().email("Email tidak valid"),
  username: z
    .string()
    .min(3, "Username minimal 3 karakter")
    .max(20, "Username maksimal 20 karakter"),
  full_name: z
    .string()
    .min(1, "Nama lengkap tidak boleh kosong")
    .max(100, "Nama lengkap maksimal 100 karakter"),
  bio: z.string().max(500, "Bio maksimal 500 karakter").optional(),
  avatar_url: z.string().url().optional().or(z.literal("")),
});

export const updateUserSchema = userSchema.partial();