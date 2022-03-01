import { createRouter } from "../modules/trpc";

interface Post {
  title: string;
  text: string;
}

export const posts = createRouter().query("getPosts", {
  resolve(): Post[] {
    return [
      {
        title: "FIRST",
        text: "FIRST TEXT",
      },
      {
        title: "SECOND",
        text: "SECOND TEXT",
      },
    ];
  },
});
