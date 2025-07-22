import { z } from "zod";

export const postFormSchema = z.object({
  image_files: z
    .array(z.instanceof(File))
    .max(4, "Maksimum 4 gambar")
    .refine(
      (files) => files.every((file) => file.size <= 10 * 1024 * 1024),
      "Ukuran setiap gambar maksimum 10MB"
    )
    .optional(),
  content: z
    .string()
    .min(1, "Konten harus diisi")
    .max(1000, "Konten maksimum 1000 karakter"),
  category_ids: z.array(z.string()).optional(),
});

export const postApiSchema = z.object({
  user_id: z.string().uuid("User ID harus berupa UUID yang valid"),
  content: z
    .string()
    .min(1, "Konten harus diisi")
    .max(1000, "Konten maksimum 1000 karakter"),
  category_ids: z
    .array(z.string().uuid("Setiap kategori ID harus berupa UUID"))
    .optional(),
  image_urls: z
    .array(z.string().url("Setiap URL gambar harus valid"))
    .optional(),
});
