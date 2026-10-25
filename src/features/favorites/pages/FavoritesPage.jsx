import { useEffect, useState } from "react";
import { getFavorites } from "../api/favoriteApi";
import ItemGrid from "../../items/components/ItemGrid";
import { useAuth } from "../../auth/states/AuthContext";

export default function FavoritesPage() {
  const { favs } = useAuth();
  const [items, setItems] = useState([]);
  useEffect(() => { getFavorites().then(setItems); }, [favs]);
  return (
    <section className="py-8">
      <h1 className="mb-5 text-3xl font-extrabold tracking-tight">Favorit</h1>
      <ItemGrid items={items} empty="Belum ada favorit. Tekan ikon hati pada barang yang kamu suka." />
    </section>
  );
}
