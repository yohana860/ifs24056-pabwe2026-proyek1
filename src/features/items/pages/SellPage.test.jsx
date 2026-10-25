import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import SellPage from "./SellPage";
import { createItem } from "../api/itemApi";
import { renderWithProviders } from "../../../test-utils";

vi.mock("../api/itemApi");
const page = (
  <Routes>
    <Route path="/sell" element={<SellPage />} />
    <Route path="/item/:id" element={<p>detail dibuka</p>} />
  </Routes>
);

async function fillBasic() {
  await userEvent.type(screen.getByLabelText("Nama barang"), "Meja");
  await userEvent.type(screen.getByLabelText("Harga (Rp)"), "150000");
  await userEvent.selectOptions(screen.getByLabelText("Kategori"), "Furniture");
  await userEvent.selectOptions(screen.getByLabelText("Kondisi"), "Baik");
  await userEvent.selectOptions(screen.getByLabelText("Provinsi"), "Sumatera Utara");
  await userEvent.selectOptions(screen.getByLabelText("Kabupaten / Kota"), "Kabupaten Toba");
  await userEvent.type(screen.getByLabelText("Alamat lengkap (lokasi barang)"), "Jl. Sisingamangaraja No. 10");
  await userEvent.type(screen.getByLabelText("Deskripsi"), "Kayu jati");
}

describe("SellPage", () => {
  it("mengirim iklan dengan URL foto lalu membuka detail", async () => {
    createItem.mockResolvedValue({ id: 7 });
    renderWithProviders(page, { route: "/sell" });
    await fillBasic();
    await userEvent.click(screen.getByRole("button", { name: "Tautan URL" }));
    await userEvent.type(screen.getByLabelText("URL foto (opsional)"), "https://x.id/a.png");
    await userEvent.click(screen.getByRole("button", { name: "Hapus foto" }));
    await userEvent.type(screen.getByLabelText("URL foto (opsional)"), "https://x.id/b.png");
    await userEvent.click(screen.getByRole("button", { name: "Pasang iklan" }));
    expect(await screen.findByText("detail dibuka")).toBeInTheDocument();
    expect(createItem).toHaveBeenCalledWith(expect.objectContaining({
      title: "Meja",
      price: 150000,
      category: "Furniture",
      province: "Sumatera Utara",
      city: "Kabupaten Toba",
      address: "Jl. Sisingamangaraja No. 10",
      image: "https://x.id/b.png",
    }));
  });

  it("mengunggah foto dari perangkat sendiri dan menangani pembatalan file", async () => {
    createItem.mockResolvedValue({ id: 8 });
    renderWithProviders(page, { route: "/sell" });
    await fillBasic();
    await userEvent.click(screen.getByRole("button", { name: "Dari perangkat" }));
    const fileInput = screen.getByLabelText("Pilih foto dari perangkat");
    fireEvent.change(fileInput, { target: { files: [] } });
    const file = new File(["test image bytes"], "meja.png", { type: "image/png" });
    await userEvent.upload(fileInput, file);
    await waitFor(() => expect(screen.getByText("Foto siap digunakan")).toBeInTheDocument());
    await userEvent.click(screen.getByRole("button", { name: "Pasang iklan" }));
    expect(await screen.findByText("detail dibuka")).toBeInTheDocument();
    expect(createItem).toHaveBeenCalledWith(expect.objectContaining({
      title: "Meja",
      image: expect.stringContaining("data:image/png;base64"),
    }));
  });

  it("menampilkan error dari server", async () => {
    createItem.mockRejectedValue(new Error("Data tidak valid"));
    renderWithProviders(page, { route: "/sell" });
    await fillBasic();
    await userEvent.click(screen.getByRole("button", { name: "Pasang iklan" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Data tidak valid");
  });
});
