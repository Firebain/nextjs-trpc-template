import "../styles/globals.css";
import { withTRPC } from "@trpc/next";
import cookie from "cookie";
import type { AppRouter } from "server";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    const isSSR = typeof window === "undefined";

    let authHeaders: { token?: string } = {};
    if (isSSR) {
      const cookieHeaders = ctx?.req?.headers?.cookie;
      const cookieDecoded = cookieHeaders
        ? cookie.parse(cookieHeaders)
        : undefined;
      const token = cookieDecoded?.["token"];

      if (token) {
        authHeaders = {
          token,
        };
      }
    } else {
      const cookieDecoded = cookie.parse(document.cookie);

      const token = cookieDecoded["token"];

      if (token) {
        authHeaders = {
          token,
        };
      }
    }

    const url = isSSR
      ? "http://localhost:3001/trpc"
      : "http://localhost:3001/trpc";

    return {
      url,
      headers: {
        "x-ssr": isSSR ? "1" : "0",
        ...authHeaders,
      },
      queryClientConfig: {
        defaultOptions: {
          queries: {
            staleTime: 3000,
            retryOnMount: false,
            retry: false,
          },
        },
      },
    };
  },
  responseMeta({ clientErrors }) {
    if (clientErrors.length) {
      return {
        status: clientErrors[0].data?.httpStatus ?? 500,
      };
    }

    return {};
  },
  ssr: true,
})(MyApp);
