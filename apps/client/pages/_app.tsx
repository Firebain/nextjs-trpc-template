import "../styles/globals.css";
import { withTRPC } from "@trpc/next";
import cookie from "cookie";
import type { AppRouter } from "server";
import type { AppProps } from "next/app";
import { createWSClient, wsLink } from "@trpc/client/links/wsLink";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import { splitLink } from "@trpc/client/links/splitLink";
import { TRPCLink } from "@trpc/client";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    const isSSR = typeof window === "undefined";

    const getHeaders = () => {
      let authHeaders: { Authorization?: string } = {};

      if (isSSR) {
        const cookieHeaders = ctx?.req?.headers?.cookie;
        const cookieDecoded = cookieHeaders
          ? cookie.parse(cookieHeaders)
          : undefined;
        const token = cookieDecoded?.["token"];

        if (token) {
          authHeaders = {
            Authorization: `Bearer ${token}`,
          };
        }
      } else {
        const cookieDecoded = cookie.parse(document.cookie);

        const token = cookieDecoded["token"];

        if (token) {
          authHeaders = {
            Authorization: `Bearer ${token}`,
          };
        }
      }

      return {
        "x-ssr": isSSR ? "1" : "0",
        ...authHeaders,
      };
    };

    const url = isSSR
      ? "http://localhost:3001/trpc"
      : "http://localhost:3001/trpc";

    let endingLink: TRPCLink<AppRouter>;

    if (isSSR) {
      endingLink = httpBatchLink({
        url,
      });
    } else {
      const wsClient = createWSClient({
        url: isSSR ? "ws://localhost:3002" : "ws://localhost:3002",
      });

      endingLink = splitLink({
        condition(op) {
          return op.type === "query" || op.type === "mutation";
        },
        true: httpBatchLink({
          url,
        }),
        false: wsLink({
          client: wsClient,
        }),
      });
    }

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
})(MyApp);
