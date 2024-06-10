import {z} from "zod"

export const MessageSchema = z.object({
    content : z.string().min(10, "Message content is required")
        .max(300, "Message must be at most 300 characters long")

})