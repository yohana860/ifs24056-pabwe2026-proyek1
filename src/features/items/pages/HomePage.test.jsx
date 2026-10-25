import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HomePage from "./HomePage";
import { getItems } from "../api/itemApi";
import { renderWithProviders, sampleItem } from "../../../test-utils";

vi.mock("../api/itemApi");

describe("HomePage", () => {
  it("memuat barang lalu memfilter lewat pencarian, kategori, kondisi, harga, dan urutan", async () => {
    getItems.mockResolvedValue([sampleItem()]);
    renderWithProviders(<HomePage />);
    expect(await screen.findByText("Sepeda Lipat")).toBeInTheDocument();

    await userEvent.type(screen.getByLabelText("Cari barang"), "sepeda");
    await userEvent.click(screen.getByRole("button", { name: /Olahraga/ }));
    await userEvent.selectOptions(screen.getByLabelText("Kondisi"), "Baik");
    await userEvent.type(screen.getByLabelText("Harga minimum"), "100");
    await userEvent.type(screen.getByLabelText("Harga maksimum"), "900");
    await userEvent.selectOptions(screen.getByLabelText("Urutkan"), "cheap");
    await waitFor(() => expect(getItems).toHaveBeenLastCalledWith({
      q: "sepeda", category: "Olahraga", condition: "Baik", min: "100", max: "900", sort: "cheap",
    }));
    await userEvent.click(screen.getByRole("button", { name: "Semua" }));
  });

  it("menampilkan pesan error dan daftar kosong", async () => {
    getItems.mockRejectedValue(new Error("Gagal memuat"));
    renderWithProviders(<HomePage />);
    expect(await screen.findByRole("alert")).toHaveTextContent("Gagal memuat");
    expect(screen.getByText(/Tidak ada barang/)).toBeInTheDocument();
  });
});
