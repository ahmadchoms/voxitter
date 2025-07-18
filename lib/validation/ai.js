const { default: z } = require("zod");

export const requestSchema = z.object({
    content: z.string().min(1, "Content is required"),
})