import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ItemCard from "./ItemCard";
import ItemGrid from "./ItemGrid";
import CategoryIcon from "./CategoryIcon";
import { renderWithProviders, sampleItem } from "../../../test-utils";

describe("ItemCard", () => {
  it("menampilkan data barang dan menyimpan favorit saat login", async () => {
    const { auth } = renderWithProviders(<ItemCard item={sampleItem()} />, { auth: { user: { id: 1 }, favs: [] } });
    expect(screen.getByText("Sepeda Lipat")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Simpan ke favorit" }));
    expect(auth.toggleFav).toHaveBeenCalledWith(1);
  });
  it("mengarahkan ke login bila belum masuk, dan menampilkan status favorit", async () => {
    renderWithProviders(<ItemCard item={sampleItem({ city: "", status: "sold", image: "http://x/y.png" })} />, { auth: { favs: [1] } });
    expect(screen.getByText("Terjual")).toBeInTheDocument();
    expect(screen.getByText(/Indonesia/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Hapus dari favorit" }));
  });
});

describe("ItemGrid", () => {
  it("menampilkan pesan kosong", () => {
    renderWithProviders(<ItemGrid items={[]} empty="Kosong" />);
    expect(screen.getByText("Kosong")).toBeInTheDocument();
  });
  it("menampilkan daftar kartu", () => {
    renderWithProviders(<ItemGrid items={[sampleItem(), sampleItem({ id: 2, title: "Meja" })]} empty="x" />);
    expect(screen.getAllByRole("article")).toHaveLength(2);
  });
});

describe("CategoryIcon", () => {
  it("memakai ikon cadangan untuk kategori tak dikenal", () => {
    const { container } = renderWithProviders(<><CategoryIcon category="Buku" /><CategoryIcon category="?" /></>);
    expect(container.querySelectorAll("svg")).toHaveLength(2);
  });
});
