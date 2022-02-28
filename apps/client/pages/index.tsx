import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import NextError from "next/error";
import styles from "../styles/Home.module.css";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const {
    data: posts,
    isLoading,
    isError,
    error,
  } = trpc.useQuery(["posts.getPosts"]);

  if (isError) {
    return <NextError statusCode={error?.data?.httpStatus ?? 500} />;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Main</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {posts!.map((post, index) => (
        <div key={index}>
          <p>{post.name}</p>
          <p>{post.text}</p>
        </div>
      ))}

      <Link href="/protected">PROTECTED</Link>
    </div>
  );
};

export default Home;
