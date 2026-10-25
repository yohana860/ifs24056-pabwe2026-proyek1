import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../auth/states/AuthContext";

export default function ProtectedRoute() {
  const { user, ready } = useAuth();
  if (!ready) return <p className="py-10 text-ink2">Memuat…</p>;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
