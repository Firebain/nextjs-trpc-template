import { NextPageContext } from "next/dist/shared/lib/utils";
import cookies from "cookie";

export const getToken = (ctx?: NextPageContext) => {
  const isSSR = typeof window === "undefined";

  if (isSSR) {
    const cookieHeaders = ctx?.req?.headers?.cookie;
    const cookieDecoded = cookieHeaders
      ? cookies.parse(cookieHeaders)
      : undefined;
    return cookieDecoded?.["token"];
  } else {
    const cookieDecoded = cookies.parse(document.cookie);

    return cookieDecoded["token"];
  }
};
