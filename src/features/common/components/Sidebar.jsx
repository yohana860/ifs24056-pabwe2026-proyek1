import { Link, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Heart, Package, PlusCircle, ShoppingBag, MessageSquare, LogIn, UserPlus, LogOut } from "lucide-react";
import { useAuth } from "../../auth/states/AuthContext";
import { useCart } from "../../cart/states/CartContext";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const navClass = ({ isActive }) =>
    `flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition-colors ${
      isActive ? "bg-sun text-ink font-bold shadow-sm" : "text-white/80 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <aside className="w-64 bg-ink text-white min-h-screen flex flex-col justify-between p-5 border-r border-line/20 shrink-0">
      <div className="flex flex-col gap-6">
        <Link to="/" className="flex items-center gap-2 px-2 text-2xl font-extrabold tracking-tight">
          <div className="w-9 h-9 rounded-xl bg-sun text-ink flex items-center justify-center font-black text-xl">
            N
          </div>
          <span>
            Next<span className="text-sun">Owner</span>
          </span>
        </Link>

        <nav aria-label="Menu navigasi" className="flex flex-col gap-1.5">
          <NavLink to="/" end className={navClass}>
            <div className="flex items-center gap-3">
              <LayoutDashboard size={18} aria-hidden="true" />
              <span>Beranda</span>
            </div>
          </NavLink>

          <NavLink to="/cart" className={navClass}>
            <div className="flex items-center gap-3">
              <ShoppingBag size={18} aria-hidden="true" />
              <span>Keranjang</span>
            </div>
            {cartCount > 0 && (
              <span className="bg-sun text-ink text-xs font-bold px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </NavLink>

          {user && (
            <NavLink to="/messages" className={navClass}>
              <div className="flex items-center gap-3">
                <MessageSquare size={18} aria-hidden="true" />
                <span>Pesan & Chat</span>
              </div>
            </NavLink>
          )}

          {user ? (
            <>
              <NavLink to="/mine" className={navClass}>
                <div className="flex items-center gap-3">
                  <Package size={18} aria-hidden="true" />
                  <span>Barang saya</span>
                </div>
              </NavLink>
              <NavLink to="/favorites" className={navClass}>
                <div className="flex items-center gap-3">
                  <Heart size={18} aria-hidden="true" />
                  <span>Favorit</span>
                </div>
              </NavLink>
              <NavLink to="/sell" className={navClass}>
                <div className="flex items-center gap-3">
                  <PlusCircle size={18} aria-hidden="true" />
                  <span>Jual barang</span>
                </div>
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navClass}>
                <div className="flex items-center gap-3">
                  <LogIn size={18} aria-hidden="true" />
                  <span>Masuk</span>
                </div>
              </NavLink>
              <NavLink to="/register" className={navClass}>
                <div className="flex items-center gap-3">
                  <UserPlus size={18} aria-hidden="true" />
                  <span>Daftar</span>
                </div>
              </NavLink>
            </>
          )}
        </nav>
      </div>

      <div className="pt-4 border-t border-white/10">
        {user ? (
          <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white/5">
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold truncate text-white">{user.name}</span>
              <span className="text-xs text-white/60 truncate">{user.email || "Pengguna"}</span>
            </div>
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="p-2 rounded-lg text-white/70 hover:text-sun hover:bg-white/10"
              aria-label="Keluar"
              title="Keluar"
            >
              <LogOut size={18} aria-hidden="true" />
            </button>
          </div>
        ) : (
          <p className="text-xs text-white/50 text-center py-2">Silakan masuk atau buat akun baru.</p>
        )}
      </div>
    </aside>
  );
}
