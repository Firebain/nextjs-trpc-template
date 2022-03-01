import { TRPCClientErrorLike } from "@trpc/client";
import React, { PropsWithChildren } from "react";
import { AppRouter, InferQueryOutput } from "server";
import { trpc } from "../utils/trpc";
import { NextComponentType } from "next";
import { AppContextType, AppPropsType } from "next/dist/shared/lib/utils";
import cookies from "cookie";
import Cookie from "js-cookie";

interface AuthContext {
  user?: InferQueryOutput<"users.me">;
  isLoading: boolean;
  isError: boolean;
  error: TRPCClientErrorLike<AppRouter> | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContext>(null!);

interface AuthProviderProps {
  token: string | undefined;
}

const AuthProvider = ({
  token,
  children,
}: PropsWithChildren<AuthProviderProps>) => {
  const utils = trpc.useContext();

  const { data, isLoading, isError, error, refetch } = trpc.useQuery(
    ["users.me"],
    {
      enabled: token !== undefined,
    }
  );

  const getToken = trpc.useMutation("auth.getToken", {
    onSuccess(token) {
      Cookie.set("token", token, {
        sameSite: "Lax",
      });
    },
  });

  const login = async () => {
    await getToken.mutateAsync();

    await refetch();
  };

  const logout = async () => {
    Cookie.remove("token");

    utils.queryClient.setQueryData("users.me", undefined);
  };

  const value: AuthContext = {
    user: data,
    isLoading,
    isError,
    error,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => React.useContext(AuthContext);

export const withAuth = (
  AppOrPage: NextComponentType<any, any, any>
): NextComponentType => {
  const WithAuth = (props: AppPropsType) => {
    return (
      <AuthProvider token={props.pageProps.token}>
        <AppOrPage {...props}></AppOrPage>
      </AuthProvider>
    );
  };

  WithAuth.getInitialProps = (appOrPageCtx: AppContextType) => {
    const isSSR = typeof window === "undefined";

    let token: string | undefined;
    if (isSSR) {
      const cookieHeaders = appOrPageCtx.ctx?.req?.headers?.cookie;
      const cookieDecoded = cookieHeaders
        ? cookies.parse(cookieHeaders)
        : undefined;
      token = cookieDecoded?.["token"];
    } else {
      const cookieDecoded = cookies.parse(document.cookie);

      token = cookieDecoded["token"];
    }

    return {
      pageProps: {
        token,
      },
    };
  };

  return WithAuth as any;
};
