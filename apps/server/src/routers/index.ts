import { createGlobalRouter } from "../modules/trpc";
import { users } from "./user";
import { auth } from "./auth";
import { posts } from "./posts";
import { news } from "./news";

export const appRouter = createGlobalRouter()
  .merge("users.", users)
  .merge("auth.", auth)
  .merge("posts.", posts)
  .merge("news.", news);
