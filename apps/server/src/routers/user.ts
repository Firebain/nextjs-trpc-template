import { createProtectedRouter } from "../modules/trpc";

export const users = createProtectedRouter().query("me", {
  resolve() {
    return {
      name: "Name",
      surname: "Surname",
    };
  },
});
