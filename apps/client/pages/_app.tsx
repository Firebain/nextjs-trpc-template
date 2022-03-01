import "../styles/globals.css";
import { withTRPC as withTRPCSetup } from "@trpc/next";
import cookie from "cookie";
import type { AppRouter } from "server";
import type { AppProps } from "next/app";
import { createWSClient, wsLink } from "@trpc/client/links/wsLink";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import { splitLink } from "@trpc/client/links/splitLink";
import { TRPCLink } from "@trpc/client";
import { withAuth } from "../contexts/AuthContext";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

const withTRPC = withTRPCSetup<AppRouter>({
  config({ ctx }) {
    const isSSR = typeof window === "undefined";

    const host = isSSR ? "localhost:3001/trpc" : "localhost:3001/trpc";

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

    const url = `http://${host}`;

    let endingLink: TRPCLink<AppRouter>;

    if (isSSR) {
      endingLink = httpBatchLink({
        url,
      });
    } else {
      const wsClient = createWSClient({
        url: `ws://${host}`,
      });

      endingLink = splitLink({
        condition(op) {
          return op.type === "subscription";
        },
        true: wsLink({
          client: wsClient,
        }),
        false: httpBatchLink({
          url,
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
});

export default withTRPC(withAuth(MyApp));
