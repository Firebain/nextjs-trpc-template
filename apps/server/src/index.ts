import {
  CreateFastifyContextOptions,
  fastifyTRPCPlugin,
} from "@trpc/server/adapters/fastify";
import fastify from "fastify";
import plugin from "fastify-plugin";
import ws from "fastify-websocket";
import cors from "fastify-cors";
import { Context, createGlobalRouter } from "./modules/trpc";
import { users } from "./routers/user";
import { auth } from "./routers/auth";

export const appRouter = createGlobalRouter()
  .merge("users.", users)
  .merge("auth.", auth);

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

app.listen(3001, "0.0.0.0", () => {
  console.log("✅ Server was started at 3001");
});

export type AppRouter = typeof appRouter;

export type {
  TQuery,
  TMutation,
  TSubscription,
  InferQueryOutput,
  InferQueryInput,
  InferMutationOutput,
  InferMutationInput,
  InferSubscriptionOutput,
  InferAsyncSubscriptionOutput,
  InferSubscriptionInput,
  InferQueryHandlerInput,
} from "./types";
