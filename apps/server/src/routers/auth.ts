import { createRouter } from "../modules/trpc";
import { CreateUser, GetUserToken } from "forms";
import { prisma } from "../modules/prisma";
import { not, validationError } from "../helpers";
import jwt from "jsonwebtoken";
import argon2 from "argon2";

export const auth = createRouter()
  .mutation("createUser", {
    input: CreateUser,
    async resolve({ input }) {
      const existed = await prisma.user.findFirst({
        where: {
          email: input.email,
        },
      });

      if (existed) {
        throw validationError("Данный email занят", "email");
      }

      const user = await prisma.user.create({
        data: {
          email: input.email,
          name: input.name,
          password: await argon2.hash(input.password),
        },
      });

      return jwt.sign({ id: user.id }, process.env.SECRET!);
    },
  })
  .mutation("getToken", {
    input: GetUserToken,
    async resolve({ input }) {
      const user = await prisma.user.findFirst({
        where: {
          email: input.email,
        },
      });

      if (!user) {
        throw validationError("Пользователь не найден", "email");
      }

      if (await not(argon2.verify(user.password, input.password))) {
        throw validationError("Пароль не совпадает", "password");
      }

      return jwt.sign({ id: user.id }, process.env.SECRET!);
    },
  });
