import { screen } from "@testing-library/react";
import FavoritesPage from "./FavoritesPage";
import { getFavorites } from "../api/favoriteApi";
import { renderWithProviders, sampleItem } from "../../../test-utils";

vi.mock("../api/favoriteApi");

describe("FavoritesPage", () => {
  it("menampilkan favorit", async () => {
    getFavorites.mockResolvedValue([sampleItem()]);
    renderWithProviders(<FavoritesPage />, { auth: { favs: [1] } });
    expect(await screen.findByText("Sepeda Lipat")).toBeInTheDocument();
  });
  it("menampilkan pesan kosong", async () => {
    getFavorites.mockResolvedValue([]);
    renderWithProviders(<FavoritesPage />);
    expect(await screen.findByText(/Belum ada favorit/)).toBeInTheDocument();
  });
});
