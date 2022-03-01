import express from "express";
import * as trcp from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import cors from "cors";
import { IncomingMessage } from "http";
import { TRPCError } from "@trpc/server";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import ws from "ws";
import cookie from "cookie";

interface Context {
  type: "http" | "ws";
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
    let token: string;

    if (ctx.type === "http") {
      const authorizationHeader = ctx.request.headers["authorization"];

      if (!authorizationHeader) {
        throw new TRPCError({
          code: "FORBIDDEN",
        });
      }

      token = authorizationHeader.slice(7);
    } else {
      const cookies = ctx.request.headers.cookie
        ? cookie.parse(ctx.request.headers.cookie)
        : {};

      if (!cookies.token) {
        throw new TRPCError({
          code: "FORBIDDEN",
        });
      }

      token = cookies.token;
    }

    return next({
      ctx,
    });
  })
  .query("getUser", {
    resolve() {
      return {
        name: "Fedya",
        surname: "Pupkin",
      };
    },
  })
  .subscription("getNews", {
    resolve() {
      return new trcp.Subscription<string>((emit) => {
        return () => {};
      });
    },
  });

const appRouter = trcp
  .router<Context>()
  .merge("posts.", posts)
  .merge("protected.", priv);

const wss = new ws.Server({
  port: 3002,
});

const handler = applyWSSHandler({
  wss,
  router: appRouter,
  createContext: ({ req }) => ({
    type: "ws",
    request: req,
  }),
});

const app = express();

app.use(cors());

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: ({ req }) => ({
      type: "http",
      request: req,
    }),
  })
);

export type AppRouter = typeof appRouter;

app.listen(3001, "0.0.0.0", () => {
  console.log("✅ Server was started at 3001");
});
