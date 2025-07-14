import { z } from "zod";

export const commentSchema = z.object({
  post_id: z.string().uuid("Post ID harus berupa UUID yang valid"),
  user_id: z.string().uuid("User ID harus berupa UUID yang valid"),
  content: z
    .string()
    .min(1, "Komentar tidak boleh kosong")
    .max(1000, "Komentar maksimal 1000 karakter")
    .trim(),
});

export const createCommentSchema = commentSchema;

export const updateCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Komentar tidak boleh kosong")
    .max(1000, "Komentar maksimal 1000 karakter")
    .trim(),
});

export const deleteCommentSchema = z.object({
  user_id: z.string().uuid("User ID harus berupa UUID yang valid"),
});

export const getCommentsSchema = z.object({
  post_id: z.string().uuid("Post ID harus berupa UUID yang valid"),
  offset: z.number().int().min(0).default(0),
  limit: z.number().int().min(1).max(100).default(25),
});
