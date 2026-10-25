import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes, useLocation } from "react-router-dom";
import CartPage from "./CartPage";
import { renderWithProviders, sampleItem } from "../../../test-utils";

const Where = () => <p data-testid="lokasi">{useLocation().pathname}</p>;
const page = (
  <Routes>
    <Route path="/cart" element={<CartPage />} />
    <Route path="*" element={<Where />} />
  </Routes>
);
const open = (auth, items) => {
  if (items) localStorage.setItem("nextowner_cart", JSON.stringify(items));
  return renderWithProviders(page, { route: "/cart", auth });
};

describe("CartPage", () => {
  it("menampilkan keranjang kosong", () => {
    open();
    expect(screen.getByText(/masih kosong/)).toBeInTheDocument();
    expect(screen.queryByText("Kosongkan keranjang")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Mulai Cari Barang" })).toHaveAttribute("href", "/");
  });

  it("menampilkan barang, total, dan menghapus satu barang", async () => {
    open({ user: { id: 1 } }, [
      sampleItem({ id: 1, price: 1000, image: "http://x/y.png" }),
      sampleItem({ id: 2, title: "Meja", price: "abc", seller: null }),
    ]);
    expect(screen.getByText("Sepeda Lipat")).toBeInTheDocument();
    expect(screen.getByText("Sinta")).toBeInTheDocument();
    expect(screen.getByText("Penjual")).toBeInTheDocument();
    expect(screen.getByText("2 barang")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Hapus Meja" }));
    expect(screen.getByText("1 barang")).toBeInTheDocument();
  });

  it("mengosongkan keranjang", async () => {
    open({ user: { id: 1 } }, [sampleItem()]);
    await userEvent.click(screen.getByText("Kosongkan keranjang"));
    expect(screen.getByText(/masih kosong/)).toBeInTheDocument();
  });

  it("pengguna masuk membuka chat barang, baik dari barang maupun dari ringkasan", async () => {
    open({ user: { id: 1 } }, [sampleItem({ id: 7 }), sampleItem({ id: 8, title: "Meja" })]);
    await userEvent.click(screen.getAllByRole("button", { name: /Pesan via Chat/ })[1]);
    expect(screen.getByTestId("lokasi")).toHaveTextContent("/chat/8");
  });

  it("ringkasan memulai chat barang pertama", async () => {
    open({ user: { id: 1 } }, [sampleItem({ id: 7 })]);
    await userEvent.click(screen.getByRole("button", { name: /Mulai Chat Pemesanan/ }));
    expect(screen.getByTestId("lokasi")).toHaveTextContent("/chat/7");
  });

  it("tamu diarahkan ke halaman masuk", async () => {
    open({}, [sampleItem()]);
    await userEvent.click(screen.getAllByRole("button", { name: /Pesan via Chat/ })[0]);
    expect(screen.getByTestId("lokasi")).toHaveTextContent("/login");
  });
});
