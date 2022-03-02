import "../styles/globals.scss";
import { withTRPC as withTRPCSetup } from "@trpc/next";
import type { AppRouter } from "server";
import type { AppProps } from "next/app";
import { createWSClient, wsLink } from "@trpc/client/links/wsLink";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import { splitLink } from "@trpc/client/links/splitLink";
import { withAuth } from "../contexts/AuthContext";
import { getToken } from "../utils/auth";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

const withTRPC = withTRPCSetup<AppRouter>({
  config({ ctx }) {
    const isSSR = typeof window === "undefined";

    const host = isSSR ? "localhost:3001/trpc" : "localhost:3001/trpc";

    const getHeaders = () => {
      let authHeaders: { Authorization?: string } = {};

      const token = getToken(ctx);

      if (token) {
        authHeaders = {
          Authorization: `Bearer ${token}`,
        };
      }

      return {
        "x-ssr": isSSR ? "1" : "0",
        ...authHeaders,
      };
    };

    const url = `http://${host}`;

    let endingLink = isSSR
      ? httpBatchLink({
          url,
        })
      : splitLink({
          condition(op) {
            return op.type === "subscription";
          },
          true: wsLink({
            client: createWSClient({
              url: `ws://${host}`,
            }),
          }),
          false: httpBatchLink({
            url,
          }),
        });

    return {
      url,
      headers: getHeaders,
      links: [endingLink],
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
});

export default withTRPC(withAuth(MyApp));
