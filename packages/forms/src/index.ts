import { z, ZodIssueCode } from "zod";

const errorMap: z.ZodErrorMap = (issue, ctx) => {
  const getMessage = () => {
    if (issue.code === ZodIssueCode.invalid_string) {
      if (issue.validation === "email") {
        return "Enter real email";
      }
    }

    return ctx.defaultError;
  };

  return { message: getMessage() };
};

z.setErrorMap(errorMap);

export * from "./auth";
