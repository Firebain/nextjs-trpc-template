import { useAuth } from "../contexts/AuthContext";

const Layout: React.FC = ({ children }) => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return <>{children}</>;
};

export default Layout;
