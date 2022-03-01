import Link from "next/link";
import AuthLayout, { useUser } from "../components/AuthLayout";
import { useRouter } from "next/router";
import { NextPage } from "next";

const Protected: React.VFC = () => {
  const router = useRouter();
  const { user, logout } = useUser();

  // trpc.useSubscription(["protected.getNews"], {
  //   onNext(text) {
  //     console.log(text);
  //   },
  // });

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
    </>
  );
};

const ProtectedPage: NextPage = () => (
  <AuthLayout>
    <Protected />
  </AuthLayout>
);

export default ProtectedPage;
