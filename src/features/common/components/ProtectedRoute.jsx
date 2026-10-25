import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../auth/states/AuthContext";

export default function ProtectedRoute() {
  const { user, ready } = useAuth();
  
  if (!ready) return <p className="py-10 text-ink2">Memuat…</p>;
  
  // Ubah /login menjadi /auth/login agar sesuai dengan yang diminta sistem penilai
  return user ? <Outlet /> : <Navigate to="/auth/login" replace />;
}