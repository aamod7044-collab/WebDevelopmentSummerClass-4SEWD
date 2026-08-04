import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Wrap any protected page in this. If there's no logged-in user,
// it redirects straight to /login instead of rendering the page,
// which satisfies the "route protection" requirement on the frontend.
export default function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
