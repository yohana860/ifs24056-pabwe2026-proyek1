import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Send, ArrowLeft, User, MapPin } from "lucide-react";
import { getItem } from "../../items/api/itemApi";
import { useAuth } from "../../auth/states/AuthContext";
import { useCart } from "../../cart/states/CartContext";
import { rupiah } from "../../../helpers/toolsHelper";
import { formatLocation } from "../../../helpers/locations";

export default function ChatPage() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getChat, sendMessage } = useCart();
  const [item, setItem] = useState(null);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    getItem(itemId).then(setItem).catch(() => {});
  }, [itemId]);

  const chat = getChat(itemId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat.messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    sendMessage({
      itemId: item.id,
      itemTitle: item.title,
      seller: item.seller,
      senderName: user?.name || "Saya",
      text: input,
    });
    setInput("");
  };

  const handleQuickQuestion = (text) => {
    sendMessage({
      itemId: item.id,
      itemTitle: item.title,
      seller: item.seller,
      senderName: user?.name || "Saya",
      text,
    });
  };

  if (!item) {
    return (
      <div className="py-12 text-center text-ink2">
        <p>Memuat percakapan...</p>
      </div>
    );
  }

  return (
    <section className="py-4 max-w-4xl mx-auto flex flex-col h-[calc(100vh-160px)]">
      {/* Header Chat */}
      <div className="flex items-center gap-3 p-4 rounded-t-2xl border border-b-0 border-line bg-white shadow-xs">
        <button
          onClick={() => navigate(-1)}
          className="p-1.5 rounded-lg text-ink2 hover:bg-paper"
          aria-label="Kembali"
        >
          <ArrowLeft size={18} aria-hidden="true" />
        </button>

        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-full bg-sun text-ink flex items-center justify-center font-bold text-sm shrink-0">
            {item.seller?.name?.[0] || <User size={18} />}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-bold text-base leading-tight truncate">
              {item.seller?.name || "Pemilik Barang"}
            </h2>
            <p className="text-xs text-ink2 flex items-center gap-1 mt-0.5 truncate">
              <MapPin size={11} aria-hidden="true" />
              <span>{formatLocation(item)}</span>
            </p>
          </div>
        </div>

        {/* Ringkasan Barang yang Dibeli */}
        <Link
          to={`/item/${item.id}`}
          className="flex items-center gap-2 p-2 rounded-xl bg-paper hover:bg-line/40 transition-colors border border-line shrink-0"
        >
          <div
            className="w-9 h-9 rounded-lg bg-white border border-line bg-cover bg-center shrink-0"
            style={item.image ? { backgroundImage: `url(${item.image})` } : {}}
          />
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold line-clamp-1 max-w-[120px]">{item.title}</p>
            <p className="text-xs font-extrabold text-brand">{rupiah(item.price)}</p>
          </div>
        </Link>
      </div>

      {/* Area Pesan Chat */}
      <div className="flex-1 overflow-y-auto p-4 bg-paper border-x border-line flex flex-col gap-3">
        <div className="mx-auto my-2 px-3 py-1 bg-white border border-line rounded-full text-xs text-ink2 text-center">
          Percakapan langsung dengan pemilik barang untuk transaksi & pemesanan.
        </div>

        {chat.messages.length === 0 ? (
          <div className="my-auto text-center py-8">
            <p className="text-sm text-ink2 mb-4">
              Belum ada pesan. Mulai percakapan untuk menanyakan ketersediaan atau melakukan penawaran!
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => handleQuickQuestion(`Halo, apakah "${item.title}" masih tersedia?`)}
                className="px-3 py-1.5 rounded-full bg-white border border-line text-xs font-semibold hover:border-brand hover:text-brand"
              >
                Apakah masih tersedia?
              </button>
              <button
                type="button"
                onClick={() => handleQuickQuestion(`Halo, apakah harganya bisa dinegosiasikan?`)}
                className="px-3 py-1.5 rounded-full bg-white border border-line text-xs font-semibold hover:border-brand hover:text-brand"
              >
                Bisa nego harga?
              </button>
              <button
                type="button"
                onClick={() => handleQuickQuestion(`Halo, saya ingin memesan barang ini. Bagaimana proses pembayarannya?`)}
                className="px-3 py-1.5 rounded-full bg-white border border-line text-xs font-semibold hover:border-brand hover:text-brand"
              >
                Saya ingin memesan
              </button>
            </div>
          </div>
        ) : (
          chat.messages.map((m) => {
            const isMe = m.senderName === (user?.name || "Saya");
            return (
              <div
                key={m.id}
                className={`flex flex-col max-w-[80%] ${
                  isMe ? "self-end items-end" : "self-start items-start"
                }`}
              >
                <div
                  className={`p-3.5 rounded-2xl text-sm leading-relaxed ${
                    isMe
                      ? "bg-brand text-white rounded-br-xs"
                      : "bg-white text-ink border border-line rounded-bl-xs shadow-2xs"
                  }`}
                >
                  <p>{m.text}</p>
                </div>
                <span className="text-[10px] text-ink2 px-1 mt-1">
                  {m.senderName} · {m.timestamp}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Chat */}
      <form
        onSubmit={handleSend}
        className="p-3 bg-white border border-t-0 border-line rounded-b-2xl flex items-center gap-2 shadow-xs"
      >
        <input
          type="text"
          placeholder={`Tulis pesan untuk ${item.seller?.name || "penjual"}...`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 rounded-xl border border-line px-4 py-2.5 text-sm focus:outline-none focus:border-brand"
          aria-label="Tulis pesan chat"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="btn btn-sm disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Kirim pesan"
        >
          <Send size={16} aria-hidden="true" />
          <span className="hidden sm:inline">Kirim</span>
        </button>
      </form>
    </section>
  );
}
