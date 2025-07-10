import { z } from "zod";

export const postSchema = z.object({
  image_url: z
    .array(z.instanceof(File))
    .max(4, "Maksimum 4 gambar")
    .refine(
      (files) => files.every((file) => file.size <= 10 * 1024 * 1024),
      "Ukuran setiap gambar maksimum 10MB"
    ),
  content: z
    .string()
    .min(1, "Konten harus diisi")
    .max(1000, "Konten maksimum 1000 karakter"),
  category_id: z.array(z.string()).min(1, "Pilih minimal satu kategori"),
});

export const createPostSchema = z.object({
  user_id: z.string().uuid(),
  content: z.string().min(1).max(1000),
  category_id: z.string().uuid(),
  image_url: z.string().url().optional().nullable(),
});
