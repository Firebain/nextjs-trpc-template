import Link from "next/link";
import AuthLayout, { useUser } from "../components/AuthLayout";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { trpc } from "../utils/trpc";
import { useState } from "react";
import { InferAsyncSubscriptionOutput, InferSubscriptionOutput } from "server";

type News = InferAsyncSubscriptionOutput<"news.feed">;

const Protected: React.VFC = () => {
  const router = useRouter();
  const { user, logout } = useUser();

  const [feed, setFeed] = useState<News[]>([]);

  trpc.useSubscription(["news.feed"], {
    onNext(news) {
      setFeed((feed) => [news, ...feed]);
    },
  });

  const onLogout = async () => {
    await router.push("/");

    await logout();
  };

  return (
    <>
      <div>PROTECTED</div>

      <div>
        <p>{user.name}</p>
        <p>{user.surname}</p>
      </div>

      <div>
        <button onClick={onLogout}>Logout</button>
      </div>

      <div>
        <Link href="/">MAIN</Link>
      </div>

      {feed.map((news, index) => (
        <p key={index}>{news.text}</p>
      ))}
    </>
  );
};

const ProtectedPage: NextPage = () => (
  <AuthLayout>
    <Protected />
  </AuthLayout>
);

export default ProtectedPage;
