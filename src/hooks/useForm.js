// src/hooks/useForm.js
import { useState } from "react";
import { getRegencies } from "../helpers/locations";

export function useForm(initialState) {
  const [form, setForm] = useState(initialState);

  // Fungsi universal untuk update field
  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  // Fungsi khusus untuk provinsi (mereset kota jika provinsi berubah)
  const handleProvinceChange = (e) => {
    const province = e.target.value;
    setForm((prev) => ({ ...prev, province, city: "" }));
  };

  // Ambil data kabupaten/kota berdasarkan provinsi yang dipilih
  const regencies = getRegencies(form.province);

  return { form, setForm, set, handleProvinceChange, regencies };
}