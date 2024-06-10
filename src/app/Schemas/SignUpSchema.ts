import {z} from "zod"

export const UsernameValidation = z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username must be at most 20 characters long")
    .regex(/^[a-zA-Z0-9]+$/, "Username can only contain letters and numbers")

export const SignUpSchema = z.object({
    username: UsernameValidation,
    email: z
        .string()
        .min(1, "Email is required")
        .email("Invalid email address"),
    
    password: z
        .string()
        .min(6, "Password must be at least 6 characters long")
        .max(50, "Password must be at most 50 characters long"),    
})