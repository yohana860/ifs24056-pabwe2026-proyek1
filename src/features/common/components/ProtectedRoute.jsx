import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../auth/states/AuthContext";

export default function ProtectedRoute() {
  const { user, ready } = useAuth();

  // Cek langsung ke localStorage sebagai sumber kebenaran terakhir
  const token = globalThis.localStorage?.getItem("token");
  const isAuthenticated = user || token;

  if (!ready) {
    return <p className="py-10 text-ink2">Memuat…</p>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/auth/login" replace />;
}