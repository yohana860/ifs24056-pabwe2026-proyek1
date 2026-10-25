import { Link } from "react-router-dom";
import { MessageSquare, ArrowRight, User } from "lucide-react";
import { useCart } from "../../cart/states/CartContext";

export default function MessagesListPage() {
  const { chats } = useCart();
  const chatList = Object.values(chats).filter((c) => c?.itemId);

  return (
    <section className="py-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold tracking-tight mb-6 flex items-center gap-2">
        <MessageSquare className="text-brand" size={28} aria-hidden="true" />
        <span>Pesan & Negosiasi Transaksi</span>
      </h1>

      {chatList.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-line bg-white p-8">
          <p className="text-lg text-ink2 mb-4">
            Belum ada riwayat percakapan dengan penjual.
          </p>
          <p className="text-sm text-ink2 mb-6">
            Pilih barang yang kamu minati dari Beranda atau Keranjang, lalu kirim pesan untuk memulai pemesanan.
          </p>
          <Link to="/" className="btn">
            Cari Barang Sekarang
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {chatList.map((c) => {
            const lastMsg = c.messages?.[c.messages.length - 1];
            return (
              <Link
                key={c.itemId}
                to={`/chat/${c.itemId}`}
                className="flex items-center justify-between gap-4 p-4 rounded-2xl border border-line bg-white hover:border-brand/40 hover:shadow-xs transition-all"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-full bg-sun text-ink flex items-center justify-center font-bold text-base shrink-0">
                    {c.seller?.name?.[0] || <User size={20} />}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-base text-ink leading-tight truncate">
                      {c.seller?.name || "Pemilik Barang"}
                    </h3>
                    <p className="text-xs text-brand font-semibold mt-0.5 truncate">
                      Terkait: {c.itemTitle}
                    </p>
                    <p className="text-sm text-ink2 mt-1 truncate">
                      {lastMsg ? `${lastMsg.senderName}: ${lastMsg.text}` : "Mulai percakapan"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-ink2 shrink-0">
                  {lastMsg && <span className="text-xs">{lastMsg.timestamp}</span>}
                  <ArrowRight size={16} aria-hidden="true" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
