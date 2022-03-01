import * as trcp from "@trpc/server";
import {
  CreateFastifyContextOptions,
  fastifyTRPCPlugin,
} from "@trpc/server/adapters/fastify";
import fastify, { FastifyRequest } from "fastify";
import plugin from "fastify-plugin";
import ws from "fastify-websocket";
import cors from "fastify-cors";
import cookie from "cookie";
import { TRPCError } from "@trpc/server";

interface Context {
  request: FastifyRequest;
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

    if (!token) {
      throw new TRPCError({
        code: "FORBIDDEN",
      });
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

const app = fastify();

app.register(ws);
app.register(cors, {
  allowedHeaders: ["authorization", "content-type", "x-ssr", "cookie"],
});

app.register(plugin(fastifyTRPCPlugin), {
  prefix: "/trpc",
  useWSS: true,
  trpcOptions: {
    router: appRouter,
    createContext: ({ req }: CreateFastifyContextOptions): Context => ({
      request: req,
    }),
  },
});

export type AppRouter = typeof appRouter;

app.listen(3001, "0.0.0.0", () => {
  console.log("✅ Server was started at 3001");
});
