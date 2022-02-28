import express from "express";
import * as trcp from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import cors from "cors";
import { IncomingMessage } from "http";
import { TRPCError } from "@trpc/server";

interface Context {
  request: IncomingMessage;
}

interface Post {
  name: string;
  text: string;
}

const posts = trcp.router<Context>().query("getPosts", {
  async resolve(): Promise<Post[]> {
    return [
      {
        name: "FIRST",
        text: "FIRST TEXT",
      },
      {
        name: "SECOND",
        text: "SECOND TEXT",
      },
      {
        name: "THIRD",
        text: "THIRD TEXT",
      },
    ];
  },
});

const priv = trcp
  .router<Context>()
  .middleware(({ ctx, next }) => {
    if (!ctx.request.headers.token) {
      throw new TRPCError({
        code: "FORBIDDEN",
      });
    }

    return next({
      ctx,
    });
  })
  .query("getUser", {
    resolve: () => {
      return {
        name: "Fedya",
        surname: "Pupkin",
      };
    },
  });

const appRouter = trcp
  .router<Context>()
  .merge("posts.", posts)
  .merge("protected.", priv);

const app = express();

app.use(cors());

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: ({ req }) => ({
      request: req,
    }),
  })
);

export type AppRouter = typeof appRouter;

app.listen(3001, "0.0.0.0", () => {
  console.log("✅ Server was started at 3001");
});
