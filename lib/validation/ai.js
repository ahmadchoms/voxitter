const { default: z } = require("zod");

export const requestSchema = z.object({
    content: z.string().min(1, "Content is required"),
})

export const topicRatingSchema = z.object({
  topicId: z.string().uuid("Invalid topic ID format."),
  userId: z.string().uuid("Invalid user ID format."),
  rating: z.number().int().min(1).max(5, "Rating must be between 1 and 5."),
});