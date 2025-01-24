import {z} from "zod";
export const messageValidationSchema=z.object({
    content:z.string()
    .min(10,{message:"Message must be atleast of 10 characters"})
    .max(300,{message:"Message must be no longer than 300 characters"}),
    
})