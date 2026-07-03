import { z } from "zod"

export const humanizeSchema = z.object({
  text: z.string().min(1, "Text is required").max(50000, "Text too long"),
  mode: z.enum(["standard", "academic", "professional", "casual", "creative", "student", "blog", "business"]),
  tone: z.enum(["natural", "friendly", "formal", "confident", "persuasive", "conversational"]),
  intensity: z.number().min(0).max(100),
  creativity: z.number().min(0).max(100),
  preserveKeywords: z.boolean(),
  preserveFormatting: z.boolean(),
  keepParagraphStructure: z.boolean(),
})

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const documentSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string(),
})

export type HumanizeInput = z.infer<typeof humanizeSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type DocumentInput = z.infer<typeof documentSchema>
