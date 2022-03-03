import type { NextPage } from "next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GetUserToken } from "forms";
import { trpc } from "../../utils/trpc";
import { useAuth } from "../../contexts/AuthContext";
import { formHandler } from "../../helpers/errors";
import { useRouter } from "next/router";
import Navigate from "../../components/Navigate";

const Login: React.VFC = () => {
  const router = useRouter();

  const { user, login } = useAuth();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<GetUserToken>({
    resolver: zodResolver(GetUserToken),
  });

  const getToken = trpc.useMutation("auth.getToken");

  const onSubmit = formHandler(setError, async (data) => {
    const token = await getToken.mutateAsync(data);

    await login(token);

    await router.push("/protected");
  });

  if (user) {
    return <Navigate href="/protected" />;
  }

  return (
    <>
      <div>
        Email: <input type="text" {...register("email")} />
        {errors.email ? <p>{errors.email.message}</p> : null}
      </div>
      <div>
        Password: <input type="password" {...register("password")} />
        {errors.password ? <p>{errors.password.message}</p> : null}
      </div>

      <button onClick={handleSubmit(onSubmit)}>Submit</button>
    </>
  );
};

const LoginPage: NextPage = () => {
  return <Login />;
};

export default LoginPage;
