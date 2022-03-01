import { createProtectedRouter } from "../modules/trpc";
import * as trpc from "@trpc/server";

interface News {
  text: string;
}

export const news = createProtectedRouter().subscription("feed", {
  resolve() {
    return new trpc.Subscription<News>((emit) => {
      const interval = setInterval(() => {
        emit.data({
          text: (Math.random() + 1).toString(36).substring(7),
        });
      }, 2000);

      return () => {
        clearInterval(interval);
      };
    });
  },
});
