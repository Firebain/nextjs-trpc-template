import { TRPCClientError } from "@trpc/client";
import {
  ErrorOption,
  SubmitHandler,
  UnpackNestedValue,
  UseFormSetError,
} from "react-hook-form";

export const zodErrors = (
  err: unknown
):
  | {
      formErrors: string[];
      fieldErrors: {
        [k: string]: string[];
      };
    }
  | undefined => {
  if (err instanceof TRPCClientError) {
    if (err.data?.zodError) {
      return err.data?.zodError;
    }
  }
};

export const formHandler =
  <T>(
    setError: UseFormSetError<T>,
    handler: (
      data: UnpackNestedValue<T>,
      event?: React.BaseSyntheticEvent
    ) => void | Promise<void>
  ): SubmitHandler<T> =>
  async (...data) => {
    try {
      await Promise.resolve(handler(...data));
    } catch (err) {
      const errors = zodErrors(err);

      if (errors) {
        for (const [field, error] of Object.entries(errors.fieldErrors)) {
          setError(field as any, {
            message: (error as any)[0],
          });
        }

        return;
      }

      throw err;
    }
  };
