import { z } from "zod";

export const postSchema = z.object({
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
  image_urls: z.array(z.string()).optional(),
});
