import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Heart, Mail, MapPin, ShoppingBag, MessageSquare } from "lucide-react";
import { getItem } from "../api/itemApi";
import CategoryIcon from "../components/CategoryIcon";
import { useAuth } from "../../auth/states/AuthContext";
import { useCart } from "../../cart/states/CartContext";
import { rupiah, tint } from "../../../helpers/toolsHelper";
import { formatLocation } from "../../../helpers/locations";

export default function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, favs, toggleFav } = useAuth();
  const { cart, addToCart } = useCart();
  const [item, setItem] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => { getItem(id).then(setItem).catch((e) => setError(e.message)); }, [id]);

  if (error) return <p role="alert" className="py-10 font-semibold text-red-700">{error}</p>;
  if (!item) return <p className="py-10 text-ink2">Memuat…</p>;
  const fav = favs.includes(item.id);
  const inCart = cart.some((i) => i.id === item.id);
  const style = item.image ? { background: `center / cover url(${item.image})` } : { background: tint(item.category) };

  const handleChat = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    navigate(`/chat/${item.id}`);
  };

  return (
    <section className="py-6">
      <button type="button" onClick={() => navigate(-1)} className="mb-4 inline-flex items-center gap-1 text-ink2 hover:text-ink cursor-pointer bg-transparent border-0 p-0 text-base"><ChevronLeft size={18} aria-hidden="true" />Kembali</button>
      <div className="grid gap-9 md:grid-cols-2">
        <div className="grid aspect-square place-items-center rounded-2xl text-brand" style={style}>
          {!item.image && <CategoryIcon category={item.category} size={120} />}
        </div>
        <div>
          <p className="text-ink2">{item.category} · {item.condition}</p>
          <h1 className="text-4xl leading-tight font-extrabold tracking-tight">{item.title}</h1>
          <p className="my-2 text-3xl font-extrabold text-brand">{rupiah(item.price)}</p>
          <p className="max-w-prose">{item.description || "Penjual belum menambahkan deskripsi."}</p>
          <div className="my-5 rounded-2xl border border-line bg-white p-4">
            <p className="font-semibold">{item.seller.name}</p>
            <p className="flex items-center gap-1 text-sm text-ink2"><MapPin size={14} aria-hidden="true" />{formatLocation(item)}</p>
          </div>
          {item.status === "sold" ? (
            <p className="font-semibold text-red-700">Barang ini sudah terjual.</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => addToCart(item)}
                className={`btn ${inCart ? "bg-brand text-white hover:brightness-110" : ""}`}
              >
                <ShoppingBag size={18} aria-hidden="true" />
                <span>{inCart ? "Sudah di Keranjang" : "Tambah ke Keranjang"}</span>
              </button>

              <button
                type="button"
                onClick={handleChat}
                className="btn btn-ghost"
              >
                <MessageSquare size={18} aria-hidden="true" />
                <span>Chat Penjual / Pesan</span>
              </button>

              <a className="btn btn-ghost text-sm" href={`mailto:${item.seller.email}?subject=${encodeURIComponent(`Tanya: ${item.title}`)}`}>
                <Mail size={16} aria-hidden="true" />
                <span>Email</span>
              </a>

              {user && (
                <button className="btn btn-ghost" onClick={() => toggleFav(item.id)}>
                  <Heart size={18} className={fav ? "fill-red-700 text-red-700" : ""} aria-hidden="true" />{fav ? "Tersimpan" : "Simpan"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
