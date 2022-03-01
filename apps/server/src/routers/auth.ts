import { createRouter } from "../modules/trpc";

export const auth = createRouter().mutation("getToken", {
  resolve() {
    return "token_value";
  },
});
