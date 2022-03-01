import { trpc } from "../utils/trpc";
import NextError from "next/error";
import Link from "next/link";

const Protected: React.FC = () => {
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = trpc.useQuery(["protected.getUser"]);

  trpc.useSubscription(["protected.getNews"], {
    onNext(text) {
      console.log(text);
    },
  });

  if (isError) {
    return <NextError statusCode={error?.data?.httpStatus ?? 500} />;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div>PROTECTED</div>
      <div>
        <p>{user!.name}</p>
        <p>{user!.surname}</p>
      </div>
      <Link href="/">MAIN</Link>
    </>
  );
};

export default Protected;
