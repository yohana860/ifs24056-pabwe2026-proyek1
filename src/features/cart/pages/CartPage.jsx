import { Link, useNavigate } from "react-router-dom";
import { Trash2, MessageSquare, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "../states/CartContext";
import { rupiah } from "../../../helpers/toolsHelper";
import { useAuth } from "../../auth/states/AuthContext";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const total = cart.reduce((acc, item) => acc + (Number(item.price) || 0), 0);

  const handleOrderChat = (item) => {
    if (!user) {
      navigate("/login");
      return;
    }
    navigate(`/chat/${item.id}`);
  };

  return (
    <section className="py-6">
      <div className="flex items-center justify-between pb-6 border-b border-line">
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
          <ShoppingBag className="text-brand" size={28} aria-hidden="true" />
          <span>Keranjang Belanja</span>
        </h1>
        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="text-sm text-red-700 hover:underline font-semibold"
          >
            Kosongkan keranjang
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-lg text-ink2 mb-4">Keranjang belanja kamu masih kosong.</p>
          <Link to="/" className="btn">
            Mulai Cari Barang
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3 mt-6">
          <div className="lg:col-span-2 flex flex-col gap-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl border border-line bg-white shadow-sm"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className="w-20 h-20 rounded-xl bg-paper shrink-0 border border-line bg-center bg-cover"
                    style={item.image ? { backgroundImage: `url(${item.image})` } : {}}
                  />
                  <div>
                    <Link
                      to={`/item/${item.id}`}
                      className="font-bold text-lg hover:text-brand transition-colors line-clamp-1"
                    >
                      {item.title}
                    </Link>
                    <p className="text-sm font-extrabold text-brand mt-0.5">
                      {rupiah(item.price)}
                    </p>
                    <p className="text-xs text-ink2 mt-1">
                      Penjual:{" "}
                      <span className="font-semibold text-ink">
                        {item.seller?.name || "Penjual"}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => handleOrderChat(item)}
                    className="btn btn-sm flex items-center gap-1.5"
                    title="Pesan via Chat dengan Penjual"
                  >
                    <MessageSquare size={15} aria-hidden="true" />
                    <span>Pesan via Chat</span>
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-ink2 hover:text-red-700 rounded-lg hover:bg-paper"
                    aria-label={`Hapus ${item.title}`}
                    title="Hapus dari keranjang"
                  >
                    <Trash2 size={18} aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Ringkasan & Instruksi Pemesanan */}
          <div className="panel my-0! h-fit">
            <h2 className="text-xl font-bold border-b border-line pb-3">Ringkasan</h2>
            <div className="flex justify-between items-center text-sm">
              <span className="text-ink2">Total barang</span>
              <span className="font-semibold">{cart.length} barang</span>
            </div>
            <div className="flex justify-between items-center text-base border-t border-line pt-3">
              <span className="font-bold">Total Nilai</span>
              <span className="font-extrabold text-xl text-brand">{rupiah(total)}</span>
            </div>

            <div className="rounded-xl bg-paper p-3.5 text-xs text-ink2 border border-line/60">
              <p className="font-semibold text-ink mb-1">💬 Cara Pemesanan:</p>
              <p>
                Klik tombol <strong>Pesan via Chat</strong> pada barang yang ingin dibeli untuk berdiskusi langsung dengan penjual, menegosiasikan harga, dan menyepakati transaksi.
              </p>
            </div>

            {cart.length > 0 && (
              <button
                onClick={() => handleOrderChat(cart[0])}
                className="btn w-full mt-2"
              >
                <span>Mulai Chat Pemesanan</span>
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
