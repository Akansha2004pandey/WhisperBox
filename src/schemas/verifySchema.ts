import {z} from "zod";

export const verifySchema=z.object({
    code:z.string().min(6,{message:"Code must be atleast 6 characters"}),
})
