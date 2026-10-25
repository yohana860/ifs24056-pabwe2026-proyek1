import { screen } from "@testing-library/react";
import MessagesListPage from "./MessagesListPage";
import { renderWithProviders } from "../../../test-utils";

const open = (chats) => {
  if (chats) localStorage.setItem("nextowner_chats", JSON.stringify(chats));
  return renderWithProviders(<MessagesListPage />);
};

describe("MessagesListPage", () => {
  it("menampilkan keadaan kosong", () => {
    open();
    expect(screen.getByText(/Belum ada riwayat percakapan/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Cari Barang Sekarang" })).toHaveAttribute("href", "/");
  });

  it("menampilkan daftar percakapan dan mengabaikan data tanpa itemId", () => {
    open({
      1: { itemId: 1, itemTitle: "Sepeda", seller: { name: "Sinta" }, messages: [{ senderName: "Ani", text: "Halo", timestamp: "10.00" }] },
      2: { itemId: 2, itemTitle: "Meja", seller: null, messages: [] },
      3: { itemId: 3, itemTitle: "Kursi" },
      4: null,
      5: { itemTitle: "Tanpa id" },
    });
    expect(screen.getByText("Ani: Halo")).toBeInTheDocument();
    expect(screen.getByText("10.00")).toBeInTheDocument();
    expect(screen.getAllByText("Mulai percakapan")).toHaveLength(2);
    expect(screen.getAllByText("Pemilik Barang")).toHaveLength(2);
    expect(screen.getByText("S")).toBeInTheDocument();
    expect(screen.queryByText(/Tanpa id/)).not.toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(3);
    expect(screen.getByRole("link", { name: /Sinta/ })).toHaveAttribute("href", "/chat/1");
  });
});
