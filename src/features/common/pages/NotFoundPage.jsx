import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <section className="py-20 text-center">
      <h1 className="text-5xl font-extrabold">404</h1>
      <p className="my-3 text-ink2">Halaman yang kamu cari tidak ada.</p>
      <button type="button" onClick={() => navigate(-1)} className="btn">Kembali</button>
    </section>
  );
}
