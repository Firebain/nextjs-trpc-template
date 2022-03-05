import { useRouter } from "next/router";
import { useEffect } from "react";

interface NavigateProps {
  href: string;
}

const Navigate: React.VFC<NavigateProps> = ({ href }) => {
  const router = useRouter();

  useEffect(() => {
    router.push(href);
  }, [router, href]);

  return null;
};

export default Navigate;
