import { TRPCError } from "@trpc/server";
import { ZodError, ZodIssueCode } from "zod";

export const not = (p: Promise<boolean>) => p.then((b) => !b);

export const validationError = (message: string, path: string) => {
  return new TRPCError({
    code: "BAD_REQUEST",
    cause: new ZodError([
      {
        code: ZodIssueCode.custom,
        message,
        path: [path],
      },
    ]),
  });
};
