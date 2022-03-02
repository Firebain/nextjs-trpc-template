import type { NextPage } from "next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateUser } from "forms";
import { trpc } from "../../utils/trpc";
import { useAuth } from "../../contexts/AuthContext";
import { formHandler } from "../../helpers/errors";
import { useRouter } from "next/router";
import { useEffect } from "react";

const SignUp: React.VFC = () => {
  const router = useRouter();

  const { user, login } = useAuth();

  useEffect(() => {
    if (user) {
      router.push("/protected");
    }
  }, [user, router]);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CreateUser>({
    resolver: zodResolver(CreateUser),
  });

  const createUser = trpc.useMutation("auth.createUser");

  const onSubmit = formHandler(setError, async (data) => {
    const token = await createUser.mutateAsync(data);

    await login(token);

    await router.push("/protected");
  });

  if (user) {
    return null;
  }

  return (
    <>
      <div>
        Email: <input type="text" {...register("email")} />
        {errors.email ? <p>{errors.email.message}</p> : null}
      </div>
      <div>
        Name: <input type="text" {...register("name")} />
        {errors.name ? <p>{errors.name.message}</p> : null}
      </div>
      <div>
        Password: <input type="password" {...register("password")} />
        {errors.password ? <p>{errors.password.message}</p> : null}
      </div>
      <div>
        Confirm Password:{" "}
        <input type="password" {...register("confirm_password")} />
        {errors.confirm_password ? (
          <p>{errors.confirm_password.message}</p>
        ) : null}
      </div>

      <button onClick={handleSubmit(onSubmit)}>Submit</button>
    </>
  );
};

const SignUpPage: NextPage = () => {
  return <SignUp />;
};

export default SignUpPage;
