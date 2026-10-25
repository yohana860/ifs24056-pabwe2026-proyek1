import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "../common/components/Navbar";
import Sidebar from "../common/components/Sidebar";
import ItemCard from "../items/components/ItemCard";
import DetailPage from "../items/pages/DetailPage";
import { getItem } from "../items/api/itemApi";
import { renderWithProviders, sampleItem } from "../../test-utils";

vi.mock("../items/api/itemApi");
const withCart = (items) => localStorage.setItem("nextowner_cart", JSON.stringify(items));
const Where = () => <p data-testid="lokasi">{useLocation().pathname}</p>;

describe("lencana jumlah keranjang", () => {
  it("tampil di Navbar dan Sidebar bila keranjang berisi", () => {
    withCart([sampleItem(), sampleItem({ id: 2 })]);
    const { unmount } = renderWithProviders(<Navbar />);
    expect(screen.getByRole("link", { name: /Keranjang belanja, 2 barang/ })).toHaveTextContent("2");
    unmount();
    renderWithProviders(<Sidebar />);
    expect(screen.getByRole("link", { name: /Keranjang/ })).toHaveTextContent("2");
  });
});

describe("ItemCard dan keranjang", () => {
  it("menambah ke keranjang lalu menandai sudah di keranjang", async () => {
    renderWithProviders(<ItemCard item={sampleItem()} />);
    await userEvent.click(screen.getByRole("button", { name: "Tambah ke keranjang" }));
    expect(screen.getByRole("button", { name: "Sudah di keranjang" })).toHaveTextContent("Di Keranjang");
  });
});

describe("DetailPage dan keranjang/chat", () => {
  const page = (
    <Routes>
      <Route path="/item/:id" element={<DetailPage />} />
      <Route path="*" element={<Where />} />
    </Routes>
  );

  it("menambah ke keranjang, lalu chat penjual bagi pengguna masuk", async () => {
    getItem.mockResolvedValue(sampleItem());
    renderWithProviders(page, { route: "/item/1", auth: { user: { id: 1 } } });
    await userEvent.click(await screen.findByRole("button", { name: /Tambah ke Keranjang/ }));
    expect(screen.getByRole("button", { name: /Sudah di Keranjang/ })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /Chat Penjual/ }));
    expect(screen.getByTestId("lokasi")).toHaveTextContent("/chat/1");
  });

  it("tamu yang menekan chat diarahkan ke login", async () => {
    getItem.mockResolvedValue(sampleItem());
    renderWithProviders(page, { route: "/item/1" });
    await userEvent.click(await screen.findByRole("button", { name: /Chat Penjual/ }));
    expect(screen.getByTestId("lokasi")).toHaveTextContent("/login");
  });
});
