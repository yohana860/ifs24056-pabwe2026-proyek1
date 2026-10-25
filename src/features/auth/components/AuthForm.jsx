import { useState } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { login as loginApi, register as registerApi } from "../api/authApi";
import { useAuth } from "../states/AuthContext";
import { INDONESIA_PROVINCES } from "../../../helpers/locations";
import { useForm } from "../../../hooks/useForm";

export default function AuthForm({ mode }) {
  const register = mode === "register";
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const { form: f, set, handleProvinceChange, regencies } = useForm({
    name: "",
    email: "",
    password: "",
    province: "",
    city: "",
    address: "",
  });
  
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await (register ? registerApi(f) : loginApi({ email: f.email, password: f.password }));
      await login(data.token);
      navigate("/mine");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="panel" onSubmit={submit}>
      <h1 className="text-2xl font-extrabold">{register ? "Buat akun" : "Masuk"}</h1>
      {register && (
        <>
          <label className="label">
            <span>Nama</span>
            <input className="field" required value={f.name} onChange={set("name")} />
          </label>
          <label className="label">
            <span>Provinsi</span>
            <select className="field" value={f.province} onChange={handleProvinceChange}>
              <option value="">Pilih Provinsi</option>
              {INDONESIA_PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </label>
          <label className="label">
            <span>Kabupaten / Kota</span>
            <select className="field" value={f.city} onChange={set("city")}>
              <option value="">{f.province ? "Pilih Kabupaten / Kota" : "Pilih provinsi dahulu"}</option>
              {regencies.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </label>
          <label className="label">
            <span>Alamat lengkap</span>
            <input className="field" placeholder="Nama jalan, nomor rumah, RT/RW" value={f.address || ""} onChange={set("address")} />
          </label>
        </>
      )}
      
      {/* TAMBAHKAN ID="username" DI SINI */}
      <label className="label">
        <span>Email</span>
        <input 
          id="username" 
          className="field" 
          type="email" 
          required 
          value={f.email} 
          onChange={set("email")} 
        />
      </label>

      {/* TAMBAHKAN ID="password" DI SINI */}
      <label className="label">
        <span>Kata sandi</span>
        <input 
          id="password" 
          className="field" 
          type="password" 
          required 
          minLength={6} 
          value={f.password} 
          onChange={set("password")} 
        />
      </label>

      {error && <p role="alert" className="font-semibold text-red-700">{error}</p>}
      
      {/* TAMBAHKAN ID="btn-submit" DI SINI */}
      <button id="btn-submit" className="btn">
        {register ? "Daftar" : "Masuk"}
      </button>
      
      <p className="text-sm text-ink2">
        {register ? (
          <>Sudah punya akun? <Link className="font-semibold underline" to="/login">Masuk</Link></>
        ) : (
          <>Belum punya akun? <Link className="font-semibold underline" to="/register">Daftar</Link>. Demo: demo@nextowner.id / demo123</>
        )}
      </p>
    </form>
  );
}

AuthForm.propTypes = {
  mode: PropTypes.oneOf(["login", "register"]).isRequired,
};