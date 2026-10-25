import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFoundPage from "./pages/NotFoundPage";
import MainLayout from "./layouts/MainLayout";
import { Route, Routes } from "react-router-dom";
import { renderWithProviders } from "../../test-utils";

describe("Navbar", () => {
  it("menampilkan menu tamu dan brand logo", () => {
    renderWithProviders(<Navbar />);
    expect(screen.getByText("Next")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Masuk" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Daftar" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Keranjang belanja, 0 barang/ })).toHaveAttribute("href", "/cart");
  });
  it("menampilkan menu pengguna dan keluar", async () => {
    const { auth } = renderWithProviders(<Navbar />, { auth: { user: { name: "Ani Lestari" } } });
    expect(screen.getByRole("link", { name: /Jual/ })).toHaveAttribute("href", "/sell");
    expect(screen.getByRole("link", { name: /Ani/ })).toHaveAttribute("href", "/profile");
    await userEvent.click(screen.getByRole("button", { name: "Keluar" }));
    expect(auth.logout).toHaveBeenCalled();
  });
});

describe("Sidebar", () => {
  it("menampilkan navigasi beranda dan menu tamu", () => {
    renderWithProviders(<Sidebar />);
    expect(screen.getByRole("link", { name: /Beranda/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Masuk/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Daftar/i })).toBeInTheDocument();
  });

  it("menampilkan navigasi pengguna dan tombol keluar", async () => {
    const { auth } = renderWithProviders(<Sidebar />, {
      auth: { user: { name: "Budi Santoso", email: "budi@nextowner.id" } },
    });
    expect(screen.getByText("Budi Santoso")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Barang saya/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Favorit/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Jual barang/i })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Keluar" }));
    expect(auth.logout).toHaveBeenCalled();
  });
});

describe("ProtectedRoute", () => {
  const tree = (
    <Routes>
      <Route element={<ProtectedRoute />}><Route path="/" element={<p>rahasia</p>} /></Route>
      <Route path="/login" element={<p>halaman login</p>} />
    </Routes>
  );
  it("menunggu sesi siap", () => {
    renderWithProviders(tree, { auth: { ready: false } });
    expect(screen.getByText("Memuat…")).toBeInTheDocument();
  });
  it("mengalihkan tamu ke login", () => {
    renderWithProviders(tree);
    expect(screen.getByText("halaman login")).toBeInTheDocument();
  });
  it("membuka halaman untuk pengguna", () => {
    renderWithProviders(tree, { auth: { user: { name: "A" } } });
    expect(screen.getByText("rahasia")).toBeInTheDocument();
  });
});

describe("NotFoundPage & MainLayout", () => {
  it("menampilkan 404 dan navigasi kembali", async () => {
    renderWithProviders(<NotFoundPage />);
    expect(screen.getByText("404")).toBeInTheDocument();
    const backBtn = screen.getByRole("button", { name: "Kembali" });
    expect(backBtn).toBeInTheDocument();
    await userEvent.click(backBtn);
  });
  it("membungkus halaman dengan navbar, sidebar, dan footer", () => {
    renderWithProviders(<Routes><Route element={<MainLayout />}><Route path="/" element={<p>isi</p>} /></Route></Routes>);
    expect(screen.getByText("isi")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });
});
