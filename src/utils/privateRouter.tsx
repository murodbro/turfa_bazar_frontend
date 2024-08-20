import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import useAuthStore from "../context/useAuthContext";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { isAuthenticated } = useAuthStore();

  return isAuthenticated ? <>{children}</> : <Navigate to="/sign_in" />;
};

export default PrivateRoute;
