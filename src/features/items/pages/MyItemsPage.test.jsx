import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MyItemsPage from "./MyItemsPage";
import { deleteItem, getMyItems, updateItem } from "../api/itemApi";
import { renderWithProviders, sampleItem } from "../../../test-utils";

vi.mock("../api/itemApi");

describe("MyItemsPage", () => {
  it("menampilkan pesan bila belum ada iklan", async () => {
    getMyItems.mockResolvedValue([]);
    renderWithProviders(<MyItemsPage />);
    expect(await screen.findByText(/Belum ada iklan/)).toBeInTheDocument();
  });
  it("mengubah status dan menghapus barang", async () => {
    getMyItems.mockResolvedValue([sampleItem(), sampleItem({ id: 2, title: "Meja", status: "sold" })]);
    updateItem.mockResolvedValue({});
    deleteItem.mockResolvedValue({ ok: true });
    renderWithProviders(<MyItemsPage />);
    await userEvent.click(await screen.findByRole("button", { name: "Tandai terjual" }));
    expect(updateItem).toHaveBeenCalledWith(1, { status: "sold" });
    await userEvent.click(screen.getByRole("button", { name: "Tandai tersedia" }));
    expect(updateItem).toHaveBeenCalledWith(2, { status: "available" });

    vi.spyOn(window, "confirm").mockReturnValueOnce(false).mockReturnValueOnce(true);
    const [first] = screen.getAllByRole("button", { name: "Hapus" });
    await userEvent.click(first);
    expect(deleteItem).not.toHaveBeenCalled();
    await userEvent.click(first);
    await waitFor(() => expect(deleteItem).toHaveBeenCalledWith(1));
  });
});
