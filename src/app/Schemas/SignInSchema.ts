import {z} from "zod"

export const SignInSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Invalid email address"),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters long")
        .max(50, "Password must be at most 50 characters long"),
})