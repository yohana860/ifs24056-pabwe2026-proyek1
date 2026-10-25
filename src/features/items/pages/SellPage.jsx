import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Link as LinkIcon, Trash2 } from "lucide-react";
import { createItem } from "../api/itemApi";
import { CATEGORIES, CONDITIONS } from "../../../helpers/toolsHelper";
import { INDONESIA_PROVINCES, getRegencies } from "../../../helpers/locations";

export default function SellPage() {
  const navigate = useNavigate();
  const [f, setF] = useState({
    title: "",
    price: "",
    category: CATEGORIES[0],
    condition: CONDITIONS[0],
    province: "",
    city: "",
    address: "",
    image: "",
    description: "",
  });
  const [imageMode, setImageMode] = useState("device");
  const [error, setError] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const handleProvinceChange = (e) => {
    const province = e.target.value;
    setF({ ...f, province, city: "" });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setF((prev) => ({ ...prev, image: String(reader.result) }));
    };
    reader.readAsDataURL(file);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const item = await createItem({ ...f, price: Number(f.price) });
      navigate(`/item/${item.id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  const regencies = getRegencies(f.province);

  return (
    <form className="panel max-w-2xl!" onSubmit={submit}>
      <h1 className="text-2xl font-extrabold">Jual barang</h1>
      <label className="label">Nama barang<input className="field" required value={f.title} onChange={set("title")} /></label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="label">Harga (Rp)<input className="field" type="number" min="0" required value={f.price} onChange={set("price")} /></label>
        <label className="label">Kategori<select className="field" value={f.category} onChange={set("category")}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></label>
        <label className="label">Kondisi<select className="field" value={f.condition} onChange={set("condition")}>{CONDITIONS.map((c) => <option key={c}>{c}</option>)}</select></label>
        <label className="label">
          Provinsi
          <select className="field" value={f.province} onChange={handleProvinceChange}>
            <option value="">Pilih Provinsi</option>
            {INDONESIA_PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </label>
        <label className="label">
          Kabupaten / Kota
          <select className="field" value={f.city} onChange={set("city")}>
            <option value="">{f.province ? "Pilih Kabupaten / Kota" : "Pilih provinsi dahulu"}</option>
            {regencies.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </label>
      </div>
      <label className="label">
        Alamat lengkap (lokasi barang)
        <input className="field" placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan/kecamatan" value={f.address || ""} onChange={set("address")} />
      </label>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-semibold">Foto barang (opsional)</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setImageMode("device")}
            className={`btn btn-sm ${imageMode === "device" ? "bg-brand text-white" : "btn-ghost"}`}
          >
            <Upload size={14} aria-hidden="true" />Dari perangkat
          </button>
          <button
            type="button"
            onClick={() => setImageMode("url")}
            className={`btn btn-sm ${imageMode === "url" ? "bg-brand text-white" : "btn-ghost"}`}
          >
            <LinkIcon size={14} aria-hidden="true" />Tautan URL
          </button>
        </div>

        {imageMode === "device" ? (
          <label className="label">
            <span className="sr-only">Pilih foto dari perangkat</span>
            <input
              key="device-file-input"
              aria-label="Pilih foto dari perangkat"
              type="file"
              accept="image/*"
              className="field file:mr-3 file:rounded-full file:border-0 file:bg-sun file:px-4 file:py-1 file:text-xs file:font-semibold file:text-ink cursor-pointer"
              onChange={handleFileChange}
            />
          </label>
        ) : (
          <label className="label">
            <span className="sr-only">URL foto (opsional)</span>
            <input
              key="url-image-input"
              aria-label="URL foto (opsional)"
              className="field"
              type="url"
              placeholder="https://contoh.com/foto.jpg"
              value={f.image || ""}
              onChange={set("image")}
            />
          </label>
        )}

        {f.image && (
          <div className="flex items-center gap-3 rounded-xl border border-line bg-paper p-3">
            <img src={f.image} alt="Pratinjau foto" className="h-16 w-16 rounded-lg object-cover" />
            <div className="flex-1">
              <p className="text-xs font-semibold">Foto siap digunakan</p>
              <button
                type="button"
                onClick={() => setF({ ...f, image: "" })}
                className="mt-1 flex items-center gap-1 text-xs text-red-700 hover:underline"
              >
                <Trash2 size={12} aria-hidden="true" />Hapus foto
              </button>
            </div>
          </div>
        )}
      </div>

      <label className="label">Deskripsi<textarea className="field" rows="4" value={f.description} onChange={set("description")} /></label>
      {error && <p role="alert" className="font-semibold text-red-700">{error}</p>}
      <button className="btn">Pasang iklan</button>
    </form>
  );
}
