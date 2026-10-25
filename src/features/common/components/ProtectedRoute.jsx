import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../auth/states/AuthContext";

export default function ProtectedRoute() {
  const { user, ready } = useAuth();

  // JIKA SESI BELUM SELESAI DICEK, TAMPILKAN LOADING
  // Ini mencegah redirect ke login saat state 'user' belum ter-update
  if (!ready) {
    return <p className="py-10 text-ink2">Memuat…</p>;
  }

  // Setelah 'ready' true, baru cek apakah user ada atau tidak
  return user ? <Outlet /> : <Navigate to="/auth/login" replace />;
}