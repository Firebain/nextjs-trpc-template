import { useAuth } from "../contexts/AuthContext";
import NextError from "next/error";
import React from "react";
import { InferQueryOutput } from "server";

interface AuthLayoutContext {
  user: InferQueryOutput<"users.me">;
  logout: () => Promise<void>;
}

const AuthLayoutContext = React.createContext<AuthLayoutContext>(null!);

const AuthLayout: React.FC = ({ children }) => {
  const { user, isLoading, isError, error, logout } = useAuth();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <NextError statusCode={error?.data?.httpStatus ?? 500} />;
  }

  if (!user) {
    return <NextError statusCode={403} />;
  }

  return (
    <AuthLayoutContext.Provider value={{ user: user!, logout }}>
      {children}
    </AuthLayoutContext.Provider>
  );
};

export const useUser = () => React.useContext(AuthLayoutContext);

export default AuthLayout;
