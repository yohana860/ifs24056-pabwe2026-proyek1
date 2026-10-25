import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, LogOut, Plus, User } from "lucide-react";
import { useAuth } from "../../auth/states/AuthContext";
import { useCart } from "../../cart/states/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-20 bg-ink text-white border-b border-white/10 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3">
        
        {/* Logo / Brand */}
        <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold tracking-tight shrink-0">
          <div className="w-8 h-8 rounded-lg bg-sun text-ink flex items-center justify-center font-black text-lg md:hidden">
            N
          </div>
          <span>
            Next<span className="text-sun">Owner</span>
          </span>
        </Link>

        {/* Action icons & user navigation */}
        <div className="flex items-center gap-3 shrink-0 text-sm ml-auto">
          
          {/* Tombol Beranda DIHAPUS dari sini */}

          {/* Cart Navigation Button */}
          <Link
            to="/cart"
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
            aria-label={`Keranjang belanja, ${cartCount} barang`}
          >
            <ShoppingBag size={18} className="text-sun" aria-hidden="true" />
            <span className="hidden md:inline">Keranjang</span>
            {cartCount > 0 && (
              <span className="inline-flex items-center justify-center bg-sun text-ink font-bold text-xs w-5 h-5 rounded-full ml-0.5">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Tombol Pesan DIHAPUS dari sini */}

          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-white/15">
              <Link to="/sell" className="btn btn-sm hidden sm:inline-flex">
                <Plus size={16} aria-hidden="true" />
                <span>Jual</span>
              </Link>

              {/* Tombol Menu Profile */}
              <Link
                to="/profile"
                className="flex items-center gap-1.5 text-white/80 hover:text-sun py-1 px-2 rounded-lg hover:bg-white/10 transition-colors"
                title="Profil Saya"
              >
                <User size={18} aria-hidden="true" />
                <span className="hidden md:inline">{user.name.split(" ")[0]}</span>
              </Link>
              
              {/* Tombol Logout */}
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="flex items-center gap-1.5 text-white/50 hover:text-red-400 py-1 px-2 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Keluar"
                title="Keluar"
              >
                <LogOut size={16} aria-hidden="true" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 pl-2 border-l border-white/15">
              <Link to="/login" className="hover:text-sun px-2 py-1 font-medium">
                Masuk
              </Link>
              <Link to="/register" className="btn btn-sm">
                Daftar
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}