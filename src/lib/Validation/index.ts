import { z } from "zod"

export const SignupValidation = z.object({
    name: z.string().min(2, { message: "Too Short" }),
    username: z.string().min(2,{message: "Invalid" }).max(50),
    email: z.string().email(),
    password:z.string().min(8,{message:"Password must be atleast 8 characters"}),
})

export const SigninValidation = z.object({
    email: z.string().email(),
    password:z.string().min(8,{message:"Password must be atleast 8 characters"}),
})

export const PostValidation = z.object({
    caption: z.string().min(0).max(2200, { message: "Maximum 2,200 caracters" }),
    file: z.custom<File[]>(),
    //Not array

    location: z.string().min(0).max(1000, { message: "Maximum 1000 characters." }),
    tags: z.string(),
  });
