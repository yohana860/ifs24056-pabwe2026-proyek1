import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteItem, getMyItems, updateItem } from "../api/itemApi";
import { rupiah } from "../../../helpers/toolsHelper";

export default function MyItemsPage() {
  const [items, setItems] = useState([]);
  const load = useCallback(() => getMyItems().then(setItems), []);
  useEffect(() => { load(); }, [load]);

  const toggle = (it) => updateItem(it.id, { status: it.status === "sold" ? "available" : "sold" }).then(load);
  const remove = (it) => window.confirm(`Hapus "${it.title}"?`) && deleteItem(it.id).then(load);

  return (
    <section className="py-8">
      <h1 className="mb-5 text-3xl font-extrabold tracking-tight">Barang saya</h1>
      {!items.length && <p className="text-ink2">Belum ada iklan. <Link className="font-semibold underline" to="/sell">Jual barang pertamamu</Link>.</p>}
      <ul className="flex flex-col gap-3">
        {items.map((it) => (
          <li key={it.id} className="flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-white px-5 py-3">
            <Link to={`/item/${it.id}`} className="flex-1"><b>{it.title}</b><span className="block text-sm text-ink2">{rupiah(it.price)} · {it.status === "sold" ? "Terjual" : "Tersedia"}</span></Link>
            <button className="btn btn-ghost btn-sm" onClick={() => toggle(it)}>{it.status === "sold" ? "Tandai tersedia" : "Tandai terjual"}</button>
            <button className="btn btn-danger btn-sm" onClick={() => remove(it)}>Hapus</button>
          </li>
        ))}
      </ul>
    </section>
  );
}
