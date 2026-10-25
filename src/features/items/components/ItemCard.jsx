import PropTypes from "prop-types"; // Tambahan: Import PropTypes
import { Link, useNavigate } from "react-router-dom";
import { Heart, MapPin, ShoppingBag } from "lucide-react";
import CategoryIcon from "./CategoryIcon";
import { useAuth } from "../../auth/states/AuthContext";
import { useCart } from "../../cart/states/CartContext";
import { rupiah, tint } from "../../../helpers/toolsHelper";

export default function ItemCard({ item }) {
  const { user, favs, toggleFav } = useAuth();
  const { cart, addToCart } = useCart();
  const navigate = useNavigate();
  const fav = favs.includes(item.id);
  const inCart = cart.some((i) => i.id === item.id);

  const onFav = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (user) toggleFav(item.id);
    else navigate("/login");
  };

  const onAddCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(item);
  };

  const style = item.image 
    ? { background: `center / cover url(${item.image})` } 
    : { background: tint(item.category) };

  return (
    <article className="relative overflow-hidden rounded-2xl border border-line bg-white transition-transform hover:-translate-y-1 motion-reduce:transition-none group">
      <Link to={`/item/${item.id}`} aria-label={item.title}>
        <div className="grid aspect-[4/3] place-items-center text-brand relative" style={style}>
          {!item.image && <CategoryIcon category={item.category} size={56} />}
        </div>
        <div className="relative border-t-2 border-dashed border-line px-4 pt-5 pb-4">
          <span className="absolute -top-2.5 left-1/2 h-5 w-5 -translate-x-1/2 rounded-full border border-line bg-paper" aria-hidden="true" />
          <div className="flex items-start justify-between gap-2">
            <p className="text-xl font-extrabold text-brand">{rupiah(item.price)}</p>
            {item.status !== "sold" && (
              <button
                type="button"
                onClick={onAddCart}
                className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors ${
                  inCart
                    ? "bg-brand text-white border-brand"
                    : "bg-paper text-ink border-line hover:bg-sun hover:border-sun"
                }`}
                title={inCart ? "Sudah di keranjang" : "Tambah ke keranjang"}
                aria-label={inCart ? "Sudah di keranjang" : "Tambah ke keranjang"}
              >
                <ShoppingBag size={14} aria-hidden="true" />
                <span>{inCart ? "Di Keranjang" : "+ Keranjang"}</span>
              </button>
            )}
          </div>
          <h3 className="leading-snug font-semibold mt-1 line-clamp-1">{item.title}</h3>
          <p className="mt-1 flex items-center gap-1 text-sm text-ink2">
            <MapPin size={14} aria-hidden="true" />
            {[item.city, item.province].filter(Boolean).join(", ") || item.address || "Indonesia"} · {item.condition}
          </p>
        </div>
      </Link>
      
      {item.status === "sold" && (
        <span className="absolute top-3 left-0 rounded-r-full bg-red-700 px-3 py-0.5 text-sm font-semibold text-white">
          Terjual
        </span>
      )}
      
      <button 
        onClick={onFav} 
        aria-label={fav ? "Hapus dari favorit" : "Simpan ke favorit"} 
        className="absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-white shadow-sm hover:scale-105 transition-transform"
      >
        <Heart size={18} className={fav ? "fill-red-700 text-red-700" : "text-ink"} aria-hidden="true" />
      </button>
    </article>
  );
}

// Tambahan: Props Validation
ItemCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    category: PropTypes.string,
    condition: PropTypes.string,
    image: PropTypes.string,
    address: PropTypes.string,
    province: PropTypes.string,
    city: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
};