import { Navigate, Outlet } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";

function ProtectedRoute() {
  const { isAuthenticated } = useAppContext();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
