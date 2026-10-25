import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { getItems } from "../api/itemApi";
import ItemGrid from "../components/ItemGrid";
import CategoryIcon from "../components/CategoryIcon";
import useDebounce from "../../../hooks/useDebounce";
import { CATEGORIES, CONDITIONS } from "../../../helpers/toolsHelper";

export default function HomePage() {
  const [f, setF] = useState({ q: "", category: "", condition: "", min: "", max: "", sort: "" });
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const filters = useDebounce(f);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  useEffect(() => {
    getItems(filters).then(setItems).catch((e) => setError(e.message));
  }, [filters]);

  return (
    <>
      <section className="py-12">
        <h1 className="max-w-[14ch] text-5xl leading-none font-extrabold tracking-tight sm:text-6xl">Barang bekas, pemilik baru.</h1>
        <p className="mt-3 mb-6 max-w-xl text-lg text-ink2">Jual dan temukan barang preloved layak pakai, dari jaket sampai gitar, langsung dari sesama pengguna.</p>
        <div className="relative max-w-xl">
          <Search className="absolute top-1/2 left-4 -translate-y-1/2 text-ink2" size={20} aria-hidden="true" />
          <input aria-label="Cari barang" className="field rounded-full border-ink py-3.5 pl-12" placeholder="Cari sepeda, jaket, atau gitar" value={f.q} onChange={set("q")} />
        </div>
      </section>
      <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Kategori">
        {["", ...CATEGORIES].map((c) => (
          <button key={c || "all"} onClick={() => setF({ ...f, category: c })} aria-pressed={f.category === c}
            className={`flex items-center gap-1.5 rounded-full border-2 px-4 py-1.5 text-sm font-semibold ${f.category === c ? "border-brand bg-brand text-white" : "border-line bg-white"}`}>
            {c ? <CategoryIcon category={c} size={16} /> : null}{c || "Semua"}
          </button>
        ))}
      </div>
      <div className="mb-6 flex flex-wrap gap-3">
        <select aria-label="Kondisi" className="field w-auto" value={f.condition} onChange={set("condition")}>
          <option value="">Semua kondisi</option>{CONDITIONS.map((c) => <option key={c}>{c}</option>)}
        </select>
        <input aria-label="Harga minimum" type="number" min="0" className="field w-36" placeholder="Harga min" value={f.min} onChange={set("min")} />
        <input aria-label="Harga maksimum" type="number" min="0" className="field w-36" placeholder="Harga maks" value={f.max} onChange={set("max")} />
        <select aria-label="Urutkan" className="field w-auto" value={f.sort} onChange={set("sort")}>
          <option value="">Terbaru</option><option value="cheap">Harga terendah</option><option value="pricey">Harga tertinggi</option>
        </select>
      </div>
      {error && <p role="alert" className="font-semibold text-red-700">{error}</p>}
      <ItemGrid items={items} empty="Tidak ada barang yang cocok. Coba ubah kata kunci atau filter." />
    </>
  );
}
