import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = Cookies.get("key");

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

export default PublicRoute;
