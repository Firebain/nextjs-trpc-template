import { FastifyRequest } from "fastify";
import * as trcp from "@trpc/server";
import { ZodError } from "zod";
import cookie from "cookie";
import { TRPCError } from "@trpc/server";

export interface Context {
  request: FastifyRequest;
  user?: string;
}

export const createGlobalRouter = () =>
  trcp.router<Context>().formatError(({ shape, error }) => {
    const isZodError =
      error.code === "BAD_REQUEST" && error.cause instanceof ZodError;

    if (
      !isZodError &&
      error.code !== "UNAUTHORIZED" &&
      error.code !== "FORBIDDEN"
    ) {
      console.error(error);
    }

    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: isZodError ? error.cause.flatten() : null,
      },
    };
  });

export const createRouter = () =>
  trcp.router<Context>().middleware(async ({ ctx, next }) => {
    const getTokenFromHeader = () => {
      const authorizationHeader = ctx.request.headers["authorization"];

      if (!authorizationHeader) {
        return undefined;
      }

      return authorizationHeader.slice(7);
    };

    const getTokenFromCookie = (): string | undefined => {
      const cookies = ctx.request.headers.cookie
        ? cookie.parse(ctx.request.headers.cookie)
        : {};

      return cookies.token;
    };

    const token = getTokenFromHeader() ?? getTokenFromCookie();

    return next({
      ctx: {
        ...ctx,
        user: token,
      },
    });
  });

export const createProtectedRouter = () =>
  createRouter().middleware(({ ctx, next }) => {
    if (!ctx.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return next({
      ctx: {
        ...ctx,
        user: ctx.user,
      },
    });
  });
