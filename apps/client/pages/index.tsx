import type { NextPage } from "next";
import Link from "next/link";
import Layout from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";
import { trpc } from "../utils/trpc";

const Home: React.VFC = () => {
  const { user, logout } = useAuth();

  const { data: posts, isLoading } = trpc.useQuery(["posts.getPosts"], {
    staleTime: 1000 * 60 * 5,
  });

  const onLogout = async () => {
    await logout();
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      {user ? (
        <div>
          <div>
            <p>Name: {user!.name}</p>
            <p>Surname: {user!.surname}</p>
          </div>

          <div>
            <button onClick={onLogout}>Logout</button>
          </div>

          <div>
            <Link href="/protected">PROTECTED</Link>
          </div>
        </div>
      ) : (
        <div>
          <p>Not authorized</p>
          <Link href="/auth/signup">Register</Link>
          <Link href="/auth/login">Login</Link>
        </div>
      )}

      {posts!.map((post, index) => (
        <div key={index}>
          <p>{post.title}</p>
          <p>{post.text}</p>
        </div>
      ))}
    </>
  );
};

const HomePage: NextPage = () => {
  return (
    <Layout>
      <Home />
    </Layout>
  );
};

export default HomePage;
