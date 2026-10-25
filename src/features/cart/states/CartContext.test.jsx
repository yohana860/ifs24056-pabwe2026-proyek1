import { render, screen, act } from "@testing-library/react";
import { CartProvider, useCart } from "./CartContext";

let ctx;
function Probe() {
  ctx = useCart();
  return <p>jumlah: {ctx.cartCount}</p>;
}
const mount = () => render(<CartProvider><Probe /></CartProvider>);
const item = (id) => ({ id, title: `Barang ${id}` });
const msg = (o = {}) => ({ itemId: 1, itemTitle: "Barang 1", seller: { name: "Sinta" }, senderName: "Ani", text: "Halo", ...o });

describe("CartProvider", () => {
  it("menambah, menghapus, dan mengosongkan keranjang tanpa duplikat", () => {
    mount();
    expect(screen.getByText("jumlah: 0")).toBeInTheDocument();
    act(() => { ctx.addToCart(item(1)); ctx.addToCart(item(1)); ctx.addToCart(item(2)); });
    expect(ctx.cart).toHaveLength(2);
    act(() => ctx.removeFromCart(1));
    expect(ctx.cart.map((i) => i.id)).toEqual([2]);
    expect(JSON.parse(localStorage.getItem("nextowner_cart"))).toHaveLength(1);
    act(() => ctx.clearCart());
    expect(screen.getByText("jumlah: 0")).toBeInTheDocument();
  });

  it("memuat keranjang dan chat yang tersimpan", () => {
    localStorage.setItem("nextowner_cart", JSON.stringify([item(5)]));
    localStorage.setItem("nextowner_chats", JSON.stringify({ 5: { itemId: 5, messages: [] } }));
    mount();
    expect(ctx.cartCount).toBe(1);
    expect(ctx.getChat(5).itemId).toBe(5);
  });

  it("memakai nilai awal bila data tersimpan rusak", () => {
    localStorage.setItem("nextowner_cart", "{rusak");
    localStorage.setItem("nextowner_chats", "{rusak");
    mount();
    expect(ctx.cart).toEqual([]);
    expect(ctx.chats).toEqual({});
  });

  it("tidak error bila penyimpanan gagal", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("penuh"); });
    mount();
    act(() => ctx.addToCart(item(1)));
    expect(ctx.cartCount).toBe(1);
  });

  it("mengirim pesan: abaikan teks kosong, buat chat baru, lalu tambah ke chat yang ada", () => {
    mount();
    expect(ctx.getChat(1)).toEqual({ messages: [] });
    act(() => { ctx.sendMessage(msg({ text: "   " })); ctx.sendMessage(msg({ text: undefined })); });
    expect(ctx.getChat(1).messages).toHaveLength(0);
    act(() => ctx.sendMessage(msg({ text: "  Halo  " })));
    expect(ctx.getChat(1).messages[0]).toMatchObject({ senderName: "Ani", text: "Halo" });
    act(() => ctx.sendMessage(msg({ text: "Kedua" })));
    expect(ctx.getChat(1).messages).toHaveLength(2);
    expect(ctx.getChat(1).itemTitle).toBe("Barang 1");
  });
});
