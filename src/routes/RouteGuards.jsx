import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

export function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/signin" replace state={{ from: location.pathname }} />;
  }

  return children;
}

export function PublicOnlyRoute({ children }) {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/profile" replace />;
  }

  return children;
}
