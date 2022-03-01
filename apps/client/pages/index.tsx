import type { NextPage } from "next";
import Link from "next/link";
import Layout from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";

interface HomeProps {}

const Home: React.VFC<HomeProps> = () => {
  const { user, login, logout } = useAuth();

  const onLogin = async () => {
    await login();
  };

  const onLogout = async () => {
    await logout();
  };

  if (user) {
    return (
      <div>
        <div>
          <p>{user!.name}</p>
          <p>{user!.surname}</p>
        </div>

        <div>
          <button onClick={onLogout}>Выйти</button>
        </div>

        <div>
          <Link href="/protected">PROTECTED</Link>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <p>Не авторизован</p>
        <button onClick={onLogin}>Авторизоваться</button>
      </div>
    );
  }

  // const {
  //   data: posts,
  //   isLoading,
  //   isError,
  //   error,
  // } = trpc.useQuery(["posts.getPosts"]);

  // if (isError) {
  //   return <NextError statusCode={error?.data?.httpStatus ?? 500} />;
  // }

  // if (isLoading) {
  //   return <p>Loading...</p>;
  // }

  // return (
  //   <div className={styles.container}>
  //     <Head>
  //       <title>Main</title>
  //       <link rel="icon" href="/favicon.ico" />
  //     </Head>

  //     {posts!.map((post, index) => (
  //       <div key={index}>
  //         <p>{post.name}</p>
  //         <p>{post.text}</p>
  //       </div>
  //     ))}

  //     <Link href="/protected">PROTECTED</Link>
  //   </div>
  // );

  // return (
  //   <>
  //     <div>123</div>
  //     <Link href="/protected">PROTECTED</Link>
  //   </>
  // );
};

const HomePage: NextPage = () => {
  return (
    <Layout>
      <Home />
    </Layout>
  );
};

export default HomePage;
