import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import DetailPage from "./DetailPage";
import { getItem } from "../api/itemApi";
import { renderWithProviders, sampleItem } from "../../../test-utils";

vi.mock("../api/itemApi");
const page = <Routes><Route path="/item/:id" element={<DetailPage />} /></Routes>;
const open = (auth) => renderWithProviders(page, { route: "/item/1", auth });

describe("DetailPage", () => {
  it("menampilkan memuat lalu detail dengan tombol favorit dan navigasi kembali", async () => {
    getItem.mockResolvedValue(sampleItem());
    const { auth } = open({ user: { id: 1 }, favs: [] });
    expect(screen.getByText("Memuat…")).toBeInTheDocument();
    expect(await screen.findByRole("heading", { name: "Sepeda Lipat" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Email/ })).toHaveAttribute("href", expect.stringContaining("mailto:s@x.id"));
    await userEvent.click(screen.getByRole("button", { name: /Simpan/ }));
    expect(auth.toggleFav).toHaveBeenCalledWith(1);
    await userEvent.click(screen.getByRole("button", { name: "Kembali" }));
  });
  it("menampilkan status tersimpan, deskripsi dan lokasi kosong, serta foto", async () => {
    getItem.mockResolvedValue(sampleItem({ description: "", city: "", address: "", province: "", image: "http://x/y.png" }));
    open({ user: { id: 1 }, favs: [1] });
    expect(await screen.findByText("Tersimpan")).toBeInTheDocument();
    expect(screen.getByText("Penjual belum menambahkan deskripsi.")).toBeInTheDocument();
  });
  it("tanpa login tidak ada tombol simpan", async () => {
    getItem.mockResolvedValue(sampleItem());
    open({});
    await screen.findByRole("heading", { name: "Sepeda Lipat" });
    expect(screen.queryByRole("button", { name: /Simpan/ })).not.toBeInTheDocument();
  });
  it("barang terjual", async () => {
    getItem.mockResolvedValue(sampleItem({ status: "sold" }));
    open({});
    expect(await screen.findByText("Barang ini sudah terjual.")).toBeInTheDocument();
  });
  it("barang tidak ditemukan", async () => {
    getItem.mockRejectedValue(new Error("Barang tidak ditemukan"));
    open({});
    expect(await screen.findByRole("alert")).toHaveTextContent("tidak ditemukan");
  });
});
