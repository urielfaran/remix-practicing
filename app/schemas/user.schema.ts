import { z } from "zod";

export const userBaseSchema = z.object({
  username: z.string({
    required_error: "Username is required",
  }),
  password: z.string({
    required_error: "Password is required",
  }),
});

export const userCredentialsSchema = z.object({
  email: z.string().email().nullable().optional(),
  avatar: typeof window === 'undefined' ? z.any() : z.instanceof(FileList)
});

