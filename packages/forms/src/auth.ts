import { z } from "zod";

export const GetUserToken = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type GetUserToken = z.infer<typeof GetUserToken>;

export const CreateUser = z
  .object({
    name: z.string().min(2).max(20),
    email: z.string().email(),
    password: z.string(),
    confirm_password: z.string(),
  })
  .refine(({ password, confirm_password }) => password === confirm_password, {
    message: "Password wont match",
    path: ["password"],
  });

export type CreateUser = z.infer<typeof CreateUser>;
